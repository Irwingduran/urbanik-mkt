/**
 * RegenMark Scoring System
 *
 * Functions to calculate REGEN Score and determine NFT levels
 * based on active RegenMarks.
 */

import { NFTLevel, RegenMarkType, RegenMarkStatus } from "@prisma/client"
import {
  REGENMARK_TYPES,
  getNFTLevelByScore,
  calculateTotalWeight,
} from "./constants"

// ============================================
// TYPES
// ============================================

export interface RegenMarkScoreData {
  type: RegenMarkType
  score: number // 0-100
  status: RegenMarkStatus
  issuedAt?: Date | null
  expiresAt?: Date | null
}

export interface ScoreCalculationResult {
  totalScore: number // 0-100
  nftLevel: NFTLevel
  breakdown: {
    type: RegenMarkType
    score: number
    weight: number
    contribution: number
  }[]
  activeRegenMarksCount: number
  totalPossibleWeight: number
  actualWeight: number
}

// ============================================
// SCORE CALCULATION
// ============================================

/**
 * Calculate overall REGEN Score from active RegenMarks
 *
 * Formula: Weighted average of active RegenMarks
 * Score = Σ(RegenMark_score × weight) / Σ(weights of active RegenMarks)
 *
 * @param regenMarks - Array of vendor's RegenMarks with scores
 * @returns Calculation result with total score, NFT level, and breakdown
 */
export function calculateRegenScore(
  regenMarks: RegenMarkScoreData[]
): ScoreCalculationResult {
  // Filter only ACTIVE RegenMarks
  const activeMarks = regenMarks.filter((mark) => mark.status === "ACTIVE")

  // If no active RegenMarks, score is 0
  if (activeMarks.length === 0) {
    return {
      totalScore: 0,
      nftLevel: "VERDE_CLARO",
      breakdown: [],
      activeRegenMarksCount: 0,
      totalPossibleWeight: 1.0,
      actualWeight: 0,
    }
  }

  // Calculate weighted score
  let weightedSum = 0
  let totalActiveWeight = 0
  const breakdown: ScoreCalculationResult["breakdown"] = []

  for (const mark of activeMarks) {
    const config = REGENMARK_TYPES[mark.type]
    const weight = config.weight

    // Skip RegenMarks with 0 weight (like CIRCULAR_CHAMPION which is included in others)
    if (weight === 0) continue

    const contribution = mark.score * weight
    weightedSum += contribution
    totalActiveWeight += weight

    breakdown.push({
      type: mark.type,
      score: mark.score,
      weight: weight,
      contribution: contribution,
    })
  }

  // Calculate final score (normalized to 0-100)
  const totalScore =
    totalActiveWeight > 0 ? Math.round(weightedSum / totalActiveWeight) : 0

  // Determine NFT level based on score
  const nftLevel = getNFTLevelByScore(totalScore).level

  return {
    totalScore,
    nftLevel,
    breakdown,
    activeRegenMarksCount: activeMarks.length,
    totalPossibleWeight: calculateTotalWeight(
      Object.keys(REGENMARK_TYPES) as RegenMarkType[]
    ),
    actualWeight: totalActiveWeight,
  }
}

/**
 * Calculate individual RegenMark score based on metrics
 *
 * This is a placeholder - actual implementation will depend on
 * specific metrics for each RegenMark type
 *
 * @param type - RegenMark type
 * @param metrics - Metrics data (varies by type)
 * @returns Score 0-100
 */
export function calculateIndividualRegenMarkScore(
  type: RegenMarkType,
  metrics: Record<string, any>
): number {
  // This will be implemented with specific scoring logic for each type
  // For now, return a placeholder
  switch (type) {
    case "CARBON_SAVER":
      return calculateCarbonSaverScore(metrics)
    case "WATER_GUARDIAN":
      return calculateWaterGuardianScore(metrics)
    case "CIRCULAR_CHAMPION":
      return calculateCircularChampionScore(metrics)
    case "HUMAN_FIRST":
      return calculateHumanFirstScore(metrics)
    case "HUMANE_HERO":
      return calculateHumaneHeroScore(metrics)
    default:
      return 0
  }
}

// ============================================
// INDIVIDUAL REGENMARK SCORING FUNCTIONS
// ============================================

/**
 * Calculate Carbon Saver score (0-100)
 *
 * Based on:
 * - Carbon neutrality (40 points)
 * - Emissions reduction (30 points)
 * - Carbon offset (20 points)
 * - Certifications (10 points)
 */
function calculateCarbonSaverScore(metrics: Record<string, any>): number {
  let score = 0

  // Carbon neutrality (40 points)
  if (metrics.carbonNeutral === true) {
    score += 40
  }

  // Emissions reduction (30 points max)
  if (metrics.emissionsReduction && typeof metrics.emissionsReduction === "number") {
    score += Math.min(metrics.emissionsReduction, 30)
  }

  // Carbon offset (20 points max)
  if (
    metrics.offsetsUsed &&
    metrics.totalEmissions &&
    typeof metrics.offsetsUsed === "number" &&
    typeof metrics.totalEmissions === "number"
  ) {
    const offsetPercentage =
      (metrics.offsetsUsed / metrics.totalEmissions) * 100
    score += Math.min(offsetPercentage * 0.2, 20)
  }

  // Certifications (10 points)
  if (metrics.certified === true) {
    score += 10
  }

  return Math.min(Math.round(score), 100)
}

/**
 * Calculate Water Guardian score (0-100)
 *
 * Based on:
 * - Water saved (40 points)
 * - Water recycled (30 points)
 * - Wastewater treatment (20 points)
 * - Certifications (10 points)
 */
function calculateWaterGuardianScore(metrics: Record<string, any>): number {
  let score = 0

  // Water saved (40 points max)
  if (metrics.waterSavingPercentage && typeof metrics.waterSavingPercentage === "number") {
    score += Math.min(metrics.waterSavingPercentage, 40)
  }

  // Water recycled (30 points max)
  if (metrics.waterRecycledPercentage && typeof metrics.waterRecycledPercentage === "number") {
    score += Math.min(metrics.waterRecycledPercentage * 0.3, 30)
  }

  // Wastewater treatment (20 points)
  if (metrics.wasteWaterTreatment === true) {
    score += 20
  }

  // Certifications (10 points)
  if (metrics.certified === true) {
    score += 10
  }

  return Math.min(Math.round(score), 100)
}

/**
 * Calculate Circular Champion score (0-100)
 *
 * Based on:
 * - Recycling rate (40 points)
 * - Reuse rate (30 points)
 * - Circular economy (20 points)
 * - Waste reduction (10 points)
 */
function calculateCircularChampionScore(metrics: Record<string, any>): number {
  let score = 0

  // Recycling rate (40 points max)
  if (metrics.recyclingRate && typeof metrics.recyclingRate === "number") {
    score += Math.min(metrics.recyclingRate * 0.4, 40)
  }

  // Reuse rate (30 points max)
  if (metrics.reuseRate && typeof metrics.reuseRate === "number") {
    score += Math.min(metrics.reuseRate * 0.3, 30)
  }

  // Circular economy (20 points)
  if (metrics.circularEconomy === true) {
    score += 20
  }

  // Waste reduction (10 points)
  if (metrics.wasteReduction && typeof metrics.wasteReduction === "number") {
    score += Math.min(metrics.wasteReduction, 10)
  }

  return Math.min(Math.round(score), 100)
}

/**
 * Calculate Human First score (0-100)
 *
 * Based on:
 * - Fair wages (30 points)
 * - Sustainability report (25 points)
 * - Local employees (25 points)
 * - Community programs (20 points)
 */
function calculateHumanFirstScore(metrics: Record<string, any>): number {
  let score = 0

  // Fair wages (30 points)
  if (metrics.fairWages === true) {
    score += 30
  }

  // Sustainability report (25 points)
  if (metrics.sustainabilityReport === true) {
    score += 25
  }

  // Local employees (25 points max)
  if (metrics.localEmployeesPercentage && typeof metrics.localEmployeesPercentage === "number") {
    score += Math.min(metrics.localEmployeesPercentage * 0.25, 25)
  }

  // Community programs (20 points)
  if (metrics.communityPrograms === true) {
    score += 20
  }

  return Math.min(Math.round(score), 100)
}

/**
 * Calculate Humane Hero score (0-100)
 *
 * Based on:
 * - Cruelty-free certification (50 points)
 * - No animal testing policy (30 points)
 * - Ethical supply chain (20 points)
 */
function calculateHumaneHeroScore(metrics: Record<string, any>): number {
  let score = 0

  // Cruelty-free certification (50 points)
  if (metrics.crueltyFreeCertified === true) {
    score += 50
  }

  // No animal testing policy (30 points)
  if (metrics.noAnimalTesting === true) {
    score += 30
  }

  // Ethical supply chain (20 points)
  if (metrics.ethicalSupplyChain === true) {
    score += 20
  }

  return Math.min(Math.round(score), 100)
}

// ============================================
// EXPIRATION CHECKING
// ============================================

/**
 * Check if a RegenMark is expiring soon
 *
 * @param expiresAt - Expiration date
 * @param daysThreshold - Days before expiration to consider "soon"
 * @returns true if expiring within threshold
 */
export function isExpiringSoon(
  expiresAt: Date | null | undefined,
  daysThreshold: number = 60
): boolean {
  if (!expiresAt) return false

  const now = new Date()
  const daysUntilExpiration =
    (expiresAt.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)

  return daysUntilExpiration <= daysThreshold && daysUntilExpiration > 0
}

/**
 * Check if a RegenMark has expired
 *
 * @param expiresAt - Expiration date
 * @returns true if expired
 */
export function isExpired(expiresAt: Date | null | undefined): boolean {
  if (!expiresAt) return false

  return new Date() > expiresAt
}

/**
 * Calculate days until expiration
 *
 * @param expiresAt - Expiration date
 * @returns Days until expiration (negative if expired)
 */
export function daysUntilExpiration(
  expiresAt: Date | null | undefined
): number | null {
  if (!expiresAt) return null

  const now = new Date()
  const days = Math.round(
    (expiresAt.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
  )

  return days
}

// ============================================
// SCORE COMPARISON
// ============================================

/**
 * Compare two score calculations and detect changes
 *
 * @param oldScore - Previous score calculation
 * @param newScore - New score calculation
 * @returns Change analysis
 */
export function compareScores(
  oldScore: ScoreCalculationResult,
  newScore: ScoreCalculationResult
) {
  const scoreDiff = newScore.totalScore - oldScore.totalScore
  const levelChanged = oldScore.nftLevel !== newScore.nftLevel
  const levelUp = levelChanged && scoreDiff > 0
  const levelDown = levelChanged && scoreDiff < 0

  return {
    scoreDiff,
    scorePercentageChange:
      oldScore.totalScore > 0
        ? Math.round((scoreDiff / oldScore.totalScore) * 100)
        : 0,
    levelChanged,
    levelUp,
    levelDown,
    oldLevel: oldScore.nftLevel,
    newLevel: newScore.nftLevel,
    newRegenMarks: newScore.activeRegenMarksCount - oldScore.activeRegenMarksCount,
  }
}
