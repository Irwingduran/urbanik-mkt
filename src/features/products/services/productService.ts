// Product feature service layer

import { apiClient } from '@/src/shared/services/apiClient'
import { ApiResponse, PaginatedResponse, PaginationParams } from '@/src/shared/types/api.types'
import { Product } from '@/src/shared/types/api.types'

export interface ProductFilters {
  category?: string
  search?: string
  minPrice?: number
  maxPrice?: number
  minRegenScore?: number
  certifications?: string[]
  inStockOnly?: boolean
  featuredOnly?: boolean
}

export interface ProductSearchParams extends PaginationParams, ProductFilters {
  sortBy?: 'price' | 'regenScore' | 'name' | 'popularity' | 'createdAt'
}

export class ProductService {
  // Browse products (public endpoint)
  async browseProducts(params: ProductSearchParams = {}): Promise<ApiResponse<PaginatedResponse<Product>>> {
    const queryParams = {
      page: params.page || 1,
      limit: params.limit || 20,
      sortBy: params.sortBy || 'createdAt',
      sortOrder: params.sortOrder || 'desc',
      ...(params.category && { category: params.category }),
      ...(params.search && { search: params.search }),
      ...(params.minPrice && { minPrice: params.minPrice }),
      ...(params.maxPrice && { maxPrice: params.maxPrice }),
      ...(params.minRegenScore && { minRegenScore: params.minRegenScore }),
      ...(params.certifications?.length && { certifications: params.certifications.join(',') }),
      ...(params.inStockOnly && { inStockOnly: params.inStockOnly }),
      ...(params.featuredOnly && { featuredOnly: params.featuredOnly }),
    }

    return apiClient.get<PaginatedResponse<Product>>('/api/user/products', queryParams)
  }

  // Get single product by ID
  async getProduct(id: string): Promise<ApiResponse<Product>> {
    return apiClient.get<Product>(`/api/user/products/${id}`)
  }

  // Add to wishlist
  async addToWishlist(productId: string): Promise<ApiResponse<{ success: boolean }>> {
    return apiClient.post<{ success: boolean }>('/api/user/wishlist', { productId })
  }

  // Remove from wishlist
  async removeFromWishlist(productId: string): Promise<ApiResponse<{ success: boolean }>> {
    return apiClient.delete<{ success: boolean }>(`/api/user/wishlist/${productId}`)
  }

  // Get user's wishlist
  async getWishlist(params: PaginationParams = {}): Promise<ApiResponse<PaginatedResponse<Product>>> {
    return apiClient.get<PaginatedResponse<Product>>('/api/user/wishlist', params)
  }

  // Vendor-specific methods
  async getVendorProducts(params: ProductSearchParams = {}): Promise<ApiResponse<PaginatedResponse<Product>>> {
    return apiClient.get<PaginatedResponse<Product>>('/api/vendor/products', params)
  }

  async createProduct(productData: Partial<Product>): Promise<ApiResponse<Product>> {
    return apiClient.post<Product>('/api/vendor/products', productData)
  }

  async updateProduct(id: string, productData: Partial<Product>): Promise<ApiResponse<Product>> {
    return apiClient.put<Product>(`/api/vendor/products/${id}`, productData)
  }

  async deleteProduct(id: string): Promise<ApiResponse<{ success: boolean }>> {
    return apiClient.delete<{ success: boolean }>(`/api/vendor/products/${id}`)
  }

  // Upload product images
  async uploadProductImage(file: File): Promise<ApiResponse<{ url: string }>> {
    return apiClient.upload<{ url: string }>('/api/upload/products', file)
  }

  // Get product categories
  async getCategories(): Promise<ApiResponse<string[]>> {
    return apiClient.get<string[]>('/api/products/categories')
  }

  // Get available certifications
  async getCertifications(): Promise<ApiResponse<string[]>> {
    return apiClient.get<string[]>('/api/products/certifications')
  }

  // Search suggestions
  async getSearchSuggestions(query: string): Promise<ApiResponse<string[]>> {
    return apiClient.get<string[]>('/api/products/search-suggestions', { q: query })
  }
}

// Create singleton instance
export const productService = new ProductService()