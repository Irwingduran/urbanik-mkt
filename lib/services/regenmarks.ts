import { RegenMarkType } from "@prisma/client"

export type SubmitVendorRegenMarksInput = {
  marks: { type: RegenMarkType; metrics: Record<string, unknown> }[]
  vendorId?: string // admin override
}

export async function submitVendorRegenMarks(input: SubmitVendorRegenMarksInput) {
  const res = await fetch("/api/vendor/onboarding/regenmarks", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  })
  const data = await res.json()
  if (!res.ok) {
    throw new Error(data?.error || "Failed to submit vendor regen marks")
  }
  return data?.data
}
