'use client'

import { useSession } from 'next-auth/react'
import { DashboardLayout, DashboardHeader } from '@/components/shared/layout/DashboardLayout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import {
  ShoppingCart,
  Heart,
  Leaf,
  Droplets,
  Zap,
  Package,
  TrendingUp,
  Award,
  Calendar
} from 'lucide-react'
import Link from 'next/link'
import { useVendorStatus } from '@/hooks/useVendorStatus'
import { useUserDashboard } from '@/hooks/useUserDashboard'
import { BecomeVendorBanner } from '@/components/dashboard/BecomeVendorBanner'
import { VendorApplicationPending } from '@/components/dashboard/VendorApplicationPending'
import { VendorApplicationRejected } from '@/components/dashboard/VendorApplicationRejected'
import { VendorDashboardLink } from '@/components/dashboard/VendorDashboardLink'

export default function UserDashboardPage() {
  const { data: session } = useSession()
  const { status, isLoading, application, vendorProfile } = useVendorStatus()
  const { data: dashboardData, loading: dashboardLoading, error: dashboardError } = useUserDashboard()

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Por favor inicia sesión para acceder a tu dashboard.</p>
      </div>
    )
  }

  // Usar datos reales si están disponibles, sino mostrar skeleton/vacío
  const userData = dashboardData || null
  const userName = userData?.user?.name || session.user?.name || 'Usuario'

  // Renderiza el componente correcto según el estado del vendedor
  const renderVendorSection = () => {
    if (isLoading) {
      return null // Evitar parpadeo mientras carga
    }

    switch (status) {
      case 'approved':
        return vendorProfile ? <VendorDashboardLink vendorProfile={vendorProfile} /> : null
      case 'pending':
      case 'in_review':
        return application ? <VendorApplicationPending application={application} /> : null
      case 'rejected':
        return application ? <VendorApplicationRejected application={application} /> : null
      case 'not_applied':
      default:
        return <BecomeVendorBanner />
    }
  }

  return (
    <DashboardLayout>
      <DashboardHeader
        title="Dashboard"
        subtitle={`Bienvenido de nuevo, ${userName}!`}
        breadcrumbs={[
          { label: 'Inicio', href: '/' },
          { label: 'Dashboard' }
        ]}
      />

      <div className="p-6 space-y-8">
        {/* Sección de Vendedor - Condicional */}
        {renderVendorSection()}

        {dashboardError && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-700">Error al cargar el dashboard: {dashboardError}</p>
          </div>
        )}

        {dashboardLoading ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Leaf className="w-5 h-5 text-green-600" />
                  <span>Tu Impacto Ambiental</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 animate-pulse">
                  <div className="h-32 bg-gray-200 rounded"></div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Package className="w-5 h-5 text-blue-600" />
                  <span>Órdenes Recientes</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 animate-pulse">
                  <div className="h-24 bg-gray-200 rounded"></div>
                </div>
              </CardContent>
            </Card>
          </div>
        ) : userData ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Impacto Ambiental */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Leaf className="w-5 h-5 text-green-600" />
                  <span>Tu Impacto Ambiental</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <Droplets className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-blue-600">{userData.impactMetrics.waterSaved.toLocaleString()}</p>
                    <p className="text-sm text-gray-600">litros ahorrados</p>
                  </div>
                  <div className="text-center p-4 bg-yellow-50 rounded-lg">
                    <Zap className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-yellow-600">{userData.impactMetrics.energyGenerated}</p>
                    <p className="text-sm text-gray-600">kWh generados</p>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <Award className="w-8 h-8 text-green-600 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-green-600">{userData.impactMetrics.treesPlanted}</p>
                    <p className="text-sm text-gray-600">árboles plantados</p>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <Leaf className="w-8 h-8 text-green-600 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-green-600">{userData.impactMetrics.co2Saved}</p>
                    <p className="text-sm text-gray-600">kg CO₂ ahorrado</p>
                  </div>
                </div>

                {/* Trending indicators */}
                <div className="border-t pt-4 space-y-2">
                  <h4 className="text-sm font-medium text-gray-700">Tendencia este mes</h4>
                  <div className="space-y-1 text-xs text-gray-600">
                    <div className="flex justify-between">
                      <span>CO₂ Ahorrado:</span>
                      <span className={userData.trending.co2SavedGrowth > 0 ? 'text-green-600 font-medium' : 'text-gray-600'}>
                        {userData.trending.co2SavedGrowth > 0 ? '+' : ''}{userData.trending.co2SavedGrowth}%
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Agua Ahorrada:</span>
                      <span className={userData.trending.waterSavedGrowth > 0 ? 'text-green-600 font-medium' : 'text-gray-600'}>
                        {userData.trending.waterSavedGrowth > 0 ? '+' : ''}{userData.trending.waterSavedGrowth}%
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Órdenes Recientes */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Package className="w-5 h-5 text-blue-600" />
                    <span>Órdenes Recientes</span>
                  </div>
                  <Link href="/dashboard/orders">
                    <Button variant="outline" size="sm">Ver Todas</Button>
                  </Link>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {userData.recentOrders.length > 0 ? (
                  userData.recentOrders.map((order) => (
                    <div key={order.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <span className="font-medium">#{order.id}</span>
                          <Badge variant={order.status === 'delivered' ? 'default' : 'secondary'}>
                            {order.status === 'delivered' ? 'Entregado' : order.status === 'pending' ? 'Pendiente' : 'Enviado'}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600">{order.vendor}</p>
                        <div className="flex items-center space-x-4 text-sm text-gray-500 mt-1">
                          <span className="flex items-center space-x-1">
                            <Calendar className="w-3 h-3" />
                            <span>{order.date}</span>
                          </span>
                          <span>{order.items} artículos</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">${order.total.toFixed(2)}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <Package className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                    <p>No tienes órdenes aún</p>
                    <Link href="/marketplace">
                      <Button variant="link" size="sm" className="mt-2">Empezar a comprar</Button>
                    </Link>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        ) : null}

        {/* Acciones Rápidas y Estadísticas */}
        {userData && !dashboardLoading && (
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {/* Stats Cards */}
            <div className="md:col-span-1">
              <Card>
                <CardContent className="p-4">
                  <div className="text-center">
                    <p className="text-3xl font-bold text-blue-600">{userData.stats.totalOrders}</p>
                    <p className="text-xs text-gray-600 mt-1">Órdenes Totales</p>
                  </div>
                </CardContent>
              </Card>
            </div>
            <div className="md:col-span-1">
              <Card>
                <CardContent className="p-4">
                  <div className="text-center">
                    <p className="text-3xl font-bold text-green-600">{userData.stats.regenScore}</p>
                    <p className="text-xs text-gray-600 mt-1">Regen Score</p>
                  </div>
                </CardContent>
              </Card>
            </div>
            <div className="md:col-span-1">
              <Card>
                <CardContent className="p-4">
                  <div className="text-center">
                    <p className="text-3xl font-bold text-purple-600">{userData.stats.loyaltyPoints}</p>
                    <p className="text-xs text-gray-600 mt-1">Puntos Lealtad</p>
                  </div>
                </CardContent>
              </Card>
            </div>
            <div className="md:col-span-1">
              <Card>
                <CardContent className="p-4">
                  <div className="text-center">
                    <p className="text-3xl font-bold text-pink-600">{userData.stats.wishlistItems}</p>
                    <p className="text-xs text-gray-600 mt-1">Guardados</p>
                  </div>
                </CardContent>
              </Card>
            </div>
            <div className="md:col-span-1">
              <Card>
                <CardContent className="p-4">
                  <div className="text-center">
                    <p className="text-3xl font-bold text-amber-600">${(userData.stats.totalSpent).toLocaleString('es-ES', { maximumFractionDigits: 0 })}</p>
                    <p className="text-xs text-gray-600 mt-1">Gastado</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* Acciones Rápidas */}
        <Card>
          <CardHeader>
            <CardTitle>Acciones Rápidas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Link href="/marketplace">
                <Button variant="outline" className="w-full h-16 flex flex-col items-center space-y-2">
                  <ShoppingCart className="w-6 h-6" />
                  <span className="text-sm">Explorar Productos</span>
                </Button>
              </Link>
              <Link href="/dashboard/orders">
                <Button variant="outline" className="w-full h-16 flex flex-col items-center space-y-2">
                  <Package className="w-6 h-6" />
                  <span className="text-sm">Mis Órdenes</span>
                </Button>
              </Link>
              <Link href="/dashboard/wishlist">
                <Button variant="outline" className="w-full h-16 flex flex-col items-center space-y-2">
                  <Heart className="w-6 h-6" />
                  <span className="text-sm">Lista de Deseos</span>
                </Button>
              </Link>
              <Link href="/dashboard/impact">
                <Button variant="outline" className="w-full h-16 flex flex-col items-center space-y-2">
                  <Leaf className="w-6 h-6" />
                  <span className="text-sm">Reporte de Impacto</span>
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}