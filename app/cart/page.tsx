"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  ShoppingCart,
  Plus,
  Minus,
  Trash2,
  ArrowLeft,
  ArrowRight,
  Leaf,
  Shield,
  Truck,
  Gift,
  AlertCircle,
  Heart
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import Header from '@/components/layout/header'
import { useAppDispatch, useAppSelector } from '@/lib/store/hooks'
import {
  selectCartItems,
  selectCartTotal,
  selectCartCount,
  updateQuantity,
  removeItem,
  clearCart
} from '@/lib/store/slices/cartSlice'

export default function CartPage() {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const cartItems = useAppSelector(selectCartItems)
  const cartTotal = useAppSelector(selectCartTotal)
  const cartCount = useAppSelector(selectCartCount)

  const [isLoading, setIsLoading] = useState(false)
  const [promoCode, setPromoCode] = useState('')
  const [promoDiscount, setPromoDiscount] = useState(0)

  // Simulated sustainability metrics based on cart
  const sustainabilityMetrics = {
    co2Reduced: Math.round(cartTotal * 0.15), // kg
    treesPlanted: Math.floor(cartTotal / 50),
    waterSaved: Math.round(cartTotal * 2.3), // liters
    plasticReduced: Math.round(cartTotal * 0.08) // kg
  }

  const subtotal = cartTotal
  const shipping = subtotal > 500 ? 0 : 99
  const taxes = subtotal * 0.16
  const discount = promoDiscount
  const total = subtotal + shipping + taxes - discount

  const handleUpdateQuantity = (productId: string, quantity: number) => {
    dispatch(updateQuantity({ productId, quantity }))
  }

  const handleRemoveItem = (productId: string) => {
    dispatch(removeItem(productId))
  }

  const handleClearCart = () => {
    if (confirm('¿Estás seguro de que quieres vaciar tu carrito?')) {
      dispatch(clearCart())
    }
  }

  const handleApplyPromo = () => {
    // Simple promo code logic
    if (promoCode.toLowerCase() === 'eco20') {
      setPromoDiscount(subtotal * 0.2)
    } else if (promoCode.toLowerCase() === 'green10') {
      setPromoDiscount(subtotal * 0.1)
    } else {
      alert('Código promocional no válido')
    }
  }

  const handleCheckout = () => {
    setIsLoading(true)
    router.push('/checkout')
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <ShoppingCart className="mx-auto h-24 w-24 text-gray-400 mb-6" />
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Tu carrito está vacío
            </h1>
            <p className="text-lg text-gray-600 mb-8 max-w-md mx-auto">
              Descubre productos sostenibles que ayuden a crear un futuro más verde.
            </p>
            <div className="space-y-4 sm:space-y-0 sm:space-x-4 sm:flex sm:justify-center">
              <Link href="/marketplace">
                <Button className="bg-green-600 hover:bg-green-700 text-white px-8 py-3">
                  <Leaf className="w-4 h-4 mr-2" />
                  Explorar Productos
                </Button>
              </Link>
              <Link href="/">
                <Button variant="outline" className="px-8 py-3">
                  Volver al Inicio
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4">
              <Link href="/marketplace">
                <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-900">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Continuar Comprando
                </Button>
              </Link>
            </div>
            <div className="text-right">
              <h1 className="text-3xl font-bold text-gray-900">Carrito de Compras</h1>
              <p className="text-gray-600">
                {cartCount} {cartCount === 1 ? 'producto' : 'productos'}
              </p>
            </div>
          </div>

          {/* Sustainability Impact Preview */}
          <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="flex items-center justify-center w-10 h-10 bg-green-100 rounded-full">
                    <Leaf className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-green-900">Impacto de tu Compra</h3>
                    <p className="text-sm text-green-700">
                      Con esta compra reducirás {sustainabilityMetrics.co2Reduced}kg de CO₂
                    </p>
                  </div>
                </div>
                <div className="hidden sm:flex space-x-6 text-sm text-green-700">
                  <div className="text-center">
                    <div className="font-semibold">{sustainabilityMetrics.treesPlanted}</div>
                    <div>árboles plantados</div>
                  </div>
                  <div className="text-center">
                    <div className="font-semibold">{sustainabilityMetrics.waterSaved}L</div>
                    <div>agua ahorrada</div>
                  </div>
                  <div className="text-center">
                    <div className="font-semibold">{sustainabilityMetrics.plasticReduced}kg</div>
                    <div>plástico reducido</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-6">
                <CardTitle className="text-xl">Productos en tu Carrito</CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleClearCart}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Vaciar Carrito
                </Button>
              </CardHeader>
              <CardContent className="space-y-6">
                {cartItems.map((item, index) => (
                  <div key={item.productId}>
                    <div className="flex space-x-4">
                      {/* Product Image */}
                      <div className="flex-shrink-0">
                        <div className="w-24 h-24 sm:w-32 sm:h-32 bg-gray-200 rounded-lg overflow-hidden">
                          <img
                            src={item.image || '/placeholder.svg'}
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </div>

                      {/* Product Details */}
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between">
                          <div className="flex-1">
                            <h3 className="text-lg font-semibold text-gray-900 mb-1">
                              {item.name}
                            </h3>
                            <p className="text-sm text-gray-600 mb-2">
                              Vendido por {item.vendorName}
                            </p>

                            {/* Price */}
                            <div className="flex items-center space-x-2 mb-3">
                              <span className="text-xl font-bold text-gray-900">
                                ${item.price.toFixed(2)} MXN
                              </span>
                              <Badge variant="secondary" className="text-xs">
                                En stock
                              </Badge>
                            </div>
                          </div>

                          {/* Quantity Controls & Remove */}
                          <div className="flex items-center space-x-3 sm:flex-col sm:items-end sm:space-x-0 sm:space-y-3">
                            <div className="flex items-center space-x-2 border rounded-lg p-1">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0"
                                onClick={() => handleUpdateQuantity(item.productId, item.quantity - 1)}
                                disabled={item.quantity <= 1}
                              >
                                <Minus className="h-3 w-3" />
                              </Button>
                              <span className="text-sm font-medium min-w-[2rem] text-center">
                                {item.quantity}
                              </span>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0"
                                onClick={() => handleUpdateQuantity(item.productId, item.quantity + 1)}
                                disabled={item.quantity >= item.maxStock}
                              >
                                <Plus className="h-3 w-3" />
                              </Button>
                            </div>

                            <div className="text-right">
                              <div className="text-lg font-semibold text-gray-900">
                                ${(item.price * item.quantity).toFixed(2)}
                              </div>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleRemoveItem(item.productId)}
                                className="text-red-600 hover:text-red-700 hover:bg-red-50 p-1 h-auto"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {index < cartItems.length - 1 && <Separator className="mt-6" />}
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-8 space-y-6">
              {/* Promo Code */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center">
                    <Gift className="w-5 h-5 mr-2 text-green-600" />
                    Código Promocional
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      placeholder="Código promocional"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    />
                    <Button
                      onClick={handleApplyPromo}
                      variant="outline"
                      size="sm"
                      className="text-green-600 border-green-300 hover:bg-green-50"
                    >
                      Aplicar
                    </Button>
                  </div>
                  {promoDiscount > 0 && (
                    <div className="mt-2 text-sm text-green-600">
                      ✓ Código aplicado: -${promoDiscount.toFixed(2)}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Order Summary */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Resumen del Pedido</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Subtotal ({cartCount} productos)</span>
                    <span className="font-medium">${subtotal.toFixed(2)}</span>
                  </div>

                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Envío</span>
                    <span className={`font-medium ${shipping === 0 ? 'text-green-600' : ''}`}>
                      {shipping === 0 ? 'Gratis' : `$${shipping.toFixed(2)}`}
                    </span>
                  </div>

                  {shipping > 0 && (
                    <div className="text-xs text-gray-500 flex items-center">
                      <AlertCircle className="w-3 h-3 mr-1" />
                      Envío gratis en compras mayores a $500
                    </div>
                  )}

                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Impuestos (16%)</span>
                    <span className="font-medium">${taxes.toFixed(2)}</span>
                  </div>

                  {discount > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Descuento</span>
                      <span className="font-medium text-green-600">-${discount.toFixed(2)}</span>
                    </div>
                  )}

                  <Separator />

                  <div className="flex justify-between text-lg font-semibold">
                    <span>Total</span>
                    <span>${total.toFixed(2)} MXN</span>
                  </div>

                  {/* Security & Benefits */}
                  <div className="space-y-2 text-xs text-gray-600 pt-4">
                    <div className="flex items-center space-x-2">
                      <Shield className="w-4 h-4 text-green-500" />
                      <span>Compra 100% segura</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Truck className="w-4 h-4 text-blue-500" />
                      <span>Envío con huella de carbono neutral</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Heart className="w-4 h-4 text-red-500" />
                      <span>Productos verificados sostenibles</span>
                    </div>
                  </div>

                  <Button
                    onClick={handleCheckout}
                    disabled={isLoading}
                    className="w-full bg-green-600 hover:bg-green-700 text-white py-3 text-lg font-semibold"
                  >
                    {isLoading ? (
                      'Procesando...'
                    ) : (
                      <>
                        Proceder al Checkout
                        <ArrowRight className="ml-2 w-5 h-5" />
                      </>
                    )}
                  </Button>

                  <div className="text-center">
                    <Link href="/marketplace">
                      <Button variant="outline" className="w-full">
                        Continuar Comprando
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}