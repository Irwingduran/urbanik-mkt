"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { VendorDashboardLayout } from "@/components/shared/layout/VendorDashboardLayout"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Truck,
  Package,
  MapPin,
  Clock,
  CheckCircle,
  AlertTriangle,
  Plus,
  Search,
  Eye,
  Edit,
  BarChart3,
  Calendar,
  DollarSign,
} from "lucide-react"

// Mock data para envíos
const shippingData = {
  summary: {
    totalShipments: 89,
    inTransit: 12,
    delivered: 71,
    avgDeliveryTime: 3.2,
  },
  shipments: [
    {
      id: "SHP-001",
      orderId: "ORD-001",
      customer: "María González",
      destination: "Ciudad A, País",
      carrier: "EcoLogistics",
      trackingNumber: "ECO123456789",
      status: "in_transit",
      shippedDate: "2024-01-14",
      estimatedDelivery: "2024-01-17",
      actualDelivery: null,
      weight: 15.5,
      cost: 25.99,
      carbonFootprint: 2.1,
    },
    {
      id: "SHP-002",
      orderId: "ORD-002",
      customer: "Carlos Rodríguez",
      destination: "Ciudad B, País",
      carrier: "GreenShip",
      trackingNumber: "GRN987654321",
      status: "delivered",
      shippedDate: "2024-01-12",
      estimatedDelivery: "2024-01-15",
      actualDelivery: "2024-01-15",
      weight: 8.2,
      cost: 18.5,
      carbonFootprint: 1.4,
    },
    {
      id: "SHP-003",
      orderId: "ORD-003",
      customer: "Ana Martínez",
      destination: "Ciudad C, País",
      carrier: "EcoLogistics",
      trackingNumber: "ECO456789123",
      status: "pending",
      shippedDate: null,
      estimatedDelivery: "2024-01-18",
      actualDelivery: null,
      weight: 22.1,
      cost: 32.75,
      carbonFootprint: 2.8,
    },
    {
      id: "SHP-004",
      orderId: "ORD-004",
      customer: "Luis Fernández",
      destination: "Ciudad D, País",
      carrier: "SustainableDelivery",
      trackingNumber: "SUS789123456",
      status: "delivered",
      shippedDate: "2024-01-10",
      estimatedDelivery: "2024-01-13",
      actualDelivery: "2024-01-12",
      weight: 31.0,
      cost: 45.2,
      carbonFootprint: 3.2,
    },
  ],
  carriers: [
    {
      name: "EcoLogistics",
      rating: 4.8,
      avgDeliveryTime: 3.1,
      carbonEfficiency: 95,
      cost: "$$",
    },
    {
      name: "GreenShip",
      rating: 4.6,
      avgDeliveryTime: 3.5,
      carbonEfficiency: 92,
      cost: "$",
    },
    {
      name: "SustainableDelivery",
      rating: 4.9,
      avgDeliveryTime: 2.8,
      carbonEfficiency: 98,
      cost: "$$$",
    },
  ],
}

const vendorData = {
  name: "EcoTech Solutions",
  contactName: "Juan Pérez",
  email: "juan@ecotech.com",
  memberSince: "2024-01-15",
  regenScore: 78,
  nftLevel: "Hoja Creciente",
}

export default function ShippingPage() {
  const [activeTab, setActiveTab] = useState("shipments")
  const [searchTerm, setSearchTerm] = useState("")
  const [showCreateShipment, setShowCreateShipment] = useState(false)

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { label: "Pendiente", className: "bg-yellow-100 text-yellow-800" },
      in_transit: { label: "En Tránsito", className: "bg-blue-100 text-blue-800" },
      delivered: { label: "Entregado", className: "bg-green-100 text-green-800" },
      delayed: { label: "Retrasado", className: "bg-red-100 text-red-800" },
    }

    const config = statusConfig[status as keyof typeof statusConfig]
    return <Badge className={config.className}>{config.label}</Badge>
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="w-4 h-4 text-yellow-600" />
      case "in_transit":
        return <Truck className="w-4 h-4 text-blue-600" />
      case "delivered":
        return <CheckCircle className="w-4 h-4 text-green-600" />
      case "delayed":
        return <AlertTriangle className="w-4 h-4 text-red-600" />
      default:
        return <Package className="w-4 h-4 text-gray-600" />
    }
  }

  const filteredShipments = shippingData.shipments.filter((shipment) => {
    return (
      shipment.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      shipment.trackingNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      shipment.orderId.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })

  return (
    <VendorDashboardLayout>
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Gestión de Envíos</h1>
            <p className="text-gray-600 mt-2">Administra la logística y seguimiento de tus envíos</p>
          </div>
          <Dialog open={showCreateShipment} onOpenChange={setShowCreateShipment}>
            <DialogTrigger asChild>
              <Button className="bg-green-600 hover:bg-green-700">
                <Plus className="w-4 h-4 mr-2" />
                Crear Envío
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Crear Nuevo Envío</DialogTitle>
                <DialogDescription>Completa la información para crear un nuevo envío</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="orderId">ID del Pedido</Label>
                    <Input id="orderId" placeholder="ORD-001" />
                  </div>
                  <div>
                    <Label htmlFor="carrier">Transportista</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar transportista" />
                      </SelectTrigger>
                      <SelectContent>
                        {shippingData.carriers.map((carrier) => (
                          <SelectItem key={carrier.name} value={carrier.name}>
                            {carrier.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <Label htmlFor="destination">Dirección de Destino</Label>
                  <Textarea id="destination" placeholder="Dirección completa de entrega..." />
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="weight">Peso (kg)</Label>
                    <Input id="weight" type="number" placeholder="15.5" />
                  </div>
                  <div>
                    <Label htmlFor="estimatedDelivery">Fecha Estimada de Entrega</Label>
                    <Input id="estimatedDelivery" type="date" />
                  </div>
                </div>
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setShowCreateShipment(false)}>
                    Cancelar
                  </Button>
                  <Button className="bg-green-600 hover:bg-green-700">Crear Envío</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Resumen Ejecutivo */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Envíos</p>
                  <p className="text-2xl font-bold text-gray-900">{shippingData.summary.totalShipments}</p>
                </div>
                <Package className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">En Tránsito</p>
                  <p className="text-2xl font-bold text-blue-600">{shippingData.summary.inTransit}</p>
                </div>
                <Truck className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Entregados</p>
                  <p className="text-2xl font-bold text-green-600">{shippingData.summary.delivered}</p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Tiempo Promedio</p>
                  <p className="text-2xl font-bold text-purple-600">{shippingData.summary.avgDeliveryTime} días</p>
                </div>
                <Clock className="w-8 h-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="shipments">Envíos</TabsTrigger>
            <TabsTrigger value="carriers">Transportistas</TabsTrigger>
            <TabsTrigger value="analytics">Analíticas</TabsTrigger>
          </TabsList>

          <TabsContent value="shipments" className="space-y-6">
            {/* Filtros y Búsqueda */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Lista de Envíos</CardTitle>
                  <div className="relative">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <Input
                      placeholder="Buscar envíos..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 w-64"
                    />
                  </div>
                </div>
              </CardHeader>
            </Card>

            {/* Lista de Envíos */}
            <div className="space-y-4">
              {filteredShipments.map((shipment) => (
                <Card key={shipment.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                          {getStatusIcon(shipment.status)}
                        </div>
                        <div>
                          <div className="flex items-center space-x-2 mb-1">
                            <h3 className="font-semibold text-gray-900">#{shipment.id}</h3>
                            {getStatusBadge(shipment.status)}
                          </div>
                          <p className="text-sm text-gray-600">Pedido: {shipment.orderId}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button variant="outline" size="sm">
                          <Eye className="w-4 h-4 mr-1" />
                          Ver
                        </Button>
                        <Button variant="outline" size="sm">
                          <Edit className="w-4 h-4 mr-1" />
                          Editar
                        </Button>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6">
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">Cliente y Destino</h4>
                        <p className="text-sm text-gray-600 mb-1">{shipment.customer}</p>
                        <div className="flex items-center space-x-1 text-sm text-gray-600">
                          <MapPin className="w-4 h-4" />
                          <span>{shipment.destination}</span>
                        </div>
                      </div>

                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">Transportista y Tracking</h4>
                        <p className="text-sm text-gray-600 mb-1">{shipment.carrier}</p>
                        {shipment.trackingNumber && (
                          <p className="text-sm text-blue-600 font-mono">{shipment.trackingNumber}</p>
                        )}
                      </div>

                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">Fechas y Costos</h4>
                        <div className="space-y-1 text-sm text-gray-600">
                          {shipment.shippedDate && (
                            <div className="flex items-center space-x-1">
                              <Calendar className="w-4 h-4" />
                              <span>Enviado: {new Date(shipment.shippedDate).toLocaleDateString()}</span>
                            </div>
                          )}
                          <div className="flex items-center space-x-1">
                            <Clock className="w-4 h-4" />
                            <span>Estimado: {new Date(shipment.estimatedDelivery).toLocaleDateString()}</span>
                          </div>
                          {shipment.actualDelivery && (
                            <div className="flex items-center space-x-1 text-green-600">
                              <CheckCircle className="w-4 h-4" />
                              <span>Entregado: {new Date(shipment.actualDelivery).toLocaleDateString()}</span>
                            </div>
                          )}
                          <div className="flex items-center space-x-1">
                            <DollarSign className="w-4 h-4" />
                            <span>Costo: ${shipment.cost}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center space-x-4">
                          <span className="text-gray-600">Peso: {shipment.weight} kg</span>
                          <span className="text-green-600">Huella de Carbono: {shipment.carbonFootprint} kg CO₂</span>
                        </div>
                        {shipment.trackingNumber && (
                          <Button variant="outline" size="sm">
                            <Truck className="w-4 h-4 mr-1" />
                            Rastrear Envío
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="carriers" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Transportistas Disponibles</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {shippingData.carriers.map((carrier) => (
                    <Card key={carrier.name} className="border-2 hover:border-green-200 transition-colors">
                      <CardContent className="p-6">
                        <div className="text-center mb-4">
                          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                            <Truck className="w-8 h-8 text-green-600" />
                          </div>
                          <h3 className="font-semibold text-gray-900">{carrier.name}</h3>
                          <div className="flex items-center justify-center space-x-1 mt-1">
                            <span className="text-yellow-500">★</span>
                            <span className="text-sm text-gray-600">{carrier.rating}</span>
                          </div>
                        </div>

                        <div className="space-y-3">
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">Tiempo Promedio</span>
                            <span className="text-sm font-medium">{carrier.avgDeliveryTime} días</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">Eficiencia CO₂</span>
                            <Badge className="bg-green-100 text-green-800">{carrier.carbonEfficiency}%</Badge>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">Costo</span>
                            <span className="text-sm font-medium">{carrier.cost}</span>
                          </div>
                        </div>

                        <Button className="w-full mt-4 bg-green-600 hover:bg-green-700">Seleccionar</Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <BarChart3 className="w-5 h-5" />
                    <span>Rendimiento de Envíos</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12">
                    <BarChart3 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Analíticas de Envíos</h3>
                    <p className="text-gray-600">Próximamente: Reportes detallados de rendimiento logístico</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Impacto Ambiental</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Total CO₂ Ahorrado</span>
                      <span className="text-lg font-bold text-green-600">
                        {shippingData.shipments.reduce((acc, ship) => acc + ship.carbonFootprint, 0).toFixed(1)} kg
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Transportistas Eco-Friendly</span>
                      <span className="text-lg font-bold text-blue-600">100%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Eficiencia Promedio</span>
                      <span className="text-lg font-bold text-purple-600">
                        {Math.round(
                          shippingData.carriers.reduce((acc, carrier) => acc + carrier.carbonEfficiency, 0) /
                            shippingData.carriers.length,
                        )}
                        %
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
    </VendorDashboardLayout>
  )
}
