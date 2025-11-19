import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth-config"
import { prisma } from "@/lib/prisma"

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    const evaluationId = params.id

    // Get evaluation with all details
    const evaluation = await prisma.regenMarkEvaluation.findUnique({
      where: { id: evaluationId },
      include: {
        vendorProfile: {
          select: {
            id: true,
            companyName: true,
            description: true,
            website: true,
            certifications: true,
          },
        },
        documents: {
          select: {
            id: true,
            name: true,
            fileName: true,
            url: true,
            fileSize: true,
            mimeType: true,
            uploadedAt: true,
          },
        },
      },
    })

    if (!evaluation) {
      return NextResponse.json(
        { error: "Evaluation not found" },
        { status: 404 }
      )
    }

    return NextResponse.json({
      evaluation: {
        id: evaluation.id,
        type: evaluation.type,
        status: evaluation.status,
        stage: evaluation.stage,
        submittedAt: evaluation.submittedAt,
        createdAt: evaluation.createdAt,
        reviewScore: evaluation.reviewScore,
        reviewerNotes: evaluation.reviewerNotes,
        feedback: evaluation.feedback,
        approved: evaluation.approved,
        vendorProfile: evaluation.vendorProfile,
        documents: evaluation.documents,
      },
    })
  } catch (error) {
    console.error("Error fetching evaluation detail:", error)
    return NextResponse.json(
      { error: "Failed to fetch evaluation" },
      { status: 500 }
    )
  }
}
