"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import {
  TreePine,
  Droplets,
  Zap,
  Recycle,
  TrendingUp,
  TrendingDown,
  RefreshCw,
  Calendar,
  Target,
  BarChart3,
} from "lucide-react"

interface MetricsOverviewProps {
  metrics: {
    carbonReduction: { value: number; target: number; unit: string }
    waterSaving: { value: number; target: number; unit: string }
    renewableEnergy: { value: number; target: number; unit: string }
    wasteReduction: { value: number; target: number; unit: string }
  }
}

export default function MetricsOverview({ metrics }: MetricsOverviewProps) {
  const metricConfigs = [
    {
      key: "carbonReduction",
      title: "Reducción de CO₂",
      icon: TreePine,
      color: "text-green-600",
      bgColor: "bg-green-50",
      borderColor: "border-green-200",
      trend: "+12%",
      trendUp: true,
      description: "Toneladas de CO₂ evitadas anualmente",
    },
    {
      key: "waterSaving",
      title: "Ahorro de Agua",
      icon: Droplets,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200",
      trend: "+8%",
      trendUp: true,
      description: "Litros de agua conservados por año",
    },
    {
      key: "renewableEnergy",
      title: "Energía Renovable",
      icon: Zap,
      color: "text-yellow-600",
      bgColor: "bg-yellow-50",
      borderColor: "border-yellow-200",
      trend: "+5%",
      trendUp: true,
      description: "Porcentaje de energía de fuentes renovables",
    },
    {
      key: "wasteReduction",
      title: "Reducción de Residuos",
      icon: Recycle,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      borderColor: "border-purple-200",
      trend: "+3%",
      trendUp: true,
      description: "Porcentaje de residuos reducidos o reciclados",
    },
  ]

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Métricas de Sostenibilidad</h2>
          <p className="text-gray-600">Monitorea y actualiza tus indicadores ambientales</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <Calendar className="w-4 h-4 mr-2" />
            Programar Reporte
          </Button>
          <Button>
            <RefreshCw className="w-4 h-4 mr-2" />
            Actualizar Datos
          </Button>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid md:grid-cols-2 gap-6">
        {metricConfigs.map((config) => {
          const metric = metrics[config.key as keyof typeof metrics]
          const percentage = (metric.value / metric.target) * 100
          const Icon = config.icon

          return (
            <Card key={config.key} className={`border-2 ${config.borderColor}`}>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className={`w-8 h-8 ${config.bgColor} rounded-lg flex items-center justify-center`}>
                      <Icon className={`w-5 h-5 ${config.color}`} />
                    </div>
                    <span>{config.title}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    {config.trendUp ? (
                      <TrendingUp className="w-4 h-4 text-green-500" />
                    ) : (
                      <TrendingDown className="w-4 h-4 text-red-500" />
                    )}
                    <span className={`text-sm font-medium ${config.trendUp ? "text-green-600" : "text-red-600"}`}>
                      {config.trend}
                    </span>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-gray-900 mb-1">{metric.value.toLocaleString()}</div>
                  <div className="text-sm text-gray-500">
                    de {metric.target.toLocaleString()} {metric.unit}
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Progreso hacia objetivo</span>
                    <span className="font-medium">{percentage.toFixed(1)}%</span>
                  </div>
                  <Progress value={Math.min(100, percentage)} className="h-3" />
                </div>

                <p className="text-xs text-gray-600">{config.description}</p>

                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                    <BarChart3 className="w-4 h-4 mr-2" />
                    Ver Histórico
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                    <Target className="w-4 h-4 mr-2" />
                    Ajustar Meta
                  </Button>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Summary Card */}
      <Card>
        <CardHeader>
          <CardTitle>Resumen de Rendimiento</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-4 gap-4 mb-6">
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">3/4</div>
              <div className="text-sm text-green-700">Objetivos en Progreso</div>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">85%</div>
              <div className="text-sm text-blue-700">Promedio de Cumplimiento</div>
            </div>
            <div className="text-center p-4 bg-yellow-50 rounded-lg">
              <div className="text-2xl font-bold text-yellow-600">+7%</div>
              <div className="text-sm text-yellow-700">Mejora vs Mes Anterior</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">A</div>
              <div className="text-sm text-purple-700">Calificación General</div>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="font-semibold text-gray-900">Próximas Acciones Recomendadas:</h4>
            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-sm">
                <Badge className="bg-yellow-100 text-yellow-800">Prioridad Media</Badge>
                <span>Aumentar ahorro de agua en 25,000 litros</span>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <Badge className="bg-green-100 text-green-800">Fácil</Badge>
                <span>Completar transición a 100% energía renovable</span>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <Badge className="bg-blue-100 text-blue-800">Documentar</Badge>
                <span>Actualizar datos de reducción de residuos</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
