'use client'

import { useSession } from 'next-auth/react'
import { VendorDashboardLayout, VendorDashboardHeader } from '@/components/shared/layout/VendorDashboardLayout'
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
    <VendorDashboardLayout>
      <VendorDashboardHeader
        title="Dashboard Vendedor"
        subtitle={`Bienvenido, ${session?.user?.name || 'Vendedor'}`}
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
              <div className="text-2xl font-bold text-gray-900">0</div>
              <p className="text-xs text-gray-600 mt-1">
                En tu inventario
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
              <div className="text-2xl font-bold text-gray-900">$0</div>
              <p className="text-xs text-gray-600 mt-1">
                +0% del mes pasado
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
              <div className="text-2xl font-bold text-gray-900">0</div>
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
              <div className="text-2xl font-bold text-gray-900">0.0</div>
              <p className="text-xs text-gray-600 mt-1">
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
    </VendorDashboardLayout>
  )
}
