import { computeProductRegenScore } from "@/lib/regenmark/services/product"

describe("computeProductRegenScore", () => {
  it("computes weighted score (happy path)", () => {
    const { score, breakdown } = computeProductRegenScore({
      co2Reduction: 50,
      waterSaving: 40,
      energyEfficiency: 60,
    })
    // 50*.4 + 40*.3 + 60*.3 = 20 + 12 + 18 = 50
    expect(score).toBe(50)
    expect(breakdown).toHaveLength(3)
  })

  it("handles missing values as zero", () => {
    const { score } = computeProductRegenScore({} as unknown as {
      co2Reduction: number
      waterSaving: number
      energyEfficiency: number
    })
    expect(score).toBe(0)
  })

  it("caps score at 100", () => {
    const { score } = computeProductRegenScore({
      co2Reduction: 200,
      waterSaving: 200,
      energyEfficiency: 200,
    })
    expect(score).toBe(100)
  })
})
