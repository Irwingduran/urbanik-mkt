"use client"

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import {
  Package,
  Truck,
  CheckCircle,
  XCircle,
  Clock,
  Eye,
  Filter,
  Search,
  ArrowLeft,
  Leaf,
  RotateCcw,
  CreditCard
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import Header from '@/components/layout/header'
import Link from 'next/link'

interface Order {
  id: string
  status: string
  total: number
  subtotal: number
  tax: number
  shipping: number
  paymentMethod: string
  trackingNumber?: string
  estimatedDelivery?: string
  actualDelivery?: string
  createdAt: string
  updatedAt: string
  vendor: {
    id: string
    companyName: string
    user: { name: string }
  }
  items: Array<{
    id: string
    quantity: number
    price: number
    total: number
    product: {
      id: string
      name: string
      images: string[]
      regenScore: number
    }
  }>
  environmentalImpact: {
    co2Saved: number
    waterSaved: number
    energyGenerated: number
  }
  itemCount: number
  totalRegenScore: number
}

const statusConfig = {
  PENDING: {
    icon: Clock,
    color: 'bg-yellow-100 text-yellow-800',
    label: 'Pendiente'
  },
  PROCESSING: {
    icon: Package,
    color: 'bg-blue-100 text-blue-800',
    label: 'Procesando'
  },
  SHIPPED: {
    icon: Truck,
    color: 'bg-purple-100 text-purple-800',
    label: 'Enviado'
  },
  DELIVERED: {
    icon: CheckCircle,
    color: 'bg-green-100 text-green-800',
    label: 'Entregado'
  },
  CANCELLED: {
    icon: XCircle,
    color: 'bg-red-100 text-red-800',
    label: 'Cancelado'
  },
  RETURNED: {
    icon: RotateCcw,
    color: 'bg-gray-100 text-gray-800',
    label: 'Devuelto'
  }
}

export default function OrdersPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalOrders, setTotalOrders] = useState(0)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin')
    }
  }, [status, router])

  useEffect(() => {
    if (session?.user) {
      fetchOrders()
    }
  }, [session, currentPage, statusFilter])

  const fetchOrders = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '10'
      })

      if (statusFilter !== 'all') {
        params.append('status', statusFilter)
      }

      const response = await fetch(`/api/user/orders?${params}`)
      const data = await response.json()

      if (data.success) {
        setOrders(data.data)
        setTotalPages(data.meta.totalPages)
        setTotalOrders(data.meta.total)
      } else {
        console.error('Error fetching orders:', data.error)
      }
    } catch (error) {
      console.error('Error fetching orders:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredOrders = orders.filter(order =>
    order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    order.vendor.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    order.items.some(item =>
      item.product.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
  )

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-MX', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const getStatusIcon = (status: string) => {
    const config = statusConfig[status as keyof typeof statusConfig]
    if (!config) return Clock
    return config.icon
  }

  const getStatusColor = (status: string) => {
    const config = statusConfig[status as keyof typeof statusConfig]
    return config?.color || 'bg-gray-100 text-gray-800'
  }

  const getStatusLabel = (status: string) => {
    const config = statusConfig[status as keyof typeof statusConfig]
    return config?.label || status
  }

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
      </div>
    )
  }

  if (!session) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <Link href="/marketplace">
                <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-900">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Volver al Marketplace
                </Button>
              </Link>
            </div>
            <div className="text-right">
              <h1 className="text-3xl font-bold text-gray-900">Mis Pedidos</h1>
              <p className="text-gray-600">
                {totalOrders} {totalOrders === 1 ? 'pedido' : 'pedidos'} en total
              </p>
            </div>
          </div>

          {/* Filters and Search */}
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="flex flex-1 items-center space-x-4">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Buscar por ID, tienda o producto..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-48">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Filtrar por estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los estados</SelectItem>
                  <SelectItem value="PENDING">Pendiente</SelectItem>
                  <SelectItem value="PROCESSING">Procesando</SelectItem>
                  <SelectItem value="SHIPPED">Enviado</SelectItem>
                  <SelectItem value="DELIVERED">Entregado</SelectItem>
                  <SelectItem value="CANCELLED">Cancelado</SelectItem>
                  <SelectItem value="RETURNED">Devuelto</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Orders List */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Cargando pedidos...</p>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="text-center py-12">
            <Package className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No hay pedidos</h3>
            <p className="text-gray-600 mb-6">
              {searchQuery || statusFilter !== 'all'
                ? 'No se encontraron pedidos con los filtros aplicados.'
                : 'Aún no has realizado ningún pedido.'}
            </p>
            <Link href="/marketplace">
              <Button className="bg-green-600 hover:bg-green-700 text-white">
                <Leaf className="w-4 h-4 mr-2" />
                Explorar Productos
              </Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredOrders.map((order) => {
              const StatusIcon = getStatusIcon(order.status)

              return (
                <Card key={order.id} className="overflow-hidden">
                  <CardHeader className="bg-gray-50 border-b">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div>
                          <CardTitle className="text-lg">
                            Pedido #{order.id.slice(-8).toUpperCase()}
                          </CardTitle>
                          <p className="text-sm text-gray-600">
                            {formatDate(order.createdAt)} • {order.vendor.companyName}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <Badge className={getStatusColor(order.status)}>
                          <StatusIcon className="w-3 h-3 mr-1" />
                          {getStatusLabel(order.status)}
                        </Badge>
                        <Link href={`/orders/${order.id}`}>
                          <Button variant="outline" size="sm">
                            <Eye className="w-4 h-4 mr-2" />
                            Ver Detalles
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="p-6">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                      {/* Order Items */}
                      <div className="lg:col-span-2">
                        <h4 className="font-semibold text-gray-900 mb-3">
                          Productos ({order.itemCount})
                        </h4>
                        <div className="space-y-3">
                          {order.items.slice(0, 3).map((item) => (
                            <div key={item.id} className="flex items-center space-x-3">
                              <div className="w-12 h-12 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                                <img
                                  src={item.product.images[0] || '/placeholder.svg'}
                                  alt={item.product.name}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <div className="flex-1">
                                <p className="font-medium text-sm text-gray-900">
                                  {item.product.name}
                                </p>
                                <p className="text-xs text-gray-600">
                                  Cantidad: {item.quantity} × ${item.price.toFixed(2)}
                                </p>
                              </div>
                              <div className="text-right">
                                <p className="font-semibold text-sm">
                                  ${item.total.toFixed(2)}
                                </p>
                              </div>
                            </div>
                          ))}
                          {order.items.length > 3 && (
                            <p className="text-sm text-gray-600 italic">
                              +{order.items.length - 3} productos más
                            </p>
                          )}
                        </div>

                        {/* Environmental Impact */}
                        <div className="mt-4 p-3 bg-green-50 rounded-lg">
                          <div className="flex items-center space-x-2 mb-2">
                            <Leaf className="w-4 h-4 text-green-600" />
                            <span className="text-sm font-medium text-green-900">
                              Impacto Ambiental
                            </span>
                          </div>
                          <div className="grid grid-cols-3 gap-2 text-xs text-green-700">
                            <div>
                              <div className="font-semibold">
                                {order.environmentalImpact.co2Saved.toFixed(1)}kg
                              </div>
                              <div>CO₂ ahorrado</div>
                            </div>
                            <div>
                              <div className="font-semibold">
                                {order.environmentalImpact.waterSaved.toFixed(0)}L
                              </div>
                              <div>Agua ahorrada</div>
                            </div>
                            <div>
                              <div className="font-semibold">
                                {order.totalRegenScore}
                              </div>
                              <div>Puntos REGEN</div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Order Summary */}
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-3">Resumen</h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Subtotal:</span>
                            <span>${order.subtotal.toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Envío:</span>
                            <span className={order.shipping === 0 ? 'text-green-600' : ''}>
                              {order.shipping === 0 ? 'Gratis' : `$${order.shipping.toFixed(2)}`}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Impuestos:</span>
                            <span>${order.tax.toFixed(2)}</span>
                          </div>
                          <Separator />
                          <div className="flex justify-between font-semibold">
                            <span>Total:</span>
                            <span>${order.total.toFixed(2)} MXN</span>
                          </div>
                        </div>

                        {/* Tracking Info */}
                        {order.trackingNumber && (
                          <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                            <div className="flex items-center space-x-2 mb-1">
                              <Truck className="w-4 h-4 text-blue-600" />
                              <span className="text-sm font-medium text-blue-900">
                                Seguimiento
                              </span>
                            </div>
                            <p className="text-xs text-blue-700 font-mono">
                              {order.trackingNumber}
                            </p>
                            {order.estimatedDelivery && (
                              <p className="text-xs text-blue-700 mt-1">
                                Entrega estimada: {formatDate(order.estimatedDelivery)}
                              </p>
                            )}
                          </div>
                        )}

                        {/* Payment Method */}
                        <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center space-x-2">
                            <CreditCard className="w-4 h-4 text-gray-600" />
                            <span className="text-sm text-gray-700">
                              {order.paymentMethod}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center space-x-2 mt-8">
            <Button
              variant="outline"
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
            >
              Anterior
            </Button>
            <span className="text-sm text-gray-600">
              Página {currentPage} de {totalPages}
            </span>
            <Button
              variant="outline"
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
            >
              Siguiente
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}