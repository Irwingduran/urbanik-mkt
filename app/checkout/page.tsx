"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import {
  Check,
  ShoppingCart,
  Truck,
  CreditCard,
  Lock,
  ArrowLeft,
  ArrowRight,
  AlertCircle,
  Leaf,
  Shield,
  Clock
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'
import Header from '@/components/layout/header'
import { useAppSelector } from '@/src/shared/store/hooks'
import { selectCartItems, selectCartTotal, selectCartCount } from '@/src/shared/store/slices/cartSlice'

// Import checkout step components
import { CartReviewStep } from '@/components/checkout/cart-review-step'
import { ShippingStep } from '@/components/checkout/shipping-step'
import { PaymentStep } from '@/components/checkout/payment-step'
import { ConfirmationStep } from '@/components/checkout/confirmation-step'

export interface ShippingAddress {
  firstName: string
  lastName: string
  email: string
  phone: string
  street: string
  city: string
  state: string
  zipCode: string
  country: string
  isDefault?: boolean
}

export interface PaymentMethod {
  type: 'card' | 'paypal' | 'oxxo' | 'bank_transfer'
  cardNumber?: string
  expiryDate?: string
  cvv?: string
  cardholderName?: string
  email?: string // for PayPal
}

export interface CheckoutData {
  shippingAddress: ShippingAddress
  billingAddress: ShippingAddress
  paymentMethod: PaymentMethod
  specialInstructions?: string
  giftMessage?: string
  useShippingAsBilling: boolean
}

const CHECKOUT_STEPS = [
  {
    id: 'cart',
    title: 'Carrito',
    description: 'Revisar productos',
    icon: ShoppingCart
  },
  {
    id: 'shipping',
    title: 'Envío',
    description: 'Dirección de entrega',
    icon: Truck
  },
  {
    id: 'payment',
    title: 'Pago',
    description: 'Método de pago',
    icon: CreditCard
  },
  {
    id: 'confirmation',
    title: 'Confirmación',
    description: 'Confirmar pedido',
    icon: Check
  }
]

export default function CheckoutPage() {
  const router = useRouter()
  const { data: session, status } = useSession()
  const cartItems = useAppSelector(selectCartItems)
  const cartTotal = useAppSelector(selectCartTotal)
  const cartCount = useAppSelector(selectCartCount)

  const [currentStep, setCurrentStep] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<string[]>([])

  const [checkoutData, setCheckoutData] = useState<CheckoutData>({
    shippingAddress: {
      firstName: '',
      lastName: '',
      email: session?.user?.email || '',
      phone: '',
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: 'MX'
    },
    billingAddress: {
      firstName: '',
      lastName: '',
      email: session?.user?.email || '',
      phone: '',
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: 'MX'
    },
    paymentMethod: {
      type: 'card'
    },
    useShippingAsBilling: true,
    specialInstructions: '',
    giftMessage: ''
  })

  // Redirect if not authenticated
  useEffect(() => {
    if (status === 'loading') return
    if (!session) {
      router.push('/auth/signin?callbackUrl=/checkout')
      return
    }
  }, [session, status, router])

  // Redirect if cart is empty
  useEffect(() => {
    if (cartItems.length === 0) {
      router.push('/cart')
      return
    }
  }, [cartItems, router])

  // Update email from session
  useEffect(() => {
    if (session?.user?.email) {
      setCheckoutData(prev => ({
        ...prev,
        shippingAddress: { ...prev.shippingAddress, email: session.user.email! },
        billingAddress: { ...prev.billingAddress, email: session.user.email! }
      }))
    }
  }, [session])

  const updateCheckoutData = (data: Partial<CheckoutData>) => {
    setCheckoutData(prev => ({ ...prev, ...data }))
  }

  const calculateTotals = () => {
    const subtotal = cartTotal
    const shipping = subtotal > 1000 ? 0 : 150 // Free shipping over $1000 MXN
    const tax = subtotal * 0.16 // 16% IVA in Mexico
    const total = subtotal + shipping + tax

    return {
      subtotal,
      shipping,
      tax,
      total,
      environmentalImpact: {
        co2Reduced: Math.round(subtotal * 0.12), // kg
        treesPlanted: Math.floor(subtotal / 500), // 1 tree per $500
        waterSaved: Math.round(subtotal * 2.5), // liters
        plasticReduced: Math.round(subtotal * 0.05) // kg
      }
    }
  }

  const totals = calculateTotals()

  const validateStep = (step: number): string[] => {
    const stepErrors: string[] = []

    switch (step) {
      case 0: // Cart review
        if (cartItems.length === 0) {
          stepErrors.push('El carrito está vacío')
        }
        break

      case 1: // Shipping
        const { shippingAddress } = checkoutData
        if (!shippingAddress.firstName) stepErrors.push('Nombre es requerido')
        if (!shippingAddress.lastName) stepErrors.push('Apellido es requerido')
        if (!shippingAddress.email) stepErrors.push('Email es requerido')
        if (!shippingAddress.phone) stepErrors.push('Teléfono es requerido')
        if (!shippingAddress.street) stepErrors.push('Dirección es requerida')
        if (!shippingAddress.city) stepErrors.push('Ciudad es requerida')
        if (!shippingAddress.state) stepErrors.push('Estado es requerido')
        if (!shippingAddress.zipCode) stepErrors.push('Código postal es requerido')
        break

      case 2: // Payment
        const { paymentMethod } = checkoutData
        if (paymentMethod.type === 'card') {
          if (!paymentMethod.cardNumber) stepErrors.push('Número de tarjeta es requerido')
          if (!paymentMethod.expiryDate) stepErrors.push('Fecha de expiración es requerida')
          if (!paymentMethod.cvv) stepErrors.push('CVV es requerido')
          if (!paymentMethod.cardholderName) stepErrors.push('Nombre del titular es requerido')
        }
        break
    }

    return stepErrors
  }

  const handleNext = async () => {
    const stepErrors = validateStep(currentStep)

    if (stepErrors.length > 0) {
      setErrors(stepErrors)
      return
    }

    setErrors([])

    if (currentStep < CHECKOUT_STEPS.length - 1) {
      setCurrentStep(prev => prev + 1)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1)
    }
  }

  const handleSubmitOrder = async () => {
    setIsLoading(true)
    try {
      // Create order
      const orderResponse = await fetch('/api/user/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: cartItems.map(item => ({
            productId: item.productId,
            quantity: item.quantity
          })),
          shippingAddress: checkoutData.shippingAddress,
          paymentMethod: checkoutData.paymentMethod
        })
      })

      if (!orderResponse.ok) {
        throw new Error('Error creating order')
      }

      const orderData = await orderResponse.json()

      // Redirect to success page with order ID
      router.push(`/checkout/success?orderId=${orderData.data.orders[0].id}`)

    } catch (error) {
      console.error('Order submission error:', error)
      setErrors(['Error al procesar el pedido. Por favor intenta de nuevo.'])
    } finally {
      setIsLoading(false)
    }
  }

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando checkout...</p>
        </div>
      </div>
    )
  }

  if (!session || cartItems.length === 0) {
    return null // Will redirect
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <CartReviewStep
            cartItems={cartItems}
            totals={totals}
          />
        )
      case 1:
        return (
          <ShippingStep
            checkoutData={checkoutData}
            updateCheckoutData={updateCheckoutData}
          />
        )
      case 2:
        return (
          <PaymentStep
            checkoutData={checkoutData}
            updateCheckoutData={updateCheckoutData}
            totals={totals}
          />
        )
      case 3:
        return (
          <ConfirmationStep
            checkoutData={checkoutData}
            cartItems={cartItems}
            totals={totals}
            onConfirm={handleSubmitOrder}
            isLoading={isLoading}
          />
        )
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Checkout</h1>
              <p className="text-gray-600 mt-1">
                Completa tu compra de {cartCount} productos
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <Lock className="w-5 h-5 text-green-600" />
              <span className="text-sm text-gray-600">Conexión Segura</span>
            </div>
          </div>

          {/* Progress Steps */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center justify-between mb-4">
              {CHECKOUT_STEPS.map((step, index) => {
                const Icon = step.icon
                const isActive = index === currentStep
                const isCompleted = index < currentStep

                return (
                  <div key={step.id} className="flex items-center">
                    <div className={`
                      flex items-center justify-center w-10 h-10 rounded-full border-2 transition-colors
                      ${isCompleted
                        ? 'bg-green-600 border-green-600 text-white'
                        : isActive
                          ? 'border-green-600 text-green-600 bg-green-50'
                          : 'border-gray-300 text-gray-400'
                      }
                    `}>
                      {isCompleted ? (
                        <Check className="w-5 h-5" />
                      ) : (
                        <Icon className="w-5 h-5" />
                      )}
                    </div>
                    <div className="ml-3">
                      <p className={`text-sm font-medium ${isActive ? 'text-green-600' : isCompleted ? 'text-gray-900' : 'text-gray-500'}`}>
                        {step.title}
                      </p>
                      <p className="text-xs text-gray-500">{step.description}</p>
                    </div>
                    {index < CHECKOUT_STEPS.length - 1 && (
                      <div className={`w-16 h-0.5 mx-4 ${isCompleted ? 'bg-green-600' : 'bg-gray-300'}`} />
                    )}
                  </div>
                )
              })}
            </div>

            <Progress
              value={(currentStep / (CHECKOUT_STEPS.length - 1)) * 100}
              className="h-2"
            />
          </div>
        </div>

        {/* Error Messages */}
        {errors.length > 0 && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex">
              <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">
                  Por favor corrige los siguientes errores:
                </h3>
                <ul className="mt-2 text-sm text-red-700 list-disc list-inside">
                  {errors.map((error, index) => (
                    <li key={index}>{error}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {renderStepContent()}
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-8 space-y-6">
              {/* Order Summary */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <ShoppingCart className="w-5 h-5 mr-2" />
                    Resumen del Pedido
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    {cartItems.slice(0, 3).map((item) => (
                      <div key={item.productId} className="flex items-center space-x-3">
                        <img
                          src={item.image || '/placeholder.svg'}
                          alt={item.name}
                          className="w-12 h-12 object-cover rounded-lg"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {item.name}
                          </p>
                          <p className="text-xs text-gray-500">
                            Cantidad: {item.quantity}
                          </p>
                        </div>
                        <p className="text-sm font-medium text-gray-900">
                          ${(item.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    ))}
                    {cartItems.length > 3 && (
                      <p className="text-sm text-gray-500 text-center py-2">
                        +{cartItems.length - 3} productos más
                      </p>
                    )}
                  </div>

                  <Separator />

                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Subtotal</span>
                      <span className="font-medium">${totals.subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Envío</span>
                      <span className={`font-medium ${totals.shipping === 0 ? 'text-green-600' : ''}`}>
                        {totals.shipping === 0 ? 'Gratis' : `$${totals.shipping.toFixed(2)}`}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">IVA (16%)</span>
                      <span className="font-medium">${totals.tax.toFixed(2)}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between text-lg font-semibold">
                      <span>Total</span>
                      <span>${totals.total.toFixed(2)} MXN</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Environmental Impact */}
              <Card className="bg-gradient-to-br from-green-50 to-blue-50 border-green-200">
                <CardContent className="p-4">
                  <div className="flex items-center mb-3">
                    <Leaf className="w-5 h-5 text-green-600 mr-2" />
                    <h3 className="font-semibold text-green-900">Impacto Ambiental</h3>
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="text-center p-2 bg-white/50 rounded-lg">
                      <div className="font-semibold text-green-800">{totals.environmentalImpact.co2Reduced}kg</div>
                      <div className="text-green-600">CO₂ reducido</div>
                    </div>
                    <div className="text-center p-2 bg-white/50 rounded-lg">
                      <div className="font-semibold text-green-800">{totals.environmentalImpact.treesPlanted}</div>
                      <div className="text-green-600">árboles plantados</div>
                    </div>
                    <div className="text-center p-2 bg-white/50 rounded-lg">
                      <div className="font-semibold text-blue-800">{totals.environmentalImpact.waterSaved}L</div>
                      <div className="text-blue-600">agua ahorrada</div>
                    </div>
                    <div className="text-center p-2 bg-white/50 rounded-lg">
                      <div className="font-semibold text-purple-800">{totals.environmentalImpact.plasticReduced}kg</div>
                      <div className="text-purple-600">plástico reducido</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Security & Trust */}
              <Card>
                <CardContent className="p-4">
                  <div className="space-y-3 text-sm">
                    <div className="flex items-center space-x-2">
                      <Shield className="w-4 h-4 text-green-500" />
                      <span className="text-gray-700">Compra 100% segura</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock className="w-4 h-4 text-blue-500" />
                      <span className="text-gray-700">Entrega estimada: 3-5 días</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Truck className="w-4 h-4 text-purple-500" />
                      <span className="text-gray-700">Envío con huella de carbono neutral</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="mt-8 flex items-center justify-between">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentStep === 0}
            className="flex items-center"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Anterior
          </Button>

          {currentStep < CHECKOUT_STEPS.length - 1 ? (
            <Button
              onClick={handleNext}
              className="bg-green-600 hover:bg-green-700 text-white flex items-center"
            >
              Siguiente
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          ) : (
            <Button
              onClick={handleSubmitOrder}
              disabled={isLoading}
              className="bg-green-600 hover:bg-green-700 text-white flex items-center"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Procesando...
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4 mr-2" />
                  Confirmar Pedido
                </>
              )}
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}