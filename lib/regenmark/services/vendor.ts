import { RegenMarkStatus, RegenMarkType } from "@prisma/client"
import { calculateRegenScore, calculateIndividualRegenMarkScore } from "../scoring"
import { prisma } from "@/lib/prisma"
import { createTracer } from "@/lib/trace"

const tracer = createTracer("regenmark.vendor")

export interface VendorRegenInput {
  vendorUserId: string
  marks: {
    type: RegenMarkType
    metrics: Record<string, unknown>
  }[]
}

export async function applyVendorRegenMarks(input: VendorRegenInput) {
  const end = tracer.start("applyVendorRegenMarks", { vendorUserId: input.vendorUserId, marks: input.marks?.length ?? 0 })
  // Ensure vendor profile exists
  const vp = await tracer.span("fetchVendorProfile", async () => {
    return prisma.vendorProfile.findUnique({ where: { userId: input.vendorUserId }, select: { id: true } })
  })
  if (!vp) throw new Error("Vendor profile not found")

  // Compute scores for each mark
  const scored = await tracer.span("computeIndividualScores", async () =>
    input.marks.map((m) => ({
      type: m.type,
      score: calculateIndividualRegenMarkScore(m.type, m.metrics),
    }))
  )

  // Upsert RegenMarks for vendor
  await tracer.span("upsertRegenMarks", async () => {
    for (const s of scored) {
      await prisma.regenMark.upsert({
        where: {
          // Unique constraint can be vendorProfileId+type in future; for now emulate
          id: `${vp.id}_${s.type}`,
        },
        update: { score: s.score, status: "ACTIVE" as RegenMarkStatus },
        create: {
          // if id is not actual PK schema, replace with true unique (requires schema change)
          id: `${vp.id}_${s.type}`,
          vendorProfileId: vp.id,
          type: s.type,
          score: s.score,
          status: "ACTIVE",
        },
      })
    }
  })

  // Recalculate vendor aggregate score and level
  const vendorMarks = await tracer.span("fetchVendorMarks", async () =>
    prisma.regenMark.findMany({
      where: { vendorProfileId: vp.id },
      select: { type: true, score: true, status: true, issuedAt: true, expiresAt: true },
    })
  )
  const aggregate = await tracer.span("calculateAggregateScore", async () =>
    calculateRegenScore(
      vendorMarks.map((m) => ({ type: m.type, score: m.score, status: m.status, issuedAt: m.issuedAt || undefined, expiresAt: m.expiresAt || undefined }))
    )
  )

  await tracer.span("updateVendorProfile", async () =>
    prisma.vendorProfile.update({
      where: { id: vp.id },
      data: {
        regenScore: aggregate.totalScore,
        nftLevel: aggregate.nftLevel,
        metricsLastUpdated: new Date(),
      },
    })
  )

  end({ totalScore: aggregate.totalScore, nftLevel: aggregate.nftLevel })
  return { totalScore: aggregate.totalScore, nftLevel: aggregate.nftLevel }
}
