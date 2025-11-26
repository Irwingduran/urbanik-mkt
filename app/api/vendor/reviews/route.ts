import { NextResponse } from 'next/server'
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth-config"
import { prisma } from "@/lib/prisma"

export async function GET() {
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

    const reviews = await prisma.review.findMany({
      where: {
        product: {
          vendorUserId: session.user.id
        }
      },
      include: {
        product: {
          select: {
            id: true,
            name: true,
            images: true
          }
        },
        user: {
          select: {
            name: true,
            image: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json({ success: true, data: reviews })
  } catch (error) {
    console.error("Error fetching vendor reviews:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
