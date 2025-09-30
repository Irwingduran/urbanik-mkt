"use client"

import { useState } from 'react'
import {
  Check,
  MapPin,
  CreditCard,
  ShoppingCart,
  Truck,
  Shield,
  Clock,
  Leaf,
  AlertTriangle,
  FileText,
  Edit3
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { CheckoutData } from '@/app/checkout/page'

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

interface ConfirmationStepProps {
  checkoutData: CheckoutData
  cartItems: CartItem[]
  totals: Totals
  onConfirm: () => void
  isLoading: boolean
}

export function ConfirmationStep({
  checkoutData,
  cartItems,
  totals,
  onConfirm,
  isLoading
}: ConfirmationStepProps) {
  const [agreedToTerms, setAgreedToTerms] = useState(false)
  const [subscribedToNews, setSubscribedToNews] = useState(true)

  const getPaymentMethodDisplay = () => {
    switch (checkoutData.paymentMethod.type) {
      case 'card':
        const cardNumber = checkoutData.paymentMethod.cardNumber || ''
        const lastFour = cardNumber.slice(-4)
        return `Tarjeta terminada en ${lastFour}`
      case 'paypal':
        return 'PayPal'
      case 'oxxo':
        return 'Pago en OXXO'
      case 'bank_transfer':
        return 'Transferencia Bancaria'
      default:
        return 'No especificado'
    }
  }

  const estimatedDeliveryDate = () => {
    const date = new Date()
    date.setDate(date.getDate() + 5) // 5 business days
    return date.toLocaleDateString('es-MX', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-green-50 border-green-200">
        <CardContent className="p-6">
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-12 h-12 bg-green-600 rounded-full">
              <Check className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-green-900">
                ¡Listo para Confirmar!
              </h2>
              <p className="text-green-700">
                Revisa todos los detalles antes de completar tu pedido
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Order Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center">
              <ShoppingCart className="w-5 h-5 mr-2" />
              Productos ({cartItems.length})
            </span>
            <Button variant="ghost" size="sm" className="text-blue-600">
              <Edit3 className="w-4 h-4 mr-1" />
              Editar
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {cartItems.map((item) => (
              <div key={item.productId} className="flex items-center space-x-4">
                <img
                  src={item.image || '/placeholder.svg'}
                  alt={item.name}
                  className="w-16 h-16 object-cover rounded-lg"
                />
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900">{item.name}</h3>
                  <p className="text-sm text-gray-600">
                    Por {item.vendorName}
                  </p>
                  <p className="text-sm text-gray-500">
                    Cantidad: {item.quantity}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">
                    ${(item.price * item.quantity).toFixed(2)}
                  </p>
                  <p className="text-sm text-gray-500">
                    ${item.price.toFixed(2)} c/u
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Shipping Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center">
              <Truck className="w-5 h-5 mr-2" />
              Información de Envío
            </span>
            <Button variant="ghost" size="sm" className="text-blue-600">
              <Edit3 className="w-4 h-4 mr-1" />
              Editar
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Shipping Address */}
            <div>
              <h3 className="font-medium text-gray-900 mb-2 flex items-center">
                <MapPin className="w-4 h-4 mr-1" />
                Dirección de Entrega
              </h3>
              <div className="text-sm text-gray-600 space-y-1">
                <p className="font-medium text-gray-900">
                  {checkoutData.shippingAddress.firstName} {checkoutData.shippingAddress.lastName}
                </p>
                <p>{checkoutData.shippingAddress.street}</p>
                <p>
                  {checkoutData.shippingAddress.city}, {checkoutData.shippingAddress.state} {checkoutData.shippingAddress.zipCode}
                </p>
                <p>{checkoutData.shippingAddress.phone}</p>
                <p>{checkoutData.shippingAddress.email}</p>
              </div>
            </div>

            {/* Delivery Details */}
            <div>
              <h3 className="font-medium text-gray-900 mb-2 flex items-center">
                <Clock className="w-4 h-4 mr-1" />
                Detalles de Entrega
              </h3>
              <div className="text-sm text-gray-600 space-y-1">
                <p>
                  <span className="font-medium">Método:</span> Envío Estándar
                </p>
                <p>
                  <span className="font-medium">Tiempo:</span> 3-5 días hábiles
                </p>
                <p>
                  <span className="font-medium">Entrega estimada:</span>
                </p>
                <p className="font-medium text-gray-900">
                  {estimatedDeliveryDate()}
                </p>
                <div className="flex items-center space-x-1 mt-2">
                  <Leaf className="w-4 h-4 text-green-500" />
                  <span className="text-green-600">Envío carbono neutral</span>
                </div>
              </div>
            </div>
          </div>

          {/* Special Instructions */}
          {(checkoutData.specialInstructions || checkoutData.giftMessage) && (
            <div className="mt-6 pt-4 border-t">
              {checkoutData.specialInstructions && (
                <div className="mb-3">
                  <h4 className="font-medium text-gray-900 mb-1">
                    Instrucciones Especiales:
                  </h4>
                  <p className="text-sm text-gray-600">
                    {checkoutData.specialInstructions}
                  </p>
                </div>
              )}
              {checkoutData.giftMessage && (
                <div>
                  <h4 className="font-medium text-gray-900 mb-1">
                    Mensaje de Regalo:
                  </h4>
                  <p className="text-sm text-gray-600">
                    {checkoutData.giftMessage}
                  </p>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Payment Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center">
              <CreditCard className="w-5 h-5 mr-2" />
              Información de Pago
            </span>
            <Button variant="ghost" size="sm" className="text-blue-600">
              <Edit3 className="w-4 h-4 mr-1" />
              Editar
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Payment Method */}
            <div>
              <h3 className="font-medium text-gray-900 mb-2">
                Método de Pago
              </h3>
              <div className="text-sm text-gray-600">
                <p className="font-medium text-gray-900">
                  {getPaymentMethodDisplay()}
                </p>
                {checkoutData.paymentMethod.type === 'card' && (
                  <p>
                    {checkoutData.paymentMethod.cardholderName}
                  </p>
                )}
              </div>
            </div>

            {/* Billing Address */}
            <div>
              <h3 className="font-medium text-gray-900 mb-2">
                Dirección de Facturación
              </h3>
              <div className="text-sm text-gray-600">
                {checkoutData.useShippingAsBilling ? (
                  <p className="text-green-600">
                    Misma que la dirección de envío
                  </p>
                ) : (
                  <div className="space-y-1">
                    <p className="font-medium text-gray-900">
                      {checkoutData.billingAddress.firstName} {checkoutData.billingAddress.lastName}
                    </p>
                    <p>{checkoutData.billingAddress.street}</p>
                    <p>
                      {checkoutData.billingAddress.city}, {checkoutData.billingAddress.state} {checkoutData.billingAddress.zipCode}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Order Total */}
      <Card>
        <CardHeader>
          <CardTitle>Resumen de Costos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Subtotal</span>
              <span className="font-medium">${totals.subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Envío</span>
              <span className={`font-medium ${totals.shipping === 0 ? 'text-green-600' : ''}`}>
                {totals.shipping === 0 ? 'Gratis' : `$${totals.shipping.toFixed(2)}`}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">IVA (16%)</span>
              <span className="font-medium">${totals.tax.toFixed(2)}</span>
            </div>
            {checkoutData.paymentMethod.type === 'oxxo' && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Comisión OXXO</span>
                <span className="font-medium">$8.00</span>
              </div>
            )}
            <Separator />
            <div className="flex justify-between text-xl font-bold">
              <span>Total</span>
              <span className="text-green-600">
                ${(totals.total + (checkoutData.paymentMethod.type === 'oxxo' ? 8 : 0)).toFixed(2)} MXN
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Environmental Impact */}
      <Card className="bg-gradient-to-br from-green-50 to-blue-50 border-green-200">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Leaf className="w-5 h-5 text-green-600 mr-2" />
            Tu Impacto Positivo
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div className="p-3 bg-white/70 rounded-lg">
              <div className="text-2xl font-bold text-green-800">
                {totals.environmentalImpact.co2Reduced}kg
              </div>
              <div className="text-sm text-green-600">CO₂ reducido</div>
            </div>
            <div className="p-3 bg-white/70 rounded-lg">
              <div className="text-2xl font-bold text-green-800">
                {totals.environmentalImpact.treesPlanted}
              </div>
              <div className="text-sm text-green-600">árboles plantados</div>
            </div>
            <div className="p-3 bg-white/70 rounded-lg">
              <div className="text-2xl font-bold text-blue-800">
                {totals.environmentalImpact.waterSaved}L
              </div>
              <div className="text-sm text-blue-600">agua ahorrada</div>
            </div>
            <div className="p-3 bg-white/70 rounded-lg">
              <div className="text-2xl font-bold text-purple-800">
                {totals.environmentalImpact.plasticReduced}kg
              </div>
              <div className="text-sm text-purple-600">plástico reducido</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Terms and Newsletter */}
      <Card>
        <CardContent className="p-6 space-y-4">
          {/* Terms Agreement */}
          <div className="flex items-start space-x-3">
            <Checkbox
              id="terms"
              checked={agreedToTerms}
              onCheckedChange={setAgreedToTerms}
              className="mt-0.5"
            />
            <div>
              <Label
                htmlFor="terms"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Acepto los{' '}
                <a href="/terms" className="text-blue-600 hover:underline">
                  Términos y Condiciones
                </a>
                {' '}y la{' '}
                <a href="/privacy" className="text-blue-600 hover:underline">
                  Política de Privacidad
                </a>
                *
              </Label>
            </div>
          </div>

          {/* Newsletter Subscription */}
          <div className="flex items-start space-x-3">
            <Checkbox
              id="newsletter"
              checked={subscribedToNews}
              onCheckedChange={setSubscribedToNews}
              className="mt-0.5"
            />
            <div>
              <Label
                htmlFor="newsletter"
                className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Suscribirme al newsletter para recibir ofertas especiales y noticias sobre sostenibilidad
              </Label>
            </div>
          </div>

          {!agreedToTerms && (
            <div className="flex items-center space-x-2 text-sm text-amber-600 bg-amber-50 p-3 rounded-lg">
              <AlertTriangle className="w-4 h-4" />
              <span>Debes aceptar los términos y condiciones para continuar</span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Security and Support */}
      <Card className="bg-gray-50">
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <div className="flex flex-col items-center space-y-2">
              <Shield className="w-8 h-8 text-green-600" />
              <div>
                <p className="font-medium text-gray-900">Compra Segura</p>
                <p className="text-sm text-gray-600">Protección SSL</p>
              </div>
            </div>
            <div className="flex flex-col items-center space-y-2">
              <Truck className="w-8 h-8 text-blue-600" />
              <div>
                <p className="font-medium text-gray-900">Envío Seguido</p>
                <p className="text-sm text-gray-600">Rastrea tu pedido</p>
              </div>
            </div>
            <div className="flex flex-col items-center space-y-2">
              <FileText className="w-8 h-8 text-purple-600" />
              <div>
                <p className="font-medium text-gray-900">Garantía</p>
                <p className="text-sm text-gray-600">30 días de devolución</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Confirmation Button */}
      <div className="flex justify-center pt-4">
        <Button
          onClick={onConfirm}
          disabled={!agreedToTerms || isLoading}
          className="w-full md:w-auto bg-green-600 hover:bg-green-700 text-white px-12 py-4 text-lg font-semibold"
        >
          {isLoading ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
              Procesando Pedido...
            </>
          ) : (
            <>
              <Shield className="w-5 h-5 mr-3" />
              Confirmar y Pagar ${(totals.total + (checkoutData.paymentMethod.type === 'oxxo' ? 8 : 0)).toFixed(2)}
            </>
          )}
        </Button>
      </div>
    </div>
  )
}