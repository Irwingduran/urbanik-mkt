import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth-config"
import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function GET() {
  const session = await getServerSession(authOptions)

  if (!session) {
    return NextResponse.json({ error: "No session" }, { status: 401 })
  }

  try {
    // Información de sesión actual
    const sessionInfo = {
      email: session.user?.email,
      name: session.user?.name,
      id: session.user?.id,
      role: session.user?.role,
      roles: session.user?.roles,
    }

    // Información de la BD
    const dbUser = await prisma.user.findUnique({
      where: { email: session.user?.email! },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        userRoles: {
          where: { active: true },
          select: { role: true }
        }
      }
    })

    return NextResponse.json({
      session: sessionInfo,
      database: dbUser,
      middleware_check: {
        hasVendorRole: sessionInfo.roles?.includes('VENDOR') || false,
        canAccessVendorDashboard: sessionInfo.roles?.includes('VENDOR') || sessionInfo.roles?.includes('ADMIN') || false,
        canAccessAdminDashboard: sessionInfo.roles?.includes('ADMIN') || false,
      }
    })
  } catch (error) {
    return NextResponse.json({
      error: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 })
  }
}
