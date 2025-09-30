"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { TrendingUp, Target, Info, TreePine, Droplets, Zap, Recycle } from "lucide-react"

interface RegenScoreCardProps {
  score: number
  metrics: {
    carbonReduction: { value: number; target: number; unit: string }
    waterSaving: { value: number; target: number; unit: string }
    renewableEnergy: { value: number; target: number; unit: string }
    wasteReduction: { value: number; target: number; unit: string }
  }
}

export default function RegenScoreCard({ score, metrics }: RegenScoreCardProps) {
  const getScoreLevel = (score: number) => {
    if (score >= 90) return { level: "Excelente", color: "text-green-600", bg: "bg-green-100" }
    if (score >= 75) return { level: "Muy Bueno", color: "text-blue-600", bg: "bg-blue-100" }
    if (score >= 60) return { level: "Bueno", color: "text-yellow-600", bg: "bg-yellow-100" }
    return { level: "En Desarrollo", color: "text-orange-600", bg: "bg-orange-100" }
  }

  const scoreLevel = getScoreLevel(score)

  const metricIcons = {
    carbonReduction: TreePine,
    waterSaving: Droplets,
    renewableEnergy: Zap,
    wasteReduction: Recycle,
  }

  const metricColors = {
    carbonReduction: "text-green-600",
    waterSaving: "text-blue-600",
    renewableEnergy: "text-yellow-600",
    wasteReduction: "text-purple-600",
  }

  return (
    <Card className="border-2 border-green-200">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Target className="w-5 h-5 text-green-600" />
            <span>REGEN SCORE</span>
          </div>
          <Button variant="ghost" size="icon">
            <Info className="w-4 h-4" />
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Score Display */}
        <div className="text-center">
          <div className="relative w-32 h-32 mx-auto mb-4">
            <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 120 120">
              <circle cx="60" cy="60" r="50" stroke="#e5e7eb" strokeWidth="8" fill="none" />
              <circle
                cx="60"
                cy="60"
                r="50"
                stroke="#10b981"
                strokeWidth="8"
                fill="none"
                strokeDasharray={`${(score / 100) * 314} 314`}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-900">{score}</div>
                <div className="text-sm text-gray-500">/ 100</div>
              </div>
            </div>
          </div>

          <Badge className={`${scoreLevel.bg} ${scoreLevel.color} mb-2`}>{scoreLevel.level}</Badge>

          <div className="flex items-center justify-center space-x-1 text-sm text-green-600">
            <TrendingUp className="w-4 h-4" />
            <span>+5 puntos este mes</span>
          </div>
        </div>

        {/* Metrics Breakdown */}
        <div className="space-y-3">
          <h4 className="font-semibold text-gray-900 text-sm">Desglose por Métricas</h4>
          {Object.entries(metrics).map(([key, metric]) => {
            const Icon = metricIcons[key as keyof typeof metricIcons]
            const color = metricColors[key as keyof typeof metricColors]
            const percentage = (metric.value / metric.target) * 100

            return (
              <div key={key} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Icon className={`w-4 h-4 ${color}`} />
                    <span className="text-sm text-gray-700">
                      {key === "carbonReduction" && "Reducción CO₂"}
                      {key === "waterSaving" && "Ahorro Agua"}
                      {key === "renewableEnergy" && "Energía Renovable"}
                      {key === "wasteReduction" && "Reducción Residuos"}
                    </span>
                  </div>
                  <span className="text-sm font-medium text-gray-900">{percentage.toFixed(0)}%</span>
                </div>
                <Progress value={percentage} className="h-2" />
                <div className="text-xs text-gray-500">
                  {metric.value.toLocaleString()} / {metric.target.toLocaleString()} {metric.unit}
                </div>
              </div>
            )
          })}
        </div>

        {/* Next Level Info */}
        <div className="p-3 bg-green-50 rounded-lg">
          <div className="flex items-center space-x-2 mb-2">
            <Target className="w-4 h-4 text-green-600" />
            <span className="text-sm font-medium text-green-900">Próximo Nivel</span>
          </div>
          <p className="text-xs text-green-700">
            Necesitas 12 puntos más para alcanzar el nivel &quot;Excelente&quot; (90 puntos)
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
