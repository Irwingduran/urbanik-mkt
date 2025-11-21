import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth-config"
import { prisma } from "@/lib/prisma"

// PATCH /api/vendor/reviews/[id] - Reply to a review
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Check if user is vendor
    const isVendor = session.user.roles?.includes('VENDOR') || session.user.role === 'VENDOR'
    if (!isVendor) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const body = await request.json()
    const { reply } = body

    if (!reply) {
      return NextResponse.json({ error: "Reply content is required" }, { status: 400 })
    }

    // Verify ownership of the product being reviewed
    const review = await prisma.review.findUnique({
      where: { id: params.id },
      include: {
        product: true
      }
    })

    if (!review) {
      return NextResponse.json({ error: "Review not found" }, { status: 404 })
    }

    if (review.product.vendorUserId !== session.user.id) {
      return NextResponse.json({ error: "You can only reply to reviews of your own products" }, { status: 403 })
    }

    // Update review
    const updatedReview = await prisma.review.update({
      where: { id: params.id },
      data: {
        vendorReply: reply,
        vendorReplyAt: new Date()
      }
    })

    // Notify User
    await prisma.notification.create({
      data: {
        userId: review.userId,
        type: "ORDER_UPDATED", // Using generic type or create a new one like REVIEW_REPLY
        title: "Respuesta del Vendedor",
        message: `El vendedor de "${review.product.name}" ha respondido a tu reseña.`,
        actionUrl: `/marketplace/products/${review.productId}?tab=reviews`
      }
    })

    return NextResponse.json({ success: true, data: updatedReview })

  } catch (error) {
    console.error("Error replying to review:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
