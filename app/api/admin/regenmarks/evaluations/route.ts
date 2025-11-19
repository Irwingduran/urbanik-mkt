import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth-config"
import { prisma } from "@/lib/prisma"

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      )
    }

    // Check if user is admin
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: {
        userRoles: {
          where: {
            role: "ADMIN",
            active: true,
          },
        },
      },
    })

    if (!user || user.userRoles.length === 0) {
      return NextResponse.json(
        { error: "Admin access required" },
        { status: 403 }
      )
    }

    // Get all evaluations with vendor info
    const evaluations = await prisma.regenMarkEvaluation.findMany({
      include: {
        vendorProfile: {
          select: {
            id: true,
            companyName: true,
            userId: true,
          },
        },
        documents: {
          select: {
            id: true,
            name: true,
            fileName: true,
          },
        },
      },
      orderBy: [
        { status: "asc" }, // Pending first
        { submittedAt: "asc" }, // Oldest first
      ],
    })

    return NextResponse.json({
      evaluations: evaluations.map((ev) => ({
        id: ev.id,
        type: ev.type,
        status: ev.status,
        stage: ev.stage,
        submittedAt: ev.submittedAt,
        createdAt: ev.createdAt,
        reviewScore: ev.reviewScore,
        approved: ev.approved,
        vendorProfile: ev.vendorProfile,
        documents: ev.documents,
      })),
    })
  } catch (error) {
    console.error("Error fetching evaluations:", error)
    return NextResponse.json(
      { error: "Failed to fetch evaluations" },
      { status: 500 }
    )
  }
}
