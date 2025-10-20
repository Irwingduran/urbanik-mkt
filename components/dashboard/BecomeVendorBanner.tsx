'use client'

import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Store, TrendingUp, Users, Shield, ArrowRight, CheckCircle } from 'lucide-react'

export function BecomeVendorBanner() {
  return (
    <Card className="relative overflow-hidden border-2 border-blue-200 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-blue-200/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-purple-200/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

      <div className="relative p-8">
        <div className="flex flex-col lg:flex-row items-start justify-between gap-6">
          <div className="flex-1 max-w-3xl">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-1.5 rounded-full text-sm font-medium mb-4 shadow-lg">
              <Store className="w-4 h-4" />
              Oportunidad de Negocio
            </div>

            {/* Title */}
            <h2 className="text-3xl lg:text-4xl font-bold mb-3 text-gray-900 leading-tight">
              ¿Listo para vender en Urbanika?
            </h2>

            <p className="text-lg text-gray-600 mb-6 leading-relaxed">
              Únete a cientos de vendedores que están generando ingresos
              vendiendo productos sostenibles a una audiencia comprometida.
            </p>

            {/* Benefits Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
              <div className="flex items-start gap-3 bg-white/60 backdrop-blur-sm p-4 rounded-lg border border-green-100">
                <div className="p-2 bg-green-100 rounded-lg flex-shrink-0">
                  <TrendingUp className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="font-semibold text-sm text-gray-900">Sin comisiones</p>
                  <p className="text-xs text-gray-600">Los primeros 3 meses</p>
                </div>
              </div>

              <div className="flex items-start gap-3 bg-white/60 backdrop-blur-sm p-4 rounded-lg border border-blue-100">
                <div className="p-2 bg-blue-100 rounded-lg flex-shrink-0">
                  <Users className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="font-semibold text-sm text-gray-900">Miles de clientes</p>
                  <p className="text-xs text-gray-600">Audiencia comprometida</p>
                </div>
              </div>

              <div className="flex items-start gap-3 bg-white/60 backdrop-blur-sm p-4 rounded-lg border border-purple-100">
                <div className="p-2 bg-purple-100 rounded-lg flex-shrink-0">
                  <Shield className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="font-semibold text-sm text-gray-900">Pagos seguros</p>
                  <p className="text-xs text-gray-600">Stripe Connect</p>
                </div>
              </div>
            </div>

            {/* Feature list */}
            <div className="mb-6 space-y-2">
              <div className="flex items-center gap-2 text-sm text-gray-700">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span>Herramientas profesionales de gestión de inventario</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-700">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span>Analytics en tiempo real de tus ventas</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-700">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span>Soporte dedicado para vendedores</span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
              <Link href="/onboarding">
                <Button size="lg" className="gap-2 shadow-lg hover:shadow-xl transition-shadow">
                  <Store className="w-4 h-4" />
                  Aplicar Ahora
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>

              <Link href="/info/selling" className="text-sm">
                <Button size="lg" variant="outline" className="gap-2">
                  Más Información
                </Button>
              </Link>
            </div>

            {/* Trust indicator */}
            <div className="flex items-center gap-2 mt-6 text-sm text-gray-600">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span>Proceso de revisión en 24-48 horas</span>
            </div>
          </div>

          {/* Illustration (right side - hidden on mobile) */}
          <div className="hidden xl:flex items-center justify-center flex-shrink-0">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-purple-400 rounded-full blur-2xl opacity-20" />
              <Store className="relative w-48 h-48 text-blue-300" strokeWidth={1.5} />
            </div>
          </div>
        </div>
      </div>
    </Card>
  )
}
