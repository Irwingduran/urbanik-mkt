'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Textarea
} from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { AlertCircle, CheckCircle, XCircle, Trash2, ArrowLeft } from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'

interface Flag {
  id: string
  type: string
  targetId: string
  reason: string
  description: string
  status: string
  severity: string
  reporter: { id: string; name: string; email: string }
  reviewer?: { id: string; name: string; email: string }
  resolution: string
  createdAt: string
  updatedAt: string
}

export default function ModerationDetailPage() {
  const params = useParams()
  const router = useRouter()
  const flagId = params.id as string

  const [flag, setFlag] = useState<Flag | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const [resolution, setResolution] = useState('')
  const [newStatus, setNewStatus] = useState('')

  useEffect(() => {
    fetchFlagDetail()
  }, [flagId])

  const fetchFlagDetail = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/admin/moderation/flags/${flagId}`)

      if (!response.ok) {
        throw new Error('Failed to fetch flag')
      }

      const data = await response.json()
      setFlag(data.data)
      setNewStatus(data.data.status)
      setResolution(data.data.resolution || '')
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error desconocido'
      setError(message)
    } finally {
      setLoading(false)
    }
  }

  const handleResolve = async (status: 'RESOLVED' | 'DISMISSED') => {
    if (status === 'RESOLVED' && !resolution.trim()) {
      alert('Por favor proporciona una resolución')
      return
    }

    setIsSubmitting(true)
    try {
      const response = await fetch(`/api/admin/moderation/flags/${flagId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status,
          resolution
        })
      })

      if (!response.ok) {
        throw new Error('Failed to update flag')
      }

      alert(
        status === 'RESOLVED' 
          ? 'Reporte resuelto exitosamente' 
          : 'Reporte descartado'
      )
      router.push('/dashboard/admin/moderation')
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Error al actualizar')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDismiss = async () => {
    if (!confirm('¿Estás seguro de que deseas descartar este reporte?')) {
      return
    }

    setIsSubmitting(true)
    try {
      const response = await fetch(`/api/admin/moderation/flags/${flagId}`, {
        method: 'DELETE'
      })

      if (!response.ok) {
        throw new Error('Failed to dismiss flag')
      }

      alert('Reporte descartado')
      router.push('/dashboard/admin/moderation')
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Error al descartar')
    } finally {
      setIsSubmitting(false)
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity.toLowerCase()) {
      case 'critical':
        return 'bg-red-100 text-red-800'
      case 'high':
        return 'bg-orange-100 text-orange-800'
      case 'medium':
        return 'bg-yellow-100 text-yellow-800'
      case 'low':
        return 'bg-blue-100 text-blue-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status.toUpperCase()) {
      case 'PENDING':
        return 'bg-blue-100 text-blue-800'
      case 'REVIEWED':
        return 'bg-yellow-100 text-yellow-800'
      case 'RESOLVED':
        return 'bg-green-100 text-green-800'
      case 'DISMISSED':
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('es-MX', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando reporte...</p>
        </div>
      </div>
    )
  }

  if (error || !flag) {
    return (
      <div className="p-6">
        <Alert className="border-red-200 bg-red-50">
          <AlertCircle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">
            {error || 'Reporte no encontrado'}
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  const isResolved = flag.status === 'RESOLVED' || flag.status === 'DISMISSED'

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => router.back()}
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <h1 className="text-3xl font-bold tracking-tight">
              Detalles del Reporte
            </h1>
          </div>
        </div>
        <Badge className={getStatusColor(flag.status)}>
          {flag.status}
        </Badge>
      </div>

      {/* Report Information */}
      <Card>
        <CardHeader>
          <CardTitle>Información del Reporte</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-xs text-gray-600">Tipo</Label>
              <p className="text-sm font-medium mt-1">{flag.type}</p>
            </div>
            <div>
              <Label className="text-xs text-gray-600">ID del Contenido</Label>
              <p className="text-sm font-medium mt-1 truncate">{flag.targetId}</p>
            </div>
            <div>
              <Label className="text-xs text-gray-600">Severidad</Label>
              <Badge className={`${getSeverityColor(flag.severity)} mt-1`}>
                {flag.severity}
              </Badge>
            </div>
            <div>
              <Label className="text-xs text-gray-600">Fecha de Reporte</Label>
              <p className="text-sm font-medium mt-1">{formatDate(flag.createdAt)}</p>
            </div>
          </div>

          <div>
            <Label className="text-xs text-gray-600">Razón</Label>
            <p className="text-sm font-medium mt-1">{flag.reason}</p>
          </div>

          {flag.description && (
            <div>
              <Label className="text-xs text-gray-600">Descripción</Label>
              <p className="text-sm mt-1 whitespace-pre-wrap">{flag.description}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Reporter Information */}
      <Card>
        <CardHeader>
          <CardTitle>Información del Reportero</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div>
            <Label className="text-xs text-gray-600">Nombre</Label>
            <p className="text-sm font-medium">{flag.reporter.name || 'N/A'}</p>
          </div>
          <div>
            <Label className="text-xs text-gray-600">Email</Label>
            <p className="text-sm font-medium">{flag.reporter.email}</p>
          </div>
        </CardContent>
      </Card>

      {/* Review Section */}
      {!isResolved ? (
        <Card className="border-2 border-green-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              Revisar y Resolver
            </CardTitle>
            <CardDescription>
              Proporciona una resolución para este reporte
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="resolution">
                Resolución (Acción Tomada) *
              </Label>
              <Textarea
                id="resolution"
                value={resolution}
                onChange={(e) => setResolution(e.target.value)}
                placeholder="Describe qué acción se tomó para resolver este reporte..."
                rows={4}
                className="mt-1"
              />
            </div>

            <div className="flex gap-3 pt-4 border-t">
              <Button
                onClick={() => handleResolve('RESOLVED')}
                disabled={isSubmitting || !resolution.trim()}
                className="flex-1 bg-green-600 hover:bg-green-700"
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                Resolver
              </Button>
              <Button
                onClick={() => handleDismiss()}
                disabled={isSubmitting}
                variant="outline"
                className="flex-1"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Descartar
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className="border-2 border-blue-200 bg-blue-50">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <CheckCircle className="w-6 h-6 text-green-600 mt-1" />
              <div>
                <p className="font-semibold">
                  Este reporte ya fue resuelto
                </p>
                {flag.resolution && (
                  <div className="mt-2">
                    <p className="text-sm text-gray-600">Resolución:</p>
                    <p className="text-sm mt-1 whitespace-pre-wrap">
                      {flag.resolution}
                    </p>
                  </div>
                )}
                {flag.reviewer && (
                  <div className="mt-2">
                    <p className="text-sm text-gray-600">
                      Resuelto por: {flag.reviewer.name}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
