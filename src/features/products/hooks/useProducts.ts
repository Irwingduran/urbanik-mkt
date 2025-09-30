// Product feature hooks

import { useState, useCallback, useEffect } from 'react'
import { useApi, usePaginatedApi } from '@/src/shared/hooks/useApi'
import { Product } from '@/src/shared/types/api.types'
import { productService, ProductSearchParams } from '../services/productService'

// Hook for browsing products with filters and pagination
export function useProducts(initialParams: ProductSearchParams = {}) {
  const [params, setParams] = useState<ProductSearchParams>(initialParams)
  const api = usePaginatedApi<Product>()

  const fetchProducts = useCallback(
    async (newParams?: Partial<ProductSearchParams>, append = false) => {
      const searchParams = { ...params, ...newParams }
      setParams(searchParams)

      return api.execute(
        () => productService.browseProducts(searchParams),
        { append }
      )
    },
    [params, api]
  )

  // Load more products (for infinite scroll)
  const loadMore = useCallback(() => {
    if (api.meta?.hasNext) {
      return fetchProducts({ page: (api.meta.page || 1) + 1 }, true)
    }
  }, [api.meta, fetchProducts])

  // Update filters
  const updateFilters = useCallback(
    (newFilters: Partial<ProductSearchParams>) => {
      return fetchProducts({ ...newFilters, page: 1 }, false)
    },
    [fetchProducts]
  )

  // Reset filters
  const resetFilters = useCallback(() => {
    const resetParams: ProductSearchParams = {
      page: 1,
      limit: params.limit || 20,
      sortBy: 'createdAt',
      sortOrder: 'desc',
    }
    return fetchProducts(resetParams, false)
  }, [fetchProducts, params.limit])

  // Auto-fetch on mount
  useEffect(() => {
    fetchProducts()
  }, []) // Only run once on mount

  return {
    products: api.data,
    meta: api.meta,
    isLoading: api.isLoading,
    isError: api.isError,
    error: api.error,
    params,
    fetchProducts,
    loadMore,
    updateFilters,
    resetFilters,
    refetch: () => fetchProducts(params, false),
  }
}

// Hook for single product
export function useProduct(productId: string) {
  const api = useApi<Product>()

  const fetchProduct = useCallback(async () => {
    if (!productId) return

    return api.execute(() => productService.getProduct(productId))
  }, [productId, api])

  useEffect(() => {
    fetchProduct()
  }, [fetchProduct])

  return {
    product: api.data,
    isLoading: api.isLoading,
    isError: api.isError,
    error: api.error,
    refetch: fetchProduct,
  }
}

// Hook for wishlist management
export function useWishlist() {
  const api = usePaginatedApi<Product>()
  const addApi = useApi()
  const removeApi = useApi()

  const fetchWishlist = useCallback(
    async (params = { page: 1, limit: 20 }) => {
      return api.execute(() => productService.getWishlist(params))
    },
    [api]
  )

  const addToWishlist = useCallback(
    async (productId: string) => {
      return addApi.execute(
        () => productService.addToWishlist(productId),
        {
          onSuccess: () => {
            // Optionally refetch wishlist
            fetchWishlist()
          },
        }
      )
    },
    [addApi, fetchWishlist]
  )

  const removeFromWishlist = useCallback(
    async (productId: string) => {
      return removeApi.execute(
        () => productService.removeFromWishlist(productId),
        {
          onSuccess: () => {
            // Remove from current list optimistically
            api.execute(
              async () => ({
                success: true,
                data: {
                  data: api.data.filter(p => p.id !== productId),
                  meta: api.meta || {
                    total: api.data.length - 1,
                    page: 1,
                    limit: 20,
                    totalPages: 1,
                    hasNext: false,
                    hasPrev: false,
                  },
                },
              }),
              { transform: (data: any) => data }
            )
          },
        }
      )
    },
    [removeApi, api]
  )

  useEffect(() => {
    fetchWishlist()
  }, [fetchWishlist])

  return {
    wishlist: api.data,
    meta: api.meta,
    isLoading: api.isLoading || addApi.isLoading || removeApi.isLoading,
    isError: api.isError || addApi.isError || removeApi.isError,
    error: api.error || addApi.error || removeApi.error,
    fetchWishlist,
    addToWishlist,
    removeFromWishlist,
  }
}

// Hook for vendor product management
export function useVendorProducts(initialParams: ProductSearchParams = {}) {
  const [params, setParams] = useState<ProductSearchParams>(initialParams)
  const api = usePaginatedApi<Product>()
  const createApi = useApi<Product>()
  const updateApi = useApi<Product>()
  const deleteApi = useApi()

  const fetchProducts = useCallback(
    async (newParams?: Partial<ProductSearchParams>) => {
      const searchParams = { ...params, ...newParams }
      setParams(searchParams)

      return api.execute(() => productService.getVendorProducts(searchParams))
    },
    [params, api]
  )

  const createProduct = useCallback(
    async (productData: Partial<Product>) => {
      return createApi.execute(
        () => productService.createProduct(productData),
        {
          onSuccess: () => {
            // Refetch the list
            fetchProducts()
          },
        }
      )
    },
    [createApi, fetchProducts]
  )

  const updateProduct = useCallback(
    async (id: string, productData: Partial<Product>) => {
      return updateApi.execute(
        () => productService.updateProduct(id, productData),
        {
          onSuccess: (updatedProduct) => {
            // Update the item in the list optimistically
            api.execute(
              async () => ({
                success: true,
                data: {
                  data: api.data.map(p => p.id === id ? updatedProduct : p),
                  meta: api.meta!,
                },
              }),
              { transform: (data: any) => data }
            )
          },
        }
      )
    },
    [updateApi, api]
  )

  const deleteProduct = useCallback(
    async (id: string) => {
      return deleteApi.execute(
        () => productService.deleteProduct(id),
        {
          onSuccess: () => {
            // Remove from list optimistically
            api.execute(
              async () => ({
                success: true,
                data: {
                  data: api.data.filter(p => p.id !== id),
                  meta: {
                    ...api.meta!,
                    total: api.meta!.total - 1,
                  },
                },
              }),
              { transform: (data: any) => data }
            )
          },
        }
      )
    },
    [deleteApi, api]
  )

  useEffect(() => {
    fetchProducts()
  }, [])

  return {
    products: api.data,
    meta: api.meta,
    isLoading: api.isLoading,
    isError: api.isError,
    error: api.error,
    isCreating: createApi.isLoading,
    isUpdating: updateApi.isLoading,
    isDeleting: deleteApi.isLoading,
    fetchProducts,
    createProduct,
    updateProduct,
    deleteProduct,
  }
}

// Hook for product search suggestions
export function useProductSearch() {
  const [query, setQuery] = useState('')
  const [suggestions, setSuggestions] = useState<string[]>([])
  const api = useApi<string[]>()

  const searchProducts = useCallback(
    async (searchQuery: string) => {
      setQuery(searchQuery)

      if (searchQuery.length < 2) {
        setSuggestions([])
        return
      }

      return api.execute(
        () => productService.getSearchSuggestions(searchQuery),
        {
          onSuccess: (data) => setSuggestions(data),
          onError: () => setSuggestions([]),
        }
      )
    },
    [api]
  )

  return {
    query,
    suggestions,
    isLoading: api.isLoading,
    searchProducts,
  }
}