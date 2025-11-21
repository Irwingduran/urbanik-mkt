import { z } from "zod"

export const CreateProductSchema = z.object({
  name: z.string().min(2, "Nombre demasiado corto"),
  description: z.string().min(10, "Descripción demasiado corta"),
  price: z.union([z.string(), z.number()]).transform(v => typeof v === 'string' ? parseFloat(v) : v).refine(v => !Number.isNaN(v) && v > 0, 'Precio inválido'),
  originalPrice: z.union([z.string(), z.number()]).optional().transform(v => v === undefined ? undefined : (typeof v === 'string' ? parseFloat(v) : v)),
  sku: z.string().min(3, "SKU inválido"),
  category: z.string().min(2, "Categoría requerida"),
  images: z.array(z.string()).optional(),
  stock: z.union([z.string(), z.number()]).transform(v => typeof v === 'string' ? parseInt(v) : v).refine(v => !Number.isNaN(v) && v >= 0, 'Stock inválido'),
  minStock: z.union([z.string(), z.number()]).optional().transform(v => v === undefined ? 5 : (typeof v === 'string' ? parseInt(v) : v)).refine(v => !Number.isNaN(v) && v >= 0, 'minStock inválido'),
  certifications: z.array(z.string()).optional(),
  co2Reduction: z.union([z.string(), z.number()]).optional().transform(v => v === undefined ? 0 : (typeof v === 'string' ? parseFloat(v) : v)).refine(v => !Number.isNaN(v), 'co2Reduction inválido'),
  waterSaving: z.union([z.string(), z.number()]).optional().transform(v => v === undefined ? 0 : (typeof v === 'string' ? parseFloat(v) : v)).refine(v => !Number.isNaN(v), 'waterSaving inválido'),
  energyEfficiency: z.union([z.string(), z.number()]).optional().transform(v => v === undefined ? 0 : (typeof v === 'string' ? parseFloat(v) : v)).refine(v => !Number.isNaN(v), 'energyEfficiency inválido'),
})

export type CreateProductInput = z.infer<typeof CreateProductSchema>
