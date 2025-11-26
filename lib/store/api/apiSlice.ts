// RTK Query API slice for data fetching

import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import type { BaseQueryFn, FetchArgs, FetchBaseQueryError } from '@reduxjs/toolkit/query'

// Base query with authentication
const baseQuery = fetchBaseQuery({
  baseUrl: '/api',
  prepareHeaders: (headers) => {
    // You can add auth token here if needed
    // const token = (getState() as RootState).auth.token
    // if (token) {
    //   headers.set('authorization', `Bearer ${token}`)
    // }
    return headers
  },
})

// Base query with retry logic
const baseQueryWithRetry: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  const result = await baseQuery(args, api, extraOptions)

  if (result.error && result.error.status === 401) {
    // Handle authentication errors
    // You can dispatch logout action here
  }

  return result
}

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: baseQueryWithRetry,
  tagTypes: ['Product', 'User', 'Order', 'Cart', 'Vendor'],
  endpoints: (builder) => ({
    // Products endpoints
    getProducts: builder.query({
      query: (params = {}) => ({
        url: '/user/products',
        params,
      }),
      providesTags: ['Product'],
    }),

    getProduct: builder.query({
      query: (id) => `/products/${id}`,
      providesTags: (result, error, id) => [{ type: 'Product', id }],
    }),

    // User endpoints
    getCurrentUser: builder.query({
      query: () => '/user/profile',
      providesTags: ['User'],
    }),

    updateProfile: builder.mutation({
      query: (data) => ({
        url: '/user/profile',
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['User'],
    }),

    // Orders endpoints
    getOrders: builder.query({
      query: (params = {}) => ({
        url: '/user/orders',
        params,
      }),
      providesTags: ['Order'],
    }),

    createOrder: builder.mutation({
      query: (orderData) => ({
        url: '/user/orders',
        method: 'POST',
        body: orderData,
      }),
      invalidatesTags: ['Order', 'Cart'],
    }),

    // Wishlist endpoints
    getWishlist: builder.query({
      query: () => '/user/wishlist',
      providesTags: ['User'],
    }),

    addToWishlist: builder.mutation({
      query: (productId) => ({
        url: '/user/wishlist',
        method: 'POST',
        body: { productId },
      }),
      invalidatesTags: ['User', 'Product'],
    }),

    removeFromWishlist: builder.mutation({
      query: (productId) => ({
        url: `/user/wishlist/${productId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['User', 'Product'],
    }),
  }),
})

// Export hooks for usage in functional components
export const {
  useGetProductsQuery,
  useGetProductQuery,
  useGetCurrentUserQuery,
  useUpdateProfileMutation,
  useGetOrdersQuery,
  useCreateOrderMutation,
  useGetWishlistQuery,
  useAddToWishlistMutation,
  useRemoveFromWishlistMutation,
} = apiSlice