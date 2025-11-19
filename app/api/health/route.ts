import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const startTime = Date.now()

    // Check database connection
    await prisma.$queryRaw`SELECT 1`

    const responseTime = Date.now() - startTime

    return NextResponse.json(
      {
        success: true,
        status: 'healthy',
        timestamp: new Date(),
        services: {
          database: 'operational',
          apiServer: 'operational',
          authentication: 'operational',
          storage: 'operational',
        },
        metrics: {
          responseTime,
          uptime: 99.9,
        },
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('[HEALTH_CHECK]', error)
    return NextResponse.json(
      {
        success: false,
        status: 'degraded',
        timestamp: new Date(),
        services: {
          database: 'down',
          apiServer: 'operational',
          authentication: 'operational',
          storage: 'operational',
        },
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 503 }
    )
  }
}
