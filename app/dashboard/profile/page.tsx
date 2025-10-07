"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { User, MapPin, CreditCard, Bell, Shield, Leaf, Edit, Plus, Trash2, Save } from "lucide-react"
import { DashboardLayout, DashboardHeader } from "@/components/shared/layout/DashboardLayout"

// Mock user data
const userData = {
  personal: {
    firstName: "María",
    lastName: "González",
    email: "maria.gonzalez@email.com",
    phone: "+52 55 1234 5678",
    birthDate: "1990-05-15",
    bio: "Apasionada por la sostenibilidad y la tecnología verde. Siempre buscando productos que generen un impacto positivo en el medio ambiente.",
  },
  preferences: {
    sustainabilityFocus: ["Energía Renovable", "Reducción de CO₂", "Ahorro de Agua"],
    priceRange: "1000-5000",
    preferredCategories: ["Paneles Solares", "Sistemas de Agua", "Iluminación LED"],
    notifications: {
      newProducts: true,
      priceAlerts: true,
      orderUpdates: true,
      sustainability: true,
      marketing: false,
    },
  },
  addresses: [
    {
      id: 1,
      type: "home",
      name: "Casa",
      street: "Av. Reforma 123",
      city: "Ciudad de México",
      state: "CDMX",
      zipCode: "06600",
      country: "México",
      isDefault: true,
    },
    {
      id: 2,
      type: "work",
      name: "Oficina",
      street: "Polanco 456",
      city: "Ciudad de México",
      state: "CDMX",
      zipCode: "11560",
      country: "México",
      isDefault: false,
    },
  ],
  paymentMethods: [
    {
      id: 1,
      type: "card",
      brand: "Visa",
      last4: "4242",
      expiryMonth: 12,
      expiryYear: 2025,
      isDefault: true,
    },
    {
      id: 2,
      type: "card",
      brand: "Mastercard",
      last4: "8888",
      expiryMonth: 8,
      expiryYear: 2026,
      isDefault: false,
    },
  ],
}

export default function UserProfile() {
  const [activeTab, setActiveTab] = useState("personal")
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState(userData.personal)

  const handleSave = () => {
    // Here you would typically save to your backend
    console.log("Saving profile data:", formData)
    setIsEditing(false)
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  return (
    <DashboardLayout>
      <DashboardHeader
        title="Mi Perfil"
        subtitle="Información personal y configuración"
        breadcrumbs={[
          { label: 'Dashboard', href: '/dashboard' },
          { label: 'Mi Perfil' }
        ]}
      />
      <div className="p-6 space-y-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="personal">Personal</TabsTrigger>
            <TabsTrigger value="preferences">Preferencias</TabsTrigger>
            <TabsTrigger value="addresses">Direcciones</TabsTrigger>
            <TabsTrigger value="payments">Pagos</TabsTrigger>
            <TabsTrigger value="privacy">Privacidad</TabsTrigger>
          </TabsList>

          {/* Personal Information Tab */}
          <TabsContent value="personal" className="space-y-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="flex items-center">
                    <User className="w-5 h-5 mr-2" />
                    Información Personal
                  </CardTitle>
                  <CardDescription>Actualiza tu información básica</CardDescription>
                </div>
                <Button
                  variant={isEditing ? "default" : "outline"}
                  onClick={isEditing ? handleSave : () => setIsEditing(true)}
                >
                  {isEditing ? (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Guardar
                    </>
                  ) : (
                    <>
                      <Edit className="w-4 h-4 mr-2" />
                      Editar
                    </>
                  )}
                </Button>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">Nombre</Label>
                    <Input
                      id="firstName"
                      value={formData.firstName}
                      onChange={(e) => handleInputChange("firstName", e.target.value)}
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Apellido</Label>
                    <Input
                      id="lastName"
                      value={formData.lastName}
                      onChange={(e) => handleInputChange("lastName", e.target.value)}
                      disabled={!isEditing}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Teléfono</Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => handleInputChange("phone", e.target.value)}
                      disabled={!isEditing}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="birthDate">Fecha de Nacimiento</Label>
                  <Input
                    id="birthDate"
                    type="date"
                    value={formData.birthDate}
                    onChange={(e) => handleInputChange("birthDate", e.target.value)}
                    disabled={!isEditing}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio">Biografía</Label>
                  <Textarea
                    id="bio"
                    value={formData.bio}
                    onChange={(e) => handleInputChange("bio", e.target.value)}
                    disabled={!isEditing}
                    rows={4}
                    placeholder="Cuéntanos sobre ti y tus intereses en sostenibilidad..."
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Preferences Tab */}
          <TabsContent value="preferences" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Leaf className="w-5 h-5 mr-2" />
                  Preferencias de Sostenibilidad
                </CardTitle>
                <CardDescription>Personaliza tu experiencia de compra sostenible</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label className="text-base font-medium">Áreas de Interés</Label>
                  <p className="text-sm text-gray-500 mb-3">Selecciona los temas que más te interesan</p>
                  <div className="flex flex-wrap gap-2">
                    {userData.preferences.sustainabilityFocus.map((focus, index) => (
                      <Badge key={index} variant="secondary" className="bg-green-100 text-green-800">
                        {focus}
                      </Badge>
                    ))}
                    <Button variant="outline" size="sm">
                      <Plus className="w-4 h-4 mr-1" />
                      Agregar
                    </Button>
                  </div>
                </div>

                <Separator />

                <div>
                  <Label className="text-base font-medium">Categorías Preferidas</Label>
                  <p className="text-sm text-gray-500 mb-3">Productos que más te interesan</p>
                  <div className="flex flex-wrap gap-2">
                    {userData.preferences.preferredCategories.map((category, index) => (
                      <Badge key={index} variant="outline">
                        {category}
                      </Badge>
                    ))}
                  </div>
                </div>

                <Separator />

                <div>
                  <Label className="text-base font-medium">Rango de Precio Preferido</Label>
                  <p className="text-sm text-gray-500 mb-3">Para recibir recomendaciones personalizadas</p>
                  <select className="w-full p-2 border rounded-md">
                    <option value="0-500">$0 - $500</option>
                    <option value="500-1000">$500 - $1,000</option>
                    <option value="1000-5000" selected>
                      $1,000 - $5,000
                    </option>
                    <option value="5000+">$5,000+</option>
                  </select>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Bell className="w-5 h-5 mr-2" />
                  Notificaciones
                </CardTitle>
                <CardDescription>Controla qué notificaciones quieres recibir</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {Object.entries(userData.preferences.notifications).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between">
                    <div>
                      <Label className="text-sm font-medium">
                        {key === "newProducts" && "Nuevos Productos"}
                        {key === "priceAlerts" && "Alertas de Precio"}
                        {key === "orderUpdates" && "Actualizaciones de Pedidos"}
                        {key === "sustainability" && "Tips de Sostenibilidad"}
                        {key === "marketing" && "Ofertas y Promociones"}
                      </Label>
                      <p className="text-xs text-gray-500">
                        {key === "newProducts" && "Notificaciones sobre productos nuevos"}
                        {key === "priceAlerts" && "Cuando bajen los precios de productos guardados"}
                        {key === "orderUpdates" && "Estado de tus pedidos y envíos"}
                        {key === "sustainability" && "Consejos para ser más sostenible"}
                        {key === "marketing" && "Ofertas especiales y descuentos"}
                      </p>
                    </div>
                    <Switch checked={value} />
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Addresses Tab */}
          <TabsContent value="addresses" className="space-y-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="flex items-center">
                    <MapPin className="w-5 h-5 mr-2" />
                    Direcciones de Envío
                  </CardTitle>
                  <CardDescription>Gestiona tus direcciones de entrega</CardDescription>
                </div>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Nueva Dirección
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {userData.addresses.map((address) => (
                    <div key={address.id} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <h4 className="font-medium">{address.name}</h4>
                            {address.isDefault && (
                              <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                                Predeterminada
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-gray-600">
                            {address.street}
                            <br />
                            {address.city}, {address.state} {address.zipCode}
                            <br />
                            {address.country}
                          </p>
                        </div>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm">
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Payment Methods Tab */}
          <TabsContent value="payments" className="space-y-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="flex items-center">
                    <CreditCard className="w-5 h-5 mr-2" />
                    Métodos de Pago
                  </CardTitle>
                  <CardDescription>Gestiona tus tarjetas y métodos de pago</CardDescription>
                </div>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Agregar Tarjeta
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {userData.paymentMethods.map((method) => (
                    <div key={method.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded flex items-center justify-center">
                            <CreditCard className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <p className="font-medium">
                              {method.brand} •••• {method.last4}
                            </p>
                            <p className="text-sm text-gray-500">
                              Expira {method.expiryMonth}/{method.expiryYear}
                            </p>
                          </div>
                          {method.isDefault && (
                            <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                              Predeterminada
                            </Badge>
                          )}
                        </div>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm">
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Privacy Tab */}
          <TabsContent value="privacy" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Shield className="w-5 h-5 mr-2" />
                  Configuración de Privacidad
                </CardTitle>
                <CardDescription>Controla cómo usamos tu información</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-sm font-medium">Perfil Público</Label>
                      <p className="text-xs text-gray-500">Permite que otros usuarios vean tu perfil</p>
                    </div>
                    <Switch />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-sm font-medium">Compartir Impacto Ambiental</Label>
                      <p className="text-xs text-gray-500">Mostrar tus métricas de sostenibilidad</p>
                    </div>
                    <Switch defaultChecked />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-sm font-medium">Análisis de Compras</Label>
                      <p className="text-xs text-gray-500">Usar datos para mejorar recomendaciones</p>
                    </div>
                    <Switch defaultChecked />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-sm font-medium">Cookies de Marketing</Label>
                      <p className="text-xs text-gray-500">Personalizar anuncios y ofertas</p>
                    </div>
                    <Switch />
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h4 className="font-medium">Gestión de Datos</h4>
                  <div className="space-y-2">
                    <Button variant="outline" className="w-full justify-start bg-transparent">
                      Descargar mis datos
                    </Button>
                    <Button variant="outline" className="w-full justify-start bg-transparent">
                      Eliminar mi cuenta
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
