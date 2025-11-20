'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Users,
  Store,
  DollarSign,
  AlertCircle,
  CheckCircle,
  Activity
} from 'lucide-react'
import Link from 'next/link'
import { useToast } from '@/lib/hooks/use-toast'
import { useAdminDashboard } from '@/hooks/useAdminDashboard'
import { RecentActivityTable } from '@/components/admin/RecentActivityTable'
import { QuickActions } from '@/components/admin/QuickActions'
import { SystemStatus } from '@/components/admin/SystemStatus'
import { ActivityFeed } from '@/components/admin/ActivityFeed'
import { TopSellers } from '@/components/admin/TopSellers'
import { TrendingProducts } from '@/components/admin/TrendingProducts'

export default function AdminDashboardPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const { toast } = useToast()
  const [vendorApplications, setVendorApplications] = useState<VendorApplication[]>([])
  const [loading, setLoading] = useState(true)
  const [pendingCount, setPendingCount] = useState(0)
  const { stats, data, isLoading: statsLoading, isError: statsError, error: statsErrorObj, refetch } = useAdminDashboard()

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
      fetchVendorApplications()
    }
  }, [status, session, router])

  const fetchVendorApplications = async () => {
    try {
      const response = await fetch('/api/admin/vendors?limit=5&status=PENDING')
      const data = await response.json()

      if (data.success) {
        setVendorApplications(data.data)
        setPendingCount(data.meta.total)
      }
    } catch (error) {
      console.error('Error fetching vendor applications:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleVendorAction = async (applicationId: string, action: 'approve' | 'reject') => {
    try {
      const response = await fetch('/api/admin/vendors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ applicationId, action })
      })

      const data = await response.json()

      if (data.success) {
        toast({
          title: action === 'approve' ? '✅ Solicitud Aprobada' : '❌ Solicitud Rechazada',
          description: data.message
        })
        fetchVendorApplications() // Refresh list
      } else {
        toast({
          title: 'Error',
          description: data.error,
          variant: 'destructive'
        })
      }
    } catch (error) {
      console.error('Error processing vendor action:', error)
      toast({
        title: 'Error',
        description: 'No se pudo procesar la acción',
        variant: 'destructive'
      })
    }
  }

  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin">
          <div className="h-12 w-12 border-4 border-gray-300 border-t-green-600 rounded-full"></div>
        </div>
      </div>
    )
  }

  if (!session || session.user.role !== 'ADMIN') {
    return null
  }

  // Salud del sistema (placeholder hasta usar hook real)
  const systemHealth = {
    apiStatus: 'operational',
    databaseStatus: 'operational',
    storageStatus: 'operational',
    uptime: 99.98
  }
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
      case 'approved':
      case 'operational':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'processing':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getStatusLabel = (status: string) => {
    const labels: { [key: string]: string } = {
      completed: 'Completado',
      processing: 'Procesando',
      pending: 'Pendiente',
      cancelled: 'Cancelado',
      approved: 'Aprobado',
      operational: 'Operativo'
    }
    return labels[status] || status
  }

  return (
    <>
      <div className="p-6 space-y-6">
        {/* Quick Actions */}
        <QuickActions />

        {/* Estadísticas principales (datos reales) */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Total Usuarios */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
              </div>
              {statsLoading ? (
                <div className="h-8 w-20 bg-blue-200 rounded animate-pulse" />
              ) : statsError ? (
                <p className="text-sm text-red-600">Error: {statsErrorObj?.message || 'Unknown'}</p>
              ) : (
                <h3 className="text-2xl font-bold text-gray-900">{stats?.totalUsers?.toLocaleString() || '0'}</h3>
              )}
              <p className="text-sm text-gray-600">Total de Usuarios</p>
            </CardContent>
          </Card>
          {/* Vendedores Activos */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <Store className="w-6 h-6 text-green-600" />
                </div>
              </div>
              {statsLoading ? (
                <div className="h-8 w-20 bg-green-200 rounded animate-pulse" />
              ) : statsError ? (
                <p className="text-sm text-red-600">Error: {statsErrorObj?.message || 'Unknown'}</p>
              ) : (
                <h3 className="text-2xl font-bold text-gray-900">{stats?.totalVendors || '0'}</h3>
              )}
              <p className="text-sm text-gray-600">Vendedores Activos</p>
            </CardContent>
          </Card>
          {/* Ingresos Mes */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-purple-600" />
                </div>
              </div>
              {statsLoading ? (
                <div className="h-8 w-32 bg-purple-200 rounded animate-pulse" />
              ) : statsError ? (
                <p className="text-sm text-red-600">Error: {statsErrorObj?.message || 'Unknown'}</p>
              ) : (
                <h3 className="text-2xl font-bold text-gray-900">${stats?.monthlyRevenue?.toLocaleString('es-MX', { minimumFractionDigits: 2 }) || '0'}</h3>
              )}
              <p className="text-sm text-gray-600">Ingresos Mes (Pagados)</p>
            </CardContent>
          </Card>
        </div>

        {/* Alertas y acciones pendientes */}
        {pendingCount > 0 && (
          <Card className="border-yellow-200 bg-yellow-50">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <AlertCircle className="w-5 h-5 text-yellow-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">
                      Vendedores Pendientes de Aprobación
                    </h4>
                    <p className="text-sm text-gray-600 mb-3">
                      Hay {pendingCount} {pendingCount === 1 ? 'solicitud' : 'solicitudes'} de vendedores esperando revisión
                    </p>
                    <Link href="/dashboard/admin/vendors?status=pending">
                      <Button size="sm" className="bg-yellow-600 hover:bg-yellow-700">
                        Revisar Solicitudes
                      </Button>
                    </Link>
                  </div>
                </div>
                <Badge className="bg-yellow-600 text-white">
                  {pendingCount}
                </Badge>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Solicitudes de vendedores - Sección completa */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Store className="w-5 h-5 text-green-600" />
                Solicitudes de Vendedores Recientes
              </div>
              <Link href="/dashboard/admin/vendors">
                <Button variant="outline" size="sm">Ver Todos</Button>
              </Link>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8 text-gray-500">
                Cargando solicitudes...
              </div>
            ) : vendorApplications.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No hay solicitudes pendientes
              </div>
            ) : (
              <div className="space-y-4">
                {vendorApplications.map((application) => (
                  <div
                    key={application.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-sm">{application.companyName}</span>
                        <Badge className={getStatusColor(application.status.toLowerCase())}>
                          {getStatusLabel(application.status.toLowerCase())}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 truncate">{application.user.email}</p>
                      <p className="text-xs text-gray-400 mt-1">
                        {new Date(application.submittedAt).toLocaleDateString('es-MX')}
                      </p>
                    </div>
                    {application.status === 'PENDING' && (
                      <div className="flex gap-2 ml-4">
                        <Button
                          size="sm"
                          onClick={() => handleVendorAction(application.id, 'approve')}
                          className="bg-green-600 hover:bg-green-700 text-white text-xs"
                        >
                          Aprobar
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleVendorAction(application.id, 'reject')}
                          className="text-red-600 border-red-600 hover:bg-red-50 text-xs"
                        >
                          Rechazar
                        </Button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Distribución NFT Levels */}
        {stats && (
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium flex justify-between items-center">
                Distribución Niveles NFT
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {Object.entries(stats.nftDistribution || {}).map(([level,count]) => (
                  <div key={level} className="p-3 rounded border bg-white flex flex-col items-center text-center">
                    <p className="text-xs font-semibold tracking-wide">{level}</p>
                    <p className="text-lg font-bold">{count}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Actividad reciente */}
  <RecentActivityTable orders={data?.recentActivity as any} loading={statsLoading} />

        {/* Dashboard mejorado: System Status, Activity Feed, Top Sellers, Trending Products */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <SystemStatus />
          <ActivityFeed />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <TopSellers />
          <TrendingProducts />
        </div>

        {/* Estado del sistema */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-green-600" />
              Estado del Sistema
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="flex items-center gap-3">
                <div className={`w-3 h-3 rounded-full ${
                  systemHealth.apiStatus === 'operational'
                    ? 'bg-green-500'
                    : 'bg-red-500'
                }`}></div>
                <div>
                  <p className="text-sm font-medium text-gray-900">API</p>
                  <p className="text-xs text-gray-500 capitalize">
                    {systemHealth.apiStatus}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className={`w-3 h-3 rounded-full ${
                  systemHealth.databaseStatus === 'operational'
                    ? 'bg-green-500'
                    : 'bg-red-500'
                }`}></div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Base de Datos</p>
                  <p className="text-xs text-gray-500 capitalize">
                    {systemHealth.databaseStatus}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className={`w-3 h-3 rounded-full ${
                  systemHealth.storageStatus === 'operational'
                    ? 'bg-green-500'
                    : 'bg-red-500'
                }`}></div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Almacenamiento</p>
                  <p className="text-xs text-gray-500 capitalize">
                    {systemHealth.storageStatus}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Uptime</p>
                  <p className="text-xs text-gray-500">
                    {systemHealth.uptime}%
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Acciones rápidas */}
        <Card>
          <CardHeader>
            <CardTitle>Acciones Rápidas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Link href="/dashboard/admin/vendors">
                <Button variant="outline" className="w-full h-20 flex items-center justify-center gap-3">
                  <Store className="w-5 h-5" />
                  <span className="text-sm font-medium">Gestionar Vendedores</span>
                </Button>
              </Link>
              <Link href="/dashboard/admin/vendors?status=pending">
                <Button variant="outline" className="w-full h-20 flex items-center justify-center gap-3">
                  <AlertCircle className="w-5 h-5 text-yellow-600" />
                  <div className="text-left">
                    <p className="text-sm font-medium">Solicitudes Pendientes</p>
                    {pendingCount > 0 && (
                      <p className="text-xs text-gray-500">{pendingCount} {pendingCount === 1 ? 'solicitud' : 'solicitudes'}</p>
                    )}
                  </div>
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  )
}

interface VendorApplication {
  id: string
  companyName: string
  businessType: string
  status: string
  submittedAt: string
  user: {
    id: string
    name: string
    email: string
  }
}
