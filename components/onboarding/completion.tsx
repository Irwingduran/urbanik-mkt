"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle, Clock, Shield, FileCheck, Users, ArrowRight, Home } from "lucide-react"
import Link from "next/link"

interface CompletionProps {
  formData: Record<string, unknown>
}

export default function Completion({ formData }: CompletionProps) {
  const userName = (formData.contactName as string) || (formData.companyName as string) || "Usuario"

  return (
    <div className="text-center max-w-2xl mx-auto">
      {/* Animated Icon */}
      <div className="mb-4">
        <div className="relative w-20 h-20 mx-auto">
          {/* Spinning ring */}
          <div className="absolute inset-0 border-4 border-green-200 rounded-full animate-spin border-t-green-600"></div>
          {/* Center icon */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-blue-500 rounded-full flex items-center justify-center">
              <Clock className="w-8 h-8 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Main Title */}
      <h2 className="text-2xl font-bold text-gray-900 mb-2">¡Solicitud Recibida!</h2>
      <p className="text-sm text-gray-600 mb-6">
        Estamos validando tu información
      </p>

      {/* Status Card */}
      <Card className="mb-6 border-2 border-green-100">
        <CardContent className="p-6">
          <div className="space-y-4">
            {/* Greeting */}
            <div className="pb-4 border-b border-gray-100">
              <p className="text-base text-gray-700">
                Hola <span className="font-semibold text-green-700">{userName}</span>, gracias por completar tu registro.
              </p>
            </div>

            {/* Status Items */}
            <div className="space-y-3 text-left">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-sm text-gray-900">Datos Recibidos</h4>
                  <p className="text-xs text-gray-600">Tu información ha sido enviada correctamente</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Shield className="w-4 h-4 text-blue-600 animate-pulse" />
                </div>
                <div>
                  <h4 className="font-semibold text-sm text-gray-900">Validación en Proceso</h4>
                  <p className="text-xs text-gray-600">Nuestro equipo está revisando tus credenciales</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <FileCheck className="w-4 h-4 text-purple-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-sm text-gray-900">Verificación de Certificaciones</h4>
                  <p className="text-xs text-gray-600">Validamos tus certificados de sostenibilidad</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Users className="w-4 h-4 text-amber-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-sm text-gray-900">Aprobación Final</h4>
                  <p className="text-xs text-gray-600">Te notificaremos cuando tu cuenta esté activa</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* What's Next Section */}
      <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-0">
        <CardContent className="p-4">
          <h3 className="font-semibold text-sm text-gray-900 mb-2">¿Qué sigue?</h3>
          <div className="space-y-2 text-xs text-gray-700 text-left">
            <div className="flex items-start gap-2">
              <span className="text-green-600 font-bold mt-0.5">1.</span>
              <p>Recibirás un <strong>correo de confirmación</strong> con los próximos pasos</p>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-green-600 font-bold mt-0.5">2.</span>
              <p>Nuestro equipo revisará tu solicitud en <strong>24-48 horas</strong></p>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-green-600 font-bold mt-0.5">3.</span>
              <p>Una vez aprobado, podrás <strong>acceder a tu dashboard</strong> y comenzar a vender</p>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-green-600 font-bold mt-0.5">4.</span>
              <p>Recibirás tu <strong>NFT de certificación</strong> como vendedor verificado</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 justify-center mt-6">
        <Link href="/dashboard" className="flex-1 sm:flex-initial">
          <Button
            className="w-full bg-green-600 hover:bg-green-700 text-white"
            size="lg"
          >
            <ArrowRight className="w-4 h-4 mr-2" />
            Ir al Dashboard
          </Button>
        </Link>
        <Link href="/" className="flex-1 sm:flex-initial">
          <Button
            variant="outline"
            className="w-full border-green-600 text-green-600 hover:bg-green-50"
            size="lg"
          >
            <Home className="w-4 h-4 mr-2" />
            Volver al Inicio
          </Button>
        </Link>
      </div>

      {/* Contact Info */}
      <div className="mt-6 text-xs text-gray-500">
        <p>¿Tienes preguntas? Contáctanos en <a href="mailto:soporte@urbanika.com" className="text-green-600 hover:underline">soporte@urbanika.com</a></p>
      </div>
    </div>
  )
}
