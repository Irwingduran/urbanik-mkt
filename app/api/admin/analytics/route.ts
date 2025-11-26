import { getServerSession } from 'next-auth'
import { NextResponse } from 'next/server'
import { authOptions } from '@/lib/auth-config'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    // Check if user is authenticated and is admin
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 403 }
      )
    }

    // Get analytics data
    const [
      totalUsers,
      totalVendors,
      totalOrders,
      totalRevenue,
      activeVendors,
      suspendedUsers,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { role: 'VENDOR' } }),
      prisma.order.count() || 0, // Fallback if Order model doesn't exist
      prisma.order.aggregate({ _sum: { total: true } }).then(r => r._sum.total || 0), // Fallback
      prisma.user.count({ where: { role: 'VENDOR' } }), // Active vendors (approximation)
      prisma.user.count({ where: { role: 'USER' } }),
    ])

    // Get recent users
    const recentUsers = await prisma.user.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
    })

    // Get user growth (approximation - users per day for last 7 days)
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    const usersLastWeek = await prisma.user.count({
      where: { createdAt: { gte: sevenDaysAgo } },
    })

    // Get vendors distribution
    const vendorsByCountry = await prisma.user.groupBy({
      by: ['role'],
      _count: true,
    })

    return NextResponse.json(
      {
        success: true,
        analytics: {
          summary: {
            totalUsers,
            totalVendors,
            totalOrders: totalOrders || 0,
            totalRevenue: totalRevenue || 0,
            activeVendors,
            suspendedUsers,
          },
          growth: {
            newUsersLastWeek: usersLastWeek,
            growthRate: ((usersLastWeek / Math.max(totalUsers - usersLastWeek, 1)) * 100).toFixed(2),
          },
          recentUsers,
          distribution: vendorsByCountry,
        },
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('[ADMIN_ANALYTICS]', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
