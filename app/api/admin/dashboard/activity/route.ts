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

    // Get recent users
    const recentUsers = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
      take: 2,
    })

    // Get recent vendors
    const recentVendors = await prisma.vendorApplication.findMany({
      where: { status: 'APPROVED' },
      include: {
        user: { select: { name: true, email: true } },
      },
      orderBy: { submittedAt: 'desc' },
      take: 1,
    })

    // Get recent products
    const recentProducts = await prisma.product.findMany({
      select: {
        id: true,
        name: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
      take: 1,
    })

    // Get recent orders
    const recentOrders = await prisma.order.findMany({
      select: {
        id: true,
        total: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
      take: 1,
    })

    // Construct activity feed
    const activities = [
      ...recentUsers.map((user) => ({
        id: user.id,
        type: 'user_created',
        title: 'Nuevo usuario registrado',
        description: `${user.name || user.email} se registró en la plataforma`,
        timestamp: user.createdAt,
        icon: 'user_created',
        severity: 'info' as const,
      })),
      ...recentVendors.map((vendor) => ({
        id: vendor.id,
        type: 'vendor_approved',
        title: 'Vendedor aprobado',
        description: `${vendor.companyName} fue aprobado como vendedor`,
        timestamp: vendor.submittedAt,
        icon: 'vendor_approved',
        severity: 'info' as const,
      })),
      ...recentProducts.map((product) => ({
        id: product.id,
        type: 'product_listed',
        title: 'Nuevo producto listado',
        description: `"${product.name}" fue añadido a la plataforma`,
        timestamp: product.createdAt,
        icon: 'product_listed',
        severity: 'info' as const,
      })),
      ...recentOrders.map((order) => ({
        id: order.id,
        type: 'order_placed',
        title: 'Nueva orden',
        description: `Orden #${order.id.substring(0, 8)} por $${(order.total / 100).toFixed(2)}`,
        timestamp: order.createdAt,
        icon: 'order_placed',
        severity: 'info' as const,
      })),
    ]

    // Sort by timestamp and take last 6
    const sortedActivities = activities
      .filter((a) => a.timestamp !== null)
      .sort((a, b) => {
        const timeA = (a.timestamp as Date).getTime()
        const timeB = (b.timestamp as Date).getTime()
        return timeB - timeA
      })
      .slice(0, 6)

    return NextResponse.json(
      {
        success: true,
        data: sortedActivities,
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('[ADMIN_ACTIVITY_FEED]', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
