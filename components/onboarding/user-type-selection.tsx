"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Store, ShoppingCart, Users, Award, TrendingUp, Leaf, ArrowRight } from "lucide-react"

interface UserTypeSelectionProps {
  onSelect: (type: "vendor" | "user") => void
}

export default function UserTypeSelection({ onSelect }: UserTypeSelectionProps) {
  return (
    <div className="text-center">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">¿Cómo quieres participar?</h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Selecciona el tipo de cuenta que mejor se adapte a tus necesidades. Siempre podrás cambiar o agregar
          funcionalidades más adelante.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        {/* Vendor Card */}
        <Card className="border-2 border-gray-200 hover:border-green-500 transition-colors cursor-pointer group">
          <CardContent className="p-8">
            <div className="text-center mb-6">
              <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <Store className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Soy Proveedor</h3>
              <p className="text-gray-600">Vendo productos o servicios sostenibles</p>
            </div>

            <div className="space-y-4 mb-8">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <Award className="w-4 h-4 text-green-600" />
                </div>
                <span className="text-sm text-gray-700">Obtén NFTs de certificación</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <TrendingUp className="w-4 h-4 text-blue-600" />
                </div>
                <span className="text-sm text-gray-700">Mejora tu REGEN SCORE</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                  <Users className="w-4 h-4 text-yellow-600" />
                </div>
                <span className="text-sm text-gray-700">Accede a mercado global</span>
              </div>
            </div>

            <Badge className="w-full mb-4 bg-green-50 text-green-700 border-green-200">
              Ideal para empresas y emprendedores
            </Badge>

            <Button onClick={() => onSelect("vendor")} className="w-full bg-green-600 hover:bg-green-700 text-white">
              Comenzar como Proveedor
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </CardContent>
        </Card>

        {/* User Card */}
        <Card className="border-2 border-gray-200 hover:border-blue-500 transition-colors cursor-pointer group">
          <CardContent className="p-8">
            <div className="text-center mb-6">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <ShoppingCart className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Soy Comprador</h3>
              <p className="text-gray-600">Busco productos y servicios sostenibles</p>
            </div>

            <div className="space-y-4 mb-8">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <Leaf className="w-4 h-4 text-green-600" />
                </div>
                <span className="text-sm text-gray-700">Productos eco-certificados</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <Award className="w-4 h-4 text-blue-600" />
                </div>
                <span className="text-sm text-gray-700">Transparencia total</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                  <TrendingUp className="w-4 h-4 text-yellow-600" />
                </div>
                <span className="text-sm text-gray-700">Seguimiento de impacto</span>
              </div>
            </div>

            <Badge className="w-full mb-4 bg-blue-50 text-blue-700 border-blue-200">
              Ideal para consumidores conscientes
            </Badge>

            <Button onClick={() => onSelect("user")} className="w-full bg-blue-600 hover:bg-blue-700 text-white">
              Comenzar como Comprador
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="mt-12 p-6 bg-gradient-to-r from-green-50 to-blue-50 rounded-xl">
        <h4 className="font-semibold text-gray-900 mb-2">💡 ¿Sabías que?</h4>
        <p className="text-sm text-gray-600">
          En EcoTech, todos los participantes contribuyen a crear un ecosistema sostenible. Los proveedores obtienen
          NFTs que evolucionan con su impacto ambiental, mientras que los compradores pueden verificar el origen y
          certificaciones de cada producto.
        </p>
      </div>
    </div>
  )
}
