import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth-config"
import { prisma } from "@/lib/prisma"
import { Prisma, NotificationType } from '@prisma/client'

// GET /api/orders/[id] - Get specific order details
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const orderId = params.id

    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
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
                energyEfficiency: true,
                certifications: true
              }
            }
          }
        }
      }
    })

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 })
    }

    // Check if user has permission to view this order
    const isOwner = order.userId === session.user.id
    const isVendor = order.vendorUserId === session.user.id
    const isAdmin = session.user.role === "ADMIN"

    if (!isOwner && !isVendor && !isAdmin) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    // Calculate environmental impact
    const environmentalImpact = order.items.reduce((acc: {co2Saved: number, waterSaved: number, energyGenerated: number}, item: typeof order.items[0]) => {
      const product = item.product
      return {
        co2Saved: acc.co2Saved + (product.co2Reduction * item.quantity),
        waterSaved: acc.waterSaved + (product.waterSaving * item.quantity),
        energyGenerated: acc.energyGenerated + (product.energyEfficiency * item.quantity)
      }
    }, { co2Saved: 0, waterSaved: 0, energyGenerated: 0 })

    const orderWithImpact = {
      ...order,
      environmentalImpact,
      itemCount: order.items.length,
      totalRegenScore: order.items.reduce((sum: number, item: typeof order.items[0]) =>
        sum + (item.product.regenScore * item.quantity), 0
      )
    }

    return NextResponse.json({
      success: true,
      data: orderWithImpact
    })

  } catch (error) {
    console.error("Get order error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

// PATCH /api/orders/[id] - Update order status
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const orderId = params.id
    const body = await request.json()
    const { status, trackingNumber, estimatedDelivery } = body

    // Get the order first to check permissions
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        vendorProfile: true,
        user: true
      }
    })

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 })
    }

    // Check permissions
    const isVendor = order.vendorUserId === session.user.id
    const isAdmin = session.user.role === "ADMIN"

    if (!isVendor && !isAdmin) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    // Validate status transition
    const validTransitions: Record<string, string[]> = {
      'PENDING': ['PROCESSING', 'CANCELLED'],
      'PROCESSING': ['SHIPPED', 'CANCELLED'],
      'SHIPPED': ['DELIVERED', 'RETURNED'],
      'DELIVERED': ['RETURNED'],
      'CANCELLED': [],
      'RETURNED': []
    }

    if (status && !validTransitions[order.status]?.includes(status)) {
      return NextResponse.json(
        { error: `Invalid status transition from ${order.status} to ${status}` },
        { status: 400 }
      )
    }

    // Prepare update data
    const updateData: Prisma.OrderUpdateInput = {}

    if (status) updateData.status = status
    if (trackingNumber) updateData.trackingNumber = trackingNumber
    if (estimatedDelivery) updateData.estimatedDelivery = new Date(estimatedDelivery)
    if (status === 'DELIVERED') updateData.actualDelivery = new Date()

    // Update the order
    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: updateData,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        vendorProfile: {
          select: {
            id: true,
            companyName: true
          }
        },
        items: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                images: true
              }
            }
          }
        }
      }
    })

    // Create notification for customer
    const notificationMessages: Record<string, string> = {
      'PROCESSING': 'Tu pedido está siendo procesado',
      'SHIPPED': 'Tu pedido ha sido enviado',
      'DELIVERED': 'Tu pedido ha sido entregado',
      'CANCELLED': 'Tu pedido ha sido cancelado',
      'RETURNED': 'Tu pedido está en proceso de devolución'
    }

    const notificationTypes: Record<string, string> = {
      'PROCESSING': 'ORDER_UPDATED',
      'SHIPPED': 'ORDER_SHIPPED',
      'DELIVERED': 'ORDER_DELIVERED',
      'CANCELLED': 'ORDER_CANCELLED',
      'RETURNED': 'ORDER_UPDATED'
    }

    if (status && notificationMessages[status]) {
      await prisma.notification.create({
        data: {
          userId: order.userId,
          orderId: order.id,
          type: notificationTypes[status] as NotificationType,
          title: 'Actualización de Pedido',
          message: notificationMessages[status],
          actionUrl: `/orders/${order.id}`
        }
      })
    }

    return NextResponse.json({
      success: true,
      data: updatedOrder,
      message: "Order updated successfully"
    })

  } catch (error) {
    console.error("Update order error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}