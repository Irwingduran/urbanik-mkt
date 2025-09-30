import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Leaf, Users, Award } from "lucide-react"

export default function CTASection() {
  return (
    <section className="py-16 bg-gradient-to-r from-green-600 to-blue-600 text-white">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <Badge className="mb-6 bg-white/20 text-white hover:bg-white/30">
            <Leaf className="w-4 h-4 mr-2" />
            Únete a la Revolución Sostenible
          </Badge>

          {/* Main Heading */}
          <h2 className="text-3xl md:text-5xl font-bold mb-6">¿Listo para Hacer la Diferencia?</h2>

          {/* Subtitle */}
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Únete a miles de personas que ya están construyendo un futuro más sostenible. Cada compra cuenta, cada
            decisión importa.
          </p>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8 max-w-2xl mx-auto">
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <Users className="w-5 h-5 mr-2" />
                <span className="text-2xl font-bold">25K+</span>
              </div>
              <p className="text-white/80 text-sm">Miembros Activos</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <Award className="w-5 h-5 mr-2" />
                <span className="text-2xl font-bold">50K+</span>
              </div>
              <p className="text-white/80 text-sm">Productos Verificados</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <Leaf className="w-5 h-5 mr-2" />
                <span className="text-2xl font-bold">2.5M</span>
              </div>
              <p className="text-white/80 text-sm">Ton CO₂ Reducidas</p>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/marketplace">
              <Button size="lg" className="bg-white text-green-600 hover:bg-gray-100 px-8">
                Explorar Marketplace
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            <Link href="/onboarding">
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-green-600 px-8 bg-transparent"
              >
                Comenzar a Vender
              </Button>
            </Link>
          </div>

          {/* Additional Info */}
          <p className="text-white/70 text-sm mt-6">Registro gratuito • Sin comisiones el primer mes • Soporte 24/7</p>
        </div>
      </div>
    </section>
  )
}
