// Shared API types for consistent interface across features

export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface PaginatedResponse<T> {
  data: T[]
  meta: {
    total: number
    page: number
    limit: number
    totalPages: number
    hasNext: boolean
    hasPrev: boolean
  }
}

export interface PaginationParams {
  page?: number
  limit?: number
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

export interface FilterParams {
  search?: string
  category?: string
  status?: string
  [key: string]: any
}

// Common request/response patterns
export interface CreateRequest<T> {
  data: Partial<T>
}

export interface UpdateRequest<T> {
  id: string
  data: Partial<T>
}

export interface DeleteRequest {
  id: string
}

// Error handling
export interface ApiError {
  message: string
  code?: string
  statusCode?: number
  field?: string
}

// Loading states
export interface LoadingState {
  isLoading: boolean
  isError: boolean
  error?: ApiError
}

// Common data structures
export interface BaseEntity {
  id: string
  createdAt: string
  updatedAt: string
}

export interface User extends BaseEntity {
  email: string
  name?: string
  role: 'USER' | 'VENDOR' | 'ADMIN'
  image?: string
}

export interface Product extends BaseEntity {
  name: string
  description: string
  price: number
  originalPrice?: number
  images: string[]
  category: string
  vendorId: string
  vendor?: {
    id: string
    companyName: string
    user: { name?: string }
  }
  regenScore: number
  certifications: string[]
  stock: number
  inStock: boolean
  featured: boolean
  active: boolean
  co2Reduction: number
  waterSaving: number
  energyEfficiency: number
  averageRating?: number
  reviewCount?: number
  totalSold?: number
  isInWishlist?: boolean
}

export interface Order extends BaseEntity {
  userId: string
  vendorId: string
  status: 'PENDING' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED' | 'RETURNED'
  paymentStatus: 'PENDING' | 'PAID' | 'FAILED' | 'REFUNDED'
  total: number
  subtotal: number
  tax: number
  shipping: number
  shippingAddress: any
  trackingNumber?: string
  estimatedDelivery?: string
  actualDelivery?: string
  vendor?: {
    id: string
    companyName: string
    user: { name?: string }
  }
  items: OrderItem[]
  environmentalImpact?: {
    co2Saved: number
    waterSaved: number
    energyGenerated: number
  }
}

export interface OrderItem extends BaseEntity {
  orderId: string
  productId: string
  quantity: number
  price: number
  total: number
  product?: {
    id: string
    name: string
    images: string[]
    regenScore: number
  }
}

export interface DashboardStats {
  [key: string]: number | string
}

// Role-based permissions
export type UserRole = 'USER' | 'VENDOR' | 'ADMIN'

export interface RolePermissions {
  canView: string[]
  canCreate: string[]
  canUpdate: string[]
  canDelete: string[]
}