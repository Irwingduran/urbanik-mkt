"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Legend,
} from "recharts"
import { TrendingUp, TrendingDown, DollarSign, Package, Users, Leaf, Download } from "lucide-react"
import VendorHeader from "@/components/dashboard/vendor-header"

// Mock data para analíticas
const analyticsData = {
  summary: {
    totalRevenue: 45250,
    revenueGrowth: 12.5,
    totalOrders: 156,
    ordersGrowth: 8.3,
    avgOrderValue: 425,
    avgOrderGrowth: -2.1,
    regenScore: 78,
    scoreGrowth: 5.2,
  },
  revenueData: [
    { month: "Ene", revenue: 3200, orders: 12, regenScore: 72 },
    { month: "Feb", revenue: 3800, orders: 15, regenScore: 74 },
    { month: "Mar", revenue: 4200, orders: 18, regenScore: 75 },
    { month: "Apr", revenue: 3900, orders: 16, regenScore: 76 },
    { month: "May", revenue: 4800, orders: 22, regenScore: 77 },
    { month: "Jun", revenue: 5200, orders: 24, regenScore: 78 },
  ],
  productPerformance: [
    { name: "Paneles Solares", sales: 45, revenue: 13500, regenScore: 95 },
    { name: "Baterías", sales: 32, revenue: 28800, regenScore: 88 },
    { name: "Inversores", sales: 28, revenue: 36400, regenScore: 78 },
    { name: "Cargadores VE", sales: 18, revenue: 34200, regenScore: 91 },
    { name: "Otros", sales: 33, revenue: 9900, regenScore: 82 },
  ],
  customerSegments: [
    { name: "Residencial", value: 45, color: "#10B981" },
    { name: "Comercial", value: 35, color: "#3B82F6" },
    { name: "Industrial", value: 20, color: "#8B5CF6" },
  ],
  sustainabilityMetrics: [
    { metric: "CO₂ Reducido", value: 245, unit: "toneladas", growth: 15.2 },
    { metric: "Agua Ahorrada", value: 125000, unit: "litros", growth: 8.7 },
    { metric: "Energía Renovable", value: 85, unit: "%", growth: 3.1 },
    { metric: "Residuos Evitados", value: 92, unit: "%", growth: 2.8 },
  ],
}

const vendorData = {
  name: "EcoTech Solutions",
  contactName: "Juan Pérez",
  email: "juan@ecotech.com",
  memberSince: "2024-01-15",
  regenScore: 78,
  nftLevel: "Hoja Creciente",
}

export default function AnalyticsPage() {
  const [activeTab, setActiveTab] = useState("overview")
  const [timeRange, setTimeRange] = useState("6m")

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("es-ES", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
    }).format(value)
  }

  const formatNumber = (value: number) => {
    return new Intl.NumberFormat("es-ES").format(value)
  }

  const getGrowthIcon = (growth: number) => {
    return growth >= 0 ? (
      <TrendingUp className="w-4 h-4 text-green-600" />
    ) : (
      <TrendingDown className="w-4 h-4 text-red-600" />
    )
  }

  const getGrowthColor = (growth: number) => {
    return growth >= 0 ? "text-green-600" : "text-red-600"
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <VendorHeader vendorData={vendorData} />

      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Analíticas del Vendedor</h1>
            <p className="text-gray-600 mt-2">Monitorea el rendimiento de tu negocio y sostenibilidad</p>
          </div>
          <div className="flex items-center space-x-4">
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1m">1 Mes</SelectItem>
                <SelectItem value="3m">3 Meses</SelectItem>
                <SelectItem value="6m">6 Meses</SelectItem>
                <SelectItem value="1y">1 Año</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Exportar
            </Button>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Resumen</TabsTrigger>
            <TabsTrigger value="sales">Ventas</TabsTrigger>
            <TabsTrigger value="products">Productos</TabsTrigger>
            <TabsTrigger value="sustainability">Sostenibilidad</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* KPIs Principales */}
            <div className="grid md:grid-cols-4 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Ingresos Totales</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {formatCurrency(analyticsData.summary.totalRevenue)}
                      </p>
                      <div
                        className={`flex items-center space-x-1 mt-1 ${getGrowthColor(analyticsData.summary.revenueGrowth)}`}
                      >
                        {getGrowthIcon(analyticsData.summary.revenueGrowth)}
                        <span className="text-sm font-medium">
                          {analyticsData.summary.revenueGrowth > 0 ? "+" : ""}
                          {analyticsData.summary.revenueGrowth}%
                        </span>
                      </div>
                    </div>
                    <DollarSign className="w-8 h-8 text-green-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Total Pedidos</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {formatNumber(analyticsData.summary.totalOrders)}
                      </p>
                      <div
                        className={`flex items-center space-x-1 mt-1 ${getGrowthColor(analyticsData.summary.ordersGrowth)}`}
                      >
                        {getGrowthIcon(analyticsData.summary.ordersGrowth)}
                        <span className="text-sm font-medium">
                          {analyticsData.summary.ordersGrowth > 0 ? "+" : ""}
                          {analyticsData.summary.ordersGrowth}%
                        </span>
                      </div>
                    </div>
                    <Package className="w-8 h-8 text-blue-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Valor Promedio</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {formatCurrency(analyticsData.summary.avgOrderValue)}
                      </p>
                      <div
                        className={`flex items-center space-x-1 mt-1 ${getGrowthColor(analyticsData.summary.avgOrderGrowth)}`}
                      >
                        {getGrowthIcon(analyticsData.summary.avgOrderGrowth)}
                        <span className="text-sm font-medium">
                          {analyticsData.summary.avgOrderGrowth > 0 ? "+" : ""}
                          {analyticsData.summary.avgOrderGrowth}%
                        </span>
                      </div>
                    </div>
                    <Users className="w-8 h-8 text-purple-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">REGEN Score</p>
                      <p className="text-2xl font-bold text-gray-900">{analyticsData.summary.regenScore}</p>
                      <div
                        className={`flex items-center space-x-1 mt-1 ${getGrowthColor(analyticsData.summary.scoreGrowth)}`}
                      >
                        {getGrowthIcon(analyticsData.summary.scoreGrowth)}
                        <span className="text-sm font-medium">
                          {analyticsData.summary.scoreGrowth > 0 ? "+" : ""}
                          {analyticsData.summary.scoreGrowth}%
                        </span>
                      </div>
                    </div>
                    <Leaf className="w-8 h-8 text-green-600" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Gráfico de Tendencias */}
            <Card>
              <CardHeader>
                <CardTitle>Tendencias de Rendimiento</CardTitle>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={{
                    revenue: {
                      label: "Ingresos",
                      color: "hsl(var(--chart-1))",
                    },
                    orders: {
                      label: "Pedidos",
                      color: "hsl(var(--chart-2))",
                    },
                    regenScore: {
                      label: "REGEN Score",
                      color: "hsl(var(--chart-3))",
                    },
                  }}
                  className="h-[400px]"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={analyticsData.revenueData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis yAxisId="left" />
                      <YAxis yAxisId="right" orientation="right" />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Legend />
                      <Line
                        yAxisId="left"
                        type="monotone"
                        dataKey="revenue"
                        stroke="var(--color-revenue)"
                        strokeWidth={2}
                        name="Ingresos ($)"
                      />
                      <Line
                        yAxisId="left"
                        type="monotone"
                        dataKey="orders"
                        stroke="var(--color-orders)"
                        strokeWidth={2}
                        name="Pedidos"
                      />
                      <Line
                        yAxisId="right"
                        type="monotone"
                        dataKey="regenScore"
                        stroke="var(--color-regenScore)"
                        strokeWidth={2}
                        name="REGEN Score"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="sales" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Ingresos por Mes */}
              <Card>
                <CardHeader>
                  <CardTitle>Ingresos Mensuales</CardTitle>
                </CardHeader>
                <CardContent>
                  <ChartContainer
                    config={{
                      revenue: {
                        label: "Ingresos",
                        color: "hsl(var(--chart-1))",
                      },
                    }}
                    className="h-[300px]"
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={analyticsData.revenueData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Area
                          type="monotone"
                          dataKey="revenue"
                          stroke="var(--color-revenue)"
                          fill="var(--color-revenue)"
                          fillOpacity={0.3}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </CardContent>
              </Card>

              {/* Segmentos de Clientes */}
              <Card>
                <CardHeader>
                  <CardTitle>Segmentos de Clientes</CardTitle>
                </CardHeader>
                <CardContent>
                  <ChartContainer
                    config={{
                      residential: {
                        label: "Residencial",
                        color: "#10B981",
                      },
                      commercial: {
                        label: "Comercial",
                        color: "#3B82F6",
                      },
                      industrial: {
                        label: "Industrial",
                        color: "#8B5CF6",
                      },
                    }}
                    className="h-[300px]"
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={analyticsData.customerSegments}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {analyticsData.customerSegments.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <ChartTooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="products" className="space-y-6">
            {/* Rendimiento de Productos */}
            <Card>
              <CardHeader>
                <CardTitle>Rendimiento por Producto</CardTitle>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={{
                    sales: {
                      label: "Ventas",
                      color: "hsl(var(--chart-1))",
                    },
                    revenue: {
                      label: "Ingresos",
                      color: "hsl(var(--chart-2))",
                    },
                  }}
                  className="h-[400px]"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={analyticsData.productPerformance}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis yAxisId="left" />
                      <YAxis yAxisId="right" orientation="right" />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Legend />
                      <Bar yAxisId="left" dataKey="sales" fill="var(--color-sales)" name="Ventas (unidades)" />
                      <Bar yAxisId="right" dataKey="revenue" fill="var(--color-revenue)" name="Ingresos ($)" />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>

            {/* Tabla de Productos */}
            <Card>
              <CardHeader>
                <CardTitle>Detalles por Producto</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-4">Producto</th>
                        <th className="text-right py-3 px-4">Ventas</th>
                        <th className="text-right py-3 px-4">Ingresos</th>
                        <th className="text-right py-3 px-4">REGEN Score</th>
                      </tr>
                    </thead>
                    <tbody>
                      {analyticsData.productPerformance.map((product, index) => (
                        <tr key={index} className="border-b hover:bg-gray-50">
                          <td className="py-3 px-4 font-medium">{product.name}</td>
                          <td className="py-3 px-4 text-right">{product.sales}</td>
                          <td className="py-3 px-4 text-right">{formatCurrency(product.revenue)}</td>
                          <td className="py-3 px-4 text-right">
                            <div className="flex items-center justify-end space-x-1">
                              <Leaf className="w-4 h-4 text-green-600" />
                              <span className="font-medium text-green-600">{product.regenScore}</span>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="sustainability" className="space-y-6">
            {/* Métricas de Sostenibilidad */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {analyticsData.sustainabilityMetrics.map((metric, index) => (
                <Card key={index}>
                  <CardContent className="p-6">
                    <div className="text-center">
                      <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                        <Leaf className="w-6 h-6 text-green-600" />
                      </div>
                      <h3 className="font-medium text-gray-900 mb-1">{metric.metric}</h3>
                      <p className="text-2xl font-bold text-green-600 mb-1">
                        {formatNumber(metric.value)} {metric.unit}
                      </p>
                      <div className={`flex items-center justify-center space-x-1 ${getGrowthColor(metric.growth)}`}>
                        {getGrowthIcon(metric.growth)}
                        <span className="text-sm font-medium">
                          {metric.growth > 0 ? "+" : ""}
                          {metric.growth}%
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Evolución del REGEN Score */}
            <Card>
              <CardHeader>
                <CardTitle>Evolución del REGEN Score</CardTitle>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={{
                    regenScore: {
                      label: "REGEN Score",
                      color: "hsl(var(--chart-3))",
                    },
                  }}
                  className="h-[300px]"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={analyticsData.revenueData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis domain={[70, 80]} />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Area
                        type="monotone"
                        dataKey="regenScore"
                        stroke="var(--color-regenScore)"
                        fill="var(--color-regenScore)"
                        fillOpacity={0.3}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>

            {/* Impacto Ambiental */}
            <Card>
              <CardHeader>
                <CardTitle>Resumen de Impacto Ambiental</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-4">Beneficios Ambientales</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Reducción de CO₂</span>
                        <span className="font-medium text-green-600">245 toneladas</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Agua ahorrada</span>
                        <span className="font-medium text-blue-600">125,000 litros</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Energía renovable</span>
                        <span className="font-medium text-yellow-600">85%</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Residuos evitados</span>
                        <span className="font-medium text-purple-600">92%</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 mb-4">Certificaciones Activas</h4>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-sm text-gray-600">ISO 14001</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-sm text-gray-600">Energy Star</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                        <span className="text-sm text-gray-600">LEED Certified (Pendiente)</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                        <span className="text-sm text-gray-600">Carbon Neutral (Expirado)</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
