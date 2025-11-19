import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth-config"
import { prisma } from "@/lib/prisma"
import { calculateRegenScore } from "@/lib/regenmark"
import type { RegenMarkScoreData } from "@/lib/regenmark/scoring"
import { EVALUATION_CONFIG } from "@/lib/regenmark"

export async function POST(request: NextRequest) {
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

    const body = await request.json()
    const { evaluationId, approved, reviewScore, reviewerNotes, feedback } = body

    // Validation
    if (!evaluationId) {
      return NextResponse.json(
        { error: "Evaluation ID is required" },
        { status: 400 }
      )
    }

    if (approved && reviewScore < 60) {
      return NextResponse.json(
        { error: "Score must be at least 60 to approve" },
        { status: 400 }
      )
    }

    if (!approved && !feedback) {
      return NextResponse.json(
        { error: "Feedback is required for rejection" },
        { status: 400 }
      )
    }

    // Get evaluation
    const evaluation = await prisma.regenMarkEvaluation.findUnique({
      where: { id: evaluationId },
      include: {
        vendorProfile: {
          include: {
            regenMarks: {
              where: {
                status: {
                  in: ["ACTIVE", "EXPIRING_SOON"],
                },
              },
            },
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

    // Check if already processed
    if (evaluation.status === "APPROVED" || evaluation.status === "REJECTED") {
      return NextResponse.json(
        { error: "Evaluation already processed" },
        { status: 400 }
      )
    }

    const now = new Date()

    if (approved) {
      // APPROVED: Create RegenMark and update scores
      const expiresAt = new Date(now)
      expiresAt.setMonth(expiresAt.getMonth() + EVALUATION_CONFIG.VALIDITY_PERIOD_MONTHS)

      // Create RegenMark
      const regenMark = await prisma.regenMark.create({
        data: {
          vendorProfileId: evaluation.vendorProfileId,
          type: evaluation.type,
          score: reviewScore,
          status: "ACTIVE",
          issuedAt: now,
          expiresAt: expiresAt,
          verifiedBy: user.id,
          verifiedAt: now,
          evaluationNotes: reviewerNotes || null,
        },
      })

      // Update evaluation
      await prisma.regenMarkEvaluation.update({
        where: { id: evaluationId },
        data: {
          regenMarkId: regenMark.id,
          status: "APPROVED",
          stage: "COMPLETED",
          reviewerId: user.id,
          reviewScore: reviewScore,
          reviewerNotes: reviewerNotes || null,
          feedback: feedback || null,
          approved: true,
          reviewedAt: now,
          completedAt: now,
        },
      })

      // Calculate new overall REGEN Score
      const allRegenMarks: RegenMarkScoreData[] = [
        ...evaluation.vendorProfile.regenMarks.map((mark) => ({
          type: mark.type,
          score: mark.score,
          status: mark.status,
          issuedAt: mark.issuedAt,
          expiresAt: mark.expiresAt,
        })),
        {
          type: regenMark.type,
          score: regenMark.score,
          status: regenMark.status,
          issuedAt: regenMark.issuedAt,
          expiresAt: regenMark.expiresAt,
        },
      ]

      const scoreResult = calculateRegenScore(allRegenMarks)

      // Update VendorProfile with new score and NFT level
      await prisma.vendorProfile.update({
        where: { id: evaluation.vendorProfileId },
        data: {
          regenScore: scoreResult.totalScore,
          nftLevel: scoreResult.nftLevel,
          metricsLastUpdated: now,
        },
      })

      // Create notification for vendor
      await prisma.notification.create({
        data: {
          userId: evaluation.vendorProfile.userId,
          type: "REGENMARK_APPROVED",
          title: "¡RegenMark Aprobado!",
          message: `Tu solicitud de ${evaluation.type} ha sido aprobada con un score de ${reviewScore}/100. Tu REGEN Score total es ahora ${scoreResult.totalScore}/100.`,
          actionUrl: "/dashboard/vendor/regenmarks",
        },
      })

      // Check if NFT level changed
      if (scoreResult.nftLevel !== evaluation.vendorProfile.nftLevel) {
        await prisma.notification.create({
          data: {
            userId: evaluation.vendorProfile.userId,
            type: "NFT_LEVEL_UP",
            title: "¡Nuevo Nivel de NFT!",
            message: `¡Felicidades! Has alcanzado el nivel ${scoreResult.nftLevel}`,
            actionUrl: "/dashboard/vendor/regenmarks",
          },
        })
      }

      return NextResponse.json({
        success: true,
        message: "Evaluation approved successfully",
        regenMark: {
          id: regenMark.id,
          type: regenMark.type,
          score: regenMark.score,
          issuedAt: regenMark.issuedAt,
          expiresAt: regenMark.expiresAt,
        },
        newScore: scoreResult.totalScore,
        newNFTLevel: scoreResult.nftLevel,
      })
    } else {
      // REJECTED: Update evaluation only
      await prisma.regenMarkEvaluation.update({
        where: { id: evaluationId },
        data: {
          status: "REJECTED",
          stage: "COMPLETED",
          reviewerId: user.id,
          reviewScore: reviewScore || null,
          reviewerNotes: reviewerNotes || null,
          feedback: feedback,
          approved: false,
          reviewedAt: now,
          completedAt: now,
        },
      })

      // Create notification for vendor
      await prisma.notification.create({
        data: {
          userId: evaluation.vendorProfile.userId,
          type: "REGENMARK_REJECTED",
          title: "Evaluación No Aprobada",
          message: `Tu solicitud de ${evaluation.type} no fue aprobada. Por favor revisa el feedback proporcionado.`,
          actionUrl: "/dashboard/vendor/regenmarks",
        },
      })

      return NextResponse.json({
        success: true,
        message: "Evaluation rejected",
      })
    }
  } catch (error) {
    console.error("Error processing evaluation:", error)
    return NextResponse.json(
      { error: "Failed to process evaluation" },
      { status: 500 }
    )
  }
}
