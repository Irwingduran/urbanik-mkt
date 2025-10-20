'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Clock, Shield, CheckCircle, AlertCircle } from 'lucide-react'
import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

interface VendorApplicationPendingProps {
  application: {
    id: string
    companyName: string
    status: string
    submittedAt: Date
    reviewedAt?: Date | null
  }
}

export function VendorApplicationPending({ application }: VendorApplicationPendingProps) {
  const [isOpen, setIsOpen] = useState(false)

  const statusConfig = {
    PENDING: {
      icon: Clock,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100',
      label: 'En Espera',
      message: 'Tu solicitud está en la cola de revisión'
    },
    IN_REVIEW: {
      icon: Shield,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
      label: 'En Revisión',
      message: 'Nuestro equipo está revisando tu información'
    }
  }

  const config = statusConfig[application.status as keyof typeof statusConfig] || statusConfig.PENDING
  const Icon = config.icon

  const submittedDate = new Date(application.submittedAt).toLocaleDateString('es-MX', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })

  return (
    <Card className="border-2 border-yellow-200 bg-gradient-to-br from-yellow-50 to-amber-50">
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          {/* Icon */}
          <div className={`w-12 h-12 ${config.bgColor} rounded-full flex items-center justify-center flex-shrink-0`}>
            <Icon className={`w-6 h-6 ${config.color} animate-pulse`} />
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="text-lg font-semibold text-gray-900">
                Tu solicitud está en revisión
              </h3>
              <Badge className={`${config.bgColor} ${config.color} border-0`}>
                {config.label}
              </Badge>
            </div>

            <p className="text-sm text-gray-700 mb-3">
              {config.message}. Recibirás una notificación en <strong>24-48 horas</strong>.
            </p>

            {/* Details */}
            <div className="space-y-2 mb-4">
              <div className="flex items-center gap-2 text-sm">
                <span className="text-gray-500">Empresa:</span>
                <span className="font-medium text-gray-900">{application.companyName}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <span className="text-gray-500">Enviada:</span>
                <span className="font-medium text-gray-900">{submittedDate}</span>
              </div>
            </div>

            {/* Timeline */}
            <div className="bg-white rounded-lg p-3 mb-4 border border-yellow-200">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-1">
                  <CheckCircle className="w-3 h-3 text-green-600" />
                  <span className="text-gray-600">Enviada</span>
                </div>
                <div className="h-px flex-1 bg-yellow-200 mx-2"></div>
                <div className="flex items-center gap-1">
                  <Clock className="w-3 h-3 text-yellow-600 animate-pulse" />
                  <span className="text-gray-600">En Revisión</span>
                </div>
                <div className="h-px flex-1 bg-gray-200 mx-2"></div>
                <div className="flex items-center gap-1">
                  <AlertCircle className="w-3 h-3 text-gray-400" />
                  <span className="text-gray-400">Aprobación</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-yellow-600 text-yellow-700 hover:bg-yellow-50"
                >
                  Ver Detalles
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Detalles de tu Solicitud</DialogTitle>
                  <DialogDescription>
                    Información sobre tu aplicación como vendedor
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div>
                    <h4 className="font-semibold text-sm text-gray-900 mb-2">Estado Actual</h4>
                    <Badge className={`${config.bgColor} ${config.color} border-0`}>
                      {config.label}
                    </Badge>
                  </div>

                  <div>
                    <h4 className="font-semibold text-sm text-gray-900 mb-2">Empresa</h4>
                    <p className="text-sm text-gray-700">{application.companyName}</p>
                  </div>

                  <div>
                    <h4 className="font-semibold text-sm text-gray-900 mb-2">Fecha de Envío</h4>
                    <p className="text-sm text-gray-700">{submittedDate}</p>
                  </div>

                  <div>
                    <h4 className="font-semibold text-sm text-gray-900 mb-2">¿Qué sigue?</h4>
                    <ul className="text-sm text-gray-700 space-y-2">
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <span>Nuestro equipo revisará tu información</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <span>Verificaremos tus certificaciones</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Clock className="w-4 h-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                        <span>Recibirás una notificación con la decisión</span>
                      </li>
                    </ul>
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                    <p className="text-xs text-blue-800">
                      <strong>Tip:</strong> Mientras esperas, puedes seguir comprando productos sostenibles
                      y acumulando puntos en tu cuenta de usuario.
                    </p>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
