"use client"

import { useState, useEffect, useCallback } from 'react'
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
  MoreHorizontal,
  Calendar,
  TrendingUp,
  DollarSign,
  AlertCircle,
  RotateCcw,
  Download
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { VendorDashboardLayout } from '@/components/shared/layout/VendorDashboardLayout'

interface Order {
  id: string
  status: string
  total: number
  subtotal: number
  tax: number
  shipping: number
  paymentMethod: string
  paymentStatus: string
  trackingNumber?: string
  estimatedDelivery?: string
  actualDelivery?: string
  createdAt: string
  updatedAt: string
  user: {
    id: string
    name: string
    email: string
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
      sku: string
    }
  }>
}

interface OrderSummary {
  totalRevenue: number
  monthlyRevenue: number
  pendingOrders: number
  processingOrders: number
  statusCounts: Record<string, number>
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

export default function VendorOrdersPage() {
  const { data: session } = useSession()
  const router = useRouter()
  const [orders, setOrders] = useState<Order[]>([])
  const [summary, setSummary] = useState<OrderSummary | null>(null)
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [timeRange, setTimeRange] = useState('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [actionLoading, setActionLoading] = useState(false)
  const [dialogType, setDialogType] = useState<'processing' | 'shipping' | 'cancel' | null>(null)

  // Form states for actions
  const [trackingNumber, setTrackingNumber] = useState('')
  const [estimatedDelivery, setEstimatedDelivery] = useState('')
  const [cancelReason, setCancelReason] = useState('')

  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '20',
        timeRange,
        sortBy: 'createdAt',
        sortOrder: 'desc'
      })

      if (statusFilter !== 'all') {
        params.append('status', statusFilter)
      }

      const response = await fetch(`/api/vendor/orders?${params}`)
      const data = await response.json()

      if (data.success) {
        setOrders(data.data)
        setSummary(data.summary)
        setTotalPages(data.meta.totalPages)
      } else {
        console.error('Error fetching orders:', data.error)
      }
    } catch (error) {
      console.error('Error fetching orders:', error)
    } finally {
      setLoading(false)
    }
  }, [currentPage, timeRange, statusFilter])

  useEffect(() => {
    if (session?.user.roles?.includes('VENDOR') || session?.user.role === 'VENDOR') {
      fetchOrders()
    } else if (session?.user.role) {
      router.push('/dashboard')
    }
  }, [session, fetchOrders, router])

  const handleOrderAction = async (orderId: string, action: string, data: Record<string, unknown> = {}) => {
    try {
      setActionLoading(true)
      const response = await fetch('/api/vendor/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          orderId,
          action,
          data
        })
      })

      const result = await response.json()

      if (result.success) {
        // Refresh orders
        fetchOrders()
        // Reset form states
        setTrackingNumber('')
        setEstimatedDelivery('')
        setCancelReason('')
        setSelectedOrder(null)
        setDialogType(null)
      } else {
        console.error('Error updating order:', result.error)
        alert('Error al actualizar el pedido: ' + result.error)
      }
    } catch (error) {
      console.error('Error updating order:', error)
      alert('Error al actualizar el pedido')
    } finally {
      setActionLoading(false)
    }
  }

  const openDialog = (order: Order, type: 'processing' | 'shipping' | 'cancel') => {
    setSelectedOrder(order)
    setDialogType(type)
  }

  const closeDialog = () => {
    setSelectedOrder(null)
    setDialogType(null)
    setTrackingNumber('')
    setEstimatedDelivery('')
    setCancelReason('')
  }

  const filteredOrders = orders.filter(order =>
    order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    order.user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    order.user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    order.items.some(item =>
      item.product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.product.sku.toLowerCase().includes(searchQuery.toLowerCase())
    )
  )

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-MX', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
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

  if (!session) {
    return null
  }

  return (
    <VendorDashboardLayout>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Gestión de Pedidos</h1>
            <p className="text-gray-600">Administra y da seguimiento a todos tus pedidos</p>
          </div>

        {/* Summary Cards */}
        {summary && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Ingresos Totales</p>
                    <p className="text-2xl font-bold text-gray-900">
                      ${summary.totalRevenue.toFixed(2)}
                    </p>
                  </div>
                  <DollarSign className="h-8 w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Este Mes</p>
                    <p className="text-2xl font-bold text-gray-900">
                      ${summary.monthlyRevenue.toFixed(2)}
                    </p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Pendientes</p>
                    <p className="text-2xl font-bold text-yellow-600">
                      {summary.pendingOrders}
                    </p>
                  </div>
                  <AlertCircle className="h-8 w-8 text-yellow-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Procesando</p>
                    <p className="text-2xl font-bold text-blue-600">
                      {summary.processingOrders}
                    </p>
                  </div>
                  <Package className="h-8 w-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between mb-6">
          <div className="flex flex-1 items-center space-x-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Buscar por ID, cliente, producto..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Estado" />
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
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-48">
                <Calendar className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Período" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todo el tiempo</SelectItem>
                <SelectItem value="today">Hoy</SelectItem>
                <SelectItem value="week">Última semana</SelectItem>
                <SelectItem value="month">Último mes</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Exportar
          </Button>
        </div>

        {/* Orders Table */}
        <Card>
          <CardHeader>
            <CardTitle>Pedidos ({filteredOrders.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto"></div>
                <p className="mt-4 text-gray-600">Cargando pedidos...</p>
              </div>
            ) : filteredOrders.length === 0 ? (
              <div className="text-center py-12">
                <Package className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No hay pedidos</h3>
                <p className="text-gray-600">
                  {searchQuery || statusFilter !== 'all' || timeRange !== 'all'
                    ? 'No se encontraron pedidos con los filtros aplicados.'
                    : 'Aún no tienes pedidos.'}
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredOrders.map((order) => {
                  const StatusIcon = getStatusIcon(order.status)

                  return (
                    <div key={order.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center justify-center w-10 h-10 bg-gray-100 rounded-full">
                            <StatusIcon className="w-5 h-5 text-gray-600" />
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-900">
                              #{order.id.slice(-8).toUpperCase()}
                            </h4>
                            <p className="text-sm text-gray-600">
                              {order.user.name} • {formatDate(order.createdAt)}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-4">
                          <div className="text-right">
                            <p className="font-semibold">${order.total.toFixed(2)}</p>
                            <Badge className={getStatusColor(order.status)}>
                              {getStatusLabel(order.status)}
                            </Badge>
                          </div>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreHorizontal className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>
                                <Eye className="w-4 h-4 mr-2" />
                                Ver Detalles
                              </DropdownMenuItem>
                              {order.status === 'PENDING' && (
                                <DropdownMenuItem
                                  onClick={() => openDialog(order, 'processing')}
                                >
                                  <Package className="w-4 h-4 mr-2" />
                                  Marcar como Procesando
                                </DropdownMenuItem>
                              )}
                              {order.status === 'PROCESSING' && (
                                <DropdownMenuItem
                                  onClick={() => openDialog(order, 'shipping')}
                                >
                                  <Truck className="w-4 h-4 mr-2" />
                                  Agregar Envío
                                </DropdownMenuItem>
                              )}
                              {['PENDING', 'PROCESSING'].includes(order.status) && (
                                <DropdownMenuItem
                                  onClick={() => openDialog(order, 'cancel')}
                                  className="text-red-600"
                                >
                                  <XCircle className="w-4 h-4 mr-2" />
                                  Cancelar Pedido
                                </DropdownMenuItem>
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>

                      <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                        <div>
                          <span className="text-gray-600">Cliente:</span>
                          <p className="font-medium">{order.user.name}</p>
                          <p className="text-gray-500">{order.user.email}</p>
                        </div>
                        <div>
                          <span className="text-gray-600">Productos:</span>
                          <p className="font-medium">{order.items.length} artículos</p>
                          <p className="text-gray-500">
                            {order.items.slice(0, 2).map(item => item.product.name).join(', ')}
                            {order.items.length > 2 && '...'}
                          </p>
                        </div>
                        <div>
                          <span className="text-gray-600">Pago:</span>
                          <p className="font-medium">{order.paymentMethod}</p>
                          <Badge variant="secondary" className="text-xs">
                            {order.paymentStatus === 'PAID' ? 'Pagado' : 'Pendiente'}
                          </Badge>
                        </div>
                      </div>

                      {order.trackingNumber && (
                        <div className="mt-3 p-2 bg-blue-50 rounded text-sm">
                          <span className="text-blue-700 font-medium">Seguimiento:</span>
                          <span className="ml-2 font-mono">{order.trackingNumber}</span>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            )}
          </CardContent>
        </Card>

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

        {/* Action Dialogs */}
        {selectedOrder && (
          <>
            {/* Mark as Processing Dialog */}
            {dialogType === 'processing' && (
              <Dialog open={true} onOpenChange={closeDialog}>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Marcar Pedido como Procesando</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="estimated-delivery">Fecha de Entrega Estimada (Opcional)</Label>
                      <Input
                        id="estimated-delivery"
                        type="date"
                        value={estimatedDelivery}
                        onChange={(e) => setEstimatedDelivery(e.target.value)}
                        min={new Date().toISOString().split('T')[0]}
                      />
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        onClick={() => handleOrderAction(selectedOrder.id, 'markAsProcessing', {
                          estimatedDelivery: estimatedDelivery || undefined
                        })}
                        disabled={actionLoading}
                        className="flex-1"
                      >
                        {actionLoading ? 'Procesando...' : 'Confirmar'}
                      </Button>
                      <Button
                        variant="outline"
                        onClick={closeDialog}
                        className="flex-1"
                      >
                        Cancelar
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            )}

            {/* Add Tracking Dialog */}
            {dialogType === 'shipping' && (
              <Dialog open={true} onOpenChange={closeDialog}>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Agregar Información de Envío</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="tracking-number">Número de Seguimiento *</Label>
                      <Input
                        id="tracking-number"
                        value={trackingNumber}
                        onChange={(e) => setTrackingNumber(e.target.value)}
                        placeholder="Ej: 1234567890"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="estimated-delivery">Fecha de Entrega Estimada</Label>
                      <Input
                        id="estimated-delivery"
                        type="date"
                        value={estimatedDelivery}
                        onChange={(e) => setEstimatedDelivery(e.target.value)}
                        min={new Date().toISOString().split('T')[0]}
                      />
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        onClick={() => handleOrderAction(selectedOrder.id, 'addTrackingNumber', {
                          trackingNumber,
                          estimatedDelivery: estimatedDelivery || undefined
                        })}
                        disabled={actionLoading || !trackingNumber}
                        className="flex-1"
                      >
                        {actionLoading ? 'Enviando...' : 'Marcar como Enviado'}
                      </Button>
                      <Button
                        variant="outline"
                        onClick={closeDialog}
                        className="flex-1"
                      >
                        Cancelar
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            )}

            {/* Cancel Order Dialog */}
            {dialogType === 'cancel' && (
              <Dialog open={true} onOpenChange={closeDialog}>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Cancelar Pedido</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="cancel-reason">Motivo de la Cancelación *</Label>
                      <Textarea
                        id="cancel-reason"
                        value={cancelReason}
                        onChange={(e) => setCancelReason(e.target.value)}
                        placeholder="Explica el motivo de la cancelación..."
                        required
                      />
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        variant="destructive"
                        onClick={() => handleOrderAction(selectedOrder.id, 'cancelOrder', {
                          reason: cancelReason
                        })}
                        disabled={actionLoading || !cancelReason}
                        className="flex-1"
                      >
                        {actionLoading ? 'Cancelando...' : 'Cancelar Pedido'}
                      </Button>
                      <Button
                        variant="outline"
                        onClick={closeDialog}
                        className="flex-1"
                      >
                        Mantener Pedido
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            )}
          </>
        )}
        </div>
      </div>
    </VendorDashboardLayout>
  )
}