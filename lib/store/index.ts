// Redux store configuration with Redux Toolkit 2.2.7

import { configureStore } from '@reduxjs/toolkit'
import { setupListeners } from '@reduxjs/toolkit/query'
import { authSlice } from './slices/authSlice'
import { cartSlice } from './slices/cartSlice'
import { uiSlice } from './slices/uiSlice'
import { apiSlice } from './api/apiSlice'

export const store = configureStore({
  reducer: {
    auth: authSlice.reducer,
    cart: cartSlice.reducer,
    ui: uiSlice.reducer,
    api: apiSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }).concat(apiSlice.middleware),
  devTools: process.env.NODE_ENV !== 'production',
})

// Setup RTK Query listeners for refetchOnFocus/refetchOnReconnect
setupListeners(store.dispatch)

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

// Typed hooks for React components
export { useAppDispatch, useAppSelector } from './hooks'