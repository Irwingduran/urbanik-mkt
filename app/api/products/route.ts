import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const search = searchParams.get('search')
    const featured = searchParams.get('featured')
    const limit = searchParams.get('limit')

    let whereClause: any = {
      active: true,
      stock: {
        gt: 0
      }
    }

    if (category) {
      whereClause.category = category
    }

    if (search) {
      whereClause.OR = [
        {
          name: {
            contains: search,
            mode: 'insensitive'
          }
        },
        {
          description: {
            contains: search,
            mode: 'insensitive'
          }
        }
      ]
    }

    if (featured === 'true') {
      whereClause.featured = true
    }

    const products = await prisma.product.findMany({
      where: whereClause,
      include: {
        vendor: {
          include: {
            user: {
              select: {
                name: true
              }
            }
          }
        },
        reviews: {
          take: 5,
          orderBy: {
            createdAt: 'desc'
          },
          include: {
            user: {
              select: {
                name: true
              }
            }
          }
        }
      },
      orderBy: [
        { featured: 'desc' },
        { averageRating: 'desc' },
        { salesCount: 'desc' }
      ],
      take: limit ? parseInt(limit) : undefined
    })

    const transformedProducts = products.map((product: typeof products[0]) => ({
      id: product.id,
      name: product.name,
      description: product.description,
      price: product.price,
      originalPrice: product.originalPrice,
      sku: product.sku,
      category: product.category,
      subcategory: product.subcategory,
      images: product.images,
      stock: product.stock,
      maxOrderQuantity: product.maxOrderQuantity,
      regenScore: product.regenScore,
      certifications: product.certifications,
      co2Reduction: product.co2Reduction,
      waterSaving: product.waterSaving,
      energyEfficiency: product.energyEfficiency,
      materials: product.materials,
      origin: product.origin,
      nfts: product.nfts,
      featured: product.featured,
      views: product.views,
      salesCount: product.salesCount,
      averageRating: product.averageRating,
      reviewCount: product.reviewCount,
      vendor: {
        id: product.vendor.id,
        companyName: product.vendor.companyName,
        name: product.vendor.user.name,
        regenScore: product.vendor.regenScore
      },
      reviews: product.reviews.map((review: typeof product.reviews[0]) => ({
        id: review.id,
        rating: review.rating,
        comment: review.comment,
        verified: review.verified,
        helpful: review.helpful,
        createdAt: review.createdAt,
        user: {
          name: review.user.name
        }
      }))
    }))

    return NextResponse.json({
      success: true,
      data: transformedProducts,
      count: transformedProducts.length
    })

  } catch (error) {
    console.error('Error fetching products:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch products' },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}