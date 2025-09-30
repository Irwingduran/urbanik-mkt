"use client"

import { useState } from 'react'
import {
  CreditCard,
  Shield,
  Lock,
  AlertCircle,
  CheckCircle,
  Wallet,
  Building,
  Globe
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { CheckoutData, PaymentMethod } from '@/app/checkout/page'

interface PaymentStepProps {
  checkoutData: CheckoutData
  updateCheckoutData: (data: Partial<CheckoutData>) => void
  totals: {
    subtotal: number
    shipping: number
    tax: number
    total: number
  }
}

const PAYMENT_METHODS = [
  {
    id: 'card',
    name: 'Tarjeta de Crédito/Débito',
    description: 'Visa, Mastercard, American Express',
    icon: CreditCard,
    popular: true
  },
  {
    id: 'paypal',
    name: 'PayPal',
    description: 'Paga con tu cuenta PayPal',
    icon: Wallet,
    popular: false
  },
  {
    id: 'oxxo',
    name: 'OXXO',
    description: 'Paga en cualquier tienda OXXO',
    icon: Building,
    popular: false
  },
  {
    id: 'bank_transfer',
    name: 'Transferencia Bancaria',
    description: 'SPEI, transferencia inmediata',
    icon: Globe,
    popular: false
  }
]

export function PaymentStep({ checkoutData, updateCheckoutData, totals }: PaymentStepProps) {
  const [cardErrors, setCardErrors] = useState<Record<string, string>>({})
  const [isProcessing, setIsProcessing] = useState(false)

  const updatePaymentMethod = (field: keyof PaymentMethod, value: string) => {
    updateCheckoutData({
      paymentMethod: {
        ...checkoutData.paymentMethod,
        [field]: value
      }
    })
  }

  const handlePaymentTypeChange = (type: string) => {
    updateCheckoutData({
      paymentMethod: {
        type: type as PaymentMethod['type']
      }
    })
    setCardErrors({})
  }

  const validateCard = (field: string, value: string) => {
    const errors = { ...cardErrors }

    switch (field) {
      case 'cardNumber':
        // Basic card number validation
        const cleaned = value.replace(/\s/g, '')
        if (cleaned.length === 0) {
          errors.cardNumber = 'Número de tarjeta es requerido'
        } else if (cleaned.length < 13 || cleaned.length > 19) {
          errors.cardNumber = 'Número de tarjeta inválido'
        } else if (!/^\d+$/.test(cleaned)) {
          errors.cardNumber = 'Solo números son permitidos'
        } else {
          delete errors.cardNumber
        }
        break

      case 'expiryDate':
        const expiryRegex = /^(0[1-9]|1[0-2])\/\d{2}$/
        if (!value) {
          errors.expiryDate = 'Fecha de expiración es requerida'
        } else if (!expiryRegex.test(value)) {
          errors.expiryDate = 'Formato: MM/YY'
        } else {
          // Check if date is in the future
          const [month, year] = value.split('/')
          const expiry = new Date(2000 + parseInt(year), parseInt(month) - 1)
          const now = new Date()
          if (expiry < now) {
            errors.expiryDate = 'Tarjeta expirada'
          } else {
            delete errors.expiryDate
          }
        }
        break

      case 'cvv':
        if (!value) {
          errors.cvv = 'CVV es requerido'
        } else if (!/^\d{3,4}$/.test(value)) {
          errors.cvv = 'CVV debe tener 3 o 4 dígitos'
        } else {
          delete errors.cvv
        }
        break

      case 'cardholderName':
        if (!value.trim()) {
          errors.cardholderName = 'Nombre del titular es requerido'
        } else if (value.trim().length < 2) {
          errors.cardholderName = 'Nombre muy corto'
        } else {
          delete errors.cardholderName
        }
        break
    }

    setCardErrors(errors)
  }

  const formatCardNumber = (value: string) => {
    // Remove all non-digits
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '')

    // Add spaces every 4 digits
    const matches = v.match(/\d{4,16}/g)
    const match = matches && matches[0] || ''
    const parts = []

    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4))
    }

    if (parts.length) {
      return parts.join(' ')
    } else {
      return v
    }
  }

  const formatExpiryDate = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '')
    if (v.length >= 2) {
      return v.substring(0, 2) + '/' + v.substring(2, 4)
    }
    return v
  }

  const getCardType = (number: string) => {
    const cleaned = number.replace(/\s/g, '')
    if (/^4/.test(cleaned)) return 'Visa'
    if (/^5[1-5]/.test(cleaned)) return 'Mastercard'
    if (/^3[47]/.test(cleaned)) return 'American Express'
    return 'Unknown'
  }

  const renderCardForm = () => (
    <div className="space-y-4">
      {/* Card Number */}
      <div>
        <Label htmlFor="cardNumber" className="flex items-center">
          <CreditCard className="w-4 h-4 mr-1" />
          Número de Tarjeta *
        </Label>
        <div className="relative">
          <Input
            id="cardNumber"
            value={checkoutData.paymentMethod.cardNumber || ''}
            onChange={(e) => {
              const formatted = formatCardNumber(e.target.value)
              updatePaymentMethod('cardNumber', formatted)
              validateCard('cardNumber', formatted)
            }}
            placeholder="1234 5678 9012 3456"
            className={`mt-1 ${cardErrors.cardNumber ? 'border-red-500' : ''}`}
            maxLength={19}
          />
          {checkoutData.paymentMethod.cardNumber && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <Badge variant="secondary" className="text-xs">
                {getCardType(checkoutData.paymentMethod.cardNumber)}
              </Badge>
            </div>
          )}
        </div>
        {cardErrors.cardNumber && (
          <p className="text-sm text-red-600 mt-1 flex items-center">
            <AlertCircle className="w-4 h-4 mr-1" />
            {cardErrors.cardNumber}
          </p>
        )}
      </div>

      {/* Expiry and CVV */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="expiryDate">Fecha de Expiración *</Label>
          <Input
            id="expiryDate"
            value={checkoutData.paymentMethod.expiryDate || ''}
            onChange={(e) => {
              const formatted = formatExpiryDate(e.target.value)
              updatePaymentMethod('expiryDate', formatted)
              validateCard('expiryDate', formatted)
            }}
            placeholder="MM/YY"
            className={`mt-1 ${cardErrors.expiryDate ? 'border-red-500' : ''}`}
            maxLength={5}
          />
          {cardErrors.expiryDate && (
            <p className="text-sm text-red-600 mt-1 flex items-center">
              <AlertCircle className="w-4 h-4 mr-1" />
              {cardErrors.expiryDate}
            </p>
          )}
        </div>
        <div>
          <Label htmlFor="cvv">CVV *</Label>
          <Input
            id="cvv"
            value={checkoutData.paymentMethod.cvv || ''}
            onChange={(e) => {
              const value = e.target.value.replace(/\D/g, '')
              updatePaymentMethod('cvv', value)
              validateCard('cvv', value)
            }}
            placeholder="123"
            className={`mt-1 ${cardErrors.cvv ? 'border-red-500' : ''}`}
            maxLength={4}
          />
          {cardErrors.cvv && (
            <p className="text-sm text-red-600 mt-1 flex items-center">
              <AlertCircle className="w-4 h-4 mr-1" />
              {cardErrors.cvv}
            </p>
          )}
        </div>
      </div>

      {/* Cardholder Name */}
      <div>
        <Label htmlFor="cardholderName">Nombre del Titular *</Label>
        <Input
          id="cardholderName"
          value={checkoutData.paymentMethod.cardholderName || ''}
          onChange={(e) => {
            updatePaymentMethod('cardholderName', e.target.value)
            validateCard('cardholderName', e.target.value)
          }}
          placeholder="Juan Pérez García"
          className={`mt-1 ${cardErrors.cardholderName ? 'border-red-500' : ''}`}
        />
        {cardErrors.cardholderName && (
          <p className="text-sm text-red-600 mt-1 flex items-center">
            <AlertCircle className="w-4 h-4 mr-1" />
            {cardErrors.cardholderName}
          </p>
        )}
      </div>
    </div>
  )

  const renderPayPalForm = () => (
    <div className="text-center py-8">
      <div className="bg-blue-50 rounded-lg p-6">
        <Wallet className="w-12 h-12 text-blue-600 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-blue-900 mb-2">
          Pago con PayPal
        </h3>
        <p className="text-blue-700 mb-4">
          Serás redirigido a PayPal para completar tu pago de forma segura.
        </p>
        <div className="text-sm text-blue-600">
          ✓ Protección del comprador de PayPal<br/>
          ✓ No compartimos tu información financiera<br/>
          ✓ Procesamiento instantáneo
        </div>
      </div>
    </div>
  )

  const renderOXXOForm = () => (
    <div className="space-y-4">
      <div className="bg-red-50 rounded-lg p-6">
        <Building className="w-12 h-12 text-red-600 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-red-900 mb-2">
          Pago en OXXO
        </h3>
        <p className="text-red-700 mb-4">
          Genera tu ficha de pago y paga en cualquier tienda OXXO.
        </p>
        <div className="text-sm text-red-600 space-y-1">
          <p>• Tiempo límite: 3 días para realizar el pago</p>
          <p>• Monto máximo: $10,000 MXN</p>
          <p>• Comisión: $8 MXN por transacción</p>
          <p>• Confirmación inmediata al pagar</p>
        </div>
      </div>
    </div>
  )

  const renderBankTransferForm = () => (
    <div className="space-y-4">
      <div className="bg-green-50 rounded-lg p-6">
        <Globe className="w-12 h-12 text-green-600 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-green-900 mb-2">
          Transferencia Bancaria (SPEI)
        </h3>
        <p className="text-green-700 mb-4">
          Realiza una transferencia bancaria directa.
        </p>
        <div className="text-sm text-green-600 space-y-1">
          <p>• Transferencia instantánea (SPEI)</p>
          <p>• Sin comisiones adicionales</p>
          <p>• Disponible 24/7</p>
          <p>• Confirmación automática</p>
        </div>
      </div>
    </div>
  )

  return (
    <div className="space-y-6">
      {/* Payment Method Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <CreditCard className="w-5 h-5 mr-2" />
            Método de Pago
          </CardTitle>
        </CardHeader>
        <CardContent>
          <RadioGroup
            value={checkoutData.paymentMethod.type}
            onValueChange={handlePaymentTypeChange}
            className="space-y-3"
          >
            {PAYMENT_METHODS.map((method) => {
              const Icon = method.icon
              return (
                <div
                  key={method.id}
                  className={`
                    flex items-center space-x-3 p-4 border rounded-lg cursor-pointer transition-colors
                    ${checkoutData.paymentMethod.type === method.id
                      ? 'border-green-500 bg-green-50'
                      : 'border-gray-200 hover:border-gray-300'
                    }
                  `}
                >
                  <RadioGroupItem
                    value={method.id}
                    id={method.id}
                    className="data-[state=checked]:border-green-500 data-[state=checked]:text-green-500"
                  />
                  <Icon className={`w-5 h-5 ${
                    checkoutData.paymentMethod.type === method.id ? 'text-green-600' : 'text-gray-500'
                  }`} />
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <label htmlFor={method.id} className="font-medium cursor-pointer">
                        {method.name}
                      </label>
                      {method.popular && (
                        <Badge className="bg-blue-100 text-blue-800 text-xs">
                          Popular
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-gray-600">{method.description}</p>
                  </div>
                </div>
              )
            })}
          </RadioGroup>
        </CardContent>
      </Card>

      {/* Payment Details Form */}
      <Card>
        <CardHeader>
          <CardTitle>Detalles de Pago</CardTitle>
        </CardHeader>
        <CardContent>
          {checkoutData.paymentMethod.type === 'card' && renderCardForm()}
          {checkoutData.paymentMethod.type === 'paypal' && renderPayPalForm()}
          {checkoutData.paymentMethod.type === 'oxxo' && renderOXXOForm()}
          {checkoutData.paymentMethod.type === 'bank_transfer' && renderBankTransferForm()}
        </CardContent>
      </Card>

      {/* Order Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Resumen de Pago</CardTitle>
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
            <div className="flex justify-between text-lg font-semibold">
              <span>Total a Pagar</span>
              <span className="text-green-600">
                ${(totals.total + (checkoutData.paymentMethod.type === 'oxxo' ? 8 : 0)).toFixed(2)} MXN
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Security Information */}
      <Card className="bg-gray-50 border-gray-200">
        <CardContent className="p-4">
          <div className="flex items-center space-x-3 mb-3">
            <Shield className="w-5 h-5 text-green-600" />
            <h3 className="font-semibold text-gray-900">Tu Pago es Seguro</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
            <div className="flex items-center space-x-2">
              <Lock className="w-4 h-4 text-green-500" />
              <span>Cifrado SSL de 256 bits</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span>Certificado PCI DSS</span>
            </div>
            <div className="flex items-center space-x-2">
              <Shield className="w-4 h-4 text-green-500" />
              <span>Protección contra fraude</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span>Garantía de reembolso</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Payment Policies */}
      <Card className="border-blue-200 bg-blue-50">
        <CardContent className="p-4">
          <h3 className="font-semibold text-blue-900 mb-2">Políticas de Pago</h3>
          <div className="text-sm text-blue-800 space-y-1">
            <p>• Los pagos se procesan de forma segura y encriptada</p>
            <p>• No almacenamos información de tarjetas de crédito</p>
            <p>• Política de reembolso de 30 días</p>
            <p>• Soporte 24/7 para problemas de pago</p>
            <p>• Todos los precios incluyen IVA</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}