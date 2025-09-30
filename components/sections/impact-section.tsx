import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TreePine, Droplets, Zap, Recycle, Users, Award } from "lucide-react"

const impactStats = [
  {
    icon: TreePine,
    value: "2.5M",
    unit: "Toneladas CO₂",
    label: "Reducidas este año",
    color: "text-green-600",
    bgColor: "bg-green-100",
  },
  {
    icon: Droplets,
    value: "850K",
    unit: "Litros de Agua",
    label: "Ahorrados mensualmente",
    color: "text-blue-600",
    bgColor: "bg-blue-100",
  },
  {
    icon: Zap,
    value: "1.2M",
    unit: "kWh Limpios",
    label: "Generados por productos",
    color: "text-yellow-600",
    bgColor: "bg-yellow-100",
  },
  {
    icon: Recycle,
    value: "95%",
    unit: "Materiales",
    label: "Reciclables certificados",
    color: "text-purple-600",
    bgColor: "bg-purple-100",
  },
]

const achievements = [
  {
    title: "Certificación B Corp",
    description: "Empresa certificada por su impacto social y ambiental",
    badge: "Verificado",
  },
  {
    title: "Carbon Neutral 2024",
    description: "Operaciones 100% neutras en carbono",
    badge: "Activo",
  },
  {
    title: "UN Global Compact",
    description: "Miembro del Pacto Mundial de las Naciones Unidas",
    badge: "Miembro",
  },
]

export default function ImpactSection() {
  return (
    <section className="py-16 bg-gradient-to-br from-green-50 to-blue-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <Badge className="mb-4 bg-green-100 text-green-800">
            <Award className="w-4 h-4 mr-2" />
            Impacto Verificado
          </Badge>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Nuestro Impacto en Números</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Cada transacción en nuestra plataforma contribuye a un futuro más sostenible. Conoce el impacto real que
            estamos generando juntos.
          </p>
        </div>

        {/* Impact Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {impactStats.map((stat, index) => {
            const Icon = stat.icon
            return (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6 text-center">
                  <div
                    className={`w-16 h-16 ${stat.bgColor} rounded-full flex items-center justify-center mx-auto mb-4`}
                  >
                    <Icon className={`w-8 h-8 ${stat.color}`} />
                  </div>
                  <div className="mb-2">
                    <span className="text-3xl font-bold text-gray-900">{stat.value}</span>
                    <span className="text-lg text-gray-600 ml-1">{stat.unit}</span>
                  </div>
                  <p className="text-gray-600 text-sm">{stat.label}</p>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Achievements */}
        <div className="max-w-4xl mx-auto">
          <h3 className="text-2xl font-bold text-gray-900 text-center mb-8">Certificaciones y Reconocimientos</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {achievements.map((achievement, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6 text-center">
                  <div className="mb-4">
                    <Badge className="bg-green-100 text-green-800">{achievement.badge}</Badge>
                  </div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">{achievement.title}</h4>
                  <p className="text-gray-600 text-sm">{achievement.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Community Stats */}
        <div className="mt-12 text-center">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto">
            <div>
              <div className="flex items-center justify-center mb-2">
                <Users className="w-6 h-6 text-green-600 mr-2" />
                <span className="text-2xl font-bold text-gray-900">25,000+</span>
              </div>
              <p className="text-gray-600">Compradores Activos</p>
            </div>
            <div>
              <div className="flex items-center justify-center mb-2">
                <Award className="w-6 h-6 text-blue-600 mr-2" />
                <span className="text-2xl font-bold text-gray-900">10,000+</span>
              </div>
              <p className="text-gray-600">Vendedores Certificados</p>
            </div>
            <div>
              <div className="flex items-center justify-center mb-2">
                <TreePine className="w-6 h-6 text-green-600 mr-2" />
                <span className="text-2xl font-bold text-gray-900">500+</span>
              </div>
              <p className="text-gray-600">Ciudades con Impacto</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
