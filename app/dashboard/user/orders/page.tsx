"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useSession } from "next-auth/react"
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
  AlertCircle
} from "lucide-react"

interface OrderItem {
  id: string
  name: string
  quantity: number
  price: number
  image: string
  vendor: string
}

interface Order {
  id: string
  date: string
  status: string
  total: number
  items: OrderItem[]
  shipping: {
    method: string
    trackingNumber?: string
    estimatedDelivery?: string
    actualDelivery?: string
    address: string
  }
  vendor: string
  canReview: boolean
  canReturn: boolean
  cancelReason?: string
}

const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case "delivered":
    case "entregado":
      return "bg-green-100 text-green-800"
    case "shipped":
    case "enviado":
      return "bg-blue-100 text-blue-800"
    case "processing":
    case "procesando":
    case "pending":
    case "pendiente":
      return "bg-yellow-100 text-yellow-800"
    case "cancelled":
    case "cancelado":
      return "bg-red-100 text-red-800"
    default:
      return "bg-gray-100 text-gray-800"
  }
}

const getStatusText = (status: string) => {
  switch (status.toLowerCase()) {
    case "delivered":
      return "Entregado"
    case "shipped":
      return "Enviado"
    case "processing":
      return "Procesando"
    case "pending":
      return "Pendiente"
    case "cancelled":
      return "Cancelado"
    default:
      return status
  }
}

const getStatusIcon = (status: string) => {
  switch (status.toLowerCase()) {
    case "delivered":
      return CheckCircle
    case "shipped":
      return Truck
    case "processing":
    case "pending":
      return Clock
    case "cancelled":
      return RefreshCw
    default:
      return Package
  }
}

export default function UserOrders() {
  const { data: session } = useSession()
  const [orders, setOrders] = useState<Order[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [activeTab, setActiveTab] = useState("all")

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch('/api/user/orders?limit=50')
        if (!response.ok) {
          throw new Error('Error al cargar los pedidos')
        }
        const data = await response.json()
        
        if (data.success) {
          const mappedOrders = data.data.map((apiOrder: any) => ({
            id: apiOrder.id,
            date: new Date(apiOrder.createdAt).toLocaleDateString(),
            status: apiOrder.status.toLowerCase(),
            total: apiOrder.total,
            items: apiOrder.items.map((item: any) => ({
              id: item.id,
              name: item.product.name,
              quantity: item.quantity,
              price: item.price,
              image: item.product.images?.[0] || "/placeholder.svg",
              vendor: apiOrder.vendorProfile?.companyName || "Vendedor"
            })),
            shipping: {
              method: "Envío Estándar", // Default or from API if available
              trackingNumber: apiOrder.trackingNumber,
              estimatedDelivery: apiOrder.estimatedDelivery ? new Date(apiOrder.estimatedDelivery).toLocaleDateString() : undefined,
              actualDelivery: apiOrder.actualDelivery ? new Date(apiOrder.actualDelivery).toLocaleDateString() : undefined,
              address: apiOrder.shippingAddress ? `${apiOrder.shippingAddress.street}, ${apiOrder.shippingAddress.city}` : "Dirección no disponible"
            },
            vendor: apiOrder.vendorProfile?.companyName || "Vendedor",
            canReview: apiOrder.status === 'DELIVERED',
            canReturn: apiOrder.status === 'DELIVERED', // Simplified logic
            cancelReason: undefined // Not in API response yet
          }))
          setOrders(mappedOrders)
        }
      } catch (err) {
        console.error('Error fetching orders:', err)
        setError('No se pudieron cargar tus pedidos. Por favor intenta más tarde.')
      } finally {
        setIsLoading(false)
      }
    }

    if (session) {
      fetchOrders()
    }
  }, [session])

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.vendor.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.items.some((item) => item.name.toLowerCase().includes(searchTerm.toLowerCase()))

    const matchesTab = activeTab === "all" || order.status === activeTab

    return matchesSearch && matchesTab
  })

  const orderCounts = {
    all: orders.length,
    pending: orders.filter((o) => o.status === "pending").length,
    processing: orders.filter((o) => o.status === "processing").length,
    shipped: orders.filter((o) => o.status === "shipped").length,
    delivered: orders.filter((o) => o.status === "delivered").length,
    cancelled: orders.filter((o) => o.status === "cancelled").length,
  }

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
        </div>
      </DashboardLayout>
    )
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

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative mb-6" role="alert">
            <div className="flex items-center">
              <AlertCircle className="w-5 h-5 mr-2" />
              <span>{error}</span>
            </div>
          </div>
        )}

        {/* Order Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-6 h-auto">
            <TabsTrigger value="all">Todos ({orderCounts.all})</TabsTrigger>
            <TabsTrigger value="pending">Pendientes ({orderCounts.pending})</TabsTrigger>
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
                          <p className="text-lg font-bold mt-1">${order.total.toFixed(2)}</p>
                        </div>
                      </div>
                    </CardHeader>

                    <CardContent className="space-y-4">
                      {/* Order Items */}
                      <div className="space-y-3">
                        {order.items.map((item) => (
                          <div key={item.id} className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-12 h-12 rounded-lg object-cover"
                            />
                            <div className="flex-1">
                              <h4 className="font-medium text-sm">{item.name}</h4>
                              <p className="text-xs text-gray-500">Cantidad: {item.quantity}</p>
                            </div>
                            <div className="text-right">
                              <p className="font-medium">${item.price.toFixed(2)}</p>
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
                                <p className="text-blue-600">
                                  {order.shipping.estimatedDelivery ? `Estimado: ${order.shipping.estimatedDelivery}` : 'Fecha pendiente'}
                                </p>
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
                        <Link href={`/dashboard/user/orders/${order.id}`}>
                          <Button variant="outline" size="sm">
                            <Eye className="w-4 h-4 mr-2" />
                            Ver Detalles
                          </Button>
                        </Link>

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
