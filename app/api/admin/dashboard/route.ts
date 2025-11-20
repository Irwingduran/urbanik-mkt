import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth-config"
import { prisma } from "@/lib/prisma"

// GET /api/admin/dashboard - Admin dashboard overview
export async function GET(request: NextRequest) {
  try {
    console.log('[DEBUG] Admin dashboard endpoint called')
    const session = await getServerSession(authOptions)
    console.log('[DEBUG] Session:', session?.user?.email, 'Role:', session?.user?.role)

    if (!session || session.user.role !== "ADMIN") {
      console.log('[DEBUG] Unauthorized: no session or not admin role')
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    // Get platform statistics (parallel aggregate queries)
    const [
      totalUsers,
      totalVendors,
      totalProducts,
      totalOrders,
      pendingVendors,
      activeOrders,
      monthlyRevenue,
      averageRegenScore,
      nftDistributionRaw
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
      }),

      // Average regen score across active vendors (sustainability metric)
      prisma.vendorProfile.aggregate({
        where: { active: true },
        _avg: { regenScore: true }
      }),

      // NFT distribution by level
      prisma.vendorProfile.groupBy({
        by: ['nftLevel'],
        where: { active: true },
        _count: { nftLevel: true }
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

    // Transform distribution to key-value object
    const nftDistribution = nftDistributionRaw.reduce<Record<string, number>>((acc, item) => {
      acc[item.nftLevel] = item._count.nftLevel
      return acc
    }, {})

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
          monthlyRevenue: monthlyRevenue._sum.total || 0,
          averageRegenScore: averageRegenScore._avg.regenScore || 0,
          nftDistribution
        },
        recentActivity: recentOrders,
        topVendors
      }
    })

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error)
    console.error("Admin dashboard error:", errorMessage)
    console.error("Full error:", error)
    return NextResponse.json(
      { 
        error: "Internal server error",
        details: process.env.NODE_ENV === 'development' ? errorMessage : undefined
      },
      { status: 500 }
    )
  }
}