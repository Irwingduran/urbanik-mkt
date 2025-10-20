import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth-config"
import { prisma } from "@/lib/prisma"

// GET /api/vendor/orders/analytics - Get detailed order analytics for vendor
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== "VENDOR") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    const { searchParams } = new URL(request.url)
    const timeRange = searchParams.get("timeRange") || "30" // days
    const granularity = searchParams.get("granularity") || "day" // day, week, month

    const vendorUserId = session.user.id

    const daysBack = parseInt(timeRange)
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - daysBack)

    // Revenue over time
    const revenueData = await prisma.$queryRaw`
      SELECT
        DATE_TRUNC(${granularity}, "createdAt") as period,
        COUNT(*)::int as order_count,
        SUM("total")::float as revenue,
        AVG("total")::float as avg_order_value
      FROM "orders"
      WHERE "vendorUserId" = ${vendorUserId}
        AND "createdAt" >= ${startDate}
        AND "status" IN ('DELIVERED', 'SHIPPED')
      GROUP BY DATE_TRUNC(${granularity}, "createdAt")
      ORDER BY period ASC
    ` as Array<{
      period: Date
      order_count: number
      revenue: number
      avg_order_value: number
    }>

    // Order status distribution
    const statusDistribution = await prisma.order.groupBy({
      by: ["status"],
      where: {
        vendorUserId: vendorUserId,
        createdAt: { gte: startDate }
      },
      _count: { status: true },
      _sum: { total: true }
    })

    // Top selling products
    const topProducts = await prisma.$queryRaw`
      SELECT
        p."id",
        p."name",
        p."images",
        p."price",
        SUM(oi."quantity")::int as total_sold,
        SUM(oi."total")::float as total_revenue,
        COUNT(DISTINCT o."id")::int as order_count
      FROM "order_items" oi
      JOIN "orders" o ON oi."orderId" = o."id"
      JOIN "products" p ON oi."productId" = p."id"
      WHERE o."vendorUserId" = ${vendorUserId}
        AND o."createdAt" >= ${startDate}
        AND o."status" IN ('DELIVERED', 'SHIPPED', 'PROCESSING')
      GROUP BY p."id", p."name", p."images", p."price"
      ORDER BY total_sold DESC
      LIMIT 10
    ` as Array<{
      id: string
      name: string
      images: string[]
      price: number
      total_sold: number
      total_revenue: number
      order_count: number
    }>

    // Customer insights
    const customerInsights = await prisma.$queryRaw`
      SELECT
        COUNT(DISTINCT o."userId")::int as unique_customers,
        AVG(order_counts.order_count)::float as avg_orders_per_customer,
        COUNT(CASE WHEN order_counts.order_count > 1 THEN 1 END)::int as repeat_customers
      FROM (
        SELECT "userId", COUNT(*)::int as order_count
        FROM "orders"
        WHERE "vendorUserId" = ${vendorUserId}
          AND "createdAt" >= ${startDate}
          AND "status" IN ('DELIVERED', 'SHIPPED')
        GROUP BY "userId"
      ) order_counts
    ` as Array<{
      unique_customers: number
      avg_orders_per_customer: number
      repeat_customers: number
    }>

    // Monthly comparison
    const currentMonth = new Date()
    currentMonth.setDate(1)
    const lastMonth = new Date(currentMonth)
    lastMonth.setMonth(lastMonth.getMonth() - 1)

    const [currentMonthStats, lastMonthStats] = await Promise.all([
      prisma.order.aggregate({
        where: {
          vendorUserId: vendorUserId,
          createdAt: { gte: currentMonth },
          status: { in: ["DELIVERED", "SHIPPED"] }
        },
        _count: { id: true },
        _sum: { total: true }
      }),
      prisma.order.aggregate({
        where: {
          vendorUserId: vendorUserId,
          createdAt: {
            gte: lastMonth,
            lt: currentMonth
          },
          status: { in: ["DELIVERED", "SHIPPED"] }
        },
        _count: { id: true },
        _sum: { total: true }
      })
    ])

    // Calculate growth rates
    const revenueGrowth = lastMonthStats._sum.total
      ? ((currentMonthStats._sum.total || 0) - (lastMonthStats._sum.total || 0)) / (lastMonthStats._sum.total || 1) * 100
      : 0

    const orderGrowth = lastMonthStats._count.id
      ? ((currentMonthStats._count.id || 0) - (lastMonthStats._count.id || 0)) / (lastMonthStats._count.id || 1) * 100
      : 0

    // Environmental impact metrics
    const environmentalImpact = await prisma.$queryRaw`
      SELECT
        SUM(p."co2Reduction" * oi."quantity")::float as total_co2_saved,
        SUM(p."waterSaving" * oi."quantity")::float as total_water_saved,
        SUM(p."energyEfficiency" * oi."quantity")::float as total_energy_generated
      FROM "order_items" oi
      JOIN "orders" o ON oi."orderId" = o."id"
      JOIN "products" p ON oi."productId" = p."id"
      WHERE o."vendorUserId" = ${vendorUserId}
        AND o."createdAt" >= ${startDate}
        AND o."status" IN ('DELIVERED', 'SHIPPED')
    ` as Array<{
      total_co2_saved: number
      total_water_saved: number
      total_energy_generated: number
    }>

    return NextResponse.json({
      success: true,
      data: {
        timeRange: {
          days: daysBack,
          startDate,
          endDate: new Date()
        },
        revenue: {
          timeSeries: revenueData,
          currentMonth: currentMonthStats._sum.total || 0,
          lastMonth: lastMonthStats._sum.total || 0,
          growth: revenueGrowth
        },
        orders: {
          currentMonth: currentMonthStats._count.id || 0,
          lastMonth: lastMonthStats._count.id || 0,
          growth: orderGrowth,
          statusDistribution: statusDistribution.map((item: any) => ({
            status: item.status,
            count: item._count.status,
            revenue: item._sum.total || 0
          }))
        },
        products: {
          topSelling: topProducts
        },
        customers: {
          unique: customerInsights[0]?.unique_customers || 0,
          avgOrdersPerCustomer: customerInsights[0]?.avg_orders_per_customer || 0,
          repeatCustomers: customerInsights[0]?.repeat_customers || 0,
          repeatRate: customerInsights[0]?.unique_customers
            ? (customerInsights[0]?.repeat_customers / customerInsights[0]?.unique_customers) * 100
            : 0
        },
        environmental: {
          co2Saved: environmentalImpact[0]?.total_co2_saved || 0,
          waterSaved: environmentalImpact[0]?.total_water_saved || 0,
          energyGenerated: environmentalImpact[0]?.total_energy_generated || 0
        }
      }
    })

  } catch (error) {
    console.error("Vendor analytics error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}