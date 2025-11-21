import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth-config"
import { prisma } from "@/lib/prisma"
import { stripe } from "@/lib/stripe"

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    const userRoles = session?.user?.roles || (session?.user?.role ? [session.user.role] : [])
    const hasPermission = userRoles.some((r: string) => ['USER', 'CUSTOMER', 'ADMIN'].includes(r))

    if (!session || !hasPermission) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    const body = await request.json()
    const {
      items, // [{ productId, quantity }]
      shippingAddress,
      billingAddress,
      paymentMethod,
      useShippingAsBilling = true
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
    const itemsByVendor = items.reduce((acc: any, item: any) => {
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

    // Calculate totals
    const grandSubtotal = items.reduce((sum: number, item: any) => {
      const product = products.find((p: any) => p.id === item.productId)!
      return sum + (product.price * item.quantity)
    }, 0)

    const grandShipping = grandSubtotal > 500 ? 0 : 99 // Free shipping over $500
    const grandTax = grandSubtotal * 0.16 // 16% tax in Mexico
    const grandTotal = grandSubtotal + grandShipping + grandTax

    // Create Stripe Payment Intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(grandTotal * 100), // Stripe expects cents
      currency: 'mxn',
      metadata: {
        userId: session.user.id,
        orderCount: Object.keys(itemsByVendor).length.toString(),
        subtotal: grandSubtotal.toString(),
        shipping: grandShipping.toString(),
        tax: grandTax.toString(),
        total: grandTotal.toString()
      },
      description: `Regen Marketplace Order - ${Object.keys(itemsByVendor).length} vendor(s)`,
      automatic_payment_methods: {
        enabled: true,
      },
    })

    // Create orders (one per vendor) but with PENDING status
    const createdOrders = await Promise.all(
      Object.entries(itemsByVendor).map(async ([vendorId, vendorItems]) => {
        const subtotal = (vendorItems as any[]).reduce((sum: number, item: any) => sum + item.total, 0)
        const shipping = grandSubtotal > 500 ? 0 : Math.round(99 * (subtotal / grandSubtotal)) // Proportional shipping
        const tax = subtotal * 0.16
        const total = subtotal + shipping + tax

        // Create order with PENDING status
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
            paymentMethod: paymentMethod.type,
            paymentStatus: "PENDING",
            stripePaymentId: paymentIntent.id,
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
                product: {
                  select: {
                    id: true,
                    name: true,
                    images: true
                  }
                }
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

        // Reserve stock (decrement temporarily)
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

        return order
      })
    )

    // Create initial notifications (payment pending)
    await Promise.all(
      createdOrders.map((order: any) =>
        prisma.notification.create({
          data: {
            userId: session.user.id,
            orderId: order.id,
            type: "ORDER_CREATED",
            title: "Pedido Creado",
            message: "Tu pedido ha sido creado y está pendiente de pago.",
            actionUrl: `/orders/${order.id}`
          }
        })
      )
    )

    return NextResponse.json({
      success: true,
      data: {
        orders: createdOrders,
        paymentIntent: {
          id: paymentIntent.id,
          clientSecret: paymentIntent.client_secret,
          amount: paymentIntent.amount,
          currency: paymentIntent.currency
        },
        totals: {
          subtotal: grandSubtotal,
          shipping: grandShipping,
          tax: grandTax,
          total: grandTotal
        }
      },
      message: "Orders created successfully, complete payment to confirm"
    })

  } catch (error) {
    console.error("Order creation error:", error)

    // If it's a Stripe error, provide more specific error message
    if (error instanceof Error && error.message.includes('stripe')) {
      return NextResponse.json(
        { error: "Payment processing failed. Please try again." },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}