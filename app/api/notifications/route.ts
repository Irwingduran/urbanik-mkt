import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth-config"
import { prisma } from "@/lib/prisma"

// GET /api/notifications - Get user's notifications
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get("page") || "1")
    const limit = parseInt(searchParams.get("limit") || "20")
    const unreadOnly = searchParams.get("unreadOnly") === "true"

    const skip = (page - 1) * limit

    // Build where clause
    const where: any = { userId: session.user.id }

    if (unreadOnly) {
      where.read = false
    }

    const [notifications, totalCount, unreadCount] = await Promise.all([
      prisma.notification.findMany({
        where,
        skip,
        take: limit,
        include: {
          product: {
            select: {
              id: true,
              name: true,
              images: true
            }
          }
        },
        orderBy: { createdAt: "desc" }
      }),

      prisma.notification.count({ where }),

      prisma.notification.count({
        where: {
          userId: session.user.id,
          read: false
        }
      })
    ])

    const totalPages = Math.ceil(totalCount / limit)

    return NextResponse.json({
      success: true,
      data: notifications,
      meta: {
        total: totalCount,
        unread: unreadCount,
        page,
        limit,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1
      }
    })

  } catch (error) {
    console.error("Notifications error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

// PATCH /api/notifications - Mark notifications as read
export async function PATCH(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { notificationIds, markAllAsRead } = body

    if (markAllAsRead) {
      // Mark all notifications as read
      await prisma.notification.updateMany({
        where: {
          userId: session.user.id,
          read: false
        },
        data: {
          read: true
        }
      })

      return NextResponse.json({
        success: true,
        message: "All notifications marked as read"
      })
    } else if (notificationIds && Array.isArray(notificationIds)) {
      // Mark specific notifications as read
      await prisma.notification.updateMany({
        where: {
          id: { in: notificationIds },
          userId: session.user.id
        },
        data: {
          read: true
        }
      })

      return NextResponse.json({
        success: true,
        message: "Notifications marked as read"
      })
    } else {
      return NextResponse.json(
        { error: "Invalid request body" },
        { status: 400 }
      )
    }

  } catch (error) {
    console.error("Mark notifications read error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

// DELETE /api/notifications - Delete notifications
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const notificationId = searchParams.get("id")

    if (notificationId) {
      // Delete specific notification
      await prisma.notification.delete({
        where: {
          id: notificationId,
          userId: session.user.id
        }
      })

      return NextResponse.json({
        success: true,
        message: "Notification deleted"
      })
    } else {
      // Delete all read notifications
      await prisma.notification.deleteMany({
        where: {
          userId: session.user.id,
          read: true
        }
      })

      return NextResponse.json({
        success: true,
        message: "Read notifications deleted"
      })
    }

  } catch (error) {
    console.error("Delete notifications error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}