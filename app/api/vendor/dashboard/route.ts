import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth-config"
import { prisma } from "@/lib/prisma"

// GET /api/vendor/dashboard - Vendor dashboard overview
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || (session.user.role !== "VENDOR" && session.user.role !== "ADMIN")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    // Get vendor ID (if admin, could be passed as query param)
    let vendorId: string

    if (session.user.role === "ADMIN") {
      const { searchParams } = new URL(request.url)
      const requestedVendorId = searchParams.get("vendorId")

      if (!requestedVendorId) {
        return NextResponse.json({ error: "Vendor ID required for admin" }, { status: 400 })
      }
      vendorId = requestedVendorId
    } else {
      // Get vendor profile for current user
      const vendor = await prisma.vendor.findUnique({
        where: { userId: session.user.id }
      })

      if (!vendor) {
        return NextResponse.json({ error: "Vendor profile not found" }, { status: 404 })
      }
      vendorId = vendor.id
    }

    // Get vendor dashboard statistics
    const [
      totalProducts,
      activeProducts,
      totalOrders,
      pendingOrders,
      monthlyRevenue,
      monthlyOrderCount,
      lowStockProducts,
      recentOrders,
      topProducts
    ] = await Promise.all([
      // Total products
      prisma.product.count({
        where: { vendorId }
      }),

      // Active products
      prisma.product.count({
        where: {
          vendorId,
          active: true,
          inStock: true
        }
      }),

      // Total orders
      prisma.order.count({
        where: { vendorId }
      }),

      // Pending orders
      prisma.order.count({
        where: {
          vendorId,
          status: {
            in: ["PENDING", "PROCESSING"]
          }
        }
      }),

      // Monthly revenue (current month)
      prisma.order.aggregate({
        where: {
          vendorId,
          createdAt: {
            gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
          },
          paymentStatus: "PAID"
        },
        _sum: {
          total: true
        }
      }),

      // Monthly order count
      prisma.order.count({
        where: {
          vendorId,
          createdAt: {
            gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
          }
        }
      }),

      // Low stock products
      prisma.product.findMany({
        where: {
          vendorId,
          active: true,
          OR: [
            { stock: { lte: prisma.product.fields.minStock } },
            { stock: 0 }
          ]
        },
        select: {
          id: true,
          name: true,
          stock: true,
          minStock: true,
          sku: true
        },
        take: 10
      }),

      // Recent orders
      prisma.order.findMany({
        where: { vendorId },
        take: 10,
        orderBy: { createdAt: "desc" },
        include: {
          user: {
            select: { name: true, email: true }
          },
          items: {
            include: {
              product: {
                select: { name: true, images: true }
              }
            }
          }
        }
      }),

      // Top selling products (by order items)
      prisma.product.findMany({
        where: { vendorId },
        take: 5,
        include: {
          _count: {
            select: { orderItems: true }
          },
          orderItems: {
            select: {
              quantity: true
            }
          }
        }
      })
    ])

    // Calculate total quantity sold for top products
    const topProductsWithSales = topProducts.map((product: any) => ({
      ...product,
      totalSold: product.orderItems.reduce((sum: number, item: any) => sum + item.quantity, 0)
    })).sort((a: any, b: any) => b.totalSold - a.totalSold)

    // Get vendor profile info
    const vendorInfo = await prisma.vendor.findUnique({
      where: { id: vendorId },
      include: {
        user: {
          select: { name: true, email: true }
        }
      }
    })

    return NextResponse.json({
      success: true,
      data: {
        vendorInfo,
        stats: {
          totalProducts,
          activeProducts,
          totalOrders,
          pendingOrders,
          monthlyRevenue: monthlyRevenue._sum.total || 0,
          monthlyOrderCount,
          lowStockCount: lowStockProducts.length
        },
        lowStockProducts,
        recentOrders,
        topProducts: topProductsWithSales
      }
    })

  } catch (error) {
    console.error("Vendor dashboard error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}