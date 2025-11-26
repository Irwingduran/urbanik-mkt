'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import {
  Store,
  TrendingUp,
  Users,
  Shield,
  ArrowRight,
  X,
  Zap,
  Target,
  Award,
  Leaf
} from 'lucide-react'

const features = [
  {
    icon: TrendingUp,
    title: 'Sin comisiones',
    subtitle: 'Los primeros 3 meses',
    color: 'text-emerald-600',
    bg: 'bg-emerald-50',
    border: 'border-emerald-200'
  },
  {
    icon: Users,
    title: 'Miles de clientes',
    subtitle: 'Audiencia comprometida',
    color: 'text-blue-600',
    bg: 'bg-blue-50',
    border: 'border-blue-200'
  },
  {
    icon: Shield,
    title: 'Pagos seguros',
    subtitle: 'Stripe Connect',
    color: 'text-purple-600',
    bg: 'bg-purple-50',
    border: 'border-purple-200'
  }
]

const benefits = [
  {
    icon: Target,
    text: 'Herramientas de gestión de inventario profesionales'
  },
  {
    icon: Zap,
    text: 'Analytics en tiempo real y reportes detallados'
  },
  {
    icon: Award,
    text: 'Soporte dedicado y comunidad de vendedores'
  },
  {
    icon: Leaf,
    text: 'Programa de RegenMarks para certificaciones sostenibles'
  }
]

interface BecomeVendorBannerProps {
  isDismissed?: boolean
  onDismiss?: () => void
}

export function BecomeVendorBanner({ isDismissed = false, onDismiss }: BecomeVendorBannerProps) {
  const [isVisible, setIsVisible] = useState(!isDismissed)

  useEffect(() => {
    setIsVisible(!isDismissed)
  }, [isDismissed])

  const handleClose = () => {
    setIsVisible(false)
    // Guardar en localStorage que el usuario cerró el banner
    localStorage.setItem('vendorBanner_dismissed', 'true')
    localStorage.setItem('vendorBanner_dismissedAt', new Date().toISOString())
    onDismiss?.()
  }

  if (!isVisible) {
    return null
  }

  return (
    <div className="space-y-6">
      {/* Main Banner Card */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-green-50 via-emerald-50 to-blue-50 shadow-lg border border-emerald-100/50 hover:shadow-xl transition-shadow">
        {/* Decorative background elements */}
        <div className="absolute top-0 right-0 w-72 h-72 bg-emerald-200/30 rounded-full blur-3xl -translate-y-1/3 translate-x-1/4" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-200/30 rounded-full blur-3xl translate-y-1/3 -translate-x-1/4" />
        <div className="absolute top-1/2 right-1/4 w-48 h-48 bg-green-200/20 rounded-full blur-3xl" />

        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 z-10 p-2 hover:bg-white/50 rounded-full transition-colors"
          aria-label="Cerrar banner"
        >
          <X className="w-5 h-5 text-gray-600 hover:text-gray-900" />
        </button>

        <div className="relative px-6 py-10 sm:px-8 sm:py-12 lg:px-12 lg:py-16">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Left Content */}
            <div className="flex flex-col justify-center pr-6">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 w-fit bg-white/80 backdrop-blur-sm px-3 py-1.5 rounded-full text-xs font-semibold mb-6 border border-emerald-200 shadow-sm">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                <span className="text-emerald-700">Oportunidad Premium</span>
              </div>

              {/* Title */}
              <h2 className="text-4xl lg:text-5xl font-bold mb-4 text-gray-900 leading-tight">
                Convierte tu pasión en un
                <span className="block bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">
                  negocio sostenible
                </span>
              </h2>

              {/* Description */}
              <p className="text-base lg:text-lg text-gray-700 mb-8 leading-relaxed">
                Únete a una comunidad de emprendedores que están transformando el mercado de productos sostenibles. Con Urbanika, obtienes las herramientas, el apoyo y la audiencia que necesitas para crecer.
              </p>

              {/* Key Benefits Grid */}
              <div className="grid sm:grid-cols-3 gap-3 mb-8">
                {features.map((feature) => {
                  const Icon = feature.icon
                  return (
                    <div
                      key={feature.title}
                      className={`${feature.bg} border ${feature.border} p-4 rounded-xl transition-transform hover:scale-105`}
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <Icon className={`w-5 h-5 ${feature.color}`} />
                        <span className="font-semibold text-sm text-gray-900">{feature.title}</span>
                      </div>
                      <p className="text-xs text-gray-600">{feature.subtitle}</p>
                    </div>
                  )
                })}
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 mb-6">
                <Link href="/onboarding" className="flex-1 sm:flex-initial">
                  <Button size="lg" className="w-full gap-2 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 shadow-lg hover:shadow-xl transition-all">
                    <Store className="w-5 h-5" />
                    Comenzar ahora
                    <ArrowRight className="w-5 h-5" />
                  </Button>
                </Link>

                <Link href="/info/selling">
                  <Button size="lg" variant="outline" className="gap-2 border-emerald-300 hover:bg-emerald-50">
                    Más información
                  </Button>
                </Link>
              </div>

              {/* Trust Signal */}
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                <span>Aprobación en 24-48 horas • Soporte disponible 24/7</span>
              </div>
            </div>

            {/* Right Content - Benefits List */}
            <div className="hidden lg:flex flex-col justify-center">
              <h3 className="text-lg font-bold text-gray-900 mb-6">¿Por qué vender con Urbanika?</h3>
              <div className="space-y-4">
                {benefits.map((benefit) => {
                  const Icon = benefit.icon
                  return (
                    <div key={benefit.text} className="flex items-start gap-4 bg-white/60 backdrop-blur-sm p-4 rounded-lg border border-white/50 hover:bg-white/80 transition-colors">
                      <div className="flex-shrink-0 mt-1">
                        <Icon className="w-5 h-5 text-emerald-600" />
                      </div>
                      <p className="text-sm text-gray-700 leading-relaxed">{benefit.text}</p>
                    </div>
                  )
                })}
              </div>

              {/* Additional Info */}
              <div className="mt-8 p-4 bg-gradient-to-r from-emerald-100/50 to-blue-100/50 border border-emerald-200/50 rounded-lg">
                <p className="text-xs text-gray-700">
                  <span className="font-semibold">💡 Tip:</span> Los vendedores activos generan un promedio de $2,500-$5,000 al mes en su primer trimestre.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Benefits (visible only on mobile) */}
      <div className="lg:hidden space-y-3">
        <h3 className="text-lg font-bold text-gray-900">¿Por qué vender con Urbanika?</h3>
        {benefits.map((benefit) => {
          const Icon = benefit.icon
          return (
            <div key={benefit.text} className="flex items-start gap-3 bg-white p-4 rounded-lg border border-gray-200">
              <Icon className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-gray-700">{benefit.text}</p>
            </div>
          )
        })}
      </div>
    </div>
  )
}
