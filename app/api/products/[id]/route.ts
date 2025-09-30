import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const product = await prisma.product.findUnique({
      where: {
        id: params.id,
        active: true
      },
      include: {
        vendor: {
          include: {
            user: {
              select: {
                name: true,
                email: true
              }
            }
          }
        },
        reviews: {
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
      }
    })

    if (!product) {
      return NextResponse.json(
        { success: false, error: 'Product not found' },
        { status: 404 }
      )
    }

    // Increment views
    await prisma.product.update({
      where: { id: params.id },
      data: {
        views: {
          increment: 1
        }
      }
    })

    const transformedProduct = {
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
      dimensions: product.dimensions,
      materials: product.materials,
      origin: product.origin,
      nfts: product.nfts,
      featured: product.featured,
      views: product.views + 1, 
      salesCount: product.salesCount,
      averageRating: product.averageRating,
      reviewCount: product.reviewCount,
      vendor: {
        id: product.vendor.id,
        companyName: product.vendor.companyName,
        description: product.vendor.description,
        website: product.vendor.website,
        phone: product.vendor.phone,
        location: product.vendor.location,
        regenScore: product.vendor.regenScore,
        nftLevel: product.vendor.nftLevel,
        totalProducts: product.vendor.totalProducts,
        totalSales: product.vendor.totalSales,
        name: product.vendor.user.name,
        email: product.vendor.user.email
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
    }

    return NextResponse.json({
      success: true,
      data: transformedProduct
    })

  } catch (error) {
    console.error('Error fetching product:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch product' },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}