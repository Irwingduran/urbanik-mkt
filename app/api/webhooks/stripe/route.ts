import { NextRequest, NextResponse } from "next/server"
import { headers } from "next/headers"
import { stripe } from "@/lib/stripe"
import { prisma } from "@/lib/prisma"

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!

export async function POST(request: NextRequest) {
  try {
    const body = await request.text()
    const signature = headers().get("stripe-signature")!

    let event: any

    try {
      event = stripe.webhooks.constructEvent(body, signature, endpointSecret)
    } catch (err: any) {
      console.error("Webhook signature verification failed:", err.message)
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 })
    }

    // Handle the event
    switch (event.type) {
      case "payment_intent.succeeded":
        await handlePaymentSuccess(event.data.object)
        break

      case "payment_intent.payment_failed":
        await handlePaymentFailed(event.data.object)
        break

      case "payment_intent.canceled":
        await handlePaymentCanceled(event.data.object)
        break

      case "charge.dispute.created":
        await handleChargeDispute(event.data.object)
        break

      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return NextResponse.json({ received: true })

  } catch (error) {
    console.error("Webhook error:", error)
    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 500 }
    )
  }
}

async function handlePaymentSuccess(paymentIntent: any) {
  try {
    console.log("Processing successful payment:", paymentIntent.id)

    // Find orders associated with this payment intent
    const orders = await prisma.order.findMany({
      where: { stripePaymentId: paymentIntent.id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        vendor: {
          select: {
            id: true,
            companyName: true,
            user: {
              select: {
                id: true,
                name: true,
                email: true
              }
            }
          }
        },
        items: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                vendorId: true,
                regenScore: true
              }
            }
          }
        }
      }
    })

    if (orders.length === 0) {
      console.error("No orders found for payment intent:", paymentIntent.id)
      return
    }

    // Update all orders to PROCESSING status
    await Promise.all(
      orders.map(async (order: any) => {
        // Update order status
        await prisma.order.update({
          where: { id: order.id },
          data: {
            status: "PROCESSING",
            paymentStatus: "PAID"
          }
        })

        // Create customer notification
        await prisma.notification.create({
          data: {
            userId: order.userId,
            orderId: order.id,
            type: "PAYMENT_SUCCESS",
            title: "Pago Confirmado",
            message: `Tu pago de $${order.total.toFixed(2)} ha sido procesado exitosamente. Tu pedido está siendo preparado.`,
            actionUrl: `/orders/${order.id}`
          }
        })

        // Create vendor notification
        await prisma.notification.create({
          data: {
            userId: order.vendor.user.id,
            orderId: order.id,
            type: "ORDER_CREATED",
            title: "Nuevo Pedido",
            message: `Tienes un nuevo pedido por $${order.total.toFixed(2)} de ${order.user.name}`,
            actionUrl: `/dashboard/vendor/orders/${order.id}`
          }
        })

        // Update product sales count
        await Promise.all(
          order.items.map((item: any) =>
            prisma.product.update({
              where: { id: item.productId },
              data: {
                salesCount: { increment: item.quantity },
                views: { increment: 1 }
              }
            })
          )
        )

        // Clear user's cart items for products in this order
        const productIds = order.items.map((item: any) => item.productId)
        await prisma.cartItem.deleteMany({
          where: {
            userId: order.userId,
            productId: { in: productIds }
          }
        })

        console.log(`Order ${order.id} processed successfully`)
      })
    )

    // Update user loyalty points (if not already done)
    const totalRegenScore = orders.reduce((sum, order) =>
      sum + order.items.reduce((itemSum, item) =>
        itemSum + (item.product.regenScore || 0) * item.quantity, 0
      ), 0
    )

    if (totalRegenScore > 0) {
      await prisma.userProfile.upsert({
        where: { userId: orders[0].userId },
        update: {
          loyaltyPoints: { increment: Math.floor(totalRegenScore / 10) },
          regenScore: { increment: totalRegenScore }
        },
        create: {
          userId: orders[0].userId,
          loyaltyPoints: Math.floor(totalRegenScore / 10),
          regenScore: totalRegenScore
        }
      })
    }

  } catch (error) {
    console.error("Error processing payment success:", error)
    throw error
  }
}

async function handlePaymentFailed(paymentIntent: any) {
  try {
    console.log("Processing failed payment:", paymentIntent.id)

    // Find orders associated with this payment intent
    const orders = await prisma.order.findMany({
      where: { stripePaymentId: paymentIntent.id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        items: {
          select: {
            productId: true,
            quantity: true
          }
        }
      }
    })

    if (orders.length === 0) {
      console.error("No orders found for failed payment intent:", paymentIntent.id)
      return
    }

    // Update orders to CANCELLED and restore stock
    await Promise.all(
      orders.map(async (order: any) => {
        // Update order status
        await prisma.order.update({
          where: { id: order.id },
          data: {
            status: "CANCELLED",
            paymentStatus: "FAILED"
          }
        })

        // Restore product stock
        await Promise.all(
          order.items.map((item: any) =>
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
            type: "PAYMENT_FAILED",
            title: "Pago Fallido",
            message: "Tu pago no pudo ser procesado. Tu pedido ha sido cancelado y el stock ha sido restaurado.",
            actionUrl: `/orders/${order.id}`
          }
        })

        console.log(`Failed order ${order.id} processed and stock restored`)
      })
    )

  } catch (error) {
    console.error("Error processing payment failure:", error)
    throw error
  }
}

async function handlePaymentCanceled(paymentIntent: any) {
  try {
    console.log("Processing canceled payment:", paymentIntent.id)

    // Similar to payment failed - cancel orders and restore stock
    const orders = await prisma.order.findMany({
      where: { stripePaymentId: paymentIntent.id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        items: {
          select: {
            productId: true,
            quantity: true
          }
        }
      }
    })

    if (orders.length === 0) {
      return
    }

    await Promise.all(
      orders.map(async (order: any) => {
        await prisma.order.update({
          where: { id: order.id },
          data: {
            status: "CANCELLED",
            paymentStatus: "FAILED"
          }
        })

        // Restore stock
        await Promise.all(
          order.items.map((item: any) =>
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
            message: "Tu pago fue cancelado. Tu pedido ha sido cancelado automáticamente.",
            actionUrl: `/orders/${order.id}`
          }
        })
      })
    )

  } catch (error) {
    console.error("Error processing payment cancellation:", error)
    throw error
  }
}

async function handleChargeDispute(charge: any) {
  try {
    console.log("Processing charge dispute:", charge.id)

    // Find orders associated with this charge
    const paymentIntent = await stripe.paymentIntents.retrieve(charge.payment_intent)

    const orders = await prisma.order.findMany({
      where: { stripePaymentId: paymentIntent.id },
      include: {
        vendor: {
          select: {
            user: {
              select: {
                id: true,
                email: true
              }
            }
          }
        }
      }
    })

    // Create notifications for vendors about the dispute
    await Promise.all(
      orders.map((order: any) =>
        prisma.notification.create({
          data: {
            userId: order.vendor.user.id,
            orderId: order.id,
            type: "SYSTEM",
            title: "Disputa de Pago",
            message: `Se ha iniciado una disputa para el pedido #${order.id}. Revisa los detalles en tu panel de administración.`,
            actionUrl: `/dashboard/vendor/orders/${order.id}`
          }
        })
      )
    )

  } catch (error) {
    console.error("Error processing charge dispute:", error)
    throw error
  }
}