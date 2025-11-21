import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth-config"
import { applyVendorRegenMarks } from "@/lib/regenmark/services/vendor"
import { z } from "zod"
import { RegenMarkType } from "@prisma/client"

const BodySchema = z.object({
  marks: z
    .array(
      z.object({
        type: z.nativeEnum(RegenMarkType),
        metrics: z.record(z.any()),
      })
    )
    .min(1, "At least one RegenMark must be provided"),
  vendorId: z.string().optional(), // Admin override
})

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const json = await req.json()
    const parsed = BodySchema.safeParse(json)
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation error", details: parsed.error.flatten() },
        { status: 400 }
      )
    }

    const isAdmin = session.user.role === "ADMIN" || session.user.roles?.includes("ADMIN")
    const vendorUserId = isAdmin && parsed.data.vendorId ? parsed.data.vendorId : session.user.id

    // Only allow non-admins (vendors) to operate on their own id
    if (!isAdmin) {
      // simple guard: must have vendor role
      if (!(session.user.role === "VENDOR" || session.user.roles?.includes("VENDOR"))) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 })
      }
    }

    const result = await applyVendorRegenMarks({
      vendorUserId,
      marks: parsed.data.marks,
    })

    return NextResponse.json({ success: true, data: result })
  } catch (err) {
    console.error("POST /api/vendor/onboarding/regenmarks error:", err)
    const msg = err instanceof Error ? err.message : "Internal error"
    return NextResponse.json({ error: "Internal server error", details: msg }, { status: 500 })
  }
}
