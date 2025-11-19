import { z } from 'zod'

export const ProductMetricsSchema = z.object({
  co2Reduction: z.number().nonnegative().default(0),
  waterSaving: z.number().nonnegative().default(0),
  energyEfficiency: z.number().nonnegative().default(0)
}).partial()

export const ProductDimensionsSchema = z.object({
  length: z.number().positive().optional(),
  width: z.number().positive().optional(),
  height: z.number().positive().optional(),
  weight: z.number().positive().optional(),
  unit: z.string().optional()
})

export const ProductCreateSchema = z.object({
  name: z.string().min(2),
  description: z.string().min(10),
  price: z.number().positive(),
  sku: z.string().min(3),
  category: z.string().min(2),
  subcategory: z.string().optional(),
  images: z.array(z.string().url()).default([]),
  stock: z.number().int().nonnegative().default(0),
  maxOrderQuantity: z.number().int().positive().default(1),
  certifications: z.array(z.string()).default([]),
  metrics: ProductMetricsSchema.optional(),
  dimensions: ProductDimensionsSchema.optional(),
  materials: z.array(z.string()).optional(),
  origin: z.string().optional(),
  featured: z.boolean().default(false)
})

export const ProductUpdateSchema = ProductCreateSchema.partial()

export type ProductCreateInput = z.infer<typeof ProductCreateSchema>
export type ProductUpdateInput = z.infer<typeof ProductUpdateSchema>
