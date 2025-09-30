"use client"

import { ArrowLeft, Construction, Clock, Leaf } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import Header from '@/components/layout/header'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

interface UnderConstructionProps {
  title: string
  description?: string
  expectedFeatures?: string[]
  backLink?: string
  backLabel?: string
}

export default function UnderConstruction({
  title,
  description = "Esta funcionalidad está siendo desarrollada para ofrecerte la mejor experiencia posible.",
  expectedFeatures = [],
  backLink = "/",
  backLabel = "Volver al Inicio"
}: UnderConstructionProps) {
  const router = useRouter()

  const handleGoBack = () => {
    router.back()
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <Card className="max-w-2xl mx-auto">
            <CardContent className="p-8">
              {/* Icon */}
              <div className="flex justify-center mb-6">
                <div className="relative">
                  <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
                    <Construction className="w-10 h-10 text-green-600" />
                  </div>
                  <div className="absolute -top-1 -right-1 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center">
                    <Clock className="w-3 h-3 text-yellow-800" />
                  </div>
                </div>
              </div>

              {/* Title */}
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                {title}
              </h1>

              {/* Description */}
              <p className="text-lg text-gray-600 mb-8">
                {description}
              </p>

              {/* Expected Features */}
              {expectedFeatures.length > 0 && (
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center justify-center">
                    <Leaf className="w-5 h-5 text-green-600 mr-2" />
                    Funcionalidades Próximamente
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {expectedFeatures.map((feature, index) => (
                      <div
                        key={index}
                        className="flex items-center p-3 bg-green-50 rounded-lg border border-green-200"
                      >
                        <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                        <span className="text-sm text-green-800">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  onClick={handleGoBack}
                  variant="outline"
                  className="flex items-center"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Volver Atrás
                </Button>

                <Link href={backLink}>
                  <Button className="bg-green-600 hover:bg-green-700 text-white">
                    {backLabel}
                  </Button>
                </Link>
              </div>

              {/* Footer Note */}
              <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-sm text-blue-800">
                  💚 <strong>Regen Marketplace</strong> está en desarrollo activo.
                  Esta funcionalidad será lanzada próximamente como parte de nuestro compromiso
                  con la sostenibilidad y la mejor experiencia de usuario.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}