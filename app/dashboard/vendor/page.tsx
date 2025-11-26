'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { VendorDashboardLayout, VendorDashboardHeader } from '@/components/shared/layout/VendorDashboardLayout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Package,
  DollarSign,
  ShoppingCart,
  BarChart3,
  Users,
  Star,
  Settings,
  FileText
} from 'lucide-react'
import Link from 'next/link'
import { formatCurrency } from '@/lib/utils'

interface DashboardData {
  vendorInfo: {
    id: string
    companyName: string
    rating: number
    reviewCount: number
  }
  stats: {
    totalProducts: number
    activeProducts: number
    totalOrders: number
    pendingOrders: number
    monthlyRevenue: number
    monthlyOrderCount: number
    lowStockCount: number
  }
  recentOrders: Array<{
    id: string
    total: number
    status: string
    createdAt: string
    user: { name: string }
    items: Array<{
      product: { name: string; images: string[] }
      quantity: number
    }>
  }>
  topProducts: Array<{
    id: string
    name: string
    price: number
    totalSold: number
    images: string[]
  }>
}

export default function VendorDashboard() {
  const { data: session } = useSession()
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await fetch('/api/vendor/dashboard')
        const result = await response.json()
        if (result.success) {
          setData(result.data)
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error)
      } finally {
        setLoading(false)
      }
    }

    if (session?.user) {
      fetchDashboardData()
    }
  }, [session])

  return (
    <VendorDashboardLayout>
      <VendorDashboardHeader
        title="Dashboard Vendedor"
        subtitle={`Bienvenido, ${data?.vendorInfo?.companyName || session?.user?.name || 'Vendedor'}`}
        breadcrumbs={[
          { label: 'Dashboard Vendedor' }
        ]}
      />

      <div className="p-6 space-y-8">

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="border-l-4 border-l-green-600">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Productos Activos
              </CardTitle>
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <Package className="h-5 w-5 text-green-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">
                {loading ? '...' : data?.stats.activeProducts || 0}
              </div>
              <p className="text-xs text-gray-600 mt-1">
                De {data?.stats.totalProducts || 0} en total
              </p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-blue-600">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Ventas del Mes
              </CardTitle>
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <DollarSign className="h-5 w-5 text-blue-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">
                {loading ? '...' : formatCurrency(data?.stats.monthlyRevenue || 0)}
              </div>
              <p className="text-xs text-gray-600 mt-1">
                {data?.stats.monthlyOrderCount || 0} órdenes este mes
              </p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-purple-600">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Órdenes Pendientes
              </CardTitle>
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <ShoppingCart className="h-5 w-5 text-purple-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">
                {loading ? '...' : data?.stats.pendingOrders || 0}
              </div>
              <p className="text-xs text-gray-600 mt-1">
                Por procesar
              </p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-yellow-600">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Calificación
              </CardTitle>
              <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Star className="h-5 w-5 text-yellow-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">
                {loading ? '...' : (data?.vendorInfo?.rating || 0).toFixed(1)}
              </div>
              <p className="text-xs text-gray-600 mt-1">
                {data?.vendorInfo?.reviewCount || 0} reseñas
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Orders */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Órdenes Recientes</CardTitle>
                <Link href="/dashboard/vendor/orders">
                  <Button variant="ghost" size="sm">Ver Todas</Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-12">Cargando...</div>
              ) : data?.recentOrders && data.recentOrders.length > 0 ? (
                <div className="space-y-4">
                  {data.recentOrders.map((order) => (
                    <div key={order.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-gray-100 rounded-md flex items-center justify-center">
                          <ShoppingCart className="w-5 h-5 text-gray-500" />
                        </div>
                        <div>
                          <p className="font-medium text-sm">Pedido #{order.id.slice(-8)}</p>
                          <p className="text-xs text-gray-500">
                            {new Date(order.createdAt).toLocaleDateString()} • {order.user.name}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-sm">{formatCurrency(order.total)}</p>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          order.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                          order.status === 'COMPLETED' ? 'bg-green-100 text-green-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {order.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <ShoppingCart className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-sm text-gray-500">
                    No tienes órdenes recientes aún.
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    Las órdenes aparecerán aquí cuando los clientes compren tus productos.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quick Links */}
          <Card>
            <CardHeader>
              <CardTitle>Gestión Rápida</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Link href="/dashboard/vendor/analytics">
                <Button variant="outline" className="w-full justify-start" size="sm">
                  <BarChart3 className="w-4 h-4 mr-2" />
                  Analíticas
                </Button>
              </Link>
              <Link href="/dashboard/vendor/inventory">
                <Button variant="outline" className="w-full justify-start" size="sm">
                  <Package className="w-4 h-4 mr-2" />
                  Inventario
                </Button>
              </Link>
              <Link href="/dashboard/vendor/orders">
                <Button variant="outline" className="w-full justify-start" size="sm">
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  Pedidos
                </Button>
              </Link>

              <Link href="/dashboard/vendor/reviews">
                <Button variant="outline" className="w-full justify-start" size="sm">
                  <Star className="w-4 h-4 mr-2" />
                  Reseñas
                </Button>
              </Link>

              <Link href="/dashboard/vendor/customers">
                <Button variant="outline" className="w-full justify-start" size="sm">
                  <Users className="w-4 h-4 mr-2" />
                  Clientes
                </Button>
              </Link>

              <Link href="/dashboard/vendor/reports">
                <Button variant="outline" className="w-full justify-start" size="sm">
                  <FileText className="w-4 h-4 mr-2" />
                  Reportes
                </Button>
              </Link>

              <Link href="/dashboard/vendor/settings">
                <Button variant="outline" className="w-full justify-start" size="sm">
                  <Settings className="w-4 h-4 mr-2" />
                  Configuración
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Performance Overview */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Productos Más Vendidos</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-4">Cargando...</div>
              ) : data?.topProducts && data.topProducts.length > 0 ? (
                <div className="space-y-4">
                  {data.topProducts.map((product) => (
                    <div key={product.id} className="flex items-center justify-between pb-2 border-b last:border-0">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-gray-100 rounded overflow-hidden">
                          {product.images[0] && (
                            <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
                          )}
                        </div>
                        <span className="text-sm text-gray-700">{product.name}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-sm font-medium text-gray-900 block">{product.totalSold} vendidos</span>
                        <span className="text-xs text-gray-500">{formatCurrency(product.price)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-4 text-gray-500 text-sm">
                  No hay datos de ventas aún
                </div>
              )}
            </CardContent>
          </Card>

          {/* Tips Card */}
          <Card className="bg-gradient-to-br from-blue-50 to-purple-50">
            <CardHeader>
              <CardTitle className="text-base">💡 Consejos para Vender</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-0.5">✓</span>
                  <span>Sube fotos de alta calidad de tus productos</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-0.5">✓</span>
                  <span>Describe detalladamente los beneficios sostenibles</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-0.5">✓</span>
                  <span>Responde rápido a las preguntas de los clientes</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-0.5">✓</span>
                  <span>Mantén tu inventario actualizado</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </VendorDashboardLayout>
  )
}
