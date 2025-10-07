"use client"

import { useState } from 'react'
import { Plus, Minus, Trash2, Star, Award, Leaf } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useAppDispatch } from '@/lib/store/hooks'
import { updateQuantity, removeItem } from '@/lib/store/slices/cartSlice'

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

interface Totals {
  subtotal: number
  shipping: number
  tax: number
  total: number
  environmentalImpact: {
    co2Reduced: number
    treesPlanted: number
    waterSaved: number
    plasticReduced: number
  }
}

interface CartReviewStepProps {
  cartItems: CartItem[]
  totals: Totals
}

export function CartReviewStep({ cartItems, totals }: CartReviewStepProps) {
  const dispatch = useAppDispatch()
  const [removingItems, setRemovingItems] = useState<Set<string>>(new Set())

  const handleUpdateQuantity = (productId: string, quantity: number) => {
    dispatch(updateQuantity({ productId, quantity }))
  }

  const handleRemoveItem = async (productId: string) => {
    setRemovingItems(prev => new Set(prev).add(productId))

    // Add a small delay for visual feedback
    setTimeout(() => {
      dispatch(removeItem(productId))
      setRemovingItems(prev => {
        const newSet = new Set(prev)
        newSet.delete(productId)
        return newSet
      })
    }, 300)
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Revisar Productos</CardTitle>
          <p className="text-gray-600">
            Verifica los productos en tu carrito antes de continuar
          </p>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {cartItems.map((item) => (
              <div
                key={item.productId}
                className={`
                  flex space-x-4 p-4 border rounded-lg transition-all duration-300
                  ${removingItems.has(item.productId)
                    ? 'opacity-50 scale-95 bg-red-50 border-red-200'
                    : 'bg-white border-gray-200'
                  }
                `}
              >
                {/* Product Image */}
                <div className="flex-shrink-0">
                  <img
                    src={item.image || '/placeholder.svg'}
                    alt={item.name}
                    className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-lg"
                  />
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

                      {/* Mock product details for better UX */}
                      <div className="flex items-center space-x-4 text-sm text-gray-500 mb-3">
                        <div className="flex items-center">
                          <Star className="w-4 h-4 text-yellow-500 mr-1" />
                          <span>4.8 (156)</span>
                        </div>
                        <div className="flex items-center">
                          <Award className="w-4 h-4 text-green-500 mr-1" />
                          <span>Certificado</span>
                        </div>
                        <div className="flex items-center">
                          <Leaf className="w-4 h-4 text-green-500 mr-1" />
                          <span>REGEN Score: 92</span>
                        </div>
                      </div>

                      {/* Price */}
                      <div className="flex items-center space-x-2 mb-3">
                        <span className="text-xl font-bold text-green-600">
                          ${item.price.toFixed(2)}
                        </span>
                        <Badge variant="secondary" className="text-xs">
                          En stock
                        </Badge>
                      </div>
                    </div>

                    {/* Quantity and Actions */}
                    <div className="flex items-center space-x-3 sm:flex-col sm:items-end sm:space-x-0 sm:space-y-3 mt-3 sm:mt-0">
                      {/* Quantity Controls */}
                      <div className="flex items-center space-x-2 border rounded-lg p-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 hover:bg-gray-100"
                          onClick={() => handleUpdateQuantity(item.productId, item.quantity - 1)}
                          disabled={item.quantity <= 1 || removingItems.has(item.productId)}
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="text-sm font-medium min-w-[2rem] text-center">
                          {item.quantity}
                        </span>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 hover:bg-gray-100"
                          onClick={() => handleUpdateQuantity(item.productId, item.quantity + 1)}
                          disabled={item.quantity >= item.maxStock || removingItems.has(item.productId)}
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>

                      {/* Total Price and Remove */}
                      <div className="text-right">
                        <div className="text-lg font-semibold text-gray-900 mb-1">
                          ${(item.price * item.quantity).toFixed(2)}
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveItem(item.productId)}
                          disabled={removingItems.has(item.productId)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50 p-1 h-auto"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Stock Warning */}
                  {item.quantity >= item.maxStock * 0.8 && (
                    <div className="mt-2 text-xs text-amber-600 bg-amber-50 px-2 py-1 rounded">
                      ⚠️ Últimas {item.maxStock - item.quantity + 1} unidades disponibles
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Shipping Options */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Opciones de Envío</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 border rounded-lg border-green-200 bg-green-50">
              <div className="flex items-center space-x-3">
                <div className="w-4 h-4 bg-green-600 rounded-full"></div>
                <div>
                  <p className="font-medium text-gray-900">Envío Estándar</p>
                  <p className="text-sm text-gray-600">3-5 días hábiles • Huella de carbono neutral</p>
                </div>
              </div>
              <div className="text-right">
                {totals.shipping === 0 ? (
                  <span className="text-lg font-semibold text-green-600">Gratis</span>
                ) : (
                  <span className="text-lg font-semibold text-gray-900">${totals.shipping.toFixed(2)}</span>
                )}
              </div>
            </div>

            {totals.shipping > 0 && (
              <div className="text-sm text-gray-600 bg-blue-50 p-3 rounded-lg">
                💡 Añade ${(1000 - totals.subtotal).toFixed(2)} más para obtener envío gratis
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Environmental Impact Summary */}
      <Card className="bg-gradient-to-br from-green-50 to-blue-50 border-green-200">
        <CardHeader>
          <CardTitle className="text-lg flex items-center">
            <Leaf className="w-5 h-5 text-green-600 mr-2" />
            Impacto Ambiental de tu Compra
          </CardTitle>
          <p className="text-green-700">
            Con esta compra estás contribuyendo a un futuro más sostenible
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-3 bg-white/70 rounded-lg">
              <div className="text-2xl font-bold text-green-800">
                {totals.environmentalImpact.co2Reduced}kg
              </div>
              <div className="text-sm text-green-600">CO₂ reducido</div>
            </div>
            <div className="text-center p-3 bg-white/70 rounded-lg">
              <div className="text-2xl font-bold text-green-800">
                {totals.environmentalImpact.treesPlanted}
              </div>
              <div className="text-sm text-green-600">árboles plantados</div>
            </div>
            <div className="text-center p-3 bg-white/70 rounded-lg">
              <div className="text-2xl font-bold text-blue-800">
                {totals.environmentalImpact.waterSaved}L
              </div>
              <div className="text-sm text-blue-600">agua ahorrada</div>
            </div>
            <div className="text-center p-3 bg-white/70 rounded-lg">
              <div className="text-2xl font-bold text-purple-800">
                {totals.environmentalImpact.plasticReduced}kg
              </div>
              <div className="text-sm text-purple-600">plástico reducido</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Special Offers */}
      <Card className="border-amber-200 bg-amber-50">
        <CardContent className="p-4">
          <div className="flex items-center space-x-3">
            <div className="text-2xl">🎁</div>
            <div>
              <p className="font-medium text-amber-900">¡Oferta Especial!</p>
              <p className="text-sm text-amber-700">
                Añade un mensaje de regalo personalizado sin costo adicional
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}