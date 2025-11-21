import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth-config"
import { prisma } from "@/lib/prisma"

// GET /api/vendor/orders - Get vendor's orders
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || (!session.user.roles?.includes("VENDOR") && session.user.role !== "VENDOR" && session.user.role !== "ADMIN")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get("page") || "1")
    const limit = parseInt(searchParams.get("limit") || "20")
    const status = searchParams.get("status")
    const timeRange = searchParams.get("timeRange") || "all" // today, week, month, all
    const sortBy = searchParams.get("sortBy") || "createdAt"
    const sortOrder = searchParams.get("sortOrder") || "desc"

    const vendorUserId = session.user.id
    const skip = (page - 1) * limit

    // Build where clause
    const where: any = { vendorUserId: vendorUserId }

    if (status) {
      where.status = status
    }

    // Add time range filter
    if (timeRange !== "all") {
      const now = new Date()
      let startDate: Date

      switch (timeRange) {
        case "today":
          startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate())
          break
        case "week":
          startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
          break
        case "month":
          startDate = new Date(now.getFullYear(), now.getMonth(), 1)
          break
        default:
          startDate = new Date(0)
      }

      where.createdAt = {
        gte: startDate
      }
    }

    // Build order by clause
    const orderBy: any = {}
    orderBy[sortBy] = sortOrder

    const [orders, totalCount, statusCounts] = await Promise.all([
      prisma.order.findMany({
        where,
        skip,
        take: limit,
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true
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
                  sku: true
                }
              }
            }
          }
        },
        orderBy
      }),

      prisma.order.count({ where }),

      // Get counts by status for vendor dashboard
      prisma.order.groupBy({
        by: ["status"],
        where: { vendorUserId: vendorUserId },
        _count: {
          status: true
        }
      })
    ])

    // Calculate totals and metrics
    const totalRevenue = await prisma.order.aggregate({
      where: {
        vendorUserId: vendorUserId,
        status: { in: ["DELIVERED", "SHIPPED"] }
      },
      _sum: {
        total: true
      }
    })

    const monthlyRevenue = await prisma.order.aggregate({
      where: {
        vendorUserId: vendorUserId,
        status: { in: ["DELIVERED", "SHIPPED"] },
        createdAt: {
          gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
        }
      },
      _sum: {
        total: true
      }
    })

    const pendingOrders = statusCounts.find((s: any) => s.status === "PENDING")?._count?.status || 0
    const processingOrders = statusCounts.find((s: any) => s.status === "PROCESSING")?._count?.status || 0

    const totalPages = Math.ceil(totalCount / limit)

    return NextResponse.json({
      success: true,
      data: orders,
      meta: {
        total: totalCount,
        page,
        limit,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1
      },
      summary: {
        totalRevenue: totalRevenue._sum.total || 0,
        monthlyRevenue: monthlyRevenue._sum.total || 0,
        pendingOrders,
        processingOrders,
        statusCounts: statusCounts.reduce((acc: Record<string, number>, item: any) => {
          acc[item.status] = item._count.status
          return acc
        }, {} as Record<string, number>)
      }
    })

  } catch (error) {
    console.error("Vendor orders error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

// GET /api/vendor/orders/analytics - Get vendor order analytics
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || (!session.user.roles?.includes("VENDOR") && session.user.role !== "VENDOR")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    const body = await request.json()
    const { orderId, action, data } = body
    const vendorUserId = session.user.id

    // Verify order belongs to vendor
    const order = await prisma.order.findFirst({
      where: {
        id: orderId,
        vendorUserId: vendorUserId
      }
    })

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 })
    }

    let result;

    switch (action) {
      case "addTrackingNumber":
        result = await prisma.order.update({
          where: { id: orderId },
          data: {
            trackingNumber: data.trackingNumber,
            status: "SHIPPED",
            estimatedDelivery: data.estimatedDelivery ? new Date(data.estimatedDelivery) : undefined
          }
        })

        // Create notification
        await prisma.notification.create({
          data: {
            userId: order.userId,
            orderId: order.id,
            type: "ORDER_SHIPPED",
            title: "Pedido Enviado",
            message: `Tu pedido ha sido enviado. Número de seguimiento: ${data.trackingNumber}`,
            actionUrl: `/orders/${order.id}`
          }
        })
        break

      case "markAsProcessing":
        result = await prisma.order.update({
          where: { id: orderId },
          data: {
            status: "PROCESSING",
            estimatedDelivery: data.estimatedDelivery ? new Date(data.estimatedDelivery) : undefined
          }
        })

        // Create notification
        await prisma.notification.create({
          data: {
            userId: order.userId,
            orderId: order.id,
            type: "ORDER_UPDATED",
            title: "Pedido en Proceso",
            message: "Tu pedido está siendo procesado",
            actionUrl: `/orders/${order.id}`
          }
        })
        break

      case "cancelOrder":
        // Only allow cancellation if order is PENDING or PROCESSING
        if (!["PENDING", "PROCESSING"].includes(order.status)) {
          return NextResponse.json(
            { error: "Cannot cancel order in current status" },
            { status: 400 }
          )
        }

        result = await prisma.order.update({
          where: { id: orderId },
          data: {
            status: "CANCELLED"
          }
        })

        // Restore product stock
        const orderItems = await prisma.orderItem.findMany({
          where: { orderId }
        })

        await Promise.all(
          orderItems.map((item: any) =>
            prisma.product.update({
              where: { id: item.productId },
              data: {
                stock: { increment: item.quantity },
                inStock: true
              }
            })
          )
        )

        // Create notification
        await prisma.notification.create({
          data: {
            userId: order.userId,
            orderId: order.id,
            type: "ORDER_CANCELLED",
            title: "Pedido Cancelado",
            message: data.reason || "Tu pedido ha sido cancelado",
            actionUrl: `/orders/${order.id}`
          }
        })
        break

      default:
        return NextResponse.json(
          { error: "Invalid action" },
          { status: 400 }
        )
    }

    return NextResponse.json({
      success: true,
      data: result,
      message: "Order updated successfully"
    })

  } catch (error) {
    console.error("Vendor order action error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}