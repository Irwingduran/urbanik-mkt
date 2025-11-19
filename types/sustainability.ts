export interface SustainabilityMetrics {
  co2Reduction: number // kg CO2e avoided
  waterSaving: number // liters saved
  energyEfficiency: number // kWh saved or efficiency index
  wasteReduction?: number // kg of waste diverted
}

export interface RegenScoreBreakdown {
  score: number // 0-100
  components: Array<{ key: string; label: string; weight: number; value: number }>
  updatedAt: string
}
