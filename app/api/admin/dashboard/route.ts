import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth-config"
import { prisma } from "@/lib/prisma"

// GET /api/admin/dashboard - Admin dashboard overview
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    // Get platform statistics
    const [
      totalUsers,
      totalVendors,
      totalProducts,
      totalOrders,
      pendingVendors,
      activeOrders,
      monthlyRevenue
    ] = await Promise.all([
      // Total users
      prisma.user.count(),

      // Total vendors (users with VendorProfile)
      prisma.vendorProfile.count({
        where: { active: true }
      }),

      // Total products
      prisma.product.count({
        where: { active: true }
      }),

      // Total orders
      prisma.order.count(),

      // Pending vendor applications
      prisma.vendorApplication.count({
        where: { status: "PENDING" }
      }),

      // Active orders (not delivered/cancelled)
      prisma.order.count({
        where: {
          status: {
            in: ["PENDING", "PROCESSING", "SHIPPED"]
          }
        }
      }),

      // Monthly revenue (current month)
      prisma.order.aggregate({
        where: {
          createdAt: {
            gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
          },
          paymentStatus: "PAID"
        },
        _sum: {
          total: true
        }
      })
    ])

    // Recent activity (last 10 orders)
    const recentOrders = await prisma.order.findMany({
      take: 10,
      orderBy: { createdAt: "desc" },
      include: {
        user: {
          select: { name: true, email: true }
        },
        vendorProfile: {
          select: { companyName: true }
        }
      }
    })

    // Top performing vendors
    const topVendors = await prisma.vendorProfile.findMany({
      take: 5,
      orderBy: { totalSales: "desc" },
      include: {
        user: {
          select: { name: true, email: true }
        }
      }
    })

    return NextResponse.json({
      success: true,
      data: {
        stats: {
          totalUsers,
          totalVendors,
          totalProducts,
          totalOrders,
          pendingVendors,
          activeOrders,
          monthlyRevenue: monthlyRevenue._sum.total || 0
        },
        recentActivity: recentOrders,
        topVendors
      }
    })

  } catch (error) {
    console.error("Admin dashboard error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}