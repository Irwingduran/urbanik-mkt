import { z } from 'zod'

export const MetricsSchema = z.object({
  co2Reduction: z.number().nonnegative(),
  waterSaving: z.number().nonnegative(),
  energyEfficiency: z.number().nonnegative(),
  wasteReduction: z.number().nonnegative().optional()
})

export const RegenScoreSchema = z.object({
  score: z.number().min(0).max(100),
  components: z.array(z.object({
    key: z.string(),
    label: z.string(),
    weight: z.number().min(0).max(1),
    value: z.number().min(0).max(100)
  })),
  updatedAt: z.string()
})

export type Metrics = z.infer<typeof MetricsSchema>
export type RegenScore = z.infer<typeof RegenScoreSchema>
