'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { AlertCircle, Eye } from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'

interface Flag {
  id: string
  type: string
  targetId: string
  reason: string
  status: string
  severity: string
  reporter: { name: string; email: string }
  createdAt: string
}

export default function ModerationPage() {
  const router = useRouter()
  const [flags, setFlags] = useState<Flag[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [statusFilter, setStatusFilter] = useState('PENDING')
  const [typeFilter, setTypeFilter] = useState('')

  useEffect(() => {
    fetchFlags()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter, typeFilter])

  const fetchFlags = async () => {
    try {
      setLoading(true)
      setError(null)

      const params = new URLSearchParams()
      if (statusFilter) params.append('status', statusFilter)
      if (typeFilter) params.append('type', typeFilter)

      const response = await fetch(`/api/admin/moderation/flags?${params}`)

      if (!response.ok) {
        throw new Error('Failed to fetch flags')
      }

      const data = await response.json()
      setFlags(data.data || [])
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error desconocido'
      setError(message)
      console.error('Error fetching flags:', err)
    } finally {
      setLoading(false)
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Moderación de Contenido</h1>
        <p className="text-gray-600 mt-2">
          Revisa y resuelve reportes de contenido inapropiado
        </p>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filtros</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-4">
          <div className="flex flex-col space-y-2">
            <label className="text-sm font-medium">Estado</label>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[200px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="PENDING">Pendiente</SelectItem>
                <SelectItem value="REVIEWED">Revisado</SelectItem>
                <SelectItem value="RESOLVED">Resuelto</SelectItem>
                <SelectItem value="DISMISSED">Descartado</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col space-y-2">
            <label className="text-sm font-medium">Tipo</label>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Todos" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">Todos</SelectItem>
                <SelectItem value="REVIEW">Reseña</SelectItem>
                <SelectItem value="PRODUCT">Producto</SelectItem>
                <SelectItem value="VENDOR">Vendedor</SelectItem>
                <SelectItem value="USER">Usuario</SelectItem>
                <SelectItem value="MESSAGE">Mensaje</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-end">
            <Button onClick={fetchFlags} variant="outline">
              Actualizar
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Error */}
      {error && (
        <Alert className="border-red-200 bg-red-50">
          <AlertCircle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">
            {error}
          </AlertDescription>
        </Alert>
      )}

      {/* Flags Table */}
      <Card>
        <CardHeader>
          <CardTitle>Reportes ({flags.length})</CardTitle>
          <CardDescription>
            Lista de contenido reportado por los usuarios
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
            </div>
          ) : flags.length === 0 ? (
            <div className="text-center py-8 text-gray-600">
              No hay reportes que mostrar
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Razón</TableHead>
                    <TableHead>Severidad</TableHead>
                    <TableHead>Reportado por</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead>Fecha</TableHead>
                    <TableHead>Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {flags.map((flag) => (
                    <TableRow key={flag.id}>
                      <TableCell>
                        <Badge variant="outline">{flag.type}</Badge>
                      </TableCell>
                      <TableCell className="max-w-xs truncate">
                        {flag.reason}
                      </TableCell>
                      <TableCell>
                        <Badge className={getSeverityColor(flag.severity)}>
                          {flag.severity}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div className="font-medium">{flag.reporter.name}</div>
                          <div className="text-gray-600">{flag.reporter.email}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(flag.status)}>
                          {flag.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-gray-600">
                        {formatDate(flag.createdAt)}
                      </TableCell>
                      <TableCell>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            router.push(
                              `/dashboard/admin/moderation/${flag.id}`
                            )
                          }}
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          Ver
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
