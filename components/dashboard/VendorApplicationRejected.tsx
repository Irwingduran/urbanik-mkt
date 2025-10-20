'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { XCircle, RefreshCw, MessageCircle, AlertTriangle } from 'lucide-react'
import Link from 'next/link'

interface VendorApplicationRejectedProps {
  application: {
    id: string
    companyName: string
    status: string
    submittedAt: Date
    reviewedAt?: Date | null
    rejectionReason?: string | null
  }
}

export function VendorApplicationRejected({ application }: VendorApplicationRejectedProps) {
  const rejectionReason = application.rejectionReason ||
    'Tu solicitud no cumplió con los requisitos mínimos. Por favor revisa la información proporcionada.'

  const reviewedDate = application.reviewedAt
    ? new Date(application.reviewedAt).toLocaleDateString('es-MX', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    : null

  return (
    <Card className="border-2 border-red-200 bg-gradient-to-br from-red-50 to-orange-50">
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          {/* Icon */}
          <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
            <XCircle className="w-6 h-6 text-red-600" />
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="text-lg font-semibold text-gray-900">
                Solicitud No Aprobada
              </h3>
              <Badge className="bg-red-100 text-red-700 border-0">
                Rechazada
              </Badge>
            </div>

            <p className="text-sm text-gray-700 mb-3">
              Lamentamos informarte que tu solicitud para convertirte en vendedor no fue aprobada en esta ocasión.
            </p>

            {/* Rejection Reason */}
            <div className="bg-white rounded-lg p-4 mb-4 border border-red-200">
              <div className="flex items-start gap-2 mb-2">
                <AlertTriangle className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
                <h4 className="font-semibold text-sm text-gray-900">Razón del Rechazo</h4>
              </div>
              <p className="text-sm text-gray-700 pl-6">
                {rejectionReason}
              </p>
            </div>

            {/* Details */}
            <div className="space-y-2 mb-4">
              <div className="flex items-center gap-2 text-sm">
                <span className="text-gray-500">Empresa:</span>
                <span className="font-medium text-gray-900">{application.companyName}</span>
              </div>
              {reviewedDate && (
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-gray-500">Revisada:</span>
                  <span className="font-medium text-gray-900">{reviewedDate}</span>
                </div>
              )}
            </div>

            {/* Support Message */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
              <p className="text-xs text-blue-800">
                <strong>No te desanimes:</strong> Puedes mejorar tu solicitud y volver a aplicar.
                Asegúrate de proporcionar toda la información requerida y documentos de soporte necesarios.
              </p>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Link href="/onboarding" className="flex-1">
                <Button className="w-full bg-green-600 hover:bg-green-700 text-white">
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Volver a Aplicar
                </Button>
              </Link>
              <Link href="/contact?subject=vendor-application" className="flex-1">
                <Button variant="outline" className="w-full border-blue-600 text-blue-600 hover:bg-blue-50">
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Contactar Soporte
                </Button>
              </Link>
            </div>

            {/* Attempts Counter - Future feature */}
            {/* <div className="mt-3 text-center">
              <p className="text-xs text-gray-500">
                Intentos restantes: <span className="font-semibold">2/3</span>
              </p>
            </div> */}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
