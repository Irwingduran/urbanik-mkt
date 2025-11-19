import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth-config'
import { prisma } from '@/lib/prisma'

// GET /api/admin/moderation/flags/[id] - Get flag details
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Check if user is admin
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: { userRoles: true }
    })

    const isAdmin = user?.userRoles.some(r => r.role === 'ADMIN')

    if (!isAdmin) {
      return NextResponse.json(
        { error: 'Forbidden - Admin access required' },
        { status: 403 }
      )
    }

    const flag = await prisma.contentFlag.findUnique({
      where: { id: params.id },
      include: {
        reporter: { select: { id: true, email: true, name: true } },
        reviewer: { select: { id: true, email: true, name: true } }
      }
    })

    if (!flag) {
      return NextResponse.json(
        { error: 'Flag not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ data: flag })
  } catch (error) {
    console.error('Error fetching flag:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// PATCH /api/admin/moderation/flags/[id] - Update flag status
export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Check if user is admin
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: { userRoles: true }
    })

    const isAdmin = user?.userRoles.some(r => r.role === 'ADMIN')

    if (!isAdmin) {
      return NextResponse.json(
        { error: 'Forbidden - Admin access required' },
        { status: 403 }
      )
    }

    const { status, resolution } = await request.json()

    if (!status) {
      return NextResponse.json(
        { error: 'Missing status' },
        { status: 400 }
      )
    }

    const flag = await prisma.contentFlag.update({
      where: { id: params.id },
      data: {
        status,
        resolution,
        reviewedBy: session.user.id
      },
      include: {
        reporter: { select: { id: true, email: true, name: true } },
        reviewer: { select: { id: true, email: true, name: true } }
      }
    })

    return NextResponse.json({ data: flag })
  } catch (error) {
    console.error('Error updating flag:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// DELETE /api/admin/moderation/flags/[id] - Dismiss flag
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Check if user is admin
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: { userRoles: true }
    })

    const isAdmin = user?.userRoles.some(r => r.role === 'ADMIN')

    if (!isAdmin) {
      return NextResponse.json(
        { error: 'Forbidden - Admin access required' },
        { status: 403 }
      )
    }

    await prisma.contentFlag.update({
      where: { id: params.id },
      data: {
        status: 'DISMISSED',
        reviewedBy: session.user.id
      }
    })

    return NextResponse.json({
      message: 'Flag dismissed successfully'
    })
  } catch (error) {
    console.error('Error dismissing flag:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
