import { z } from "zod"
import { createTracer } from "@/lib/trace"

const tracer = createTracer("regenmark.product")

// Simple, reusable scoring for product-level regen score
// Default weights chosen to align with existing form fields
export const ProductRegenInput = z.object({
  co2Reduction: z.number().min(0).optional().default(0), // 0-100
  waterSaving: z.number().min(0).optional().default(0), // 0-100
  energyEfficiency: z.number().min(0).optional().default(0), // 0-100
})

export type ProductRegenInput = z.infer<typeof ProductRegenInput>

export interface ProductRegenResult {
  score: number // 0-100
  breakdown: {
    metric: "co2Reduction" | "waterSaving" | "energyEfficiency"
    value: number
    weight: number
    contribution: number
  }[]
}

const DEFAULT_WEIGHTS = {
  co2Reduction: 0.4,
  waterSaving: 0.3,
  energyEfficiency: 0.3,
} as const

export function computeProductRegenScore(
  input: ProductRegenInput,
  weights = DEFAULT_WEIGHTS
): ProductRegenResult {
  const end = tracer.start("computeProductRegenScore")
  const data = ProductRegenInput.parse(input)

  const contributions = [
    {
      metric: "co2Reduction" as const,
      value: data.co2Reduction || 0,
      weight: weights.co2Reduction,
      contribution: (data.co2Reduction || 0) * weights.co2Reduction,
    },
    {
      metric: "waterSaving" as const,
      value: data.waterSaving || 0,
      weight: weights.waterSaving,
      contribution: (data.waterSaving || 0) * weights.waterSaving,
    },
    {
      metric: "energyEfficiency" as const,
      value: data.energyEfficiency || 0,
      weight: weights.energyEfficiency,
      contribution: (data.energyEfficiency || 0) * weights.energyEfficiency,
    },
  ]

  const score = Math.min(100, Math.round(contributions.reduce((s, c) => s + c.contribution, 0)))

  end({ score, metricsProvided: {
    co2Reduction: !!input.co2Reduction,
    waterSaving: !!input.waterSaving,
    energyEfficiency: !!input.energyEfficiency,
  } })

  return { score, breakdown: contributions }
}
