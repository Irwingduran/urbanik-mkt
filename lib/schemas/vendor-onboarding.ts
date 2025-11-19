import { z } from "zod"

export const BusinessTypeEnum = z.enum([
  "LLC",
  "Individual",
  "Corporation",
  "Cooperative",
  "Non-profit",
])

export const AnimalTestingPolicyEnum = z.enum([
  "NO_TESTING",
  "LIMITED_LEGAL",
  "NO_POLICY",
])

export const AnimalOriginUseEnum = z.enum([
  "NO_ANIMAL_PRODUCTS",
  "ETHICAL_ANIMAL_PRODUCTS",
  "CONVENTIONAL_ANIMAL_PRODUCTS",
])

export const VendorOnboardingSchema = z
  .object({
  // Business Info
  companyName: z.string().min(1, "companyName is required"),
  contactName: z.string().min(1, "contactName is required"),
  businessType: z.union([BusinessTypeEnum, z.string().min(1)]),
  description: z.string().optional().default(""),

  // Contact
  email: z.string().email(),
  phone: z.string().min(6),
  website: z
    .preprocess((v) => (v === "" ? undefined : v), z.string().url().optional()),
  businessAddress: z.string().min(1, "businessAddress is required"),

  // Category
  category: z.string().min(1, "category is required"),

  // Sustainability
  sustainabilityIntent: z.string().optional().default(""),
  certifications: z.array(z.string()).default([]),
  sustainabilityGoals: z.array(z.string()).default([]),
  environmentalCertifications: z.array(z.string()).default([]),
  certificationDocuments: z
    .array(
      z.object({
        url: z.string().url(),
        filename: z.string(),
        type: z.string().optional(),
        size: z.number().optional(),
      })
    )
    .optional()
    .default([]),

  // Social Practices
  laborPractices: z.string().optional().default(""),
  communityImpact: z.string().optional().default(""),
  laborCompliance: z.string().optional().default(""),
  fairTradeCertified: z.boolean().optional().default(false),
  localSourcingPercent: z.preprocess(
    (v) => {
      if (typeof v === "string") {
        const trimmed = v.trim()
        if (trimmed === "") return undefined
        const n = Number(trimmed)
        return Number.isNaN(n) ? undefined : n
      }
      return v
    },
    z.number().min(0).max(100).optional()
  ),

  // Animal Welfare
  animalTestingPolicy: z.preprocess(
    (v) => (v === "" ? undefined : v),
    AnimalTestingPolicyEnum.optional()
  ),
  animalOriginUse: z.preprocess(
    (v) => (v === "" ? undefined : v),
    AnimalOriginUseEnum.optional()
  ),
  animalWelfarePolicies: z.string().optional().default(""),
  ethicalAlternatives: z.string().optional().default(""),
})
  .superRefine((data, ctx) => {
    const category = (data.category || '').toString()
    const docsCount = (data.certificationDocuments || []).length

    // Regla 1: Categorías sensibles requieren al menos un documento
    const categoriesRequiringDocs = new Set([
      'alimentos-organicos',
      'cosmetica-natural',
    ])
    if (categoriesRequiringDocs.has(category) && docsCount === 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['certificationDocuments'],
        message: 'Se requiere al menos un documento de certificación para esta categoría.'
      })
    }

    // Regla 2: Si declara certificaciones ambientales, pide evidencia
    if ((data.environmentalCertifications?.length || 0) > 0 && docsCount === 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['certificationDocuments'],
        message: 'Adjunta evidencia de tus certificaciones ambientales.'
      })
    }
  })

export type VendorOnboardingInput = z.infer<typeof VendorOnboardingSchema>
