"use client"

import { useState } from 'react'
import { MapPin, User, Mail, Phone, Home, Building, Globe, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { CheckoutData, ShippingAddress } from '@/app/checkout/page'

interface ShippingStepProps {
  checkoutData: CheckoutData
  updateCheckoutData: (data: Partial<CheckoutData>) => void
}

const MEXICAN_STATES = [
  'Aguascalientes', 'Baja California', 'Baja California Sur', 'Campeche', 'Chiapas',
  'Chihuahua', 'Ciudad de México', 'Coahuila', 'Colima', 'Durango',
  'Estado de México', 'Guanajuato', 'Guerrero', 'Hidalgo', 'Jalisco',
  'Michoacán', 'Morelos', 'Nayarit', 'Nuevo León', 'Oaxaca',
  'Puebla', 'Querétaro', 'Quintana Roo', 'San Luis Potosí', 'Sinaloa',
  'Sonora', 'Tabasco', 'Tamaulipas', 'Tlaxcala', 'Veracruz',
  'Yucatán', 'Zacatecas'
]

export function ShippingStep({ checkoutData, updateCheckoutData }: ShippingStepProps) {
  const [showAddressForm, setShowAddressForm] = useState(false)
  const [savedAddresses] = useState<ShippingAddress[]>([
    // Mock saved addresses
    {
      firstName: 'Juan',
      lastName: 'Pérez',
      email: 'juan@example.com',
      phone: '+52 55 1234 5678',
      street: 'Av. Reforma 123, Col. Centro',
      city: 'Ciudad de México',
      state: 'Ciudad de México',
      zipCode: '06000',
      country: 'MX',
      isDefault: true
    }
  ])

  const updateShippingAddress = (field: keyof ShippingAddress, value: string) => {
    updateCheckoutData({
      shippingAddress: {
        ...checkoutData.shippingAddress,
        [field]: value
      }
    })
  }

  const updateBillingAddress = (field: keyof ShippingAddress, value: string) => {
    updateCheckoutData({
      billingAddress: {
        ...checkoutData.billingAddress,
        [field]: value
      }
    })
  }

  const handleUseShippingAsBilling = (checked: boolean) => {
    updateCheckoutData({
      useShippingAsBilling: checked,
      billingAddress: checked ? { ...checkoutData.shippingAddress } : checkoutData.billingAddress
    })
  }

  const selectSavedAddress = (address: ShippingAddress) => {
    updateCheckoutData({
      shippingAddress: { ...address }
    })
  }

  return (
    <div className="space-y-6">
      {/* Saved Addresses */}
      {savedAddresses.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <MapPin className="w-5 h-5 mr-2" />
              Direcciones Guardadas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {savedAddresses.map((address, index) => (
                <div
                  key={index}
                  className={`
                    p-4 border rounded-lg cursor-pointer transition-colors
                    ${JSON.stringify(address) === JSON.stringify(checkoutData.shippingAddress)
                      ? 'border-green-500 bg-green-50'
                      : 'border-gray-200 hover:border-gray-300'
                    }
                  `}
                  onClick={() => selectSavedAddress(address)}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">
                        {address.firstName} {address.lastName}
                        {address.isDefault && (
                          <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                            Predeterminada
                          </span>
                        )}
                      </p>
                      <p className="text-sm text-gray-600">
                        {address.street}, {address.city}, {address.state} {address.zipCode}
                      </p>
                      <p className="text-sm text-gray-500">
                        {address.email} • {address.phone}
                      </p>
                    </div>
                    <div className={`
                      w-4 h-4 rounded-full border-2 transition-colors
                      ${JSON.stringify(address) === JSON.stringify(checkoutData.shippingAddress)
                        ? 'border-green-500 bg-green-500'
                        : 'border-gray-300'
                      }
                    `}>
                      {JSON.stringify(address) === JSON.stringify(checkoutData.shippingAddress) && (
                        <div className="w-full h-full rounded-full bg-white scale-50"></div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <Button
              variant="outline"
              onClick={() => setShowAddressForm(!showAddressForm)}
              className="w-full mt-4"
            >
              <Plus className="w-4 h-4 mr-2" />
              {showAddressForm ? 'Ocultar formulario' : 'Usar nueva dirección'}
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Shipping Address Form */}
      {(savedAddresses.length === 0 || showAddressForm) && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <User className="w-5 h-5 mr-2" />
              Dirección de Envío
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Name Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName">Nombre *</Label>
                <Input
                  id="firstName"
                  value={checkoutData.shippingAddress.firstName}
                  onChange={(e) => updateShippingAddress('firstName', e.target.value)}
                  placeholder="Juan"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="lastName">Apellidos *</Label>
                <Input
                  id="lastName"
                  value={checkoutData.shippingAddress.lastName}
                  onChange={(e) => updateShippingAddress('lastName', e.target.value)}
                  placeholder="Pérez García"
                  className="mt-1"
                />
              </div>
            </div>

            {/* Contact Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="email" className="flex items-center">
                  <Mail className="w-4 h-4 mr-1" />
                  Email *
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={checkoutData.shippingAddress.email}
                  onChange={(e) => updateShippingAddress('email', e.target.value)}
                  placeholder="juan@example.com"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="phone" className="flex items-center">
                  <Phone className="w-4 h-4 mr-1" />
                  Teléfono *
                </Label>
                <Input
                  id="phone"
                  value={checkoutData.shippingAddress.phone}
                  onChange={(e) => updateShippingAddress('phone', e.target.value)}
                  placeholder="+52 55 1234 5678"
                  className="mt-1"
                />
              </div>
            </div>

            {/* Address */}
            <div>
              <Label htmlFor="street" className="flex items-center">
                <Home className="w-4 h-4 mr-1" />
                Dirección completa *
              </Label>
              <Input
                id="street"
                value={checkoutData.shippingAddress.street}
                onChange={(e) => updateShippingAddress('street', e.target.value)}
                placeholder="Calle, número, colonia"
                className="mt-1"
              />
            </div>

            {/* City, State, ZIP */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="city" className="flex items-center">
                  <Building className="w-4 h-4 mr-1" />
                  Ciudad *
                </Label>
                <Input
                  id="city"
                  value={checkoutData.shippingAddress.city}
                  onChange={(e) => updateShippingAddress('city', e.target.value)}
                  placeholder="Ciudad de México"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="state">Estado *</Label>
                <Select
                  value={checkoutData.shippingAddress.state}
                  onValueChange={(value) => updateShippingAddress('state', value)}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Seleccionar estado" />
                  </SelectTrigger>
                  <SelectContent>
                    {MEXICAN_STATES.map((state) => (
                      <SelectItem key={state} value={state}>
                        {state}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="zipCode">Código Postal *</Label>
                <Input
                  id="zipCode"
                  value={checkoutData.shippingAddress.zipCode}
                  onChange={(e) => updateShippingAddress('zipCode', e.target.value)}
                  placeholder="06000"
                  className="mt-1"
                />
              </div>
            </div>

            {/* Country */}
            <div>
              <Label htmlFor="country" className="flex items-center">
                <Globe className="w-4 h-4 mr-1" />
                País
              </Label>
              <Select
                value={checkoutData.shippingAddress.country}
                onValueChange={(value) => updateShippingAddress('country', value)}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="MX">México</SelectItem>
                  <SelectItem value="US">Estados Unidos</SelectItem>
                  <SelectItem value="CA">Canadá</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Save Address Option */}
            <div className="flex items-center space-x-2 p-4 bg-blue-50 rounded-lg">
              <Checkbox id="saveAddress" />
              <Label htmlFor="saveAddress" className="text-sm">
                Guardar esta dirección para futuras compras
              </Label>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Billing Address */}
      <Card>
        <CardHeader>
          <CardTitle>Dirección de Facturación</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2 mb-4">
            <Checkbox
              id="useShippingAsBilling"
              checked={checkoutData.useShippingAsBilling}
              onCheckedChange={handleUseShippingAsBilling}
            />
            <Label htmlFor="useShippingAsBilling">
              Usar la misma dirección de envío para facturación
            </Label>
          </div>

          {!checkoutData.useShippingAsBilling && (
            <div className="space-y-4">
              {/* Billing Name Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="billingFirstName">Nombre *</Label>
                  <Input
                    id="billingFirstName"
                    value={checkoutData.billingAddress.firstName}
                    onChange={(e) => updateBillingAddress('firstName', e.target.value)}
                    placeholder="Juan"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="billingLastName">Apellidos *</Label>
                  <Input
                    id="billingLastName"
                    value={checkoutData.billingAddress.lastName}
                    onChange={(e) => updateBillingAddress('lastName', e.target.value)}
                    placeholder="Pérez García"
                    className="mt-1"
                  />
                </div>
              </div>

              {/* Billing Address */}
              <div>
                <Label htmlFor="billingStreet">Dirección completa *</Label>
                <Input
                  id="billingStreet"
                  value={checkoutData.billingAddress.street}
                  onChange={(e) => updateBillingAddress('street', e.target.value)}
                  placeholder="Calle, número, colonia"
                  className="mt-1"
                />
              </div>

              {/* Billing City, State, ZIP */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="billingCity">Ciudad *</Label>
                  <Input
                    id="billingCity"
                    value={checkoutData.billingAddress.city}
                    onChange={(e) => updateBillingAddress('city', e.target.value)}
                    placeholder="Ciudad de México"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="billingState">Estado *</Label>
                  <Select
                    value={checkoutData.billingAddress.state}
                    onValueChange={(value) => updateBillingAddress('state', value)}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Seleccionar estado" />
                    </SelectTrigger>
                    <SelectContent>
                      {MEXICAN_STATES.map((state) => (
                        <SelectItem key={state} value={state}>
                          {state}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="billingZipCode">Código Postal *</Label>
                  <Input
                    id="billingZipCode"
                    value={checkoutData.billingAddress.zipCode}
                    onChange={(e) => updateBillingAddress('zipCode', e.target.value)}
                    placeholder="06000"
                    className="mt-1"
                  />
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Special Instructions */}
      <Card>
        <CardHeader>
          <CardTitle>Instrucciones Especiales (Opcional)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="specialInstructions">Instrucciones de entrega</Label>
            <Textarea
              id="specialInstructions"
              value={checkoutData.specialInstructions}
              onChange={(e) => updateCheckoutData({ specialInstructions: e.target.value })}
              placeholder="Ej: Dejar el paquete con el portero, tocar el timbre 2 veces..."
              className="mt-1"
              rows={3}
            />
          </div>

          <div>
            <Label htmlFor="giftMessage">Mensaje de regalo</Label>
            <Textarea
              id="giftMessage"
              value={checkoutData.giftMessage}
              onChange={(e) => updateCheckoutData({ giftMessage: e.target.value })}
              placeholder="Escribe un mensaje personalizado para incluir con el regalo..."
              className="mt-1"
              rows={3}
            />
            <p className="text-sm text-gray-500 mt-1">
              💡 Incluiremos tu mensaje en una tarjeta ecológica sin costo adicional
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Shipping Information */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="p-4">
          <h3 className="font-semibold text-blue-900 mb-2">📦 Información de Envío</h3>
          <div className="space-y-2 text-sm text-blue-800">
            <p>• Tiempo de entrega: 3-5 días hábiles</p>
            <p>• Envío gratis en compras mayores a $1,000 MXN</p>
            <p>• Todos nuestros envíos son carbono neutral</p>
            <p>• Recibirás un código de seguimiento por email</p>
            <p>• Empaque 100% reciclable y compostable</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}