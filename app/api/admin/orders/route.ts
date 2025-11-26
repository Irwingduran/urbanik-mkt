import { getServerSession } from 'next-auth'
import { NextRequest, NextResponse } from 'next/server'
import { authOptions } from '@/lib/auth-config'
import { prisma } from '@/lib/prisma'
import { Prisma, OrderStatus } from '@prisma/client'

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

    const searchParams = request.nextUrl.searchParams
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const status = searchParams.get('status')
    const search = searchParams.get('search')

    const skip = (page - 1) * limit

    // Build where clause
    const where: Prisma.OrderWhereInput = {}
    if (status && status !== 'all') {
      where.status = status as OrderStatus
    }
    if (search) {
      where.OR = [
        { id: { contains: search, mode: 'insensitive' } },
        { user: { email: { contains: search, mode: 'insensitive' } } },
      ]
    }

    // Get orders
    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        skip,
        take: limit,
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          items: {
            select: {
              id: true,
              quantity: true,
              price: true,
              product: {
                select: {
                  id: true,
                  name: true,
                  sku: true,
                },
              },
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.order.count({ where }),
    ])

    // Calculate summary stats
    const stats = await prisma.order.aggregate({
      _sum: { total: true },
      _count: true,
      where: { status: 'DELIVERED' },
    })

    return NextResponse.json(
      {
        success: true,
        data: {
          orders,
          stats: {
            totalRevenue: stats._sum?.total || 0,
            completedOrders: stats._count,
          },
          pagination: {
            page,
            limit,
            total,
            pages: Math.ceil(total / limit),
          },
        },
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('[ADMIN_ORDERS]', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
