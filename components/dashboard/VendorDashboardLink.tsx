'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Store, ArrowRight, TrendingUp, Package, Star, CheckCircle, X } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

interface VendorDashboardLinkProps {
  vendorProfile: {
    id: string
    companyName: string
    verificationStatus: string
    active: boolean
    onboardingStatus: string
  }
}

export function VendorDashboardLink({ vendorProfile }: VendorDashboardLinkProps) {
  const [isVisible, setIsVisible] = useState(true)

  if (!isVisible) {
    return null
  }

  // TODO: Fetch real stats from API
  const mockStats = {
    products: 0,
    sales: 0,
    rating: 0
  }

  return (
    <Card className="border-2 border-green-200 bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-green-200/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-emerald-200/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

      <CardContent className="p-6 relative z-10">
        <div className="flex items-start gap-4">
          {/* Close Button */}
          <button
            onClick={() => setIsVisible(false)}
            className="absolute top-4 right-4 p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Cerrar notificación"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Icon */}
          <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
            <Store className="w-7 h-7 text-white" />
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="text-xl font-bold text-gray-900">
                ¡Eres un Vendedor Verificado!
              </h3>
              <Badge className="bg-green-600 text-white border-0 flex items-center gap-1">
                <CheckCircle className="w-3 h-3" />
                Verificado
              </Badge>
            </div>

            <p className="text-sm text-gray-700 mb-4">
              Tu tienda <strong>{vendorProfile.companyName}</strong> está activa y lista para vender.
            </p>

            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-3 mb-4">
              <div className="bg-white/80 backdrop-blur-sm rounded-lg p-3 border border-green-100">
                <div className="flex items-center gap-2 mb-1">
                  <Package className="w-4 h-4 text-green-600" />
                  <span className="text-xs text-gray-500">Productos</span>
                </div>
                <p className="text-lg font-bold text-gray-900">{mockStats.products}</p>
              </div>

              <div className="bg-white/80 backdrop-blur-sm rounded-lg p-3 border border-green-100">
                <div className="flex items-center gap-2 mb-1">
                  <TrendingUp className="w-4 h-4 text-green-600" />
                  <span className="text-xs text-gray-500">Ventas</span>
                </div>
                <p className="text-lg font-bold text-gray-900">{mockStats.sales}</p>
              </div>

              <div className="bg-white/80 backdrop-blur-sm rounded-lg p-3 border border-green-100">
                <div className="flex items-center gap-2 mb-1">
                  <Star className="w-4 h-4 text-green-600" />
                  <span className="text-xs text-gray-500">Rating</span>
                </div>
                <p className="text-lg font-bold text-gray-900">
                  {mockStats.rating > 0 ? `⭐ ${mockStats.rating.toFixed(1)}` : '-'}
                </p>
              </div>
            </div>

            {/* CTA Button */}
            <Link href="/dashboard/vendor">
              <Button
                size="lg"
                className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-lg hover:shadow-xl transition-all"
              >
                <Store className="w-5 h-5 mr-2" />
                Ir a Dashboard de Vendedor
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>

            {/* Quick Tips */}
            <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-3">
              <p className="text-xs text-blue-800 mb-2">
                <strong>💡 Próximos pasos:</strong>
              </p>
              <ul className="text-xs text-blue-700 space-y-1">
                <li className="flex items-start gap-2">
                  <span className="text-blue-500">•</span>
                  <span>Agrega tus primeros productos</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-500">•</span>
                  <span>Completa el perfil de tu tienda</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-500">•</span>
                  <span>Configura tus métodos de envío</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
