import { getServerSession } from 'next-auth'
import { NextRequest, NextResponse } from 'next/server'
import { authOptions } from '@/lib/auth-config'
import { prisma } from '@/lib/prisma'

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

    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        emailVerified: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: { createdAt: 'desc' },
    })

    // Map users with status (we'll need to add this to schema if not present)
    const usersWithStatus = users.map((user) => ({
      ...user,
      status: 'ACTIVE' as const,
      lastLogin: null, // This would need to be tracked separately
    }))

    return NextResponse.json(
      {
        success: true,
        users: usersWithStatus,
        total: usersWithStatus.length,
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('[ADMIN_USERS_GET]', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
