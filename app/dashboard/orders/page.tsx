"use client"

import { useState } from "react"
import { DashboardLayout, DashboardHeader } from "@/components/shared/layout/DashboardLayout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Search,
  Filter,
  Package,
  Truck,
  CheckCircle,
  Clock,
  Star,
  Eye,
  Download,
  MessageCircle,
  RefreshCw,
  MapPin,
  Calendar,
} from "lucide-react"

// Mock orders data
const ordersData = [
  {
    id: "ORD-2024-001",
    date: "2024-01-15",
    status: "delivered",
    total: 1299,
    items: [
      {
        id: 1,
        name: "Panel Solar Bifacial 450W",
        quantity: 1,
        price: 1299,
        image: "/placeholder.svg?height=60&width=60",
        vendor: "EcoTech Solutions",
      },
    ],
    shipping: {
      method: "Envío Estándar",
      trackingNumber: "ECO123456789",
      estimatedDelivery: "2024-01-18",
      actualDelivery: "2024-01-17",
      address: "Av. Reforma 123, CDMX",
    },
    vendor: "EcoTech Solutions",
    canReview: true,
    canReturn: true,
  },
  {
    id: "ORD-2024-002",
    date: "2024-01-10",
    status: "shipped",
    total: 850,
    items: [
      {
        id: 2,
        name: "Sistema Captación Agua Lluvia 500L",
        quantity: 1,
        price: 850,
        image: "/placeholder.svg?height=60&width=60",
        vendor: "AquaTech Verde",
      },
    ],
    shipping: {
      method: "Envío Express",
      trackingNumber: "AQU987654321",
      estimatedDelivery: "2024-01-12",
      address: "Polanco 456, CDMX",
    },
    vendor: "AquaTech Verde",
    canReview: false,
    canReturn: false,
  },
  {
    id: "ORD-2024-003",
    date: "2024-01-05",
    status: "processing",
    total: 2100,
    items: [
      {
        id: 3,
        name: "Cargador Vehicular Eléctrico 22kW",
        quantity: 1,
        price: 1800,
        image: "/placeholder.svg?height=60&width=60",
        vendor: "GreenEnergy Co",
      },
      {
        id: 4,
        name: "Cable de Carga Tipo 2",
        quantity: 1,
        price: 300,
        image: "/placeholder.svg?height=60&width=60",
        vendor: "GreenEnergy Co",
      },
    ],
    shipping: {
      method: "Envío Estándar",
      estimatedDelivery: "2024-01-08",
      address: "Av. Reforma 123, CDMX",
    },
    vendor: "GreenEnergy Co",
    canReview: false,
    canReturn: false,
  },
  {
    id: "ORD-2023-045",
    date: "2023-12-20",
    status: "cancelled",
    total: 450,
    items: [
      {
        id: 5,
        name: "Compostador Inteligente IoT",
        quantity: 1,
        price: 450,
        image: "/placeholder.svg?height=60&width=60",
        vendor: "SmartCompost",
      },
    ],
    vendor: "SmartCompost",
    canReview: false,
    canReturn: false,
    cancelReason: "Producto fuera de stock",
  },
]

const getStatusColor = (status: string) => {
  switch (status) {
    case "delivered":
      return "bg-green-100 text-green-800"
    case "shipped":
      return "bg-blue-100 text-blue-800"
    case "processing":
      return "bg-yellow-100 text-yellow-800"
    case "cancelled":
      return "bg-red-100 text-red-800"
    default:
      return "bg-gray-100 text-gray-800"
  }
}

const getStatusText = (status: string) => {
  switch (status) {
    case "delivered":
      return "Entregado"
    case "shipped":
      return "Enviado"
    case "processing":
      return "Procesando"
    case "cancelled":
      return "Cancelado"
    default:
      return "Desconocido"
  }
}

const getStatusIcon = (status: string) => {
  switch (status) {
    case "delivered":
      return CheckCircle
    case "shipped":
      return Truck
    case "processing":
      return Clock
    case "cancelled":
      return RefreshCw
    default:
      return Package
  }
}

export default function UserOrders() {
  const [searchTerm, setSearchTerm] = useState("")
  const [activeTab, setActiveTab] = useState("all")

  const filteredOrders = ordersData.filter((order) => {
    const matchesSearch =
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.vendor.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.items.some((item) => item.name.toLowerCase().includes(searchTerm.toLowerCase()))

    const matchesTab = activeTab === "all" || order.status === activeTab

    return matchesSearch && matchesTab
  })

  const orderCounts = {
    all: ordersData.length,
    processing: ordersData.filter((o) => o.status === "processing").length,
    shipped: ordersData.filter((o) => o.status === "shipped").length,
    delivered: ordersData.filter((o) => o.status === "delivered").length,
    cancelled: ordersData.filter((o) => o.status === "cancelled").length,
  }

  return (
    <DashboardLayout>
      <DashboardHeader
        title="Mis Pedidos"
        subtitle="Rastrea y gestiona todos tus pedidos"
        breadcrumbs={[
          { label: 'Dashboard', href: '/dashboard' },
          { label: 'Pedidos' }
        ]}
      />

      <div className="p-6 space-y-6">

        {/* Search and Filters */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Buscar por número de pedido, producto o vendedor..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button variant="outline">
                <Filter className="w-4 h-4 mr-2" />
                Filtros
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Order Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="all">Todos ({orderCounts.all})</TabsTrigger>
            <TabsTrigger value="processing">Procesando ({orderCounts.processing})</TabsTrigger>
            <TabsTrigger value="shipped">Enviados ({orderCounts.shipped})</TabsTrigger>
            <TabsTrigger value="delivered">Entregados ({orderCounts.delivered})</TabsTrigger>
            <TabsTrigger value="cancelled">Cancelados ({orderCounts.cancelled})</TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="space-y-4">
            {filteredOrders.length === 0 ? (
              <Card>
                <CardContent className="text-center py-12">
                  <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No se encontraron pedidos</h3>
                  <p className="text-gray-500">
                    {searchTerm ? "Intenta con otros términos de búsqueda" : "Aún no tienes pedidos en esta categoría"}
                  </p>
                </CardContent>
              </Card>
            ) : (
              filteredOrders.map((order) => {
                const StatusIcon = getStatusIcon(order.status)

                return (
                  <Card key={order.id} className="overflow-hidden">
                    <CardHeader className="pb-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                            <StatusIcon className="w-5 h-5 text-green-600" />
                          </div>
                          <div>
                            <CardTitle className="text-lg">Pedido #{order.id}</CardTitle>
                            <CardDescription className="flex items-center space-x-4">
                              <span className="flex items-center">
                                <Calendar className="w-4 h-4 mr-1" />
                                {order.date}
                              </span>
                              <span>•</span>
                              <span>{order.vendor}</span>
                            </CardDescription>
                          </div>
                        </div>
                        <div className="text-right">
                          <Badge className={getStatusColor(order.status)}>{getStatusText(order.status)}</Badge>
                          <p className="text-lg font-bold mt-1">${order.total}</p>
                        </div>
                      </div>
                    </CardHeader>

                    <CardContent className="space-y-4">
                      {/* Order Items */}
                      <div className="space-y-3">
                        {order.items.map((item) => (
                          <div key={item.id} className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                            <img
                              src={item.image || "/placeholder.svg"}
                              alt={item.name}
                              className="w-12 h-12 rounded-lg object-cover"
                            />
                            <div className="flex-1">
                              <h4 className="font-medium text-sm">{item.name}</h4>
                              <p className="text-xs text-gray-500">Cantidad: {item.quantity}</p>
                            </div>
                            <div className="text-right">
                              <p className="font-medium">${item.price}</p>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Shipping Info */}
                      {order.shipping && (
                        <div className="bg-blue-50 p-4 rounded-lg">
                          <div className="flex items-start justify-between">
                            <div>
                              <h4 className="font-medium text-sm mb-2">Información de Envío</h4>
                              <div className="space-y-1 text-sm text-gray-600">
                                <p className="flex items-center">
                                  <Truck className="w-4 h-4 mr-2" />
                                  {order.shipping.method}
                                </p>
                                <p className="flex items-center">
                                  <MapPin className="w-4 h-4 mr-2" />
                                  {order.shipping.address}
                                </p>
                                {order.shipping.trackingNumber && (
                                  <p className="font-mono text-xs bg-white px-2 py-1 rounded">
                                    Tracking: {order.shipping.trackingNumber}
                                  </p>
                                )}
                              </div>
                            </div>
                            <div className="text-right text-sm">
                              {order.shipping.actualDelivery ? (
                                <p className="text-green-600 font-medium">Entregado: {order.shipping.actualDelivery}</p>
                              ) : (
                                <p className="text-blue-600">Estimado: {order.shipping.estimatedDelivery}</p>
                              )}
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Cancel Reason */}
                      {order.status === "cancelled" && order.cancelReason && (
                        <div className="bg-red-50 p-4 rounded-lg">
                          <h4 className="font-medium text-sm text-red-800 mb-1">Motivo de Cancelación</h4>
                          <p className="text-sm text-red-600">{order.cancelReason}</p>
                        </div>
                      )}

                      {/* Action Buttons */}
                      <div className="flex flex-wrap gap-2 pt-4 border-t">
                        <Button variant="outline" size="sm">
                          <Eye className="w-4 h-4 mr-2" />
                          Ver Detalles
                        </Button>

                        {order.shipping?.trackingNumber && order.status === "shipped" && (
                          <Button variant="outline" size="sm">
                            <Truck className="w-4 h-4 mr-2" />
                            Rastrear Envío
                          </Button>
                        )}

                        {order.canReview && (
                          <Button variant="outline" size="sm">
                            <Star className="w-4 h-4 mr-2" />
                            Calificar
                          </Button>
                        )}

                        <Button variant="outline" size="sm">
                          <Download className="w-4 h-4 mr-2" />
                          Factura
                        </Button>

                        <Button variant="outline" size="sm">
                          <MessageCircle className="w-4 h-4 mr-2" />
                          Contactar Vendedor
                        </Button>

                        {order.canReturn && (
                          <Button variant="outline" size="sm">
                            <RefreshCw className="w-4 h-4 mr-2" />
                            Solicitar Devolución
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                )
              })
            )}
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
