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

export const VendorOnboardingSchema = z.object({
  // Business Info
  companyName: z.string().min(2, "El nombre de la empresa debe tener al menos 2 caracteres"),
  contactName: z.string().min(2, "El nombre de contacto debe tener al menos 2 caracteres"),
  businessType: BusinessTypeEnum, // ✅ Usa el enum directamente
  description: z.string().optional(),

  // Contact
  email: z.string().email("Ingresa un email válido"),
  phone: z.string().min(10, "El teléfono debe tener al menos 10 dígitos"),
  website: z.string().url("Ingresa una URL válida (https://...)").optional().or(z.literal("")),
  address: z.string().min(5, "La dirección es requerida"),

  // Category
  category: z.string().min(1, "Selecciona una categoría"),

  // Sustainability
  sustainabilityIntent: z.string().optional(),
  certifications: z.array(z.string()).default([]),
  sustainabilityGoals: z.array(z.string()).default([]),
  environmentalCertifications: z.array(z.string()).default([]),
  
  // Documents
  certificationDocuments: z.array(z.object({
    url: z.string().url("URL inválida"),
    filename: z.string().min(1, "Nombre de archivo requerido"),
    type: z.string().optional(),
    size: z.number().nonnegative("El tamaño debe ser positivo").optional()
  })).default([]),

  // Social & Animal Welfare
  laborPractices: z.string().optional(),
  communityImpact: z.string().optional(),
  laborCompliance: z.string().optional(),
  fairTradeCertified: z.boolean().default(false),
  localSourcingPercent: z.string()
    .regex(/^(100|[1-9]?[0-9])%?$/, "Ingresa un porcentaje válido (0-100%)")
    .optional(), // ✅ Mejor validación para porcentaje
  
  // ✅ Usa los enums definidos
  animalTestingPolicy: AnimalTestingPolicyEnum.optional(),
  animalOriginUse: AnimalOriginUseEnum.optional(),
  animalWelfarePolicies: z.string().optional(),
  ethicalAlternatives: z.string().optional(),
}).superRefine((data, ctx) => {
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
  const hasEnvironmentalCerts = (data.environmentalCertifications?.length || 0) > 0
  if (hasEnvironmentalCerts && docsCount === 0) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ['certificationDocuments'],
      message: 'Adjunta evidencia de tus certificaciones ambientales.'
    })
  }

  // ✅ Nueva regla: Evitar conflictos en políticas animales
  if (data.animalTestingPolicy === "NO_TESTING" && 
      data.animalOriginUse === "CONVENTIONAL_ANIMAL_PRODUCTS") {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ['animalTestingPolicy'],
      message: 'No puedes tener "No testing" con productos animales convencionales.'
    })
  }
})

export type VendorOnboardingValues = z.infer<typeof VendorOnboardingSchema>