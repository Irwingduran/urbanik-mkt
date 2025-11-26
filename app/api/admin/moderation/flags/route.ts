import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth-config'
import { prisma } from '@/lib/prisma'
import { Prisma, FlagStatus, FlagType } from '@prisma/client'

// GET /api/admin/moderation/flags - List all flags
export async function GET(request: Request) {
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

    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const type = searchParams.get('type')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const skip = (page - 1) * limit

    // Build filters
    const where: Prisma.ContentFlagWhereInput = {}
    if (status) where.status = status as FlagStatus
    if (type && type !== 'ALL') where.type = type as FlagType

    const [flags, total] = await Promise.all([
      prisma.contentFlag.findMany({
        where,
        include: {
          reporter: { select: { id: true, email: true, name: true } },
          reviewer: { select: { id: true, email: true, name: true } }
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit
      }),
      prisma.contentFlag.count({ where })
    ])

    return NextResponse.json({
      data: flags,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error('Error fetching flags:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST /api/admin/moderation/flags - Create a flag
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { type, targetId, reason, description, severity } = await request.json()

    if (!type || !targetId || !reason) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const flag = await prisma.contentFlag.create({
      data: {
        type,
        targetId,
        reason,
        description,
        severity: severity || 'medium',
        reportedBy: session.user.id
      },
      include: {
        reporter: { select: { id: true, email: true, name: true } }
      }
    })

    return NextResponse.json({ data: flag }, { status: 201 })
  } catch (error) {
    console.error('Error creating flag:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
