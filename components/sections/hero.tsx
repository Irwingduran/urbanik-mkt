import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Leaf, Users, Award, TrendingUp } from "lucide-react"

export default function Hero() {
  return (
    <section className="relative bg-gradient-to-br from-green-50 via-white to-blue-50 py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <Badge className="mb-6 bg-green-100 text-green-800 hover:bg-green-200">
            <Leaf className="w-4 h-4 mr-2" />
            Marketplace #1 en Sostenibilidad
          </Badge>

          {/* Main Heading */}
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            El Futuro del Comercio
            <span className="text-green-600 block">Sostenible</span>
          </h1>

          {/* Subtitle */}
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Conectamos compradores conscientes con vendedores comprometidos. Cada compra genera impacto positivo y
            evoluciona tu NFT sostenible.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link href="/marketplace">
              <Button size="lg" className="bg-green-600 hover:bg-green-700 text-white px-8">
                Explorar Marketplace
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            <Link href="/onboarding">
              <Button
                size="lg"
                variant="outline"
                className="border-green-600 text-green-600 hover:bg-green-50 px-8 bg-transparent"
              >
                Comenzar a Vender
              </Button>
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-3xl mx-auto">
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <Users className="w-6 h-6 text-green-600 mr-2" />
                <span className="text-2xl font-bold text-gray-900">10K+</span>
              </div>
              <p className="text-gray-600">Vendedores Verificados</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <Award className="w-6 h-6 text-blue-600 mr-2" />
                <span className="text-2xl font-bold text-gray-900">50K+</span>
              </div>
              <p className="text-gray-600">Productos Certificados</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <Leaf className="w-6 h-6 text-green-600 mr-2" />
                <span className="text-2xl font-bold text-gray-900">2.5M</span>
              </div>
              <p className="text-gray-600">Ton CO₂ Reducidas</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <TrendingUp className="w-6 h-6 text-purple-600 mr-2" />
                <span className="text-2xl font-bold text-gray-900">95%</span>
              </div>
              <p className="text-gray-600">Satisfacción Cliente</p>
            </div>
          </div>
        </div>
      </div>

      {/* Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-20 h-20 bg-green-200 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-32 h-32 bg-blue-200 rounded-full opacity-20 animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-yellow-200 rounded-full opacity-20 animate-pulse delay-500"></div>
      </div>
    </section>
  )
}
