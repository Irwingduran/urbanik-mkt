// Centralized API client with error handling and interceptors

import { ApiResponse, ApiError } from '../types/api.types'

export class ApiClient {
  private baseURL: string
  private defaultHeaders: Record<string, string>

  constructor() {
    this.baseURL = process.env.NEXT_PUBLIC_API_URL || ''
    this.defaultHeaders = {
      'Content-Type': 'application/json',
    }
  }

  // Generic request method
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const url = `${this.baseURL}${endpoint}`

      const response = await fetch(url, {
        ...options,
        headers: {
          ...this.defaultHeaders,
          ...options.headers,
        },
      })

      const data = await response.json()

      if (!response.ok) {
        throw {
          message: data.error || 'Request failed',
          statusCode: response.status,
          code: data.code,
        } as ApiError
      }

      return data
    } catch (error) {
      if (error instanceof TypeError) {
        // Network error
        throw {
          message: 'Network error. Please check your connection.',
          statusCode: 0,
          code: 'NETWORK_ERROR',
        } as ApiError
      }

      throw error as ApiError
    }
  }

  // HTTP methods
  async get<T>(endpoint: string, params?: Record<string, any>): Promise<ApiResponse<T>> {
    const queryString = params
      ? '?' + new URLSearchParams(
          Object.entries(params).reduce((acc, [key, value]) => {
            if (value !== undefined && value !== null) {
              acc[key] = String(value)
            }
            return acc
          }, {} as Record<string, string>)
        ).toString()
      : ''

    return this.request<T>(`${endpoint}${queryString}`)
  }

  async post<T>(endpoint: string, body?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: body ? JSON.stringify(body) : undefined,
    })
  }

  async put<T>(endpoint: string, body?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: body ? JSON.stringify(body) : undefined,
    })
  }

  async patch<T>(endpoint: string, body?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PATCH',
      body: body ? JSON.stringify(body) : undefined,
    })
  }

  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'DELETE',
    })
  }

  // File upload method
  async upload<T>(endpoint: string, file: File, additionalFields?: Record<string, any>): Promise<ApiResponse<T>> {
    const formData = new FormData()
    formData.append('file', file)

    if (additionalFields) {
      Object.entries(additionalFields).forEach(([key, value]) => {
        formData.append(key, String(value))
      })
    }

    return this.request<T>(endpoint, {
      method: 'POST',
      body: formData,
      headers: {
        // Don't set Content-Type for FormData - browser will set it with boundary
      },
    })
  }

  // Set authorization header (for authenticated requests)
  setAuthToken(token: string) {
    this.defaultHeaders.Authorization = `Bearer ${token}`
  }

  // Remove authorization header
  clearAuthToken() {
    delete this.defaultHeaders.Authorization
  }
}

// Create singleton instance
export const apiClient = new ApiClient()

// Utility function for handling API errors in components
export const handleApiError = (error: ApiError): string => {
  switch (error.code) {
    case 'NETWORK_ERROR':
      return 'Network error. Please check your connection and try again.'
    case 'VALIDATION_ERROR':
      return error.field
        ? `${error.field}: ${error.message}`
        : error.message
    case 'UNAUTHORIZED':
      return 'You are not authorized to perform this action.'
    case 'NOT_FOUND':
      return 'The requested resource was not found.'
    default:
      return error.message || 'An unexpected error occurred.'
  }
}

// Type-safe API response handler
export const unwrapApiResponse = <T>(response: ApiResponse<T>): T => {
  if (!response.success || !response.data) {
    throw new Error(response.error || 'Invalid API response')
  }
  return response.data
}