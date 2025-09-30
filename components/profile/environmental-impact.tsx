"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { TreePine, Droplets, Zap, Recycle, Globe, Users, TrendingUp, Download, Share2 } from "lucide-react"

interface EnvironmentalImpactProps {
  products: Array<Record<string, unknown>>
  overallImpact: {
    totalCO2Saved: string
    totalWaterSaved: string
    totalEnergyGenerated: string
    totalWasteReduced: string
    customersImpacted: string
    countriesServed: string
  }
}

export default function EnvironmentalImpact({ products, overallImpact }: EnvironmentalImpactProps) {
  const impactMetrics = [
    {
      icon: TreePine,
      title: "CO₂ Evitado",
      value: overallImpact.totalCO2Saved,
      unit: "toneladas",
      color: "text-green-600",
      bgColor: "bg-green-50",
      description: "Emisiones de carbono evitadas gracias a nuestros productos",
      target: 3000000,
      current: 2400000,
    },
    {
      icon: Droplets,
      title: "Agua Conservada",
      value: overallImpact.totalWaterSaved,
      unit: "litros",
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      description: "Litros de agua ahorrados por nuestras tecnologías",
      target: 1000000000,
      current: 847000000,
    },
    {
      icon: Zap,
      title: "Energía Limpia",
      value: overallImpact.totalEnergyGenerated,
      unit: "GW generados",
      color: "text-yellow-600",
      bgColor: "bg-yellow-50",
      description: "Energía renovable generada por nuestros sistemas",
      target: 1500,
      current: 1200,
    },
    {
      icon: Recycle,
      title: "Residuos Reducidos",
      value: overallImpact.totalWasteReduced,
      unit: "kg",
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      description: "Residuos evitados o reciclados",
      target: 500000,
      current: 340000,
    },
  ]

  return (
    <div className="space-y-6">
      {/* Impact Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Globe className="w-5 h-5 text-green-600" />
              <span>Impacto Ambiental Global</span>
            </div>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Reporte
              </Button>
              <Button variant="outline" size="sm">
                <Share2 className="w-4 h-4 mr-2" />
                Compartir
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {impactMetrics.map((metric, index) => {
              const Icon = metric.icon
              const percentage = (metric.current / metric.target) * 100

              return (
                <div key={index} className={`p-6 ${metric.bgColor} rounded-xl`}>
                  <div className="flex items-center space-x-3 mb-4">
                    <div className={`w-12 h-12 bg-white rounded-lg flex items-center justify-center`}>
                      <Icon className={`w-6 h-6 ${metric.color}`} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{metric.title}</h3>
                      <p className="text-xs text-gray-600">{metric.description}</p>
                    </div>
                  </div>

                  <div className="mb-4">
                    <div className={`text-3xl font-bold ${metric.color} mb-1`}>
                      {Number(metric.value.replace(/,/g, "")).toLocaleString()}
                    </div>
                    <div className="text-sm text-gray-600">{metric.unit}</div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Progreso anual</span>
                      <span>{percentage.toFixed(0)}%</span>
                    </div>
                    <Progress value={percentage} className="h-2" />
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Impact Infographic */}
      <Card>
        <CardHeader>
          <CardTitle>Infografía de Impacto</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Visual Impact */}
            <div className="space-y-6">
              <div className="text-center p-8 bg-gradient-to-br from-green-50 to-blue-50 rounded-xl">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Equivalencias de Impacto</h3>

                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-white rounded-lg">
                    <div className="flex items-center space-x-3">
                      <TreePine className="w-6 h-6 text-green-600" />
                      <span className="font-medium">CO₂ Evitado</span>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-green-600">2.4M toneladas</div>
                      <div className="text-sm text-gray-500">= 520,000 autos menos</div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-white rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Droplets className="w-6 h-6 text-blue-600" />
                      <span className="font-medium">Agua Ahorrada</span>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-blue-600">847M litros</div>
                      <div className="text-sm text-gray-500">= 339 piscinas olímpicas</div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-white rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Zap className="w-6 h-6 text-yellow-600" />
                      <span className="font-medium">Energía Limpia</span>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-yellow-600">1.2 GW</div>
                      <div className="text-sm text-gray-500">= 400,000 hogares</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <Users className="w-8 h-8 text-green-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-green-600">{overallImpact.customersImpacted}</div>
                  <div className="text-sm text-green-700">Clientes Impactados</div>
                </div>
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <Globe className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-blue-600">{overallImpact.countriesServed}</div>
                  <div className="text-sm text-blue-700">Países Servidos</div>
                </div>
              </div>
            </div>

            {/* Product Impact Breakdown */}
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Impacto por Producto</h3>

              {products.map((product, index) => {
                const typedProduct = product as {name: string, category: string, impact: Record<string, string>}
                return (
                <div key={index} className="p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between mb-3">
                    <h4 className="font-semibold text-gray-900">{typedProduct.name}</h4>
                    <Badge className="bg-green-100 text-green-800">{typedProduct.category}</Badge>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    {Object.entries(typedProduct.impact)
                      .slice(0, 4)
                      .map(([key, value]) => (
                        <div key={key} className="text-center p-2 bg-gray-50 rounded">
                          <div className="text-xs text-gray-500 capitalize">
                            {key.replace(/([A-Z])/g, " $1").toLowerCase()}
                          </div>
                          <div className="text-sm font-medium text-gray-900">{value}</div>
                        </div>
                      ))}
                  </div>
                </div>
                )
              })}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Impact Timeline */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <TrendingUp className="w-5 h-5 text-green-600" />
            <span>Evolución del Impacto</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {[
              { year: "2024", co2: "2.4M", water: "847M", energy: "1.2GW", waste: "340K" },
              { year: "2023", co2: "1.8M", water: "620M", energy: "0.9GW", waste: "280K" },
              { year: "2022", co2: "1.2M", water: "450M", energy: "0.6GW", waste: "200K" },
              { year: "2021", co2: "0.8M", water: "320M", energy: "0.4GW", waste: "150K" },
            ].map((data, index) => (
              <div key={index} className="flex items-center space-x-8 p-4 bg-gray-50 rounded-lg">
                <div className="w-16 text-center">
                  <div className="text-lg font-bold text-gray-900">{data.year}</div>
                </div>
                <div className="flex-1 grid grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-sm font-medium text-green-600">{data.co2} ton</div>
                    <div className="text-xs text-gray-500">CO₂ evitado</div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm font-medium text-blue-600">{data.water} L</div>
                    <div className="text-xs text-gray-500">Agua ahorrada</div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm font-medium text-yellow-600">{data.energy}</div>
                    <div className="text-xs text-gray-500">Energía limpia</div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm font-medium text-purple-600">{data.waste} kg</div>
                    <div className="text-xs text-gray-500">Residuos evitados</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Future Goals */}
      <Card>
        <CardHeader>
          <CardTitle>Objetivos de Impacto 2025</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-900">Metas Ambientales</h3>
              {[
                { metric: "CO₂ Evitado", current: "2.4M", target: "3.5M", unit: "toneladas" },
                { metric: "Agua Conservada", current: "847M", target: "1.2B", unit: "litros" },
                { metric: "Energía Limpia", current: "1.2", target: "2.0", unit: "GW" },
                { metric: "Residuos Reducidos", current: "340K", target: "500K", unit: "kg" },
              ].map((goal, index) => (
                <div key={index} className="p-3 border rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium text-gray-900">{goal.metric}</span>
                    <Badge variant="outline">
                      {goal.current} → {goal.target} {goal.unit}
                    </Badge>
                  </div>
                  <Progress value={65} className="h-2" />
                </div>
              ))}
            </div>

            <div className="p-6 bg-gradient-to-br from-green-50 to-blue-50 rounded-xl">
              <h3 className="font-semibold text-gray-900 mb-4">Compromiso 2025</h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start space-x-2">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0"></span>
                  <span>Alcanzar neutralidad de carbono en todas las operaciones</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></span>
                  <span>Expandir a 50 países con productos sostenibles</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="w-1.5 h-1.5 bg-yellow-500 rounded-full mt-2 flex-shrink-0"></span>
                  <span>Desarrollar 10 nuevas tecnologías regenerativas</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="w-1.5 h-1.5 bg-purple-500 rounded-full mt-2 flex-shrink-0"></span>
                  <span>Impactar positivamente a 100,000 clientes</span>
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
