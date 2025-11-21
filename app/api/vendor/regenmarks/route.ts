import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth-config"
import { prisma } from "@/lib/prisma"
import { calculateRegenScore } from "@/lib/regenmark"
import type { RegenMarkScoreData } from "@/lib/regenmark/scoring"
import { createTracer } from "@/lib/trace"

export async function GET(request: NextRequest) {
  try {
    const requestId = request.headers.get("x-request-id") || undefined
    const tracer = createTracer("api.vendor.regenmarks", { requestId })
    const end = tracer.start("GET /api/vendor/regenmarks")

    const session = await getServerSession(authOptions)

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      )
    }

    // Get user and vendor profile
    const user = await tracer.span("fetchUserWithVendorProfile", async () => prisma.user.findUnique({
      where: { email: session.user.email },
      include: {
        vendorProfile: {
          include: {
            regenMarks: {
              where: {
                status: {
                  in: ["ACTIVE", "EXPIRING_SOON"],
                },
              },
              orderBy: {
                createdAt: "desc",
              },
            },
            evaluations: {
              where: {
                status: {
                  in: ["PENDING", "SUBMITTED", "IN_REVIEW", "AI_PROCESSING"],
                },
              },
              orderBy: {
                createdAt: "desc",
              },
            },
          },
        },
      },
    }))

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    if (!user.vendorProfile) {
      return NextResponse.json(
        { error: "Vendor profile not found" },
        { status: 404 }
      )
    }

    const { vendorProfile } = user

    // Calculate current score from active RegenMarks
    const regenMarksData: RegenMarkScoreData[] = vendorProfile.regenMarks.map(
      (mark) => ({
        type: mark.type,
        score: mark.score,
        status: mark.status,
        issuedAt: mark.issuedAt,
        expiresAt: mark.expiresAt,
      })
    )

    const scoreResult = await tracer.span("calculateRegenScore", async () => calculateRegenScore(regenMarksData))

    const response = NextResponse.json({
      regenScore: scoreResult.totalScore,
      nftLevel: vendorProfile.nftLevel || "VERDE_CLARO", // Default to VERDE_CLARO if null
      commission: Number(vendorProfile.commissionRate || 15), // Convert Decimal to number, default 15
      activeRegenMarks: vendorProfile.regenMarks.map((mark) => ({
        id: mark.id,
        type: mark.type,
        score: mark.score,
        status: mark.status,
        issuedAt: mark.issuedAt,
        expiresAt: mark.expiresAt,
        createdAt: mark.createdAt,
      })),
      pendingEvaluations: vendorProfile.evaluations.map((evaluation) => ({
        id: evaluation.id,
        type: evaluation.type,
        status: evaluation.status,
        stage: evaluation.stage,
        submittedAt: evaluation.submittedAt,
        createdAt: evaluation.createdAt,
      })),
      breakdown: scoreResult.breakdown,
      activeRegenMarksCount: scoreResult.activeRegenMarksCount,
    })
    if (requestId) response.headers.set("x-request-id", requestId)
    end({ activeMarks: scoreResult.activeRegenMarksCount, totalScore: scoreResult.totalScore })
    return response
  } catch (error) {
    console.error("Error fetching vendor RegenMarks:", error)
    const errorMessage = error instanceof Error ? error.message : "Unknown error"
    return NextResponse.json(
      { error: "Failed to fetch RegenMarks data", details: errorMessage },
      { status: 500 }
    )
  }
}
