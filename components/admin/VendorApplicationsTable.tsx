'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import {
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  Search,
  FileText,
  Building2,
  Mail,
  Phone,
  Globe,
  MapPin,
  Calendar,
  AlertCircle
} from 'lucide-react'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'

interface VendorApplication {
  id: string
  companyName: string
  businessType: string
  description: string | null
  website: string | null
  businessPhone: string | null
  businessAddress: string | null
  taxId: string | null
  status: string
  createdAt: string
  reviewedAt: string | null
  rejectionReason: string | null
  internalNotes: string | null
  documents: any
  user: {
    id: string
    name: string | null
    email: string
    createdAt: string
  }
}

interface VendorApplicationsTableProps {
  initialApplications: VendorApplication[]
  initialMeta: {
    total: number
    page: number
    limit: number
    totalPages: number
    hasNext: boolean
    hasPrev: boolean
  }
}

export function VendorApplicationsTable({
  initialApplications,
  initialMeta
}: VendorApplicationsTableProps) {
  const [applications, setApplications] = useState<VendorApplication[]>(initialApplications)
  const [meta, setMeta] = useState(initialMeta)
  const [isLoading, setIsLoading] = useState(false)
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedApplication, setSelectedApplication] = useState<VendorApplication | null>(null)
  const [actionDialogOpen, setActionDialogOpen] = useState(false)
  const [actionType, setActionType] = useState<'approve' | 'reject' | 'review' | null>(null)
  const [rejectionReason, setRejectionReason] = useState('')
  const [internalNotes, setInternalNotes] = useState('')
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false)

  const fetchApplications = async (page = 1, status = statusFilter, search = searchQuery) => {
    setIsLoading(true)
    try {
      const params = new URLSearchParams({ page: page.toString(), limit: '20' })
      if (status !== 'all') params.append('status', status)
      if (search) params.append('search', search)

      const response = await fetch(`/api/admin/vendors?${params}`)
      const data = await response.json()

      if (data.success) {
        setApplications(data.data)
        setMeta(data.meta)
      }
    } catch (error) {
      console.error('Error fetching applications:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleAction = async () => {
    if (!selectedApplication || !actionType) return

    setIsLoading(true)
    try {
      const response = await fetch('/api/admin/vendors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          applicationId: selectedApplication.id,
          action: actionType,
          rejectionReason: actionType === 'reject' ? rejectionReason : undefined,
          internalNotes: internalNotes || undefined
        })
      })

      const data = await response.json()

      if (data.success) {
        // Refetch applications
        await fetchApplications()

        // Close dialog and reset
        setActionDialogOpen(false)
        setSelectedApplication(null)
        setActionType(null)
        setRejectionReason('')
        setInternalNotes('')
      }
    } catch (error) {
      console.error('Error processing action:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const openActionDialog = (application: VendorApplication, type: 'approve' | 'reject' | 'review') => {
    setSelectedApplication(application)
    setActionType(type)
    setInternalNotes(application.internalNotes || '')
    setActionDialogOpen(true)
  }

  const openDetailsDialog = (application: VendorApplication) => {
    setSelectedApplication(application)
    setDetailsDialogOpen(true)
  }

  const getStatusBadge = (status: string) => {
    const configs = {
      PENDING: { label: 'Pendiente', className: 'bg-yellow-100 text-yellow-700 border-yellow-300' },
      IN_REVIEW: { label: 'En Revisión', className: 'bg-blue-100 text-blue-700 border-blue-300' },
      APPROVED: { label: 'Aprobado', className: 'bg-green-100 text-green-700 border-green-300' },
      REJECTED: { label: 'Rechazado', className: 'bg-red-100 text-red-700 border-red-300' }
    }
    const config = configs[status as keyof typeof configs] || configs.PENDING
    return <Badge className={config.className}>{config.label}</Badge>
  }

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <CardTitle className="flex items-center gap-2">
              <Building2 className="w-5 h-5 text-blue-600" />
              Solicitudes de Vendedores
            </CardTitle>

            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Buscar por empresa o email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && fetchApplications(1, statusFilter, searchQuery)}
                  className="pl-10 w-full sm:w-64"
                />
              </div>

              <Select value={statusFilter} onValueChange={(value) => {
                setStatusFilter(value)
                fetchApplications(1, value, searchQuery)
              }}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="Filtrar por estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="PENDING">Pendientes</SelectItem>
                  <SelectItem value="IN_REVIEW">En Revisión</SelectItem>
                  <SelectItem value="APPROVED">Aprobados</SelectItem>
                  <SelectItem value="REJECTED">Rechazados</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Clock className="w-6 h-6 text-gray-400 animate-spin" />
              <span className="ml-2 text-gray-600">Cargando...</span>
            </div>
          ) : applications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12">
              <FileText className="w-12 h-12 text-gray-300 mb-3" />
              <p className="text-gray-600">No se encontraron solicitudes</p>
            </div>
          ) : (
            <>
              <div className="rounded-md border overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Empresa</TableHead>
                      <TableHead>Usuario</TableHead>
                      <TableHead>Tipo de Negocio</TableHead>
                      <TableHead>Estado</TableHead>
                      <TableHead>Fecha</TableHead>
                      <TableHead className="text-right">Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {applications.map((application) => (
                      <TableRow key={application.id}>
                        <TableCell className="font-medium">
                          {application.companyName}
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col">
                            <span className="text-sm">{application.user.name || 'Sin nombre'}</span>
                            <span className="text-xs text-gray-500">{application.user.email}</span>
                          </div>
                        </TableCell>
                        <TableCell>{application.businessType}</TableCell>
                        <TableCell>{getStatusBadge(application.status)}</TableCell>
                        <TableCell>
                          {format(new Date(application.createdAt), 'dd MMM yyyy', { locale: es })}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => openDetailsDialog(application)}
                            >
                              <Eye className="w-4 h-4" />
                            </Button>

                            {application.status === 'PENDING' || application.status === 'IN_REVIEW' ? (
                              <>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="text-green-600 hover:text-green-700 hover:bg-green-50"
                                  onClick={() => openActionDialog(application, 'approve')}
                                >
                                  <CheckCircle className="w-4 h-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                  onClick={() => openActionDialog(application, 'reject')}
                                >
                                  <XCircle className="w-4 h-4" />
                                </Button>
                              </>
                            ) : null}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination */}
              {meta.totalPages > 1 && (
                <div className="flex items-center justify-between mt-4">
                  <p className="text-sm text-gray-600">
                    Mostrando {applications.length} de {meta.total} solicitudes
                  </p>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={!meta.hasPrev || isLoading}
                      onClick={() => fetchApplications(meta.page - 1)}
                    >
                      Anterior
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={!meta.hasNext || isLoading}
                      onClick={() => fetchApplications(meta.page + 1)}
                    >
                      Siguiente
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* Action Dialog */}
      <Dialog open={actionDialogOpen} onOpenChange={setActionDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {actionType === 'approve' && '✓ Aprobar Solicitud'}
              {actionType === 'reject' && '✗ Rechazar Solicitud'}
              {actionType === 'review' && '⟳ Marcar como En Revisión'}
            </DialogTitle>
            <DialogDescription>
              {selectedApplication?.companyName} - {selectedApplication?.user.email}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {actionType === 'reject' && (
              <div className="space-y-2">
                <Label htmlFor="rejection-reason">
                  Razón del Rechazo <span className="text-red-600">*</span>
                </Label>
                <Textarea
                  id="rejection-reason"
                  placeholder="Explica por qué se rechaza la solicitud..."
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  rows={3}
                />
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="internal-notes">Notas Internas (Opcional)</Label>
              <Textarea
                id="internal-notes"
                placeholder="Notas para el equipo administrativo..."
                value={internalNotes}
                onChange={(e) => setInternalNotes(e.target.value)}
                rows={2}
              />
            </div>

            {actionType === 'approve' && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                <p className="text-sm text-green-800">
                  <strong>Al aprobar:</strong> El usuario recibirá el rol de VENDOR y se creará su perfil de vendedor automáticamente.
                </p>
              </div>
            )}

            {actionType === 'reject' && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-sm text-red-800">
                  <strong>Al rechazar:</strong> El usuario podrá ver la razón del rechazo y volver a aplicar.
                </p>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setActionDialogOpen(false)}>
              Cancelar
            </Button>
            <Button
              onClick={handleAction}
              disabled={isLoading || (actionType === 'reject' && !rejectionReason)}
              className={
                actionType === 'approve'
                  ? 'bg-green-600 hover:bg-green-700'
                  : actionType === 'reject'
                  ? 'bg-red-600 hover:bg-red-700'
                  : ''
              }
            >
              {isLoading ? 'Procesando...' : 'Confirmar'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Details Dialog */}
      <Dialog open={detailsDialogOpen} onOpenChange={setDetailsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Detalles de la Solicitud</DialogTitle>
            <DialogDescription>
              Información completa de la aplicación de vendedor
            </DialogDescription>
          </DialogHeader>

          {selectedApplication && (
            <div className="space-y-4 py-4">
              {/* Status */}
              <div>
                <Label className="text-xs text-gray-500">Estado</Label>
                <div className="mt-1">{getStatusBadge(selectedApplication.status)}</div>
              </div>

              {/* Company Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-xs text-gray-500 flex items-center gap-1">
                    <Building2 className="w-3 h-3" />
                    Empresa
                  </Label>
                  <p className="mt-1 font-medium">{selectedApplication.companyName}</p>
                </div>
                <div>
                  <Label className="text-xs text-gray-500">Tipo de Negocio</Label>
                  <p className="mt-1">{selectedApplication.businessType}</p>
                </div>
              </div>

              {/* User Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-xs text-gray-500 flex items-center gap-1">
                    <Mail className="w-3 h-3" />
                    Email
                  </Label>
                  <p className="mt-1">{selectedApplication.user.email}</p>
                </div>
                <div>
                  <Label className="text-xs text-gray-500">Nombre</Label>
                  <p className="mt-1">{selectedApplication.user.name || 'N/A'}</p>
                </div>
              </div>

              {/* Contact Info */}
              {selectedApplication.businessPhone && (
                <div>
                  <Label className="text-xs text-gray-500 flex items-center gap-1">
                    <Phone className="w-3 h-3" />
                    Teléfono
                  </Label>
                  <p className="mt-1">{selectedApplication.businessPhone}</p>
                </div>
              )}

              {selectedApplication.website && (
                <div>
                  <Label className="text-xs text-gray-500 flex items-center gap-1">
                    <Globe className="w-3 h-3" />
                    Sitio Web
                  </Label>
                  <a
                    href={selectedApplication.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-1 text-blue-600 hover:underline block"
                  >
                    {selectedApplication.website}
                  </a>
                </div>
              )}

              {selectedApplication.businessAddress && (
                <div>
                  <Label className="text-xs text-gray-500 flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    Dirección
                  </Label>
                  <p className="mt-1">{selectedApplication.businessAddress}</p>
                </div>
              )}

              {/* Description */}
              {selectedApplication.description && (
                <div>
                  <Label className="text-xs text-gray-500">Descripción</Label>
                  <p className="mt-1 text-sm">{selectedApplication.description}</p>
                </div>
              )}

              {/* Tax ID */}
              {selectedApplication.taxId && (
                <div>
                  <Label className="text-xs text-gray-500">RFC / Tax ID</Label>
                  <p className="mt-1">{selectedApplication.taxId}</p>
                </div>
              )}

              {/* Dates */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-xs text-gray-500 flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    Enviada
                  </Label>
                  <p className="mt-1 text-sm">
                    {format(new Date(selectedApplication.createdAt), 'dd MMMM yyyy, HH:mm', { locale: es })}
                  </p>
                </div>
                {selectedApplication.reviewedAt && (
                  <div>
                    <Label className="text-xs text-gray-500">Revisada</Label>
                    <p className="mt-1 text-sm">
                      {format(new Date(selectedApplication.reviewedAt), 'dd MMMM yyyy, HH:mm', { locale: es })}
                    </p>
                  </div>
                )}
              </div>

              {/* Rejection Reason */}
              {selectedApplication.rejectionReason && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                  <Label className="text-xs text-red-700 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    Razón del Rechazo
                  </Label>
                  <p className="mt-1 text-sm text-red-800">{selectedApplication.rejectionReason}</p>
                </div>
              )}

              {/* Internal Notes */}
              {selectedApplication.internalNotes && (
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                  <Label className="text-xs text-gray-700">Notas Internas</Label>
                  <p className="mt-1 text-sm text-gray-800">{selectedApplication.internalNotes}</p>
                </div>
              )}
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setDetailsDialogOpen(false)}>
              Cerrar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
