import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth-config"
import { prisma } from "@/lib/prisma"

// GET /api/user/orders/[id] - Get single order details
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    const userRoles = session?.user?.roles || (session?.user?.role ? [session.user.role] : [])
    const hasPermission = userRoles.some((r: string) => ['USER', 'CUSTOMER', 'ADMIN'].includes(r))

    if (!session || !hasPermission) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const orderId = params.id
    const userId = session.user.id
    const isAdmin = session.user.role === "ADMIN"

    const order = await prisma.order.findUnique({
      where: {
        id: orderId
      },
      include: {
        vendorProfile: {
          select: {
            id: true,
            companyName: true,
            user: { select: { name: true, email: true } }
          }
        },
        items: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                images: true,
                price: true,
                regenScore: true,
                co2Reduction: true,
                waterSaving: true,
                energyEfficiency: true
              }
            }
          }
        }
      }
    })

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 })
    }

    // Check ownership (unless admin)
    if (!isAdmin && order.userId !== userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    // Calculate environmental impact
    const environmentalImpact = order.items.reduce((acc: {co2Saved: number, waterSaved: number, energyGenerated: number}, item: any) => {
      const product = item.product
      return {
        co2Saved: acc.co2Saved + (product.co2Reduction * item.quantity),
        waterSaved: acc.waterSaved + (product.waterSaving * item.quantity),
        energyGenerated: acc.energyGenerated + (product.energyEfficiency * item.quantity)
      }
    }, { co2Saved: 0, waterSaved: 0, energyGenerated: 0 })

    // Check for existing reviews
    const productIds = order.items.map((item: any) => item.productId)
    const reviews = await prisma.review.findMany({
      where: {
        userId: userId,
        productId: { in: productIds }
      },
      select: { productId: true, rating: true }
    })
    const reviewMap = new Map(reviews.map((r: any) => [r.productId, r.rating]))

    const orderWithImpact = {
      ...order,
      items: order.items.map((item: any) => ({
        ...item,
        userRating: reviewMap.get(item.productId) || null
      })),
      environmentalImpact,
      totalRegenScore: order.items.reduce((sum: number, item: any) =>
        sum + (item.product.regenScore * item.quantity), 0
      )
    }

    return NextResponse.json({
      success: true,
      data: orderWithImpact
    })

  } catch (error) {
    console.error("Order details error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

// PATCH /api/user/orders/[id] - Cancel order
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const orderId = params.id
    const userId = session.user.id
    const body = await request.json()
    const { action, reason } = body

    if (action !== 'cancel') {
      return NextResponse.json({ error: "Invalid action" }, { status: 400 })
    }

    const order = await prisma.order.findUnique({
      where: { id: orderId }
    })

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 })
    }

    if (order.userId !== userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    // Only allow cancellation if status is PENDING or PROCESSING (depending on business logic)
    // Usually only PENDING is safe to auto-cancel. PROCESSING might mean vendor already started.
    // Let's stick to PENDING for now.
    if (order.status !== 'PENDING') {
      return NextResponse.json(
        { error: "Order cannot be cancelled in current status" },
        { status: 400 }
      )
    }

    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: {
        status: 'CANCELLED',
        // cancelReason: reason || 'Cancelled by user' // TODO: Add cancelReason to schema
      }
    })

    // Create notification for vendor
    await prisma.notification.create({
      data: {
        userId: order.vendorUserId,
        type: 'ORDER_CANCELLED',
        title: 'Pedido Cancelado',
        message: `El pedido #${order.id.slice(-8)} ha sido cancelado por el usuario.`,
        orderId: order.id,
        actionUrl: `/dashboard/vendor/orders`
      }
    })

    return NextResponse.json({
      success: true,
      data: updatedOrder
    })

  } catch (error) {
    console.error("Order update error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
