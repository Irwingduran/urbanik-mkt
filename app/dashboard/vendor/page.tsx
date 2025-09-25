"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Award,
  TrendingUp,
  AlertCircle,
  Plus,
  BarChart3,
  Leaf,
  Star,
  CheckCircle,
  Clock,
  RefreshCw,
  Bell,
  Calendar,
  Users,
} from "lucide-react"
import VendorHeader from "@/components/dashboard/vendor-header"
import RegenScoreCard from "@/components/dashboard/regen-score-card"
import NFTEvolutionCard from "@/components/dashboard/nft-evolution-card"
import CertificationsPanel from "@/components/dashboard/certifications-panel"
import RecommendationsPanel from "@/components/dashboard/recommendations-panel"
import MetricsOverview from "@/components/dashboard/metrics-overview"
import ActionButtons from "@/components/dashboard/action-buttons"

// Mock data - En producción vendría de la API
const vendorData = {
  name: "EcoTech Solutions",
  contactName: "Juan Pérez",
  email: "juan@ecotech.com",
  memberSince: "2024-01-15",
  regenScore: 78,
  nftLevel: "Hoja Creciente",
  totalProducts: 24,
  totalSales: 156,
  monthlyRevenue: 12500,
  certifications: [
    { name: "ISO 14001", status: "verified" as const, expiryDate: "2025-06-15" },
    { name: "Energy Star", status: "verified" as const, expiryDate: "2024-12-20" },
    { name: "LEED Certified", status: "pending" as const, submittedDate: "2024-01-10" },
    { name: "Carbon Neutral", status: "expired" as const, expiryDate: "2024-01-01" },
  ],
  metrics: {
    carbonReduction: { value: 245, target: 300, unit: "toneladas CO₂/año" },
    waterSaving: { value: 125000, target: 150000, unit: "litros/año" },
    renewableEnergy: { value: 85, target: 100, unit: "%" },
    wasteReduction: { value: 92, target: 95, unit: "%" },
  },
  recentActivity: [
    { type: "certification", message: "Certificación LEED enviada para revisión", date: "2024-01-10" },
    { type: "metric", message: "Métricas de agua actualizadas", date: "2024-01-08" },
    { type: "nft", message: "NFT evolucionó a Hoja Creciente", date: "2024-01-05" },
  ],
}

export default function VendorDashboard() {
  const [activeTab, setActiveTab] = useState("overview")

  return (
    <div className="min-h-screen bg-gray-50">
      <VendorHeader vendorData={vendorData} />

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-12 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-8">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="overview">Resumen</TabsTrigger>
                <TabsTrigger value="metrics">Métricas</TabsTrigger>
                <TabsTrigger value="certifications">Certificaciones</TabsTrigger>
                <TabsTrigger value="recommendations">Mejoras</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6">
                {/* REGEN Score & NFT Cards */}
                <div className="grid md:grid-cols-2 gap-6">
                  <RegenScoreCard score={vendorData.regenScore} metrics={vendorData.metrics} />
                  <NFTEvolutionCard score={vendorData.regenScore} />
                </div>

                {/* Quick Stats */}
                <div className="grid md:grid-cols-3 gap-6">
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-600">Productos Activos</p>
                          <p className="text-2xl font-bold text-gray-900">{vendorData.totalProducts}</p>
                        </div>
                        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                          <Leaf className="w-6 h-6 text-green-600" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-600">Ventas Totales</p>
                          <p className="text-2xl font-bold text-gray-900">{vendorData.totalSales}</p>
                        </div>
                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                          <BarChart3 className="w-6 h-6 text-blue-600" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-600">Ingresos Mensuales</p>
                          <p className="text-2xl font-bold text-gray-900">
                            ${vendorData.monthlyRevenue.toLocaleString()}
                          </p>
                        </div>
                        <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                          <TrendingUp className="w-6 h-6 text-yellow-600" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Recent Activity */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Clock className="w-5 h-5" />
                      <span>Actividad Reciente</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {vendorData.recentActivity.map((activity, index) => (
                        <div key={index} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center ${
                              activity.type === "certification"
                                ? "bg-blue-100"
                                : activity.type === "metric"
                                  ? "bg-green-100"
                                  : "bg-yellow-100"
                            }`}
                          >
                            {activity.type === "certification" && <Award className="w-4 h-4 text-blue-600" />}
                            {activity.type === "metric" && <BarChart3 className="w-4 h-4 text-green-600" />}
                            {activity.type === "nft" && <Star className="w-4 h-4 text-yellow-600" />}
                          </div>
                          <div className="flex-1">
                            <p className="text-sm text-gray-900">{activity.message}</p>
                            <p className="text-xs text-gray-500">{activity.date}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="metrics">
                <MetricsOverview metrics={vendorData.metrics} />
              </TabsContent>

              <TabsContent value="certifications">
                <CertificationsPanel certifications={vendorData.certifications} />
              </TabsContent>

              <TabsContent value="recommendations">
                <RecommendationsPanel
                  score={vendorData.regenScore}
                />
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-4 space-y-6">
            <ActionButtons />

            {/* Notifications */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Bell className="w-5 h-5" />
                  <span>Notificaciones</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="flex items-start space-x-2">
                    <AlertCircle className="w-4 h-4 text-yellow-600 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-yellow-800">Certificación por vencer</p>
                      <p className="text-xs text-yellow-700">Energy Star vence en 30 días</p>
                    </div>
                  </div>
                </div>

                <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-start space-x-2">
                    <CheckCircle className="w-4 h-4 text-blue-600 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-blue-800">Métricas actualizadas</p>
                      <p className="text-xs text-blue-700">Tus datos de sostenibilidad han sido procesados</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Acciones Rápidas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full justify-start bg-transparent" variant="outline">
                  <Plus className="w-4 h-4 mr-2" />
                  Agregar Producto
                </Button>
                <Button className="w-full justify-start bg-transparent" variant="outline">
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Actualizar Métricas
                </Button>
                <Button className="w-full justify-start bg-transparent" variant="outline">
                  <Calendar className="w-4 h-4 mr-2" />
                  Programar Auditoría
                </Button>
                <Button className="w-full justify-start bg-transparent" variant="outline">
                  <Users className="w-4 h-4 mr-2" />
                  Ver Comunidad
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
