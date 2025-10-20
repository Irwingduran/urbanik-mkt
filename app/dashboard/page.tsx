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
import { BecomeVendorBanner } from '@/components/dashboard/BecomeVendorBanner'
import { VendorApplicationPending } from '@/components/dashboard/VendorApplicationPending'
import { VendorApplicationRejected } from '@/components/dashboard/VendorApplicationRejected'
import { VendorDashboardLink } from '@/components/dashboard/VendorDashboardLink'

// Datos de ejemplo - en producción vendrían de tu API
const mockUserData = {
  name: 'Ana García',
  email: 'ana.garcia@email.com',
  memberSince: '2024-01-15',
  totalOrders: 12,
  totalSpent: 2847.50,
  wishlistItems: 8,
  impactMetrics: {
    co2Saved: 45.2,
    waterSaved: 12450,
    energyGenerated: 89.5,
    treesPlanted: 3
  },
  recentOrders: [
    {
      id: 'ORD-001',
      date: '2024-03-15',
      status: 'delivered',
      total: 299.99,
      items: 2,
      vendor: 'EcoTech Solutions'
    },
    {
      id: 'ORD-002',
      date: '2024-03-10',
      status: 'shipped',
      total: 149.99,
      items: 1,
      vendor: 'Green Living Co.'
    }
  ],
  sustainabilityGoals: {
    co2Target: 100,
    waterTarget: 20000,
    currentProgress: 45
  }
}

export default function UserDashboardPage() {
  const { data: session } = useSession()
  const { status, isLoading, application, vendorProfile } = useVendorStatus()

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Por favor inicia sesión para acceder a tu dashboard.</p>
      </div>
    )
  }

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
        subtitle={`Bienvenido de nuevo, ${session.user?.name || 'Usuario'}!`}
        breadcrumbs={[
          { label: 'Inicio', href: '/' },
          { label: 'Dashboard' }
        ]}
      />

      <div className="p-6 space-y-8">
        {/* Sección de Vendedor - Condicional */}
        {renderVendorSection()}

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
                  <p className="text-2xl font-bold text-blue-600">{mockUserData.impactMetrics.waterSaved.toLocaleString()}</p>
                  <p className="text-sm text-gray-600">litros ahorrados</p>
                </div>
                <div className="text-center p-4 bg-yellow-50 rounded-lg">
                  <Zap className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-yellow-600">{mockUserData.impactMetrics.energyGenerated}</p>
                  <p className="text-sm text-gray-600">kWh generados</p>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <Award className="w-8 h-8 text-green-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-green-600">{mockUserData.impactMetrics.treesPlanted}</p>
                  <p className="text-sm text-gray-600">árboles plantados</p>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <Leaf className="w-8 h-8 text-green-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-green-600">{mockUserData.impactMetrics.co2Saved}</p>
                  <p className="text-sm text-gray-600">kg CO₂ ahorrado</p>
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
              {mockUserData.recentOrders.map((order) => (
                <div key={order.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="font-medium">#{order.id}</span>
                      <Badge variant={order.status === 'delivered' ? 'default' : 'secondary'}>
                        {order.status === 'delivered' ? 'Entregado' : 'Enviado'}
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
                    <p className="font-medium">${order.total}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

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