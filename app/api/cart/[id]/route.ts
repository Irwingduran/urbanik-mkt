import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// PUT - Update cart item quantity
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const { quantity } = body

    if (!quantity || quantity < 0) {
      return NextResponse.json(
        { success: false, error: 'Valid quantity is required' },
        { status: 400 }
      )
    }

    // Get current cart item and associated product
    const cartItem = await prisma.cartItem.findUnique({
      where: { id: params.id },
      include: {
        product: true
      }
    })

    if (!cartItem) {
      return NextResponse.json(
        { success: false, error: 'Cart item not found' },
        { status: 404 }
      )
    }

    // If quantity is 0, delete the item
    if (quantity === 0) {
      await prisma.cartItem.delete({
        where: { id: params.id }
      })

      return NextResponse.json({
        success: true,
        message: 'Item removed from cart'
      })
    }

    // Validate quantity against stock and max order quantity
    if (quantity > cartItem.product.stock) {
      return NextResponse.json(
        { success: false, error: 'Insufficient stock' },
        { status: 400 }
      )
    }

    if (quantity > cartItem.product.maxOrderQuantity) {
      return NextResponse.json(
        { success: false, error: `Maximum order quantity is ${cartItem.product.maxOrderQuantity}` },
        { status: 400 }
      )
    }

    // Update quantity
    const updatedCartItem = await prisma.cartItem.update({
      where: { id: params.id },
      data: { quantity }
    })

    return NextResponse.json({
      success: true,
      data: updatedCartItem,
      message: 'Cart item updated successfully'
    })

  } catch (error) {
    console.error('Error updating cart item:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update cart item' },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}

// DELETE - Remove specific cart item
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const cartItem = await prisma.cartItem.findUnique({
      where: { id: params.id }
    })

    if (!cartItem) {
      return NextResponse.json(
        { success: false, error: 'Cart item not found' },
        { status: 404 }
      )
    }

    await prisma.cartItem.delete({
      where: { id: params.id }
    })

    return NextResponse.json({
      success: true,
      message: 'Item removed from cart successfully'
    })

  } catch (error) {
    console.error('Error removing cart item:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to remove cart item' },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}