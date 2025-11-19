import { getServerSession } from 'next-auth'
import { NextRequest, NextResponse } from 'next/server'
import { authOptions } from '@/lib/auth-config'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    // Check if user is authenticated and is admin
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 403 }
      )
    }

    // Get top sellers ordered by total sales
    const topSellers = await prisma.vendorProfile.findMany({
      orderBy: {
        totalSales: 'desc',
      },
      take: 5,
    })

    // Get user info for each vendor
    const sellersWithUser = await Promise.all(
      topSellers.map(async (seller) => {
        const user = await prisma.user.findUnique({
          where: { id: seller.userId },
          select: { id: true, name: true, email: true },
        })

        // Count products
        const productCount = await prisma.product.count({
          where: { vendorUserId: seller.userId },
        })

        return {
          id: seller.userId,
          name: user?.name || seller.companyName || 'Unknown',
          email: user?.email || 'N/A',
          totalSales: Number(seller.totalSales) || 0,
          revenue: Number(seller.totalSales) || 0,
          productCount: productCount,
          rating: seller.averageRating || 0,
          isActive: seller.active && !seller.suspended,
        }
      })
    )

    return NextResponse.json(
      {
        success: true,
        data: sellersWithUser,
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('[ADMIN_TOP_SELLERS]', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
