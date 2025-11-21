import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth-config"
import { prisma } from "@/lib/prisma"

// POST /api/reviews - Create a new review
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { productId, rating, comment } = body

    if (!productId || !rating) {
      return NextResponse.json(
        { error: "Product ID and rating are required" },
        { status: 400 }
      )
    }

    if (rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: "Rating must be between 1 and 5" },
        { status: 400 }
      )
    }

    // 1. Verify purchase (Verified Purchase)
    // Check if user has a delivered order containing this product
    const purchase = await prisma.order.findFirst({
      where: {
        userId: session.user.id,
        status: "DELIVERED",
        items: {
          some: {
            productId: productId
          }
        }
      }
    })

    if (!purchase) {
      return NextResponse.json(
        { error: "You can only review products you have purchased and received" },
        { status: 403 }
      )
    }

    // 2. Check if already reviewed
    const existingReview = await prisma.review.findFirst({
      where: {
        userId: session.user.id,
        productId: productId
      }
    })

    if (existingReview) {
      return NextResponse.json(
        { error: "You have already reviewed this product" },
        { status: 400 }
      )
    }

    // 3. Create Review
    const review = await prisma.review.create({
      data: {
        userId: session.user.id,
        productId,
        rating,
        comment,
        verified: true
      },
      include: {
        product: {
          select: {
            name: true,
            vendorUserId: true
          }
        },
        user: {
          select: {
            name: true
          }
        }
      }
    })

    // 4. Update Product Stats
    // Recalculate average to be precise
    const aggregations = await prisma.review.aggregate({
      where: { productId },
      _avg: { rating: true },
      _count: { rating: true }
    })

    await prisma.product.update({
      where: { id: productId },
      data: {
        averageRating: aggregations._avg.rating || 0,
        reviewCount: aggregations._count.rating || 0
      }
    })

    // 5. Notify Vendor
    if (review.product.vendorUserId) {
      await prisma.notification.create({
        data: {
          userId: review.product.vendorUserId,
          type: "PRODUCT_REVIEW",
          title: "Nueva Reseña de Producto",
          message: `El usuario ${review.user.name} calificó "${review.product.name}" con ${rating} estrellas.`,
          productId: productId,
          actionUrl: `/dashboard/vendor/products/${productId}` // Or reviews page
        }
      })
    }

    return NextResponse.json({
      success: true,
      data: review
    })

  } catch (error) {
    console.error("Create review error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
