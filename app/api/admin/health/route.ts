import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth-config'
import { prisma } from '@/lib/prisma'

// Lightweight health check: DB connectivity & timestamp
export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    // Ping DB with trivial query
    const dbOk = await prisma.$queryRaw`SELECT 1`.
      then(() => true)
      .catch(() => false)

    return NextResponse.json({
      success: true,
      data: {
        apiStatus: 'operational',
        databaseStatus: dbOk ? 'operational' : 'degraded',
        storageStatus: 'unknown', // Future: integrate S3 or local disk checks
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
      }
    })
  } catch {
    return NextResponse.json({ success: false, error: 'Health check failed' }, { status: 500 })
  }
}
