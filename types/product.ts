// Shared Product types for frontend/domain usage (not Prisma model typings)
// Keep minimal and stable across API transformations.
export interface ProductDimensions {
  length?: number
  width?: number
  height?: number
  weight?: number
  unit?: string // e.g., cm, kg
}

export interface ProductMetricsSummary {
  co2Reduction?: number
  waterSaving?: number
  energyEfficiency?: number
}

export interface ProductDTO {
  id: string
  vendorUserId: string
  name: string
  description: string
  price: number
  originalPrice?: number
  sku: string
  category: string
  subcategory?: string
  images: string[]
  stock: number
  minStock?: number
  maxOrderQuantity?: number
  inStock: boolean
  regenScore: number
  certifications: string[]
  metrics?: ProductMetricsSummary
  dimensions?: ProductDimensions | null
  materials?: string[]
  origin?: string | null
  nfts?: unknown[]
  featured: boolean
  active: boolean
  views?: number
  salesCount?: number
  averageRating?: number
  reviewCount?: number
  createdAt: string
  updatedAt: string
}

export type ProductListItem = Pick<ProductDTO,
  | 'id' | 'name' | 'price' | 'originalPrice' | 'images' | 'category' | 'regenScore' | 'featured' | 'inStock' | 'averageRating' | 'reviewCount'
>

export interface ProductCreateInput {
  name: string
  description: string
  price: number
  sku: string
  category: string
  subcategory?: string
  images?: string[]
  stock?: number
  maxOrderQuantity?: number
  certifications?: string[]
  metrics?: ProductMetricsSummary
  dimensions?: ProductDimensions
  materials?: string[]
  origin?: string
  featured?: boolean
}
