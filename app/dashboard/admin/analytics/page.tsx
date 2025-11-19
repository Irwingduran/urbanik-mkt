'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import {
  AlertCircle,
  Users,
  Store,
  TrendingUp,
  DollarSign,
  UserCheck,
  UserX,
  BarChart3,
  RefreshCw,
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
} from 'lucide-react'

interface Analytics {
  summary: {
    totalUsers: number
    totalVendors: number
    totalOrders: number
    totalRevenue: number
    activeVendors: number
    suspendedUsers: number
  }
  growth: {
    newUsersLastWeek: number
    growthRate: string
  }
  recentUsers: Array<{
    id: string
    name: string
    email: string
    role: string
    createdAt: string
  }>
  distribution: Array<{
    role: string
    _count: number
  }>
}

export default function AdminAnalyticsPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [analytics, setAnalytics] = useState<Analytics | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedPeriod, setSelectedPeriod] = useState('7days')

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
      fetchAnalytics()
    }
  }, [status, session, router, selectedPeriod])

  const fetchAnalytics = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await fetch('/api/admin/analytics')

      if (!response.ok) {
        throw new Error('Error al cargar analytics')
      }

      const data = await response.json()
      setAnalytics(data.analytics)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido')
    } finally {
      setLoading(false)
    }
  }

  const handleRefresh = () => {
    fetchAnalytics()
  }

  if (status === 'loading' || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando analytics...</p>
        </div>
      </div>
    )
  }

  if (!session || session.user.role !== 'ADMIN') {
    return null
  }

  if (error) {
    return (
      <div className="space-y-4">
        <Alert className="border-red-200 bg-red-50">
          <AlertCircle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">Error: {error}</AlertDescription>
        </Alert>
      </div>
    )
  }

  if (!analytics) {
    return null
  }

  const metrics = [
    {
      icon: Users,
      label: 'Usuarios Totales',
      value: analytics.summary.totalUsers,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      icon: Store,
      label: 'Vendedores',
      value: analytics.summary.totalVendors,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
    {
      icon: DollarSign,
      label: 'Ingresos Totales',
      value: `$${(analytics.summary.totalRevenue / 100).toFixed(2)}`,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      icon: TrendingUp,
      label: 'Nuevos Usuarios (7d)',
      value: analytics.growth.newUsersLastWeek,
      color: 'text-amber-600',
      bgColor: 'bg-amber-50',
      change: `${analytics.growth.growthRate}%`,
    },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>
          <p className="text-gray-600 mt-1">Dashboard ejecutivo con métricas avanzadas</p>
        </div>
        <div className="flex items-center gap-2">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value="7days">Últimos 7 días</option>
            <option value="30days">Últimos 30 días</option>
            <option value="90days">Últimos 90 días</option>
            <option value="year">Este año</option>
          </select>
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
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric, index) => {
          const Icon = metric.icon
          return (
            <Card key={index} className={metric.bgColor}>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{metric.label}</p>
                    <p className={`text-3xl font-bold ${metric.color} mt-2`}>{metric.value}</p>
                    {metric.change && (
                      <p className="text-xs text-green-600 mt-2 flex items-center gap-1">
                        <ArrowUpRight className="w-3 h-3" />
                        {metric.change} crecimiento
                      </p>
                    )}
                  </div>
                  <Icon className={`w-12 h-12 ${metric.color} opacity-20`} />
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="bg-green-50 p-3 rounded-lg">
                <UserCheck className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Usuarios Activos</p>
                <p className="text-2xl font-bold text-gray-900">
                  {analytics.summary.totalUsers - analytics.summary.suspendedUsers}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="bg-red-50 p-3 rounded-lg">
                <UserX className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Usuarios Suspendidos</p>
                <p className="text-2xl font-bold text-gray-900">
                  {analytics.summary.suspendedUsers}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="bg-blue-50 p-3 rounded-lg">
                <BarChart3 className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Órdenes Totales</p>
                <p className="text-2xl font-bold text-gray-900">
                  {analytics.summary.totalOrders}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Users */}
        <Card>
          <CardHeader>
            <CardTitle>Usuarios Recientes</CardTitle>
            <CardDescription>Últimos registros en la plataforma</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analytics.recentUsers.length > 0 ? (
                analytics.recentUsers.map((user) => (
                  <div
                    key={user.id}
                    className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0"
                  >
                    <div className="min-w-0">
                      <p className="font-medium text-gray-900 truncate">{user.name}</p>
                      <p className="text-sm text-gray-600 truncate">{user.email}</p>
                    </div>
                    <Badge className={
                      user.role === 'ADMIN'
                        ? 'bg-purple-100 text-purple-800'
                        : user.role === 'VENDOR'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-gray-100 text-gray-800'
                    }>
                      {user.role === 'ADMIN' ? 'Admin' : user.role === 'VENDOR' ? 'Vendor' : 'User'}
                    </Badge>
                  </div>
                ))
              ) : (
                <p className="text-gray-600 text-sm text-center py-4">No hay datos disponibles</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Platform Overview */}
        <Card>
          <CardHeader>
            <CardTitle>Resumen de la Plataforma</CardTitle>
            <CardDescription>Estado general del sistema</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between py-2">
                <span className="text-sm font-medium text-gray-700">Tasa de Crecimiento</span>
                <Badge className="bg-green-100 text-green-800">
                  +{analytics.growth.growthRate}%
                </Badge>
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="text-sm font-medium text-gray-700">Razón Vendor/Usuario</span>
                <span className="font-medium text-gray-900">
                  {(
                    (analytics.summary.totalVendors /
                      Math.max(analytics.summary.totalUsers, 1)) *
                    100
                  ).toFixed(1)}
                  %
                </span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="text-sm font-medium text-gray-700">Usuarios Activos</span>
                <span className="font-medium text-gray-900">
                  {(
                    ((analytics.summary.totalUsers - analytics.summary.suspendedUsers) /
                      Math.max(analytics.summary.totalUsers, 1)) *
                    100
                  ).toFixed(1)}
                  %
                </span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="text-sm font-medium text-gray-700">Ingreso Promedio/Orden</span>
                <span className="font-medium text-gray-900">
                  ${
                    analytics.summary.totalOrders > 0
                      ? (analytics.summary.totalRevenue / analytics.summary.totalOrders / 100).toFixed(2)
                      : '0.00'
                  }
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Status Indicators */}
      <Card>
        <CardHeader>
          <CardTitle>Estado del Sistema</CardTitle>
          <CardDescription>Indicadores de salud de la plataforma</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <div>
                <p className="text-sm text-gray-600">Base de Datos</p>
                <p className="font-medium text-gray-900">Operacional</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <div>
                <p className="text-sm text-gray-600">API Server</p>
                <p className="font-medium text-gray-900">Activo</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <div>
                <p className="text-sm text-gray-600">Autenticación</p>
                <p className="font-medium text-gray-900">Activa</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <div>
                <p className="text-sm text-gray-600">Almacenamiento</p>
                <p className="font-medium text-gray-900">OK</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}