"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  Package,
  Search,
  Filter,
  MoreHorizontal,
  Eye,
  Truck,
  CheckCircle,
  Clock,
  AlertCircle,
  DollarSign,
  TrendingUp,
  Calendar,
  User,
} from "lucide-react"
import VendorHeader from "@/components/dashboard/vendor-header"

// Mock data para pedidos
const ordersData = {
  summary: {
    totalOrders: 156,
    pendingOrders: 8,
    monthlyRevenue: 12500,
    avgOrderValue: 425,
  },
  orders: [
    {
      id: "ORD-001",
      customer: "María González",
      email: "maria@email.com",
      date: "2024-01-15",
      status: "pending",
      total: 599.98,
      items: 2,
      products: ["Panel Solar 400W", "Inversor 2kW"],
      shippingAddress: "Calle 123, Ciudad, País",
      paymentMethod: "Tarjeta de Crédito",
    },
    {
      id: "ORD-002",
      customer: "Carlos Rodríguez",
      email: "carlos@email.com",
      date: "2024-01-14",
      status: "processing",
      total: 1299.99,
      items: 1,
      products: ["Batería Litio 100Ah"],
      shippingAddress: "Av. Principal 456, Ciudad, País",
      paymentMethod: "PayPal",
    },
    {
      id: "ORD-003",
      customer: "Ana Martínez",
      email: "ana@email.com",
      date: "2024-01-13",
      status: "shipped",
      total: 899.99,
      items: 3,
      products: ["Cargador VE", "Cable Tipo 2", "Adaptador"],
      shippingAddress: "Plaza Central 789, Ciudad, País",
      paymentMethod: "Transferencia",
      trackingNumber: "TRK123456789",
    },
    {
      id: "ORD-004",
      customer: "Luis Fernández",
      email: "luis@email.com",
      date: "2024-01-12",
      status: "delivered",
      total: 2199.98,
      items: 2,
      products: ["Panel Solar 400W x2"],
      shippingAddress: "Sector Norte 321, Ciudad, País",
      paymentMethod: "Tarjeta de Débito",
      deliveredDate: "2024-01-15",
    },
    {
      id: "ORD-005",
      customer: "Sofia López",
      email: "sofia@email.com",
      date: "2024-01-11",
      status: "cancelled",
      total: 449.99,
      items: 1,
      products: ["Inversor 1kW"],
      shippingAddress: "Zona Sur 654, Ciudad, País",
      paymentMethod: "Tarjeta de Crédito",
      cancelReason: "Solicitado por el cliente",
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

export default function OrdersPage() {
  const [activeTab, setActiveTab] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { label: "Pendiente", className: "bg-yellow-100 text-yellow-800" },
      processing: { label: "Procesando", className: "bg-blue-100 text-blue-800" },
      shipped: { label: "Enviado", className: "bg-purple-100 text-purple-800" },
      delivered: { label: "Entregado", className: "bg-green-100 text-green-800" },
      cancelled: { label: "Cancelado", className: "bg-red-100 text-red-800" },
    }

    const config = statusConfig[status as keyof typeof statusConfig]
    return <Badge className={config.className}>{config.label}</Badge>
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="w-4 h-4 text-yellow-600" />
      case "processing":
        return <Package className="w-4 h-4 text-blue-600" />
      case "shipped":
        return <Truck className="w-4 h-4 text-purple-600" />
      case "delivered":
        return <CheckCircle className="w-4 h-4 text-green-600" />
      case "cancelled":
        return <AlertCircle className="w-4 h-4 text-red-600" />
      default:
        return <Clock className="w-4 h-4 text-gray-600" />
    }
  }

  const filteredOrders = ordersData.orders.filter((order) => {
    const matchesSearch =
      order.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.id.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesTab = activeTab === "all" || order.status === activeTab
    return matchesSearch && matchesTab
  })

  const getOrdersByStatus = (status: string) => {
    return ordersData.orders.filter((order) => order.status === status).length
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <VendorHeader vendorData={vendorData} />

      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Gestión de Pedidos</h1>
            <p className="text-gray-600 mt-2">Administra y da seguimiento a todos tus pedidos</p>
          </div>
        </div>

        {/* Resumen Ejecutivo */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Pedidos</p>
                  <p className="text-2xl font-bold text-gray-900">{ordersData.summary.totalOrders}</p>
                </div>
                <Package className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Pedidos Pendientes</p>
                  <p className="text-2xl font-bold text-yellow-600">{ordersData.summary.pendingOrders}</p>
                </div>
                <Clock className="w-8 h-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Ingresos Mensuales</p>
                  <p className="text-2xl font-bold text-green-600">
                    ${ordersData.summary.monthlyRevenue.toLocaleString()}
                  </p>
                </div>
                <DollarSign className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Valor Promedio</p>
                  <p className="text-2xl font-bold text-blue-600">${ordersData.summary.avgOrderValue}</p>
                </div>
                <TrendingUp className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filtros y Búsqueda */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Lista de Pedidos</CardTitle>
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <Input
                    placeholder="Buscar pedidos..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 w-64"
                  />
                </div>
                <Button variant="outline">
                  <Filter className="w-4 h-4 mr-2" />
                  Filtros
                </Button>
              </div>
            </div>
          </CardHeader>
        </Card>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="all">Todos ({ordersData.orders.length})</TabsTrigger>
            <TabsTrigger value="pending">Pendientes ({getOrdersByStatus("pending")})</TabsTrigger>
            <TabsTrigger value="processing">Procesando ({getOrdersByStatus("processing")})</TabsTrigger>
            <TabsTrigger value="shipped">Enviados ({getOrdersByStatus("shipped")})</TabsTrigger>
            <TabsTrigger value="delivered">Entregados ({getOrdersByStatus("delivered")})</TabsTrigger>
            <TabsTrigger value="cancelled">Cancelados ({getOrdersByStatus("cancelled")})</TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab}>
            <div className="space-y-4">
              {filteredOrders.map((order) => (
                <Card key={order.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                          {getStatusIcon(order.status)}
                        </div>
                        <div>
                          <div className="flex items-center space-x-2 mb-1">
                            <h3 className="font-semibold text-gray-900">#{order.id}</h3>
                            {getStatusBadge(order.status)}
                          </div>
                          <div className="flex items-center space-x-4 text-sm text-gray-600">
                            <div className="flex items-center space-x-1">
                              <User className="w-4 h-4" />
                              <span>{order.customer}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Calendar className="w-4 h-4" />
                              <span>{new Date(order.date).toLocaleDateString()}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Package className="w-4 h-4" />
                              <span>
                                {order.items} producto{order.items > 1 ? "s" : ""}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-4">
                        <div className="text-right">
                          <p className="text-lg font-bold text-gray-900">${order.total.toFixed(2)}</p>
                          <p className="text-sm text-gray-600">{order.paymentMethod}</p>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="sm">
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Eye className="w-4 h-4 mr-2" />
                              Ver Detalles
                            </DropdownMenuItem>
                            {order.status === "pending" && (
                              <DropdownMenuItem>
                                <Package className="w-4 h-4 mr-2" />
                                Procesar Pedido
                              </DropdownMenuItem>
                            )}
                            {order.status === "processing" && (
                              <DropdownMenuItem>
                                <Truck className="w-4 h-4 mr-2" />
                                Marcar como Enviado
                              </DropdownMenuItem>
                            )}
                            {order.trackingNumber && (
                              <DropdownMenuItem>
                                <Truck className="w-4 h-4 mr-2" />
                                Ver Seguimiento
                              </DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>

                    {/* Detalles del Pedido */}
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <h4 className="font-medium text-gray-900 mb-2">Productos</h4>
                          <ul className="text-sm text-gray-600 space-y-1">
                            {order.products.map((product, index) => (
                              <li key={index}>• {product}</li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900 mb-2">Dirección de Envío</h4>
                          <p className="text-sm text-gray-600">{order.shippingAddress}</p>
                          {order.trackingNumber && (
                            <p className="text-sm text-blue-600 mt-1">Tracking: {order.trackingNumber}</p>
                          )}
                          {order.deliveredDate && (
                            <p className="text-sm text-green-600 mt-1">
                              Entregado: {new Date(order.deliveredDate).toLocaleDateString()}
                            </p>
                          )}
                          {order.cancelReason && (
                            <p className="text-sm text-red-600 mt-1">Motivo: {order.cancelReason}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
