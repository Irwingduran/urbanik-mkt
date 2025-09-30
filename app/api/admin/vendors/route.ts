import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth-config"
import { prisma } from "@/lib/prisma"

// GET /api/admin/vendors - List all vendors with pagination
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get("page") || "1")
    const limit = parseInt(searchParams.get("limit") || "20")
    const status = searchParams.get("status") // active, suspended, pending
    const search = searchParams.get("search")

    const skip = (page - 1) * limit

    // Build where clause
    const where: any = {
      role: "VENDOR"
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
        { vendor: { companyName: { contains: search, mode: "insensitive" } } }
      ]
    }

    const [vendors, totalCount] = await Promise.all([
      prisma.user.findMany({
        where,
        skip,
        take: limit,
        include: {
          vendor: {
            include: {
              _count: {
                select: {
                  products: true,
                  orders: true
                }
              }
            }
          }
        },
        orderBy: { createdAt: "desc" }
      }),

      prisma.user.count({ where })
    ])

    const totalPages = Math.ceil(totalCount / limit)

    return NextResponse.json({
      success: true,
      data: vendors,
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
    console.error("Admin vendors list error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

// POST /api/admin/vendors - Create/Approve vendor
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    const body = await request.json()
    const { userId, action } = body // action: approve, reject, suspend

    if (!userId || !action) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { vendor: true }
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    let updatedUser

    switch (action) {
      case "approve":
        updatedUser = await prisma.user.update({
          where: { id: userId },
          data: {
            role: "VENDOR",
            // Add approval timestamp if needed
          },
          include: { vendor: true }
        })
        break

      case "reject":
        // Keep as USER role, maybe add rejection reason
        updatedUser = await prisma.user.update({
          where: { id: userId },
          data: {
            role: "USER",
          },
          include: { vendor: true }
        })
        break

      case "suspend":
        // Add suspended status logic
        updatedUser = await prisma.user.update({
          where: { id: userId },
          data: {
            // Add suspended field to schema
          },
          include: { vendor: true }
        })
        break

      default:
        return NextResponse.json({ error: "Invalid action" }, { status: 400 })
    }

    return NextResponse.json({
      success: true,
      data: updatedUser,
      message: `Vendor ${action}ed successfully`
    })

  } catch (error) {
    console.error("Admin vendor action error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}