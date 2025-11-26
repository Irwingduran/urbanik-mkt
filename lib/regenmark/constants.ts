/**
 * RegenMark System Constants
 *
 * This file contains all constants and configuration for the RegenMark
 * sustainability certification system.
 */

import { NFTLevel, RegenMarkType } from "@prisma/client"

// ============================================
// NFT LEVELS CONFIGURATION
// ============================================

export interface NFTLevelConfig {
  level: NFTLevel
  name: string
  emoji: string
  minScore: number
  maxScore: number
  regenMarksRequired: number
  commission: number // Percentage (0-100)
  visibilityBoost: number // Percentage increase
  benefits: string[]
  description: string
}

export const NFT_LEVELS: Record<NFTLevel, NFTLevelConfig> = {
  VERDE_CLARO: {
    level: "VERDE_CLARO",
    name: "Verde Claro",
    emoji: "🌱",
    minScore: 0,
    maxScore: 19,
    regenMarksRequired: 0,
    commission: 15,
    visibilityBoost: 0,
    benefits: [
      "Perfil básico en marketplace",
      "Badge de vendedor verificado",
      "Soporte estándar",
      "Puede solicitar evaluaciones de RegenMarks",
    ],
    description: "Vendedor registrado sin certificaciones activas",
  },
  HOJA_ACTIVA: {
    level: "HOJA_ACTIVA",
    name: "Hoja Activa",
    emoji: "🍃",
    minScore: 20,
    maxScore: 39,
    regenMarksRequired: 1,
    commission: 13,
    visibilityBoost: 15,
    benefits: [
      "Todo lo de Verde Claro",
      "Badge 'Hoja Activa' en productos",
      "Destacado en filtros de sostenibilidad",
      "Comisión reducida",
      "Aparece en sección 'Vendedores Sostenibles'",
    ],
    description: "Primer nivel de certificación sostenible",
  },
  ECO_GUARDIA: {
    level: "ECO_GUARDIA",
    name: "Eco-Guardia",
    emoji: "🛡️🌿",
    minScore: 40,
    maxScore: 59,
    regenMarksRequired: 2,
    commission: 11,
    visibilityBoost: 30,
    benefits: [
      "Todo lo de Hoja Activa",
      "Badge especial 'Eco-Guardia'",
      "Featured en homepage (rotativo)",
      "Soporte prioritario",
      "Analytics avanzados",
      "Newsletter mensual destacado",
    ],
    description: "Compromiso fuerte con sostenibilidad",
  },
  ESTRELLA_VERDE: {
    level: "ESTRELLA_VERDE",
    name: "Estrella Verde",
    emoji: "⭐🌿",
    minScore: 60,
    maxScore: 79,
    regenMarksRequired: 3,
    commission: 9,
    visibilityBoost: 50,
    benefits: [
      "Todo lo de Eco-Guardia",
      "Badge Premium 'Estrella Verde'",
      "Destacado permanente en homepage",
      "Soporte VIP",
      "Co-marketing con plataforma",
      "Entrevista en blog de la plataforma",
      "Acceso a eventos exclusivos",
    ],
    description: "Líder en sostenibilidad empresarial",
  },
  HUELLA_CERO: {
    level: "HUELLA_CERO",
    name: "Huella Cero",
    emoji: "♻️✨",
    minScore: 80,
    maxScore: 100,
    regenMarksRequired: 4,
    commission: 7,
    visibilityBoost: 70,
    benefits: [
      "Todo lo de Estrella Verde",
      "Badge Ultra Premium 'Huella Cero'",
      "Sección exclusiva en homepage",
      "Comisión mínima",
      "Soporte VIP 24/7",
      "Co-branding en campañas",
      "Caso de estudio publicado",
      "Embajador de la plataforma",
      "Prioridad en nuevas features",
      "Networking con otros líderes sostenibles",
    ],
    description: "Máximo estándar de sostenibilidad",
  },
}

// ============================================
// REGENMARK TYPES CONFIGURATION
// ============================================

export interface RegenMarkTypeConfig {
  type: RegenMarkType
  name: string
  emoji: string
  weight: number // Weight in overall score calculation (0-1)
  description: string
  focusAreas: string[]
  evaluationCost: {
    min: number // MXN
    max: number // MXN
  }
  evaluationTime: {
    min: number // hours
    max: number // hours
  }
}

export const REGENMARK_TYPES: Record<RegenMarkType, RegenMarkTypeConfig> = {
  CARBON_SAVER: {
    type: "CARBON_SAVER",
    name: "Carbon Saver",
    emoji: "🌍",
    weight: 0.25, // 25%
    description: "Reducción de emisiones de carbono y energía limpia",
    focusAreas: [
      "Huella de carbono",
      "Reducción de emisiones GHG",
      "Energía renovable",
      "Eficiencia energética",
      "Neutralidad de carbono",
      "Resiliencia climática",
    ],
    evaluationCost: {
      min: 12500,
      max: 37500,
    },
    evaluationTime: {
      min: 15,
      max: 43,
    },
  },
  WATER_GUARDIAN: {
    type: "WATER_GUARDIAN",
    name: "Water Guardian",
    emoji: "💧",
    weight: 0.3, // 30%
    description: "Conservación y gestión responsable del agua",
    focusAreas: [
      "Consumo de agua",
      "Conservación de agua",
      "Reciclaje de agua",
      "Tratamiento de aguas residuales",
      "Calidad del agua",
      "Gestión responsable",
    ],
    evaluationCost: {
      min: 12500,
      max: 37500,
    },
    evaluationTime: {
      min: 15,
      max: 43,
    },
  },
  CIRCULAR_CHAMPION: {
    type: "CIRCULAR_CHAMPION",
    name: "Circular Champion",
    emoji: "♻️",
    weight: 0, // Included in other RegenMarks
    description: "Economía circular y gestión de residuos",
    focusAreas: [
      "Gestión de residuos",
      "Reciclaje",
      "Reutilización",
      "Economía circular",
      "Uso de recursos",
      "Zero waste",
    ],
    evaluationCost: {
      min: 12500,
      max: 37500,
    },
    evaluationTime: {
      min: 15,
      max: 43,
    },
  },
  HUMAN_FIRST: {
    type: "HUMAN_FIRST",
    name: "Human First",
    emoji: "👥",
    weight: 0.3, // 30%
    description: "Impacto social y condiciones laborales",
    focusAreas: [
      "Calidad de vida",
      "Salarios justos",
      "Empleos locales",
      "Seguridad alimentaria",
      "Educación ambiental",
      "Programas comunitarios",
    ],
    evaluationCost: {
      min: 12500,
      max: 37500,
    },
    evaluationTime: {
      min: 15,
      max: 43,
    },
  },
  HUMANE_HERO: {
    type: "HUMANE_HERO",
    name: "Humane Hero",
    emoji: "🐾",
    weight: 0.15, // 15%
    description: "Prácticas cruelty-free y bienestar animal",
    focusAreas: [
      "Cruelty-free",
      "Bienestar animal",
      "No testeo animal",
      "Cadena de suministro ética",
      "Certificaciones éticas",
    ],
    evaluationCost: {
      min: 12500,
      max: 37500,
    },
    evaluationTime: {
      min: 15,
      max: 43,
    },
  },
}

// ============================================
// EVALUATION CONFIGURATION
// ============================================

export const EVALUATION_CONFIG = {
  // Expiration warning periods (days before expiration)
  EXPIRING_SOON_DAYS: 60,
  EXPIRING_WARNING_DAYS: 30,
  EXPIRING_URGENT_DAYS: 7,

  // Renewal discounts (percentage)
  RENEWAL_DISCOUNT_90_DAYS: 50,
  RENEWAL_DISCOUNT_60_DAYS: 30,
  RENEWAL_DISCOUNT_30_DAYS: 15,

  // Validity period
  VALIDITY_PERIOD_MONTHS: 12,

  // Grace periods after expiration
  GRACE_PERIOD_DAYS: 30,
  SUSPENSION_PERIOD_DAYS: 60,

  // Commission penalties
  COMMISSION_PENALTY_EXPIRED: 2, // +2%
  COMMISSION_PENALTY_SUSPENDED: 5, // +5%

  // Visibility penalties
  VISIBILITY_PENALTY_EXPIRED: 20, // -20%
  VISIBILITY_PENALTY_SUSPENDED: 50, // -50%
} as const

// ============================================
// DOCUMENT REQUIREMENTS
// ============================================

export const DOCUMENT_REQUIREMENTS: Record<
  RegenMarkType,
  {
    required: string[]
    optional: string[]
  }
> = {
  CARBON_SAVER: {
    required: [
      "Reporte de huella de carbono (GHG Protocol)",
      "Facturas de energía (últimos 12 meses)",
    ],
    optional: [
      "Certificados de compensación de carbono",
      "Certificación ISO 14001 o equivalente",
      "Certificación de energía renovable",
    ],
  },
  WATER_GUARDIAN: {
    required: [
      "Recibos de agua (últimos 12 meses)",
      "Evidencia de sistemas de reciclaje/tratamiento",
    ],
    optional: [
      "Auditoría de uso de agua",
      "Fotos/videos de instalaciones",
      "Certificación de gestión del agua",
    ],
  },
  CIRCULAR_CHAMPION: {
    required: [
      "Registros de gestión de residuos",
      "Contratos con centros de reciclaje",
    ],
    optional: [
      "Evidencia de economía circular",
      "Certificación Zero Waste",
      "Política de gestión de residuos",
    ],
  },
  HUMAN_FIRST: {
    required: [
      "Política de salarios y condiciones laborales",
      "Programas comunitarios (evidencia)",
    ],
    optional: [
      "Reporte de sostenibilidad publicado",
      "Certificación B Corp",
      "Certificación Fair Trade",
    ],
  },
  HUMANE_HERO: {
    required: [
      "Certificaciones cruelty-free (Leaping Bunny, PETA)",
      "Política de no testeo animal",
    ],
    optional: [
      "Auditoría de bienestar animal",
      "Certificación de cadena de suministro ética",
    ],
  },
}

// ============================================
// SCORING THRESHOLDS
// ============================================

export const SCORING_THRESHOLDS = {
  // Minimum scores to approve a RegenMark
  MIN_SCORE_TO_APPROVE: 60,

  // AI confidence thresholds
  AI_HIGH_CONFIDENCE: 0.9,
  AI_MEDIUM_CONFIDENCE: 0.7,
  AI_LOW_CONFIDENCE: 0.5,

  // Anomaly detection thresholds
  ANOMALY_SEVERE: 0.9,
  ANOMALY_MODERATE: 0.7,
  ANOMALY_MINOR: 0.5,
} as const

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Get NFT level configuration by score
 */
export function getNFTLevelByScore(score: number): NFTLevelConfig {
  const levels = Object.values(NFT_LEVELS)
  const level = levels.find(
    (l) => score >= l.minScore && score <= l.maxScore
  )
  return level || NFT_LEVELS.VERDE_CLARO
}

/**
 * Get NFT level configuration by enum value
 */
export function getNFTLevelConfig(level: NFTLevel): NFTLevelConfig {
  return NFT_LEVELS[level]
}

/**
 * Get RegenMark type configuration
 */
export function getRegenMarkTypeConfig(
  type: RegenMarkType
): RegenMarkTypeConfig {
  return REGENMARK_TYPES[type]
}

/**
 * Get all active RegenMark types (with weight > 0)
 */
export function getActiveRegenMarkTypes(): RegenMarkType[] {
  return Object.entries(REGENMARK_TYPES)
    .filter(([, config]) => config.weight > 0)
    .map(([type]) => type as RegenMarkType)
}

/**
 * Calculate total weight of active RegenMarks
 */
export function calculateTotalWeight(types: RegenMarkType[]): number {
  return types.reduce((sum, type) => {
    return sum + REGENMARK_TYPES[type].weight
  }, 0)
}
