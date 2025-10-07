// Authentication state slice

import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Role } from '@prisma/client'

interface User {
  id: string
  email: string
  name?: string
  role: Role
  companyName?: string
  memberSince?: string
}

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
}

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload
      state.isAuthenticated = true
      state.isLoading = false
      state.error = null
    },
    clearUser: (state) => {
      state.user = null
      state.isAuthenticated = false
      state.isLoading = false
      state.error = null
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload
      state.isLoading = false
    },
  },
})

export const { setUser, clearUser, setLoading, setError } = authSlice.actions

// Selectors
export const selectUser = (state: { auth: AuthState }) => state.auth.user
export const selectIsAuthenticated = (state: { auth: AuthState }) => state.auth.isAuthenticated
export const selectAuthLoading = (state: { auth: AuthState }) => state.auth.isLoading
export const selectAuthError = (state: { auth: AuthState }) => state.auth.error