import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Shield, Award, Zap, Users, TrendingUp, Leaf, CheckCircle, Star } from "lucide-react"

const benefits = [
  {
    icon: Shield,
    title: "Productos Verificados",
    description: "Todos los productos pasan por un riguroso proceso de verificación de sostenibilidad",
    features: ["Certificaciones validadas", "Auditorías regulares", "Transparencia total"],
    color: "text-blue-600",
    bgColor: "bg-blue-100",
  },
  {
    icon: Award,
    title: "REGEN Score",
    description: "Sistema único de puntuación que mide el impacto regenerativo real de cada producto",
    features: ["Métricas científicas", "Impacto cuantificado", "Comparación objetiva"],
    color: "text-green-600",
    bgColor: "bg-green-100",
  },
  {
    icon: Zap,
    title: "NFTs Evolutivos",
    description: "Tus compras sostenibles se convierten en NFTs que evolucionan con tu impacto",
    features: ["Coleccionables únicos", "Valor creciente", "Comunidad exclusiva"],
    color: "text-purple-600",
    bgColor: "bg-purple-100",
  },
  {
    icon: Users,
    title: "Comunidad Global",
    description: "Únete a miles de personas comprometidas con un futuro más sostenible",
    features: ["Red de contactos", "Eventos exclusivos", "Conocimiento compartido"],
    color: "text-orange-600",
    bgColor: "bg-orange-100",
  },
]

const guarantees = [
  {
    icon: CheckCircle,
    title: "Garantía de Sostenibilidad",
    description: "100% de productos verificados o te devolvemos tu dinero",
  },
  {
    icon: Star,
    title: "Calidad Premium",
    description: "Solo trabajamos con los mejores vendedores del mercado",
  },
  {
    icon: TrendingUp,
    title: "Impacto Medible",
    description: "Trackea tu impacto ambiental en tiempo real",
  },
  {
    icon: Leaf,
    title: "Carbono Neutral",
    description: "Todas las entregas son 100% neutras en carbono",
  },
]

export default function BenefitsSection() {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        {/* Main Benefits */}
        <div className="text-center mb-12">
          <Badge className="mb-4 bg-green-100 text-green-800">
            <Leaf className="w-4 h-4 mr-2" />
            ¿Por qué EcoMarket?
          </Badge>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            La Plataforma Más Avanzada para el Comercio Sostenible
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Combinamos tecnología de vanguardia con un compromiso real hacia la sostenibilidad
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon
            return (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-8">
                  <div className="flex items-start space-x-4">
                    <div
                      className={`w-12 h-12 ${benefit.bgColor} rounded-lg flex items-center justify-center flex-shrink-0`}
                    >
                      <Icon className={`w-6 h-6 ${benefit.color}`} />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">{benefit.title}</h3>
                      <p className="text-gray-600 mb-4">{benefit.description}</p>
                      <ul className="space-y-2">
                        {benefit.features.map((feature, featureIndex) => (
                          <li key={featureIndex} className="flex items-center text-sm text-gray-600">
                            <CheckCircle className="w-4 h-4 text-green-600 mr-2 flex-shrink-0" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Guarantees */}
        <div className="bg-gray-50 rounded-2xl p-8">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Nuestras Garantías</h3>
            <p className="text-gray-600">Comprometidos con la excelencia en cada aspecto de tu experiencia</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {guarantees.map((guarantee, index) => {
              const Icon = guarantee.icon
              return (
                <div key={index} className="text-center">
                  <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
                    <Icon className="w-8 h-8 text-green-600" />
                  </div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">{guarantee.title}</h4>
                  <p className="text-gray-600 text-sm">{guarantee.description}</p>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
