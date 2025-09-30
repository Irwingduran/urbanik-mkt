// Shopping cart state slice

import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface CartItem {
  productId: string
  name: string
  price: number
  quantity: number
  image: string
  vendorId: string
  vendorName: string
  maxStock: number
}

interface CartState {
  items: CartItem[]
  totalItems: number
  totalPrice: number
  isOpen: boolean
}

const initialState: CartState = {
  items: [],
  totalItems: 0,
  totalPrice: 0,
  isOpen: false,
}

const calculateTotals = (items: CartItem[]) => {
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0)
  const totalPrice = items.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  return { totalItems, totalPrice }
}

export const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addItem: (state, action: PayloadAction<Omit<CartItem, 'quantity'> & { quantity?: number }>) => {
      const { quantity = 1, ...product } = action.payload
      const existingItem = state.items.find(item => item.productId === product.productId)

      if (existingItem) {
        const newQuantity = Math.min(existingItem.quantity + quantity, existingItem.maxStock)
        existingItem.quantity = newQuantity
      } else {
        state.items.push({ ...product, quantity: Math.min(quantity, product.maxStock) })
      }

      const totals = calculateTotals(state.items)
      state.totalItems = totals.totalItems
      state.totalPrice = totals.totalPrice
    },

    removeItem: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(item => item.productId !== action.payload)
      const totals = calculateTotals(state.items)
      state.totalItems = totals.totalItems
      state.totalPrice = totals.totalPrice
    },

    updateQuantity: (state, action: PayloadAction<{ productId: string; quantity: number }>) => {
      const { productId, quantity } = action.payload
      const item = state.items.find(item => item.productId === productId)

      if (item) {
        if (quantity <= 0) {
          state.items = state.items.filter(item => item.productId !== productId)
        } else {
          item.quantity = Math.min(quantity, item.maxStock)
        }
      }

      const totals = calculateTotals(state.items)
      state.totalItems = totals.totalItems
      state.totalPrice = totals.totalPrice
    },

    clearCart: (state) => {
      state.items = []
      state.totalItems = 0
      state.totalPrice = 0
    },

    toggleCart: (state) => {
      state.isOpen = !state.isOpen
    },

    setCartOpen: (state, action: PayloadAction<boolean>) => {
      state.isOpen = action.payload
    },
  },
})

export const {
  addItem,
  removeItem,
  updateQuantity,
  clearCart,
  toggleCart,
  setCartOpen
} = cartSlice.actions

// Selectors
export const selectCartItems = (state: { cart: CartState }) => state.cart.items
export const selectCartTotal = (state: { cart: CartState }) => state.cart.totalPrice
export const selectCartCount = (state: { cart: CartState }) => state.cart.totalItems
export const selectCartOpen = (state: { cart: CartState }) => state.cart.isOpen
export const selectCartItemByProductId = (productId: string) =>
  (state: { cart: CartState }) => state.cart.items.find(item => item.productId === productId)