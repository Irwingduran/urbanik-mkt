// UI state slice for global UI state management

import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface UIState {
  theme: 'light' | 'dark'
  sidebarOpen: boolean
  loading: {
    global: boolean
    [key: string]: boolean
  }
  notifications: Notification[]
  modal: {
    isOpen: boolean
    type: string | null
    props: Record<string, any> | null
  }
}

interface Notification {
  id: string
  type: 'success' | 'error' | 'warning' | 'info'
  title: string
  message?: string
  duration?: number
  persistent?: boolean
  createdAt: number
}

const initialState: UIState = {
  theme: 'light',
  sidebarOpen: false,
  loading: {
    global: false,
  },
  notifications: [],
  modal: {
    isOpen: false,
    type: null,
    props: null,
  },
}

export const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setTheme: (state, action: PayloadAction<'light' | 'dark'>) => {
      state.theme = action.payload
    },

    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen
    },

    setSidebarOpen: (state, action: PayloadAction<boolean>) => {
      state.sidebarOpen = action.payload
    },

    setLoading: (state, action: PayloadAction<{ key: string; isLoading: boolean }>) => {
      const { key, isLoading } = action.payload
      state.loading[key] = isLoading
    },

    setGlobalLoading: (state, action: PayloadAction<boolean>) => {
      state.loading.global = action.payload
    },

    addNotification: (state, action: PayloadAction<Omit<Notification, 'id' | 'createdAt'>>) => {
      const notification: Notification = {
        ...action.payload,
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        createdAt: Date.now(),
      }
      state.notifications.unshift(notification)
    },

    removeNotification: (state, action: PayloadAction<string>) => {
      state.notifications = state.notifications.filter(
        notification => notification.id !== action.payload
      )
    },

    clearNotifications: (state) => {
      state.notifications = []
    },

    openModal: (state, action: PayloadAction<{ type: string; props?: Record<string, any> }>) => {
      state.modal.isOpen = true
      state.modal.type = action.payload.type
      state.modal.props = action.payload.props || null
    },

    closeModal: (state) => {
      state.modal.isOpen = false
      state.modal.type = null
      state.modal.props = null
    },
  },
})

export const {
  setTheme,
  toggleSidebar,
  setSidebarOpen,
  setLoading,
  setGlobalLoading,
  addNotification,
  removeNotification,
  clearNotifications,
  openModal,
  closeModal,
} = uiSlice.actions

// Selectors
export const selectTheme = (state: { ui: UIState }) => state.ui.theme
export const selectSidebarOpen = (state: { ui: UIState }) => state.ui.sidebarOpen
export const selectLoading = (key: string) => (state: { ui: UIState }) => state.ui.loading[key] || false
export const selectGlobalLoading = (state: { ui: UIState }) => state.ui.loading.global
export const selectNotifications = (state: { ui: UIState }) => state.ui.notifications
export const selectModal = (state: { ui: UIState }) => state.ui.modal