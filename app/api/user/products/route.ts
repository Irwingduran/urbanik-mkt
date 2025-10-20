import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth-config"
import { prisma } from "@/lib/prisma"

// GET /api/user/products - Browse products (public + customer features)
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    const { searchParams } = new URL(request.url)

    // Query parameters
    const page = parseInt(searchParams.get("page") || "1")
    const limit = parseInt(searchParams.get("limit") || "20")
    const category = searchParams.get("category")
    const search = searchParams.get("search")
    const sortBy = searchParams.get("sortBy") || "createdAt"
    const sortOrder = searchParams.get("sortOrder") || "desc"
    const minPrice = searchParams.get("minPrice")
    const maxPrice = searchParams.get("maxPrice")
    const minRegenScore = searchParams.get("minRegenScore")
    const certifications = searchParams.get("certifications")?.split(",")
    const inStockOnly = searchParams.get("inStockOnly") === "true"
    const featuredOnly = searchParams.get("featuredOnly") === "true"

    const skip = (page - 1) * limit

    // Build where clause
    const where: any = {
      active: true
    }

    if (inStockOnly) {
      where.inStock = true
      where.stock = { gt: 0 }
    }

    if (featuredOnly) {
      where.featured = true
    }

    if (category) {
      where.category = category
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
        { category: { contains: search, mode: "insensitive" } }
      ]
    }

    if (minPrice || maxPrice) {
      where.price = {}
      if (minPrice) where.price.gte = parseFloat(minPrice)
      if (maxPrice) where.price.lte = parseFloat(maxPrice)
    }

    if (minRegenScore) {
      where.regenScore = { gte: parseInt(minRegenScore) }
    }

    if (certifications && certifications.length > 0) {
      where.certifications = {
        hasSome: certifications
      }
    }

    // Build orderBy clause
    const orderBy: any = {}

    switch (sortBy) {
      case "price":
        orderBy.price = sortOrder
        break
      case "regenScore":
        orderBy.regenScore = sortOrder
        break
      case "name":
        orderBy.name = sortOrder
        break
      case "popularity":
        // Could be based on order count, for now use createdAt
        orderBy.createdAt = "desc"
        break
      default:
        orderBy.createdAt = sortOrder
    }

    const [products, totalCount] = await Promise.all([
      prisma.product.findMany({
        where,
        skip,
        take: limit,
        include: {
          vendorProfile: {
            select: {
              id: true,
              companyName: true,
              user: {
                select: { name: true }
              }
            }
          },
          _count: {
            select: {
              reviews: true,
              orderItems: true
            }
          },
          reviews: {
            select: { rating: true },
            take: 100 // Limit for avg calculation
          },
          // Include wishlist status if user is logged in
          ...(session?.user?.id && {
            wishlistItems: {
              where: { userId: session.user.id },
              select: { id: true }
            }
          })
        },
        orderBy
      }),

      prisma.product.count({ where })
    ])

    // Calculate average rating and enhance data
    const enhancedProducts = products.map((product: any) => ({
      id: product.id,
      name: product.name,
      description: product.description,
      price: product.price,
      originalPrice: product.originalPrice,
      images: product.images,
      category: product.category,
      regenScore: product.regenScore,
      certifications: product.certifications,
      inStock: product.inStock,
      stock: product.stock,
      featured: product.featured,
      co2Reduction: product.co2Reduction,
      waterSaving: product.waterSaving,
      energyEfficiency: product.energyEfficiency,
      vendor: product.vendor,
      averageRating: product.reviews.length > 0
        ? product.reviews.reduce((sum: number, review: any) => sum + review.rating, 0) / product.reviews.length
        : 0,
      reviewCount: product._count.reviews,
      totalSold: product._count.orderItems,
      isInWishlist: session?.user?.id ? product.wishlistItems.length > 0 : false,
      createdAt: product.createdAt
    }))

    const totalPages = Math.ceil(totalCount / limit)

    // Get filter options for frontend
    const [categories, maxPriceData, certificationOptions] = await Promise.all([
      // Available categories
      prisma.product.findMany({
        where: { active: true },
        select: { category: true },
        distinct: ["category"]
      }),

      // Max price for range filter
      prisma.product.aggregate({
        where: { active: true },
        _max: { price: true }
      }),

      // Available certifications
      prisma.product.findMany({
        where: {
          active: true,
          certifications: { isEmpty: false }
        },
        select: { certifications: true }
      })
    ])

    // Extract unique certifications
    const uniqueCertifications = Array.from(
      new Set(
        certificationOptions.flatMap((p: any) => p.certifications)
      )
    )

    return NextResponse.json({
      success: true,
      data: enhancedProducts,
      meta: {
        total: totalCount,
        page,
        limit,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1
      },
      filters: {
        categories: categories.map((c: any) => c.category),
        maxPrice: maxPriceData._max.price || 0,
        certifications: uniqueCertifications
      }
    })

  } catch (error) {
    console.error("Products browse error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}