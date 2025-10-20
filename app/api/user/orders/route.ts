import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth-config"
import { prisma } from "@/lib/prisma"

// GET /api/user/orders - Get user's orders
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || (session.user.role !== "USER" && session.user.role !== "ADMIN")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get("page") || "1")
    const limit = parseInt(searchParams.get("limit") || "20")
    const status = searchParams.get("status")
    const userId = session.user.role === "ADMIN"
      ? searchParams.get("userId")
      : session.user.id

    if (!userId) {
      return NextResponse.json({ error: "User ID required" }, { status: 400 })
    }

    const skip = (page - 1) * limit

    // Build where clause
    const where: any = { userId }

    if (status) {
      where.status = status
    }

    const [orders, totalCount] = await Promise.all([
      prisma.order.findMany({
        where,
        skip,
        take: limit,
        include: {
          vendorProfile: {
            select: {
              id: true,
              companyName: true,
              user: { select: { name: true } }
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
        },
        orderBy: { createdAt: "desc" }
      }),

      prisma.order.count({ where })
    ])

    // Calculate environmental impact for each order
    const ordersWithImpact = await Promise.all(
      orders.map(async (order: typeof orders[0]) => {
        // Calculate total environmental impact
        const environmentalImpact = order.items.reduce((acc: {co2Saved: number, waterSaved: number, energyGenerated: number}, item: typeof order.items[0]) => {
          const product = item.product
          return {
            co2Saved: acc.co2Saved + (product.co2Reduction * item.quantity),
            waterSaved: acc.waterSaved + (product.waterSaving * item.quantity),
            energyGenerated: acc.energyGenerated + (product.energyEfficiency * item.quantity)
          }
        }, { co2Saved: 0, waterSaved: 0, energyGenerated: 0 })

        return {
          ...order,
          environmentalImpact,
          itemCount: order.items.length,
          totalRegenScore: order.items.reduce((sum: number, item: typeof order.items[0]) =>
            sum + (item.product.regenScore * item.quantity), 0
          )
        }
      })
    )

    const totalPages = Math.ceil(totalCount / limit)

    return NextResponse.json({
      success: true,
      data: ordersWithImpact,
      meta: {
        total: totalCount,
        page,
        limit,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1
      }
    })

  } catch (error) {
    console.error("User orders error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

// POST /api/user/orders - Create new order
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== "USER") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    const body = await request.json()
    const {
      items, // [{ productId, quantity }]
      shippingAddress,
      paymentMethod
    } = body

    // Validation
    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: "Items are required" },
        { status: 400 }
      )
    }

    if (!shippingAddress || !paymentMethod) {
      return NextResponse.json(
        { error: "Shipping address and payment method are required" },
        { status: 400 }
      )
    }

    // Get products and validate availability
    const productIds = items.map((item: any) => item.productId)
    const products = await prisma.product.findMany({
      where: {
        id: { in: productIds },
        active: true,
        inStock: true
      },
      include: {
        vendorProfile: true
      }
    })

    if (products.length !== productIds.length) {
      return NextResponse.json(
        { error: "Some products are not available" },
        { status: 400 }
      )
    }

    // Check stock availability
    for (const item of items) {
      const product = products.find((p: any) => p.id === item.productId)
      if (!product || product.stock < item.quantity) {
        return NextResponse.json(
          { error: `Insufficient stock for product: ${product?.name || 'Unknown'}` },
          { status: 400 }
        )
      }
    }

    // Group items by vendor (for multi-vendor support)
    const itemsByVendor = items.reduce((acc: Record<string, any[]>, item: any) => {
      const product = products.find((p: any) => p.id === item.productId)!
      const vendorId = product.vendorUserId

      if (!acc[vendorId]) {
        acc[vendorId] = []
      }

      acc[vendorId].push({
        ...item,
        product,
        price: product.price,
        total: product.price * item.quantity
      })

      return acc
    }, {} as Record<string, any[]>)

    // Create orders (one per vendor)
    const createdOrders = await Promise.all(
      Object.entries(itemsByVendor).map(async ([vendorId, vendorItems]) => {
        const subtotal = (vendorItems as any[]).reduce((sum: number, item: any) => sum + item.total, 0)
        const shipping = 10.00 // Fixed shipping for now
        const tax = subtotal * 0.10 // 10% tax
        const total = subtotal + shipping + tax

        // Create order
        const order = await prisma.order.create({
          data: {
            userId: session.user.id,
            vendorUserId: vendorId,
            status: "PENDING",
            subtotal,
            tax,
            shipping,
            total,
            shippingAddress,
            paymentMethod,
            paymentStatus: "PENDING",
            items: {
              create: (vendorItems as any[]).map((item: any) => ({
                productId: item.productId,
                quantity: item.quantity,
                price: item.price,
                total: item.total
              }))
            }
          },
          include: {
            items: {
              include: {
                product: true
              }
            },
            vendorProfile: {
              select: {
                companyName: true,
                user: { select: { name: true } }
              }
            }
          }
        })

        // Update product stock
        await Promise.all(
          (vendorItems as any[]).map((item: any) =>
            prisma.product.update({
              where: { id: item.productId },
              data: {
                stock: { decrement: item.quantity },
                inStock: item.product.stock - item.quantity > 0
              }
            })
          )
        )

        // Update vendor stats
        await prisma.vendorProfile.update({
          where: { userId: vendorId },
          data: {
            totalOrders: { increment: 1 }
          }
        })

        return order
      })
    )

    // Update user profile with sustainability points
    const totalRegenScore = items.reduce((sum: number, item: any) => {
      const product = products.find((p: any) => p.id === item.productId)!
      return sum + (product.regenScore * item.quantity)
    }, 0)

    await prisma.userProfile.upsert({
      where: { userId: session.user.id },
      update: {
        loyaltyPoints: { increment: Math.floor(totalRegenScore / 10) },
        regenScore: { increment: totalRegenScore }
      },
      create: {
        userId: session.user.id,
        loyaltyPoints: Math.floor(totalRegenScore / 10),
        regenScore: totalRegenScore
      }
    })

    return NextResponse.json({
      success: true,
      data: {
        orders: createdOrders,
        totalRegenScore,
        loyaltyPointsEarned: Math.floor(totalRegenScore / 10)
      },
      message: "Orders created successfully"
    })

  } catch (error) {
    console.error("Order creation error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}