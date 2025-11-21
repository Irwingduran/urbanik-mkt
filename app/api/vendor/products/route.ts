import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth-config"
import { prisma } from "@/lib/prisma"
import { ProductApprovalStatus } from "@prisma/client"
import { computeProductRegenScore } from "@/lib/regenmark/services/product"
import { CreateProductSchema } from "@/lib/validation/product"
import { createTracer } from "@/lib/trace"
import { logger } from "@/lib/logger"

// GET /api/vendor/products - List vendor's products
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || (!session.user.roles?.includes("VENDOR") && session.user.role !== "VENDOR" && session.user.role !== "ADMIN")) {
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

    if (!session || (!session.user.roles?.includes("VENDOR") && session.user.role !== "VENDOR" && session.user.role !== "ADMIN")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

  const requestId = request.headers.get("x-request-id") || undefined
  const tracer = createTracer("api.vendor.products.create", { requestId })
  const end = tracer.start("POST /api/vendor/products")
  const body = await request.json()
  logger.debug("Incoming product create body", { requestId, keys: Object.keys(body) })

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
    // Validation & normalization (Zod)
    const parsed = CreateProductSchema.safeParse({
      name: body.name,
      description: body.description,
      price: body.price,
      originalPrice: body.originalPrice,
      sku: body.sku,
      category: body.category,
      images: body.images,
      stock: body.stock,
      minStock: body.minStock,
      certifications: body.certifications,
      co2Reduction: body.co2Reduction,
      waterSaving: body.waterSaving,
      energyEfficiency: body.energyEfficiency,
    })
    if (!parsed.success) {
      const fieldErrors = parsed.error.flatten().fieldErrors
      end({ error: "VALIDATION_FAILED", fieldErrors })
      return NextResponse.json({
        error: "Validation failed",
        code: "VALIDATION_FAILED",
        details: fieldErrors,
      }, { status: 400 })
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
    } = parsed.data

    // PRODUCTION: Validate vendor profile exists and is allowed to create products
    const vendorProfile = await tracer.span("fetchVendorProfile", async () => prisma.vendorProfile.findUnique({
      where: { userId: vendorUserId },
      select: { userId: true, isBanned: true, active: true, suspended: true }
    }))

    if (!vendorProfile) {
      return NextResponse.json(
        { error: "Vendor profile not found. Complete onboarding before creating products." },
        { status: 400 }
      )
    }

    if (vendorProfile.isBanned) {
      return NextResponse.json(
        { error: "Vendor is banned and cannot create products." },
        { status: 403 }
      )
    }

    if (vendorProfile.suspended || vendorProfile.active === false) {
      return NextResponse.json(
        { error: "Vendor account is not active. Resolve account status before creating products." },
        { status: 403 }
      )
    }

    // Check if SKU is unique for this vendor
    const existingSku = await tracer.span("checkExistingSku", async () => prisma.product.findFirst({
      where: { vendorUserId: vendorUserId, sku },
      select: { id: true }
    }))

    if (existingSku) {
      return NextResponse.json(
        { error: "SKU already exists for this vendor" },
        { status: 400 }
      )
    }

    // (FK guard already satisfied by vendorProfile validation above)

    // Calculate regen score based on environmental metrics (centralized service)
    const { score: regenScore } = computeProductRegenScore({
      co2Reduction: co2Reduction || 0,
      waterSaving: waterSaving || 0,
      energyEfficiency: energyEfficiency || 0,
    })

    // Use a transaction to ensure consistency between product creation and counters
    const product = await tracer.span("createProductTransaction", async () => prisma.$transaction(async (tx) => {
      const created = await tx.product.create({
        data: {
          vendorUserId: vendorUserId,
          name,
          description,
          price,
          originalPrice: originalPrice ?? null,
          sku,
          category,
          images: images || [],
          stock,
          minStock: minStock ?? 5,
          inStock: stock > 0,
          certifications: certifications || [],
          co2Reduction: co2Reduction || 0,
          waterSaving: waterSaving || 0,
          energyEfficiency: energyEfficiency || 0,
          regenScore,
          active: true,
          approvalStatus: ProductApprovalStatus.PENDING
        }
      })
      await tx.vendorProfile.update({
        where: { userId: vendorUserId },
        data: { totalProducts: { increment: 1 } }
      })
      return created
    }))

    const response = NextResponse.json({
      success: true,
      data: product,
      message: "Product created successfully"
    })
    if (requestId) response.headers.set("x-request-id", requestId)
    end({ productId: product.id, regenScore })
    return response

  } catch (error) {
    console.error("Product creation error:", error)
    const errorMessage = error instanceof Error ? error.message : "Unknown error"
    logger.error("Product creation failed", { error: errorMessage })
    return NextResponse.json({
      error: "Internal server error",
      code: "PRODUCT_CREATE_FAILED",
      details: errorMessage,
    }, { status: 500 })
  }
}