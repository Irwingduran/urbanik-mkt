"use client"

import { useEffect } from 'react'
import { X, Plus, Minus, ShoppingBag, Truck, Shield, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useAppDispatch, useAppSelector } from '@/src/shared/store/hooks'
import {
  selectCartItems,
  selectCartTotal,
  selectCartCount,
  selectCartOpen,
  setCartOpen,
  updateQuantity,
  removeItem,
  clearCart
} from '@/src/shared/store/slices/cartSlice'

export function CartSidebar() {
  const dispatch = useAppDispatch()
  const cartItems = useAppSelector(selectCartItems)
  const cartTotal = useAppSelector(selectCartTotal)
  const cartCount = useAppSelector(selectCartCount)
  const isOpen = useAppSelector(selectCartOpen)

  const handleClose = () => {
    dispatch(setCartOpen(false))
  }

  const handleUpdateQuantity = (productId: string, quantity: number) => {
    dispatch(updateQuantity({ productId, quantity }))
  }

  const handleRemoveItem = (productId: string) => {
    dispatch(removeItem(productId))
  }

  const handleClearCart = () => {
    dispatch(clearCart())
  }

  const handleCheckout = () => {
    // Close sidebar and navigate to checkout
    dispatch(setCartOpen(false))
    // Use window.location for navigation since this component might not have router access
    window.location.href = '/checkout'
  }

  // Close on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleClose()
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity"
        onClick={handleClose}
      />

      {/* Sidebar */}
      <div className="fixed inset-y-0 right-0 z-50 w-full max-w-md">
        <div className="flex h-full flex-col bg-white shadow-xl">
          {/* Header */}
          <div className="px-4 py-6 sm:px-6">
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100">
                  <ShoppingBag className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <h2 className="text-lg font-medium text-gray-900">
                    Carrito de Compras
                  </h2>
                  <p className="text-sm text-gray-500">
                    {cartCount} {cartCount === 1 ? 'producto' : 'productos'}
                  </p>
                </div>
              </div>
              <div className="ml-3 flex h-7 items-center">
                <button
                  type="button"
                  className="relative -m-2 p-2 text-gray-400 hover:text-gray-500"
                  onClick={handleClose}
                >
                  <span className="sr-only">Close panel</span>
                  <X className="h-6 w-6" aria-hidden="true" />
                </button>
              </div>
            </div>
          </div>

          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto px-4 sm:px-6">
            {cartItems.length === 0 ? (
              <div className="text-center py-12">
                <ShoppingBag className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">
                  Tu carrito está vacío
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  Agrega productos sostenibles para comenzar tu compra.
                </p>
                <div className="mt-6">
                  <Button
                    onClick={handleClose}
                    className="bg-green-600 hover:bg-green-700 text-white"
                  >
                    Continuar Comprando
                  </Button>
                </div>
              </div>
            ) : (
              <ul role="list" className="divide-y divide-gray-200">
                {cartItems.map((item) => (
                  <li key={item.productId} className="flex py-6">
                    <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                      <img
                        src={item.image || '/placeholder.svg'}
                        alt={item.name}
                        className="h-full w-full object-cover object-center"
                      />
                    </div>

                    <div className="ml-4 flex flex-1 flex-col">
                      <div>
                        <div className="flex justify-between text-base font-medium text-gray-900">
                          <h3 className="text-sm">{item.name}</h3>
                          <p className="ml-4 text-sm font-semibold">
                            ${(item.price * item.quantity).toFixed(2)}
                          </p>
                        </div>
                        <p className="mt-1 text-xs text-gray-500">{item.vendorName}</p>
                      </div>
                      <div className="flex flex-1 items-end justify-between text-sm">
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-7 w-7 p-0"
                            onClick={() => handleUpdateQuantity(item.productId, item.quantity - 1)}
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="text-gray-700 min-w-[2rem] text-center">
                            {item.quantity}
                          </span>
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-7 w-7 p-0"
                            onClick={() => handleUpdateQuantity(item.productId, item.quantity + 1)}
                            disabled={item.quantity >= item.maxStock}
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>

                        <div className="flex">
                          <button
                            type="button"
                            className="font-medium text-red-600 hover:text-red-500 text-sm"
                            onClick={() => handleRemoveItem(item.productId)}
                          >
                            Eliminar
                          </button>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Footer */}
          {cartItems.length > 0 && (
            <div className="border-t border-gray-200 px-4 py-6 sm:px-6">
              {/* Sustainability Impact */}
              <div className="mb-6 rounded-lg bg-green-50 p-4">
                <h4 className="text-sm font-medium text-green-900 mb-2">
                  🌱 Impacto de tu Compra
                </h4>
                <div className="grid grid-cols-2 gap-2 text-xs text-green-700">
                  <div className="flex items-center space-x-1">
                    <Shield className="h-3 w-3" />
                    <span>Productos verificados</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Truck className="h-3 w-3" />
                    <span>Envío carbono neutral</span>
                  </div>
                </div>
              </div>

              {/* Order Summary */}
              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Subtotal</span>
                  <span>${cartTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Envío</span>
                  <span className="text-green-600">Gratis</span>
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Impuestos</span>
                  <span>${(cartTotal * 0.16).toFixed(2)}</span>
                </div>
                <div className="border-t border-gray-200 pt-2">
                  <div className="flex justify-between text-base font-medium text-gray-900">
                    <span>Total</span>
                    <span>${(cartTotal * 1.16).toFixed(2)} MXN</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <Button
                  onClick={handleCheckout}
                  className="w-full bg-green-600 hover:bg-green-700 text-white py-3"
                >
                  Proceder al Checkout
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>

                <div className="flex space-x-3">
                  <Button
                    variant="outline"
                    onClick={handleClose}
                    className="flex-1"
                  >
                    Continuar Comprando
                  </Button>
                  <Button
                    variant="outline"
                    onClick={handleClearCart}
                    className="text-red-600 border-red-200 hover:bg-red-50"
                  >
                    Limpiar Carrito
                  </Button>
                </div>
              </div>

              {/* Security Badge */}
              <div className="mt-4 flex items-center justify-center space-x-2 text-xs text-gray-500">
                <Shield className="h-4 w-4 text-green-500" />
                <span>Compra 100% segura y verificada</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}