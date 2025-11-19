/**
 * RegenMark Utility Functions
 *
 * Helper functions for working with RegenMarks, NFT levels, and evaluations
 */

import { NFTLevel, RegenMarkType, RegenMarkStatus } from "@prisma/client"
import { getNFTLevelConfig, getRegenMarkTypeConfig, EVALUATION_CONFIG } from "./constants"

// ============================================
// TYPES
// ============================================

export interface NFTLevelInfo {
  current: NFTLevel
  name: string
  emoji: string
  score: number
  commission: number
  visibilityBoost: number
  next: {
    level: NFTLevel
    name: string
    scoreNeeded: number
    regenMarksNeeded: number
  } | null
  progress: number // 0-100 percentage to next level
}

export interface RegenMarkInfo {
  type: RegenMarkType
  name: string
  emoji: string
  status: RegenMarkStatus
  score: number
  daysUntilExpiration: number | null
  isActive: boolean
  isExpired: boolean
  isExpiringSoon: boolean
}

// ============================================
// NFT LEVEL UTILITIES
// ============================================

/**
 * Get comprehensive NFT level information
 *
 * @param currentLevel - Current NFT level
 * @param currentScore - Current REGEN score
 * @param activeRegenMarksCount - Number of active RegenMarks
 * @returns Detailed NFT level information
 */
export function getNFTLevelInfo(
  currentLevel: NFTLevel,
  currentScore: number,
  activeRegenMarksCount: number
): NFTLevelInfo {
  const config = getNFTLevelConfig(currentLevel)

  // Determine next level
  const levels: NFTLevel[] = [
    "VERDE_CLARO",
    "HOJA_ACTIVA",
    "ECO_GUARDIA",
    "ESTRELLA_VERDE",
    "HUELLA_CERO",
  ]

  const currentIndex = levels.indexOf(currentLevel)
  const nextLevel = currentIndex < levels.length - 1 ? levels[currentIndex + 1] : null

  let nextLevelInfo: NFTLevelInfo["next"] = null
  let progress = 100 // Default to 100% if at max level

  if (nextLevel) {
    const nextConfig = getNFTLevelConfig(nextLevel)
    const scoreNeeded = nextConfig.minScore - currentScore
    const regenMarksNeeded = Math.max(
      0,
      nextConfig.regenMarksRequired - activeRegenMarksCount
    )

    nextLevelInfo = {
      level: nextLevel,
      name: nextConfig.name,
      scoreNeeded: Math.max(0, scoreNeeded),
      regenMarksNeeded,
    }

    // Calculate progress (0-100)
    const scoreRange = nextConfig.minScore - config.minScore
    const scoreProgress = currentScore - config.minScore
    progress = Math.min(100, Math.round((scoreProgress / scoreRange) * 100))
  }

  return {
    current: currentLevel,
    name: config.name,
    emoji: config.emoji,
    score: currentScore,
    commission: config.commission,
    visibilityBoost: config.visibilityBoost,
    next: nextLevelInfo,
    progress,
  }
}

/**
 * Format NFT level for display
 *
 * @param level - NFT level enum
 * @returns Formatted string (e.g., "🌱 Verde Claro")
 */
export function formatNFTLevel(level: NFTLevel): string {
  const config = getNFTLevelConfig(level)
  return `${config.emoji} ${config.name}`
}

/**
 * Get commission rate for a given NFT level
 *
 * @param level - NFT level enum
 * @returns Commission percentage (0-100)
 */
export function getCommissionRate(level: NFTLevel): number {
  return getNFTLevelConfig(level).commission
}

/**
 * Get visibility boost for a given NFT level
 *
 * @param level - NFT level enum
 * @returns Visibility boost percentage
 */
export function getVisibilityBoost(level: NFTLevel): number {
  return getNFTLevelConfig(level).visibilityBoost
}

// ============================================
// REGENMARK UTILITIES
// ============================================

/**
 * Format RegenMark type for display
 *
 * @param type - RegenMark type enum
 * @returns Formatted string (e.g., "🌍 Carbon Saver")
 */
export function formatRegenMarkType(type: RegenMarkType): string {
  const config = getRegenMarkTypeConfig(type)
  return `${config.emoji} ${config.name}`
}

/**
 * Get evaluation cost range for a RegenMark type
 *
 * @param type - RegenMark type enum
 * @returns Cost range in MXN
 */
export function getEvaluationCostRange(type: RegenMarkType): {
  min: number
  max: number
  formatted: string
} {
  const config = getRegenMarkTypeConfig(type)
  return {
    min: config.evaluationCost.min,
    max: config.evaluationCost.max,
    formatted: `$${config.evaluationCost.min.toLocaleString("es-MX")} - $${config.evaluationCost.max.toLocaleString("es-MX")} MXN`,
  }
}

/**
 * Get evaluation time range for a RegenMark type
 *
 * @param type - RegenMark type enum
 * @returns Time range in hours
 */
export function getEvaluationTimeRange(type: RegenMarkType): {
  min: number
  max: number
  formatted: string
} {
  const config = getRegenMarkTypeConfig(type)
  return {
    min: config.evaluationTime.min,
    max: config.evaluationTime.max,
    formatted: `${config.evaluationTime.min}-${config.evaluationTime.max} horas`,
  }
}

// ============================================
// RENEWAL AND EXPIRATION UTILITIES
// ============================================

/**
 * Calculate renewal discount based on days before expiration
 *
 * @param daysBeforeExpiration - Days before the RegenMark expires
 * @returns Discount percentage (0-100)
 */
export function calculateRenewalDiscount(daysBeforeExpiration: number): number {
  if (daysBeforeExpiration >= 90) {
    return EVALUATION_CONFIG.RENEWAL_DISCOUNT_90_DAYS
  } else if (daysBeforeExpiration >= 60) {
    return EVALUATION_CONFIG.RENEWAL_DISCOUNT_60_DAYS
  } else if (daysBeforeExpiration >= 30) {
    return EVALUATION_CONFIG.RENEWAL_DISCOUNT_30_DAYS
  }
  return 0 // No discount if renewing after expiration
}

/**
 * Calculate expiration date from issuance date
 *
 * @param issuedAt - Date when RegenMark was issued
 * @returns Expiration date (12 months later)
 */
export function calculateExpirationDate(issuedAt: Date): Date {
  const expiresAt = new Date(issuedAt)
  expiresAt.setMonth(expiresAt.getMonth() + EVALUATION_CONFIG.VALIDITY_PERIOD_MONTHS)
  return expiresAt
}

/**
 * Get expiration status label
 *
 * @param daysUntilExpiration - Days until expiration (negative if expired)
 * @returns Status label and color
 */
export function getExpirationStatus(daysUntilExpiration: number | null): {
  label: string
  color: "green" | "yellow" | "orange" | "red" | "gray"
  urgent: boolean
} {
  if (daysUntilExpiration === null) {
    return { label: "Sin fecha de expiración", color: "gray", urgent: false }
  }

  if (daysUntilExpiration < 0) {
    return { label: "Expirado", color: "red", urgent: true }
  } else if (daysUntilExpiration <= EVALUATION_CONFIG.EXPIRING_URGENT_DAYS) {
    return {
      label: `Expira en ${daysUntilExpiration} días`,
      color: "red",
      urgent: true,
    }
  } else if (daysUntilExpiration <= EVALUATION_CONFIG.EXPIRING_WARNING_DAYS) {
    return {
      label: `Expira en ${daysUntilExpiration} días`,
      color: "orange",
      urgent: true,
    }
  } else if (daysUntilExpiration <= EVALUATION_CONFIG.EXPIRING_SOON_DAYS) {
    return {
      label: `Expira en ${daysUntilExpiration} días`,
      color: "yellow",
      urgent: false,
    }
  }

  return { label: "Activo", color: "green", urgent: false }
}

// ============================================
// VALIDATION UTILITIES
// ============================================

/**
 * Validate RegenMark score
 *
 * @param score - Score to validate
 * @returns true if valid (0-100)
 */
export function isValidScore(score: number): boolean {
  return typeof score === "number" && score >= 0 && score <= 100 && !isNaN(score)
}

/**
 * Normalize score to 0-100 range
 *
 * @param score - Score to normalize
 * @returns Normalized score (0-100)
 */
export function normalizeScore(score: number): number {
  return Math.max(0, Math.min(100, Math.round(score)))
}

// ============================================
// DISPLAY UTILITIES
// ============================================

/**
 * Format score for display
 *
 * @param score - Score (0-100)
 * @returns Formatted string (e.g., "85/100")
 */
export function formatScore(score: number): string {
  return `${Math.round(score)}/100`
}

/**
 * Format commission rate for display
 *
 * @param rate - Commission rate (0-100)
 * @returns Formatted string (e.g., "15%")
 */
export function formatCommissionRate(rate: number): string {
  return `${rate}%`
}

/**
 * Format visibility boost for display
 *
 * @param boost - Visibility boost percentage
 * @returns Formatted string (e.g., "+30%")
 */
export function formatVisibilityBoost(boost: number): string {
  return boost > 0 ? `+${boost}%` : "Normal"
}

/**
 * Get score color class for UI
 *
 * @param score - Score (0-100)
 * @returns Tailwind color class
 */
export function getScoreColorClass(score: number): string {
  if (score >= 80) return "text-green-600"
  if (score >= 60) return "text-blue-600"
  if (score >= 40) return "text-yellow-600"
  if (score >= 20) return "text-orange-600"
  return "text-gray-600"
}

/**
 * Get score background color class for UI
 *
 * @param score - Score (0-100)
 * @returns Tailwind background color class
 */
export function getScoreBgColorClass(score: number): string {
  if (score >= 80) return "bg-green-100"
  if (score >= 60) return "bg-blue-100"
  if (score >= 40) return "bg-yellow-100"
  if (score >= 20) return "bg-orange-100"
  return "bg-gray-100"
}
