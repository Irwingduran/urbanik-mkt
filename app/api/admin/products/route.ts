import { getServerSession } from 'next-auth'
import { NextRequest, NextResponse } from 'next/server'
import { authOptions } from '@/lib/auth-config'
import { prisma } from '@/lib/prisma'
import { Prisma, ProductApprovalStatus } from '@prisma/client'

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
    const approvalStatus = searchParams.get('approvalStatus') || 'PENDING' // PENDING, APPROVED, REJECTED
    const search = searchParams.get('search')

    const skip = (page - 1) * limit

    // Build where clause
    const where: Prisma.ProductWhereInput = {
      approvalStatus: approvalStatus as ProductApprovalStatus
    }
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { sku: { contains: search, mode: 'insensitive' } },
      ]
    }

    // Get products
    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        skip,
        take: limit,
        include: {
          vendorProfile: {
            include: {
              user: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                },
              },
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.product.count({ where }),
    ])

    return NextResponse.json(
      {
        success: true,
        data: {
          products,
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
    console.error('[ADMIN_PRODUCTS]', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// PATCH /api/admin/products - Approve or reject product
export async function PATCH(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const { productId, approvalStatus, rejectionReason } = body

    // Validation
    if (!productId || !approvalStatus || !['APPROVED', 'REJECTED'].includes(approvalStatus)) {
      return NextResponse.json(
        { success: false, error: 'Invalid request parameters' },
        { status: 400 }
      )
    }

    if (approvalStatus === 'REJECTED' && !rejectionReason) {
      return NextResponse.json(
        { success: false, error: 'Rejection reason is required' },
        { status: 400 }
      )
    }

    // Get product
    const product = await prisma.product.findUnique({
      where: { id: productId }
    })

    if (!product) {
      return NextResponse.json(
        { success: false, error: 'Product not found' },
        { status: 404 }
      )
    }

    // Update product
    const updatedProduct = await prisma.product.update({
      where: { id: productId },
      data: {
        approvalStatus: approvalStatus,
        rejectionReason: approvalStatus === 'REJECTED' ? rejectionReason : null,
        reviewedBy: session.user.id,
        reviewedAt: new Date()
      },
      include: {
        vendorProfile: {
          include: {
            user: {
              select: {
                id: true,
                email: true,
                name: true
              }
            }
          }
        }
      }
    })

    // Create notification for vendor
    await prisma.notification.create({
      data: {
        userId: product.vendorUserId,
        type: approvalStatus === 'APPROVED' ? 'PRODUCT_APPROVED' : 'PRODUCT_REJECTED',
        title: approvalStatus === 'APPROVED' ? 'Producto Aprobado ✅' : 'Producto Rechazado ❌',
        message: approvalStatus === 'APPROVED'
          ? `Tu producto "${product.name}" ha sido aprobado y está ahora visible en el marketplace.`
          : `Tu producto "${product.name}" ha sido rechazado. Razón: ${rejectionReason}`,
        productId: productId,
        read: false
      }
    })

    return NextResponse.json(
      {
        success: true,
        data: updatedProduct,
        message: `Product ${approvalStatus === 'APPROVED' ? 'approved' : 'rejected'} successfully`
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('[ADMIN_PRODUCTS_PATCH]', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
