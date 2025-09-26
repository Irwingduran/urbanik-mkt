"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Award, Sparkles, ArrowRight, Download, Share2, Trophy } from "lucide-react"
import Link from "next/link"

interface CompletionProps {
  userType: "vendor" | "user" | null
  formData: Record<string, unknown>
}

export default function Completion({ userType, formData }: CompletionProps) {
  const isVendor = userType === "vendor"

  const nftData = isVendor
    ? {
        name: "Semilla Verde Empresarial",
        description: "Tu primer NFT como proveedor sostenible certificado",
        level: "Inicial",
        nextEvolution: "Hoja Creciente (50 puntos REGEN)",
        benefits: [
          "Perfil verificado en marketplace",
          "Acceso a herramientas de métricas",
          "Comunidad de proveedores",
          "Soporte prioritario",
        ],
      }
    : {
        name: "Explorador Verde",
        description: "Tu primer NFT como comprador consciente",
        level: "Inicial",
        nextEvolution: "Guardián Eco (10 compras sostenibles)",
        benefits: [
          "Recomendaciones personalizadas",
          "Seguimiento de impacto",
          "Descuentos especiales",
          "Comunidad eco-friendly",
        ],
      }

  return (
    <div className="text-center">
      <div className="mb-8">
        <div className="w-24 h-24 bg-gradient-to-br from-green-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-12 h-12 text-white" />
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-4">¡Bienvenido a EcoTech! 🎉</h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Tu cuenta ha sido creada exitosamente. Has recibido tu primer NFT de sostenibilidad y ya puedes comenzar a
          explorar nuestro marketplace eco-friendly.
        </p>
      </div>

      {/* NFT Card */}
      <Card className="max-w-md mx-auto mb-8 border-2 border-green-200 shadow-lg">
        <CardContent className="p-6">
          <div className="relative mb-6">
            <div className="w-32 h-32 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Award className="w-16 h-16 text-white" />
            </div>
            <Badge className="absolute top-0 right-12 bg-yellow-500 text-yellow-900">
              <Sparkles className="w-3 h-3 mr-1" />
              NUEVO
            </Badge>
          </div>

          <h3 className="text-xl font-bold text-gray-900 mb-2">{nftData.name}</h3>
          <p className="text-sm text-gray-600 mb-4">{nftData.description}</p>

          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">Nivel:</span>
              <Badge className="bg-green-100 text-green-800">{nftData.level}</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">Próxima evolución:</span>
              <span className="text-xs text-blue-600 font-medium">{nftData.nextEvolution}</span>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-gray-200">
            <h4 className="font-semibold text-gray-900 mb-3 flex items-center justify-center">
              <Trophy className="w-4 h-4 mr-2 text-yellow-600" />
              Beneficios Incluidos
            </h4>
            <ul className="text-sm text-gray-600 space-y-1">
              {nftData.benefits.map((benefit, index) => (
                <li key={index} className="flex items-center">
                  <CheckCircle className="w-3 h-3 text-green-600 mr-2" />
                  {benefit}
                </li>
              ))}
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="space-y-4 mb-8">
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Button className="bg-green-600 hover:bg-green-700 text-white px-8">
            <Download className="w-4 h-4 mr-2" />
            Descargar NFT
          </Button>
          <Button variant="outline" className="border-blue-600 text-blue-600 hover:bg-blue-50 bg-transparent">
            <Share2 className="w-4 h-4 mr-2" />
            Compartir Logro
          </Button>
        </div>

        <Link href="/dashboard">
          <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-12">
            Ir al Dashboard
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </Link>
      </div>

      {/* Quick Actions */}
      <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
        <Card className="border-0 shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="p-6 text-center">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Sparkles className="w-6 h-6 text-green-600" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">{isVendor ? "Subir Productos" : "Explorar Productos"}</h4>
            <p className="text-sm text-gray-600">
              {isVendor ? "Comienza a vender tus productos sostenibles" : "Descubre miles de productos eco-friendly"}
            </p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="p-6 text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trophy className="w-6 h-6 text-blue-600" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">Mejorar REGEN SCORE</h4>
            <p className="text-sm text-gray-600">
              {isVendor ? "Actualiza tus métricas de sostenibilidad" : "Realiza compras sostenibles verificadas"}
            </p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="p-6 text-center">
            <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Award className="w-6 h-6 text-yellow-600" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">Únete a la Comunidad</h4>
            <p className="text-sm text-gray-600">Conecta con otros miembros comprometidos con la sostenibilidad</p>
          </CardContent>
        </Card>
      </div>

      {/* Welcome Message */}
      <div className="mt-12 p-6 bg-gradient-to-r from-green-50 to-blue-50 rounded-xl max-w-2xl mx-auto">
        <h4 className="font-semibold text-gray-900 mb-2">🌱 Tu Journey Sostenible Comienza Ahora</h4>
        <p className="text-sm text-gray-700">
          {isVendor
            ? `Hola ${formData.contactName || "Proveedor"}, estamos emocionados de tenerte en EcoTech. Tu compromiso con la sostenibilidad ayudará a construir un futuro más verde.`
            : `Hola ${formData.firstName || "Usuario"}, gracias por elegir un estilo de vida sostenible. Cada compra que realices contribuirá a un planeta más saludable.`}
        </p>
      </div>
    </div>
  )
}
