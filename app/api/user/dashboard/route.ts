import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth-config'
import { prisma } from '@/lib/prisma'

// GET /api/user/dashboard - Get user dashboard data with real metrics
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== 'USER') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    const userId = session.user.id

    // Fetch all user data in parallel
    const [user, userProfile, orders, recentOrders, currentMonthOrders] = await Promise.all([
      // User basic info
      prisma.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          name: true,
          email: true,
          createdAt: true
        }
      }),

      // User profile with sustainability data
      prisma.userProfile.findUnique({
        where: { userId },
        select: {
          regenScore: true,
          loyaltyPoints: true,
          nftsCollected: true
        }
      }),

      // All orders for impact calculation
      prisma.order.findMany({
        where: { userId },
        include: {
          items: {
            include: {
              product: {
                select: {
                  regenScore: true,
                  co2Reduction: true,
                  waterSaving: true,
                  energyEfficiency: true
                }
              }
            }
          }
        },
        orderBy: { createdAt: 'desc' }
      }),

      // Recent orders for dashboard display
      prisma.order.findMany({
        where: { userId },
        include: {
          vendorProfile: {
            select: {
              companyName: true
            }
          },
          items: {
            include: {
              product: {
                select: {
                  name: true,
                  images: true
                }
              }
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        take: 5
      }),

      // Current month orders for trending
      prisma.order.findMany({
        where: {
          userId,
          createdAt: {
            gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
          }
        },
        include: {
          items: {
            include: {
              product: {
                select: {
                  co2Reduction: true,
                  waterSaving: true,
                  energyEfficiency: true
                }
              }
            }
          }
        }
      })
    ])

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Calculate total environmental impact
    const calculateImpact = (ordersList: typeof orders) => {
      return ordersList.reduce(
        (acc, order) => {
          order.items.forEach((item) => {
            acc.co2Saved += item.product.co2Reduction * item.quantity
            acc.waterSaved += item.product.waterSaving * item.quantity
            acc.energyGenerated += item.product.energyEfficiency * item.quantity
          })
          return acc
        },
        { co2Saved: 0, waterSaved: 0, energyGenerated: 0 }
      )
    }

    const totalImpact = calculateImpact(orders)
    const currentMonthImpact = calculateImpact(currentMonthOrders)

    // Calculate previous month for comparison
    const previousMonthStart = new Date(
      new Date().getFullYear(),
      new Date().getMonth() - 1,
      1
    )
    const previousMonthEnd = new Date(
      new Date().getFullYear(),
      new Date().getMonth(),
      0
    )

    const previousMonthOrders = await prisma.order.findMany({
      where: {
        userId,
        createdAt: {
          gte: previousMonthStart,
          lte: previousMonthEnd
        }
      },
      include: {
        items: {
          include: {
            product: {
              select: {
                co2Reduction: true,
                waterSaving: true,
                energyEfficiency: true
              }
            }
          }
        }
      }
    })

    const previousMonthImpact = calculateImpact(previousMonthOrders)

    // Calculate growth percentage
    const calculateGrowth = (current: number, previous: number) => {
      if (previous === 0) return current > 0 ? 100 : 0
      return Math.round(((current - previous) / previous) * 100)
    }

    // Estimate trees planted (approximately 21 kg CO2 = 1 tree)
    const treesPlanted = Math.floor(totalImpact.co2Saved / 21)

    // Format recent orders
    const formattedRecentOrders = recentOrders.map((order) => ({
      id: order.id,
      date: order.createdAt.toISOString().split('T')[0],
      status: order.status.toLowerCase(),
      total: order.total,
      items: order.items.length,
      vendor: order.vendorProfile?.companyName || 'Unknown Vendor',
      firstProductImage: order.items[0]?.product?.images?.[0] || '/placeholder.svg'
    }))

    // Calculate wishlist count
    const wishlistCount = await prisma.wishlistItem.count({
      where: { userId }
    })

    return NextResponse.json({
      success: true,
      data: {
        user: {
          name: user.name,
          email: user.email,
          memberSince: user.createdAt.toISOString().split('T')[0]
        },
        stats: {
          totalOrders: orders.length,
          totalSpent: orders.reduce((sum, order) => sum + order.total, 0),
          wishlistItems: wishlistCount,
          regenScore: userProfile?.regenScore || 0,
          loyaltyPoints: userProfile?.loyaltyPoints || 0,
          nftsCollected: (userProfile?.nftsCollected || []).length
        },
        impactMetrics: {
          co2Saved: Math.round(totalImpact.co2Saved * 10) / 10,
          waterSaved: Math.round(totalImpact.waterSaved),
          energyGenerated: Math.round(totalImpact.energyGenerated * 10) / 10,
          treesPlanted
        },
        trending: {
          co2SavedGrowth: calculateGrowth(
            currentMonthImpact.co2Saved,
            previousMonthImpact.co2Saved
          ),
          waterSavedGrowth: calculateGrowth(
            currentMonthImpact.waterSaved,
            previousMonthImpact.waterSaved
          ),
          energyGrowth: calculateGrowth(
            currentMonthImpact.energyGenerated,
            previousMonthImpact.energyGenerated
          )
        },
        recentOrders: formattedRecentOrders
      }
    })
  } catch (error) {
    console.error('User dashboard error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
