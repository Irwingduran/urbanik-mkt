import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// GET - Fetch user's cart
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'User ID is required' },
        { status: 400 }
      )
    }

    const cartItems = await prisma.cartItem.findMany({
      where: {
        userId: userId
      },
      include: {
        product: {
          include: {
            vendor: {
              include: {
                user: {
                  select: {
                    name: true
                  }
                }
              }
            }
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    const transformedCartItems = cartItems.map(item => ({
      id: item.id,
      productId: item.product.id,
      name: item.product.name,
      price: item.product.price,
      image: item.product.images[0] || '/placeholder.svg',
      quantity: item.quantity,
      maxStock: item.product.stock,
      maxOrderQuantity: item.product.maxOrderQuantity,
      vendorName: item.product.vendor.companyName || item.product.vendor.user.name,
      regenScore: item.product.regenScore,
      inStock: item.product.stock > 0,
      total: item.product.price * item.quantity
    }))

    const cartTotal = transformedCartItems.reduce((sum, item) => sum + item.total, 0)
    const cartCount = transformedCartItems.reduce((sum, item) => sum + item.quantity, 0)

    return NextResponse.json({
      success: true,
      data: {
        items: transformedCartItems,
        total: cartTotal,
        count: cartCount
      }
    })

  } catch (error) {
    console.error('Error fetching cart:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch cart' },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}

// POST - Add item to cart
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, productId, quantity = 1 } = body

    if (!userId || !productId) {
      return NextResponse.json(
        { success: false, error: 'User ID and Product ID are required' },
        { status: 400 }
      )
    }

    // Check if product exists and is in stock
    const product = await prisma.product.findUnique({
      where: { id: productId, active: true }
    })

    if (!product) {
      return NextResponse.json(
        { success: false, error: 'Product not found' },
        { status: 404 }
      )
    }

    if (product.stock < quantity) {
      return NextResponse.json(
        { success: false, error: 'Insufficient stock' },
        { status: 400 }
      )
    }

    if (quantity > product.maxOrderQuantity) {
      return NextResponse.json(
        { success: false, error: `Maximum order quantity is ${product.maxOrderQuantity}` },
        { status: 400 }
      )
    }

    // Check if item already exists in cart
    const existingCartItem = await prisma.cartItem.findUnique({
      where: {
        userId_productId: {
          userId: userId,
          productId: productId
        }
      }
    })

    let cartItem
    if (existingCartItem) {
      const newQuantity = existingCartItem.quantity + quantity

      if (newQuantity > product.maxOrderQuantity) {
        return NextResponse.json(
          { success: false, error: `Maximum order quantity is ${product.maxOrderQuantity}` },
          { status: 400 }
        )
      }

      if (newQuantity > product.stock) {
        return NextResponse.json(
          { success: false, error: 'Insufficient stock' },
          { status: 400 }
        )
      }

      cartItem = await prisma.cartItem.update({
        where: {
          userId_productId: {
            userId: userId,
            productId: productId
          }
        },
        data: {
          quantity: newQuantity
        }
      })
    } else {
      cartItem = await prisma.cartItem.create({
        data: {
          userId: userId,
          productId: productId,
          quantity: quantity
        }
      })
    }

    return NextResponse.json({
      success: true,
      data: cartItem,
      message: 'Item added to cart successfully'
    })

  } catch (error) {
    console.error('Error adding to cart:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to add item to cart' },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}

// DELETE - Clear entire cart
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'User ID is required' },
        { status: 400 }
      )
    }

    await prisma.cartItem.deleteMany({
      where: {
        userId: userId
      }
    })

    return NextResponse.json({
      success: true,
      message: 'Cart cleared successfully'
    })

  } catch (error) {
    console.error('Error clearing cart:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to clear cart' },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}