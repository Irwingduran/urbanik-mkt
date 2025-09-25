"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import {
  Lightbulb,
  TrendingUp,
  Target,
  CheckCircle,
  ArrowRight,
  Star,
  Award,
  Zap,
  Droplets,
  Recycle,
} from "lucide-react"

interface RecommendationsPanelProps {
  score: number
}

export default function RecommendationsPanel({ score }: RecommendationsPanelProps) {
  const recommendations = [
    {
      id: 1,
      title: "Mejorar Métricas de Agua",
      description: "Aumenta tu ahorro de agua en 25,000 litros para alcanzar tu objetivo",
      impact: "+8 REGEN",
      priority: "high",
      category: "metrics",
      icon: Droplets,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      actions: ["Instalar sistemas de reciclaje", "Optimizar procesos de producción"],
      timeframe: "2-3 meses",
    },
    {
      id: 2,
      title: "Obtener Certificación B-Corp",
      description: "Esta certificación aumentaría significativamente tu REGEN SCORE",
      impact: "+15 REGEN",
      priority: "high",
      category: "certification",
      icon: Award,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      actions: ["Completar evaluación B-Corp", "Documentar impacto social"],
      timeframe: "4-6 meses",
    },
    {
      id: 3,
      title: "Aumentar Energía Renovable",
      description: "Llega al 100% de energía renovable para maximizar tu puntuación",
      impact: "+5 REGEN",
      priority: "medium",
      category: "metrics",
      icon: Zap,
      color: "text-yellow-600",
      bgColor: "bg-yellow-50",
      actions: ["Instalar paneles solares adicionales", "Cambiar a proveedor 100% renovable"],
      timeframe: "1-2 meses",
    },
    {
      id: 4,
      title: "Optimizar Gestión de Residuos",
      description: "Alcanza el 95% de reducción de residuos",
      impact: "+3 REGEN",
      priority: "low",
      category: "metrics",
      icon: Recycle,
      color: "text-green-600",
      bgColor: "bg-green-50",
      actions: ["Implementar programa de compostaje", "Reducir empaques"],
      timeframe: "1 mes",
    },
  ]

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "high":
        return <Badge className="bg-red-100 text-red-800">Alta Prioridad</Badge>
      case "medium":
        return <Badge className="bg-yellow-100 text-yellow-800">Media Prioridad</Badge>
      case "low":
        return <Badge className="bg-green-100 text-green-800">Baja Prioridad</Badge>
      default:
        return <Badge className="bg-gray-100 text-gray-800">Sin Prioridad</Badge>
    }
  }

  const totalPotentialGain = recommendations.reduce(
    (sum, rec) => sum + Number.parseInt(rec.impact.replace("+", "").replace(" REGEN", "")),
    0,
  )

  return (
    <div className="space-y-6">
      {/* Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Lightbulb className="w-5 h-5 text-yellow-600" />
            <span>Recomendaciones Personalizadas</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <Target className="w-5 h-5 text-green-600" />
                <span className="font-semibold text-green-900">Potencial de Mejora</span>
              </div>
              <div className="text-2xl font-bold text-green-600">+{totalPotentialGain} REGEN</div>
              <p className="text-sm text-green-700">Puntos adicionales posibles</p>
            </div>

            <div className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <TrendingUp className="w-5 h-5 text-purple-600" />
                <span className="font-semibold text-purple-900">Próximo Objetivo</span>
              </div>
              <div className="text-2xl font-bold text-purple-600">
                {score >= 90 ? "Máximo" : score >= 75 ? "90" : "75"}
              </div>
              <p className="text-sm text-purple-700">
                {score >= 90 ? "Nivel alcanzado" : `Faltan ${(score >= 75 ? 90 : 75) - score} puntos`}
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Progreso hacia el siguiente nivel</span>
              <span>{Math.min(100, ((score % 25) / 25) * 100).toFixed(0)}%</span>
            </div>
            <Progress value={Math.min(100, ((score % 25) / 25) * 100)} className="h-2" />
          </div>
        </CardContent>
      </Card>

      {/* Recommendations List */}
      <div className="space-y-4">
        {recommendations.map((rec) => {
          const Icon = rec.icon
          return (
            <Card key={rec.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start space-x-3">
                    <div className={`w-10 h-10 ${rec.bgColor} rounded-lg flex items-center justify-center`}>
                      <Icon className={`w-5 h-5 ${rec.color}`} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">{rec.title}</h3>
                      <p className="text-sm text-gray-600 mb-2">{rec.description}</p>
                      <div className="flex items-center space-x-2">
                        {getPriorityBadge(rec.priority)}
                        <Badge className="bg-green-100 text-green-800">
                          <Star className="w-3 h-3 mr-1" />
                          {rec.impact}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Acciones Recomendadas:</h4>
                    <ul className="space-y-1">
                      {rec.actions.map((action, index) => (
                        <li key={index} className="flex items-center space-x-2 text-sm text-gray-600">
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          <span>{action}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <span>Tiempo estimado: {rec.timeframe}</span>
                    </div>
                    <Button className="bg-green-600 hover:bg-green-700 text-white">
                      Comenzar
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Quick Wins */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Zap className="w-5 h-5 text-yellow-600" />
            <span>Victorias Rápidas</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            {[
              { title: "Actualizar perfil de empresa", impact: "+2 REGEN", time: "5 min" },
              { title: "Subir foto de instalaciones", impact: "+1 REGEN", time: "2 min" },
              { title: "Completar métricas pendientes", impact: "+3 REGEN", time: "10 min" },
              { title: "Conectar redes sociales", impact: "+1 REGEN", time: "3 min" },
            ].map((item, index) => (
              <div key={index} className="p-3 border border-dashed border-gray-300 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-gray-900">{item.title}</h4>
                  <Badge className="bg-yellow-100 text-yellow-800">{item.impact}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">{item.time}</span>
                  <Button variant="outline" size="sm">
                    Hacer Ahora
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
