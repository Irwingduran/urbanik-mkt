import { z } from "zod"

export const CreateProductSchema = z.object({
  name: z.string().min(2, "Nombre demasiado corto"),
  description: z.string().min(10, "Descripción demasiado corta"),
  price: z.union([z.string(), z.number()]).transform(v => typeof v === 'string' ? parseFloat(v) : v).refine(v => !Number.isNaN(v) && v > 0, 'Precio inválido'),
  originalPrice: z.union([z.string(), z.number()]).optional().transform(v => {
    if (v === undefined || v === "") return undefined;
    return typeof v === 'string' ? parseFloat(v) : v;
  }),
  sku: z.string().min(3, "SKU inválido"),
  category: z.string().min(2, "Categoría requerida"),
  images: z.array(z.string()).optional(),
  stock: z.union([z.string(), z.number()]).transform(v => {
    const n = Number(v);
    return Number.isNaN(n) || n < 0 ? 0 : Math.round(n);
  }),
  minStock: z.union([z.string(), z.number(), z.null(), z.undefined()]).optional().transform(v => {
    if (v === undefined || v === null || v === "") return 5;
    const n = Number(v);
    return Number.isNaN(n) || n < 0 ? 5 : Math.round(n);
  }),
  certifications: z.array(z.string()).optional(),
  co2Reduction: z.union([z.string(), z.number(), z.null(), z.undefined()]).optional().transform(v => {
    if (v === undefined || v === null || v === "") return 0;
    const n = Number(v);
    return Number.isNaN(n) ? 0 : n;
  }),
  waterSaving: z.union([z.string(), z.number(), z.null(), z.undefined()]).optional().transform(v => {
    if (v === undefined || v === null || v === "") return 0;
    const n = Number(v);
    return Number.isNaN(n) ? 0 : n;
  }),
  energyEfficiency: z.union([z.string(), z.number(), z.null(), z.undefined()]).optional().transform(v => {
    if (v === undefined || v === null || v === "") return 0;
    const n = Number(v);
    return Number.isNaN(n) ? 0 : n;
  }),
})

export type CreateProductInput = z.infer<typeof CreateProductSchema>
