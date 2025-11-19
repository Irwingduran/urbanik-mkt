'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter, useParams } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import {
  ArrowLeft,
  AlertCircle,
  Mail,
  Calendar,
  Shield,
  Lock,
  Unlock,
  Copy,
  CheckCircle2,
  Clock,
} from 'lucide-react'

interface User {
  id: string
  name: string
  email: string
  role: 'USER' | 'VENDOR' | 'ADMIN'
  emailVerified: boolean
  createdAt: string
  updatedAt: string
}

export default function AdminUserDetailPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const params = useParams()
  const userId = params.userId as string

  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const [statusChanging, setStatusChanging] = useState(false)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/signin')
      return
    }

    if (status === 'authenticated' && session?.user.role !== 'ADMIN') {
      router.push('/dashboard')
      return
    }

    if (status === 'authenticated' && userId) {
      fetchUserDetail()
    }
  }, [status, session, router, userId])

  const fetchUserDetail = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await fetch(`/api/admin/users/${userId}`)

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Usuario no encontrado')
        }
        throw new Error('Error al cargar los detalles del usuario')
      }

      const data = await response.json()
      setUser(data.user)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido')
    } finally {
      setLoading(false)
    }
  }

  const handleCopyId = () => {
    if (user) {
      navigator.clipboard.writeText(user.id)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const getRoleBadge = (role: string) => {
    const roleConfig = {
      ADMIN: { color: 'bg-purple-100 text-purple-800', label: 'Administrador' },
      VENDOR: { color: 'bg-blue-100 text-blue-800', label: 'Vendedor' },
      USER: { color: 'bg-gray-100 text-gray-800', label: 'Usuario' },
    }

    const config = roleConfig[role as keyof typeof roleConfig] || {
      color: 'bg-gray-100 text-gray-800',
      label: role,
    }

    return <Badge className={config.color}>{config.label}</Badge>
  }

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('es-MX', {
      year: 'numeric',
      month: 'long',
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
          <p className="text-gray-600">Cargando detalles del usuario...</p>
        </div>
      </div>
    )
  }

  if (error || !user) {
    return (
      <div className="space-y-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => router.back()}
          className="gap-2 mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Volver
        </Button>

        <Alert className="border-red-200 bg-red-50">
          <AlertCircle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">
            {error || 'Usuario no encontrado'}
          </AlertDescription>
        </Alert>
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
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.back()}
            className="gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{user.name}</h1>
            <p className="text-gray-600 mt-1">{user.email}</p>
          </div>
        </div>
      </div>

      {/* Main Info */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* User Info Card */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Información del Usuario</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Name */}
            <div>
              <label className="text-sm font-medium text-gray-700">Nombre</label>
              <p className="mt-2 text-lg text-gray-900">{user.name}</p>
            </div>

            {/* Email */}
            <div>
              <label className="text-sm font-medium text-gray-700">Email</label>
              <div className="mt-2 flex items-center gap-2">
                <div className="flex items-center gap-1 text-gray-900">
                  <Mail className="w-4 h-4" />
                  {user.email}
                </div>
                {user.emailVerified && (
                  <Badge className="bg-green-100 text-green-800">
                    <CheckCircle2 className="w-3 h-3 mr-1" />
                    Verificado
                  </Badge>
                )}
              </div>
            </div>

            {/* Role */}
            <div>
              <label className="text-sm font-medium text-gray-700">Rol</label>
              <div className="mt-2">{getRoleBadge(user.role)}</div>
            </div>

            {/* User ID */}
            <div>
              <label className="text-sm font-medium text-gray-700">ID del Usuario</label>
              <div className="mt-2 flex items-center gap-2">
                <code className="bg-gray-100 px-3 py-1 rounded text-sm font-mono text-gray-900">
                  {user.id}
                </code>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleCopyId}
                  className="gap-2"
                >
                  <Copy className="w-4 h-4" />
                  {copied ? 'Copiado' : 'Copiar'}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Timeline Card */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Historial</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Created At */}
            <div className="flex gap-3">
              <Calendar className="w-5 h-5 text-green-600 flex-shrink-0 mt-1" />
              <div>
                <p className="text-sm font-medium text-gray-700">Registrado</p>
                <p className="text-sm text-gray-600 mt-1">{formatDate(user.createdAt)}</p>
              </div>
            </div>

            {/* Updated At */}
            <div className="flex gap-3">
              <Clock className="w-5 h-5 text-blue-600 flex-shrink-0 mt-1" />
              <div>
                <p className="text-sm font-medium text-gray-700">Última actualización</p>
                <p className="text-sm text-gray-600 mt-1">{formatDate(user.updatedAt)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Acciones</CardTitle>
          <CardDescription>Gestiona las acciones para este usuario</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button
            variant="outline"
            className="w-full gap-2"
            disabled={statusChanging}
          >
            <Shield className="w-4 h-4" />
            Cambiar Rol
          </Button>
          <Button
            variant="outline"
            className="w-full gap-2"
          >
            <Mail className="w-4 h-4" />
            Enviar Email
          </Button>
          <Button
            variant="destructive"
            className="w-full gap-2"
          >
            <Lock className="w-4 h-4" />
            Suspender Cuenta
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
