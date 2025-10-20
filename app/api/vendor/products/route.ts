import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth-config"
import { prisma } from "@/lib/prisma"

// GET /api/vendor/products - List vendor's products
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || (session.user.role !== "VENDOR" && session.user.role !== "ADMIN")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    const { searchParams } = new URL(request.url)

    // Get vendor user ID
    let vendorUserId: string
    if (session.user.role === "ADMIN") {
      const requestedVendorId = searchParams.get("vendorId")
      if (!requestedVendorId) {
        return NextResponse.json({ error: "Vendor ID required for admin" }, { status: 400 })
      }
      vendorUserId = requestedVendorId
    } else {
      vendorUserId = session.user.id
    }

    const page = parseInt(searchParams.get("page") || "1")
    const limit = parseInt(searchParams.get("limit") || "20")
    const category = searchParams.get("category")
    const status = searchParams.get("status") // active, inactive, out_of_stock
    const search = searchParams.get("search")

    const skip = (page - 1) * limit

    // Build where clause
    const where: any = { vendorUserId: vendorUserId }

    if (category) {
      where.category = category
    }

    if (status) {
      switch (status) {
        case "active":
          where.active = true
          where.inStock = true
          break
        case "inactive":
          where.active = false
          break
        case "out_of_stock":
          where.stock = 0
          break
      }
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
        { sku: { contains: search, mode: "insensitive" } }
      ]
    }

    const [products, totalCount] = await Promise.all([
      prisma.product.findMany({
        where,
        skip,
        take: limit,
        include: {
          _count: {
            select: {
              orderItems: true,
              reviews: true
            }
          },
          reviews: {
            select: {
              rating: true
            }
          }
        },
        orderBy: { createdAt: "desc" }
      }),

      prisma.product.count({ where })
    ])

    // Calculate average rating for each product
    const productsWithRating = products.map((product: any) => ({
      ...product,
      averageRating: product.reviews.length > 0
        ? product.reviews.reduce((sum: number, review: any) => sum + review.rating, 0) / product.reviews.length
        : 0,
      totalSold: product._count.orderItems
    }))

    const totalPages = Math.ceil(totalCount / limit)

    return NextResponse.json({
      success: true,
      data: productsWithRating,
      meta: {
        total: totalCount,
        page,
        limit,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1
      }
    })

  } catch (error) {
    console.error("Vendor products list error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

// POST /api/vendor/products - Create new product
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || (session.user.role !== "VENDOR" && session.user.role !== "ADMIN")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    const body = await request.json()

    // Get vendor user ID
    let vendorUserId: string
    if (session.user.role === "ADMIN") {
      vendorUserId = body.vendorId
      if (!vendorUserId) {
        return NextResponse.json({ error: "Vendor ID required for admin" }, { status: 400 })
      }
    } else {
      vendorUserId = session.user.id
    }
    const {
      name,
      description,
      price,
      originalPrice,
      sku,
      category,
      images,
      stock,
      minStock,
      certifications,
      co2Reduction,
      waterSaving,
      energyEfficiency
    } = body

    // Validation
    if (!name || !description || !price || !sku || !category) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    // Check if SKU is unique for this vendor
    const existingSku = await prisma.product.findFirst({
      where: {
        vendorUserId: vendorUserId,
        sku
      }
    })

    if (existingSku) {
      return NextResponse.json(
        { error: "SKU already exists for this vendor" },
        { status: 400 }
      )
    }

    // Calculate regen score based on environmental metrics
    const regenScore = Math.min(100, Math.round(
      (co2Reduction || 0) * 0.4 +
      (waterSaving || 0) * 0.3 +
      (energyEfficiency || 0) * 0.3
    ))

    const product = await prisma.product.create({
      data: {
        vendorUserId: vendorUserId,
        name,
        description,
        price: parseFloat(price),
        originalPrice: originalPrice ? parseFloat(originalPrice) : null,
        sku,
        category,
        images: images || [],
        stock: parseInt(stock) || 0,
        minStock: parseInt(minStock) || 5,
        inStock: parseInt(stock) > 0,
        certifications: certifications || [],
        co2Reduction: parseFloat(co2Reduction) || 0,
        waterSaving: parseFloat(waterSaving) || 0,
        energyEfficiency: parseFloat(energyEfficiency) || 0,
        regenScore,
        active: true
      }
    })

    // Update vendor product count
    await prisma.vendorProfile.update({
      where: { userId: vendorUserId },
      data: {
        totalProducts: {
          increment: 1
        }
      }
    })

    return NextResponse.json({
      success: true,
      data: product,
      message: "Product created successfully"
    })

  } catch (error) {
    console.error("Product creation error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}