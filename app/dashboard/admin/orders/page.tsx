'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Input } from '@/components/ui/input'
import {
  AlertCircle,
  Search,
  Filter,
  ShoppingCart,
  Eye,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  Package,
} from 'lucide-react'

interface OrderItem {
  id: string
  quantity: number
  price: number
  product: {
    id: string
    name: string
    sku: string
  }
}

interface Order {
  id: string
  status: 'PENDING' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED' | 'RETURNED'
  total: number
  user: {
    name: string
    email: string
  }
  items: OrderItem[]
  createdAt: string
}

interface PaginationData {
  page: number
  limit: number
  total: number
  pages: number
}

export default function AdminOrdersPage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  const [orders, setOrders] = useState<Order[]>([])
  const [pagination, setPagination] = useState<PaginationData>({
    page: 1,
    limit: 20,
    total: 0,
    pages: 0,
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [currentPage, setCurrentPage] = useState(1)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/signin')
      return
    }

    if (status === 'authenticated' && session?.user.role !== 'ADMIN') {
      router.push('/dashboard')
      return
    }

    if (status === 'authenticated') {
      fetchOrders()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, session, router])

  useEffect(() => {
    if (status === 'authenticated' && session?.user.role === 'ADMIN') {
      fetchOrders()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, filterStatus])

  const fetchOrders = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '20',
        ...(searchTerm && { search: searchTerm }),
        ...(filterStatus !== 'all' && { status: filterStatus }),
      })

      const response = await fetch(`/api/admin/orders?${params}`)

      if (!response.ok) {
        throw new Error('Error al cargar órdenes')
      }

      const data = await response.json()
      setOrders(data.data.orders || [])
      setPagination(data.data.pagination)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido')
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setCurrentPage(1)
    fetchOrders()
  }

  const handleRefresh = () => {
    setCurrentPage(1)
    fetchOrders()
  }

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      PENDING: { color: 'bg-yellow-100 text-yellow-800', label: 'Pendiente' },
      PROCESSING: { color: 'bg-blue-100 text-blue-800', label: 'Procesando' },
      SHIPPED: { color: 'bg-purple-100 text-purple-800', label: 'Enviado' },
      DELIVERED: { color: 'bg-green-100 text-green-800', label: 'Entregado' },
      CANCELLED: { color: 'bg-red-100 text-red-800', label: 'Cancelado' },
      RETURNED: { color: 'bg-orange-100 text-orange-800', label: 'Devuelto' },
    }

    const config = statusConfig[status as keyof typeof statusConfig] || {
      color: 'bg-gray-100 text-gray-800',
      label: status,
    }

    return <Badge className={config.color}>{config.label}</Badge>
  }

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('es-MX', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  if (status === 'loading' || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando órdenes...</p>
        </div>
      </div>
    )
  }

  if (!session || session.user.role !== 'ADMIN') {
    return null
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestión de Órdenes</h1>
          <p className="text-gray-600 mt-1">Monitor y administración completa de órdenes</p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={handleRefresh}
          className="gap-2"
        >
          <RefreshCw className="w-4 h-4" />
          Refrescar
        </Button>
      </div>

      {error && (
        <Alert className="border-red-200 bg-red-50">
          <AlertCircle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">Error: {error}</AlertDescription>
        </Alert>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-blue-600">{pagination.total}</p>
              <p className="text-sm text-gray-600 mt-1">Órdenes Totales</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-green-600">
                {orders.filter(o => o.status === 'DELIVERED').length}
              </p>
              <p className="text-sm text-gray-600 mt-1">Entregadas</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-yellow-600">
                {orders.filter(o => o.status === 'PENDING').length}
              </p>
              <p className="text-sm text-gray-600 mt-1">Pendientes</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-red-600">
                {orders.filter(o => o.status === 'CANCELLED').length}
              </p>
              <p className="text-sm text-gray-600 mt-1">Canceladas</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Buscar por ID de orden, email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Status Filter */}
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-500" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="all">Todos los estados</option>
                <option value="PENDING">Pendientes</option>
                <option value="PROCESSING">Procesando</option>
                <option value="SHIPPED">Enviado</option>
                <option value="DELIVERED">Entregado</option>
                <option value="CANCELLED">Cancelado</option>
                <option value="RETURNED">Devuelto</option>
              </select>
            </div>

            <Button type="submit" className="gap-2">
              <Search className="w-4 h-4" />
              Buscar
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Orders Table */}
      <Card>
        <CardHeader>
          <CardTitle>
            Órdenes ({pagination.total})
          </CardTitle>
          <CardDescription>
            Página {pagination.page} de {pagination.pages}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {orders.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <ShoppingCart className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>No hay órdenes que coincidan con los filtros</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">ID Orden</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Cliente</th>
                    <th className="text-center py-3 px-4 font-semibold text-gray-700">Artículos</th>
                    <th className="text-center py-3 px-4 font-semibold text-gray-700">Total</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Estado</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Fecha</th>
                    <th className="text-center py-3 px-4 font-semibold text-gray-700">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <code className="bg-gray-100 px-2 py-1 rounded text-xs font-mono">
                          {order.id.substring(0, 8)}...
                        </code>
                      </td>
                      <td className="py-3 px-4">
                        <div className="text-sm">
                          <p className="font-medium text-gray-900">{order.user.name}</p>
                          <p className="text-xs text-gray-500">{order.user.email}</p>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <Badge className="bg-gray-100 text-gray-800 gap-1">
                          <Package className="w-3 h-3" />
                          {order.items.reduce((sum, item) => sum + item.quantity, 0)}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 text-center font-bold text-gray-900">
                        ${(order.total / 100).toFixed(2)}
                      </td>
                      <td className="py-3 px-4">
                        {getStatusBadge(order.status)}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-600">
                        {formatDate(order.createdAt)}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex justify-center">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => router.push(`/dashboard/admin/orders/${order.id}`)}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          {pagination.pages > 1 && (
            <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-200">
              <p className="text-sm text-gray-600">
                Mostrando página {pagination.page} de {pagination.pages}
              </p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="gap-2"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Anterior
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(Math.min(pagination.pages, currentPage + 1))}
                  disabled={currentPage === pagination.pages}
                  className="gap-2"
                >
                  Siguiente
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}