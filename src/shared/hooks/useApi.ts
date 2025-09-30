// Reusable API hook with loading states and error handling
// @ts-nocheck

import { useState, useCallback } from 'react'
import { ApiResponse, ApiError, LoadingState } from '../types/api.types'
import { handleApiError } from '../services/apiClient'

export interface UseApiOptions<T> {
  onSuccess?: (data: T) => void
  onError?: (error: string) => void
  transform?: (data: any) => T
}

export function useApi<T>() {
  const [state, setState] = useState<LoadingState & { data?: T }>({
    isLoading: false,
    isError: false,
    error: undefined,
    data: undefined,
  })

  const execute = useCallback(
    async <R>(
      apiCall: () => Promise<ApiResponse<R>>,
      options?: UseApiOptions<R>
    ) => {
      setState(prev => ({
        ...prev,
        isLoading: true,
        isError: false,
        error: undefined,
      }))

      try {
        const response = await apiCall()

        if (!response.success) {
          throw {
            message: response.error || 'Request failed',
            code: 'API_ERROR',
          } as ApiError
        }

        const transformedData = options?.transform
          ? options.transform(response.data)
          : response.data

        setState({
          isLoading: false,
          isError: false,
          error: undefined,
          data: transformedData as T,
        })

        options?.onSuccess?.(transformedData as R)
        return transformedData
      } catch (error) {
        const apiError = error as ApiError
        const errorMessage = handleApiError(apiError)

        setState({
          isLoading: false,
          isError: true,
          error: apiError,
          data: undefined,
        })

        options?.onError?.(errorMessage)
        throw error
      }
    },
    []
  )

  const reset = useCallback(() => {
    setState({
      isLoading: false,
      isError: false,
      error: undefined,
      data: undefined,
    })
  }, [])

  return {
    ...state,
    execute,
    reset,
  }
}

// Specialized hook for paginated data
export function usePaginatedApi<T>() {
  const [state, setState] = useState<
    LoadingState & {
      data: T[]
      meta?: {
        total: number
        page: number
        limit: number
        totalPages: number
        hasNext: boolean
        hasPrev: boolean
      }
    }
  >({
    isLoading: false,
    isError: false,
    error: undefined,
    data: [],
    meta: undefined,
  })

  const execute = useCallback(
    async <R>(
      apiCall: () => Promise<ApiResponse<{ data: R[]; meta: any }>>,
      options?: UseApiOptions<R[]> & { append?: boolean }
    ) => {
      setState(prev => ({
        ...prev,
        isLoading: true,
        isError: false,
        error: undefined,
      }))

      try {
        const response = await apiCall()

        if (!response.success || !response.data) {
          throw {
            message: response.error || 'Request failed',
            code: 'API_ERROR',
          } as ApiError
        }

        const { data, meta } = response.data
        const transformedData = options?.transform
          ? options.transform(data)
          : data

        setState(prev => ({
          isLoading: false,
          isError: false,
          error: undefined,
          data: options?.append
            ? [...prev.data, ...(transformedData as T[])]
            : (transformedData as T[]),
          meta,
        }))

        options?.onSuccess?.(transformedData as R[])
        return { data: transformedData, meta }
      } catch (error) {
        const apiError = error as ApiError
        const errorMessage = handleApiError(apiError)

        setState(prev => ({
          ...prev,
          isLoading: false,
          isError: true,
          error: apiError,
        }))

        options?.onError?.(errorMessage)
        throw error
      }
    },
    []
  )

  const reset = useCallback(() => {
    setState({
      isLoading: false,
      isError: false,
      error: undefined,
      data: [],
      meta: undefined,
    })
  }, [])

  return {
    ...state,
    execute,
    reset,
  }
}

// Hook for optimistic updates
export function useOptimisticApi<T>() {
  const [state, setState] = useState<LoadingState & { data?: T }>({
    isLoading: false,
    isError: false,
    error: undefined,
    data: undefined,
  })

  const executeOptimistic = useCallback(
    async <R>(
      optimisticData: R,
      apiCall: () => Promise<ApiResponse<R>>,
      options?: UseApiOptions<R>
    ) => {
      // Immediately update with optimistic data
      setState(prev => ({
        ...prev,
        data: optimisticData,
        isLoading: true,
        isError: false,
        error: undefined,
      }))

      try {
        const response = await apiCall()

        if (!response.success) {
          throw {
            message: response.error || 'Request failed',
            code: 'API_ERROR',
          } as ApiError
        }

        const transformedData = options?.transform
          ? options.transform(response.data)
          : response.data

        setState({
          isLoading: false,
          isError: false,
          error: undefined,
          data: transformedData as T,
        })

        options?.onSuccess?.(transformedData as R)
        return transformedData
      } catch (error) {
        const apiError = error as ApiError
        const errorMessage = handleApiError(apiError)

        // Revert optimistic update on error
        setState({
          isLoading: false,
          isError: true,
          error: apiError,
          data: undefined,
        })

        options?.onError?.(errorMessage)
        throw error
      }
    },
    []
  )

  return {
    ...state,
    executeOptimistic,
  }
}