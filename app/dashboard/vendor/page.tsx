'use client'

import { useSession } from 'next-auth/react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Package,
  DollarSign,
  ShoppingCart,
  TrendingUp,
  Plus,
  BarChart3,
  Users,
  Star,
  Settings,
  FileText
} from 'lucide-react'
import Link from 'next/link'

export default function VendorDashboard() {
  const { data: session } = useSession()

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Dashboard Vendedor
          </h1>
          <p className="text-gray-600 mt-1">
            Bienvenido, {session?.user?.name || 'Vendedor'}
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Link href="/dashboard/vendor/products/new">
            <Button className="w-full h-auto py-4 flex items-center justify-center gap-2" size="lg">
              <Plus className="w-5 h-5" />
              <span>Crear Producto</span>
            </Button>
          </Link>

          <Link href="/dashboard/vendor/orders">
            <Button variant="outline" className="w-full h-auto py-4 flex items-center justify-center gap-2" size="lg">
              <ShoppingCart className="w-5 h-5" />
              <span>Ver Órdenes</span>
            </Button>
          </Link>

          <Link href="/dashboard/vendor/analytics">
            <Button variant="outline" className="w-full h-auto py-4 flex items-center justify-center gap-2" size="lg">
              <BarChart3 className="w-5 h-5" />
              <span>Analytics</span>
            </Button>
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Productos Activos
              </CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0</div>
              <p className="text-xs text-muted-foreground">
                En tu inventario
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Ventas del Mes
              </CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$0</div>
              <p className="text-xs text-muted-foreground">
                +0% del mes pasado
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Órdenes Pendientes
              </CardTitle>
              <ShoppingCart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0</div>
              <p className="text-xs text-muted-foreground">
                Por procesar
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Calificación
              </CardTitle>
              <Star className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0.0</div>
              <p className="text-xs text-muted-foreground">
                0 reseñas
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
              <div className="text-center py-12">
                <ShoppingCart className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-sm text-gray-500">
                  No tienes órdenes recientes aún.
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  Las órdenes aparecerán aquí cuando los clientes compren tus productos.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Quick Links */}
          <Card>
            <CardHeader>
              <CardTitle>Gestión Rápida</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Link href="/dashboard/vendor/products">
                <Button variant="outline" className="w-full justify-start" size="sm">
                  <Package className="w-4 h-4 mr-2" />
                  Mis Productos
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
              <CardTitle>Resumen de Rendimiento</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-2 border-b">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-green-600" />
                    <span className="text-sm text-gray-700">Productos más vendidos</span>
                  </div>
                  <span className="text-sm font-medium text-gray-900">-</span>
                </div>

                <div className="flex items-center justify-between pb-2 border-b">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-blue-600" />
                    <span className="text-sm text-gray-700">Nuevos clientes</span>
                  </div>
                  <span className="text-sm font-medium text-gray-900">0</span>
                </div>

                <div className="flex items-center justify-between pb-2 border-b">
                  <div className="flex items-center gap-2">
                    <Star className="w-4 h-4 text-yellow-600" />
                    <span className="text-sm text-gray-700">Nuevas reseñas</span>
                  </div>
                  <span className="text-sm font-medium text-gray-900">0</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <BarChart3 className="w-4 h-4 text-purple-600" />
                    <span className="text-sm text-gray-700">Tasa de conversión</span>
                  </div>
                  <span className="text-sm font-medium text-gray-900">0%</span>
                </div>
              </div>
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
    </div>
  )
}
