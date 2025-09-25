"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
} from "recharts"
import { TrendingUp, Download, Calendar, Target, Zap, Droplets, TreePine, Recycle } from "lucide-react"
import { useState } from "react"

interface RegenScoreChartProps {
  data: Array<{
    month: string
    score: number
    carbonReduction: number
    waterSaving: number
    renewableEnergy: number
    wasteReduction: number
  }>
}

export default function RegenScoreChart({ data }: RegenScoreChartProps) {
  const [selectedMetric, setSelectedMetric] = useState("score")
  const [chartType, setChartType] = useState("line")

  const metrics = [
    { key: "score", label: "REGEN SCORE", icon: Target, color: "#10b981", unit: "pts" },
    { key: "carbonReduction", label: "Reducción CO₂", icon: TreePine, color: "#059669", unit: "ton" },
    { key: "waterSaving", label: "Ahorro Agua", icon: Droplets, color: "#0284c7", unit: "L" },
    { key: "renewableEnergy", label: "Energía Renovable", icon: Zap, color: "#eab308", unit: "%" },
    { key: "wasteReduction", label: "Reducción Residuos", icon: Recycle, color: "#7c3aed", unit: "%" },
  ]

  const currentMetric = metrics.find((m) => m.key === selectedMetric) || metrics[0]
  const latestData = data[data.length - 1]
  const previousData = data[data.length - 2]
  const change =
    latestData && previousData
      ? (latestData[selectedMetric as keyof typeof latestData] as number) -
        (previousData[selectedMetric as keyof typeof previousData] as number)
      : 0
  const changePercentage = previousData
    ? (change / (previousData[selectedMetric as keyof typeof previousData] as number)) * 100
    : 0

  const renderChart = () => {
    const commonProps = {
      data,
      margin: { top: 5, right: 30, left: 20, bottom: 5 },
    }

    switch (chartType) {
      case "area":
        return (
          <AreaChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Area
              type="monotone"
              dataKey={selectedMetric}
              stroke={currentMetric.color}
              fill={currentMetric.color}
              fillOpacity={0.3}
            />
          </AreaChart>
        )
      case "bar":
        return (
          <BarChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Bar dataKey={selectedMetric} fill={currentMetric.color} />
          </BarChart>
        )
      default:
        return (
          <LineChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey={selectedMetric}
              stroke={currentMetric.color}
              strokeWidth={3}
              dot={{ fill: currentMetric.color, strokeWidth: 2, r: 6 }}
            />
          </LineChart>
        )
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <TrendingUp className="w-5 h-5 text-green-600" />
              <span>Analíticas de Sostenibilidad</span>
            </div>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm">
                <Calendar className="w-4 h-4 mr-2" />
                Último 6 meses
              </Button>
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Exportar
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-5 gap-4">
            {metrics.map((metric) => {
              const Icon = metric.icon
              const value = latestData ? latestData[metric.key as keyof typeof latestData] : 0
              const isSelected = selectedMetric === metric.key

              return (
                <div
                  key={metric.key}
                  onClick={() => setSelectedMetric(metric.key)}
                  className={`p-4 rounded-lg cursor-pointer transition-all ${
                    isSelected
                      ? "bg-green-50 border-2 border-green-500"
                      : "bg-gray-50 border-2 border-transparent hover:border-gray-300"
                  }`}
                >
                  <div className="flex items-center space-x-2 mb-2">
                    <Icon className={`w-4 h-4 ${isSelected ? "text-green-600" : "text-gray-500"}`} />
                    <span className={`text-sm font-medium ${isSelected ? "text-green-900" : "text-gray-700"}`}>
                      {metric.label}
                    </span>
                  </div>
                  <div className={`text-2xl font-bold ${isSelected ? "text-green-600" : "text-gray-900"}`}>
                    {typeof value === "number" ? value.toLocaleString() : value}
                  </div>
                  <div className="text-xs text-gray-500">{metric.unit}</div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <currentMetric.icon className="w-5 h-5" style={{ color: currentMetric.color }} />
              <span>{currentMetric.label} - Evolución Temporal</span>
            </div>
            <div className="flex space-x-2">
              <Button
                variant={chartType === "line" ? "default" : "outline"}
                size="sm"
                onClick={() => setChartType("line")}
              >
                Línea
              </Button>
              <Button
                variant={chartType === "area" ? "default" : "outline"}
                size="sm"
                onClick={() => setChartType("area")}
              >
                Área
              </Button>
              <Button
                variant={chartType === "bar" ? "default" : "outline"}
                size="sm"
                onClick={() => setChartType("bar")}
              >
                Barras
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <div className="flex items-center space-x-4">
              <div>
                <div className="text-3xl font-bold" style={{ color: currentMetric.color }}>
                  {latestData ? (latestData[selectedMetric as keyof typeof latestData] as number).toLocaleString() : 0}
                  <span className="text-sm text-gray-500 ml-1">{currentMetric.unit}</span>
                </div>
                <div className="text-sm text-gray-600">Valor actual</div>
              </div>
              <div className="flex items-center space-x-1">
                <TrendingUp className={`w-4 h-4 ${changePercentage >= 0 ? "text-green-500" : "text-red-500"}`} />
                <span className={`text-sm font-medium ${changePercentage >= 0 ? "text-green-600" : "text-red-600"}`}>
                  {changePercentage >= 0 ? "+" : ""}
                  {changePercentage.toFixed(1)}%
                </span>
                <span className="text-sm text-gray-500">vs mes anterior</span>
              </div>
            </div>
          </div>

          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              {renderChart()}
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Insights */}
      <Card>
        <CardHeader>
          <CardTitle>Insights y Tendencias</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="p-4 bg-green-50 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <TrendingUp className="w-4 h-4 text-green-600" />
                <span className="font-medium text-green-900">Tendencia Positiva</span>
              </div>
              <p className="text-sm text-green-700">
                Tu REGEN SCORE ha aumentado consistentemente en los últimos 6 meses, mostrando un compromiso sólido con
                la sostenibilidad.
              </p>
            </div>

            <div className="p-4 bg-blue-50 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <Target className="w-4 h-4 text-blue-600" />
                <span className="font-medium text-blue-900">Próximo Objetivo</span>
              </div>
              <p className="text-sm text-blue-700">
                Estás a solo 12 puntos de alcanzar el nivel &quot;Excelente&quot; (90 puntos). Continúa mejorando tus métricas de
                agua.
              </p>
            </div>

            <div className="p-4 bg-yellow-50 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <Zap className="w-4 h-4 text-yellow-600" />
                <span className="font-medium text-yellow-900">Área de Oportunidad</span>
              </div>
              <p className="text-sm text-yellow-700">
                Tu métrica de energía renovable puede mejorar. Considera aumentar tu porcentaje al 100% para maximizar
                tu score.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
