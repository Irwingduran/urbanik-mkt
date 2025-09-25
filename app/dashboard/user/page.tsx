"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  ShoppingBag,
  Heart,
  Leaf,
  Award,
  TrendingUp,
  Package,
  Star,
  Gift,
  Zap,
  Droplets,
  TreePine,
  ArrowRight,
  Eye,
} from "lucide-react"
import Link from "next/link"

// Mock data
const userStats = {
  totalOrders: 12,
  totalSpent: 8450,
  regenScore: 78,
  co2Saved: 2.4,
  waterSaved: 1200,
  energySaved: 340,
  nftsCollected: 8,
  loyaltyPoints: 1250,
}

const recentOrders = [
  {
    id: "ORD-001",
    date: "2024-01-15",
    status: "delivered",
    total: 1299,
    items: 2,
    vendor: "EcoTech Solutions",
    product: "Panel Solar Bifacial 450W",
  },
  {
    id: "ORD-002",
    date: "2024-01-10",
    status: "shipped",
    total: 850,
    items: 1,
    vendor: "AquaTech Verde",
    product: "Sistema Captación Agua",
  },
  {
    id: "ORD-003",
    date: "2024-01-05",
    status: "processing",
    total: 2100,
    items: 3,
    vendor: "GreenEnergy Co",
    product: "Cargador Vehicular + Accesorios",
  },
]

const wishlistItems = [
  {
    id: 1,
    name: "Compostador Inteligente IoT",
    price: 1899,
    vendor: "SmartCompost",
    image: "/placeholder.svg?height=80&width=80",
    regenScore: 85,
    inStock: true,
  },
  {
    id: 2,
    name: "Luminarias LED Solares",
    price: 650,
    vendor: "SolarLight Pro",
    image: "/placeholder.svg?height=80&width=80",
    regenScore: 90,
    inStock: false,
  },
]

const recommendations = [
  {
    id: 1,
    name: "Filtro de Aire HEPA Industrial",
    price: 3200,
    vendor: "CleanAir Tech",
    image: "/placeholder.svg?height=100&width=100",
    regenScore: 82,
    reason: "Basado en tus compras anteriores",
  },
  {
    id: 2,
    name: "Batería Solar Doméstica 10kWh",
    price: 12500,
    vendor: "PowerStore Green",
    image: "/placeholder.svg?height=100&width=100",
    regenScore: 88,
    reason: "Complementa tu panel solar",
  },
]

const getStatusColor = (status: string) => {
  switch (status) {
    case "delivered":
      return "bg-green-100 text-green-800"
    case "shipped":
      return "bg-blue-100 text-blue-800"
    case "processing":
      return "bg-yellow-100 text-yellow-800"
    default:
      return "bg-gray-100 text-gray-800"
  }
}

const getStatusText = (status: string) => {
  switch (status) {
    case "delivered":
      return "Entregado"
    case "shipped":
      return "Enviado"
    case "processing":
      return "Procesando"
    default:
      return "Desconocido"
  }
}

export default function UserDashboard() {
  const [activeTab, setActiveTab] = useState("overview")

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Mi Dashboard</h1>
          <p className="text-gray-600">Bienvenido de vuelta, gestiona tu experiencia sostenible</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Resumen</TabsTrigger>
            <TabsTrigger value="orders">Mis Pedidos</TabsTrigger>
            <TabsTrigger value="wishlist">Lista de Deseos</TabsTrigger>
            <TabsTrigger value="impact">Mi Impacto</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Pedidos</CardTitle>
                  <ShoppingBag className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{userStats.totalOrders}</div>
                  <p className="text-xs text-muted-foreground">+2 este mes</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Gastado</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">${userStats.totalSpent.toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground">En productos sostenibles</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">REGEN Score</CardTitle>
                  <Leaf className="h-4 w-4 text-green-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">{userStats.regenScore}</div>
                  <Progress value={userStats.regenScore} className="mt-2" />
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Puntos Lealtad</CardTitle>
                  <Gift className="h-4 w-4 text-purple-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-purple-600">{userStats.loyaltyPoints}</div>
                  <p className="text-xs text-muted-foreground">Canjea por descuentos</p>
                </CardContent>
              </Card>
            </div>

            {/* Recent Orders */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Pedidos Recientes</CardTitle>
                  <CardDescription>Tus últimas compras sostenibles</CardDescription>
                </div>
                <Link href="/dashboard/user?tab=orders">
                  <Button variant="outline" size="sm">
                    Ver todos
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentOrders.slice(0, 3).map((order) => (
                    <div key={order.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                          <Package className="h-6 w-6 text-green-600" />
                        </div>
                        <div>
                          <p className="font-medium">{order.product}</p>
                          <p className="text-sm text-gray-500">
                            {order.vendor} • {order.date}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge className={getStatusColor(order.status)}>{getStatusText(order.status)}</Badge>
                        <p className="text-sm font-medium mt-1">${order.total}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recommendations */}
            <Card>
              <CardHeader>
                <CardTitle>Recomendado para Ti</CardTitle>
                <CardDescription>Productos que podrían interesarte</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {recommendations.map((product) => (
                    <div key={product.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-start space-x-4">
                        <img
                          src={product.image || "/placeholder.svg"}
                          alt={product.name}
                          className="w-16 h-16 rounded-lg object-cover"
                        />
                        <div className="flex-1">
                          <h4 className="font-medium text-sm">{product.name}</h4>
                          <p className="text-xs text-gray-500 mb-2">{product.vendor}</p>
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-green-600">${product.price}</span>
                            <Badge variant="secondary" className="text-xs">
                              REGEN {product.regenScore}
                            </Badge>
                          </div>
                          <p className="text-xs text-blue-600 mt-1">{product.reason}</p>
                        </div>
                      </div>
                      <Button size="sm" className="w-full mt-3">
                        Ver Producto
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Orders Tab */}
          <TabsContent value="orders" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Historial de Pedidos</CardTitle>
                <CardDescription>Todos tus pedidos y su estado actual</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentOrders.map((order) => (
                    <div key={order.id} className="border rounded-lg p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h3 className="font-semibold">Pedido #{order.id}</h3>
                          <p className="text-sm text-gray-500">Realizado el {order.date}</p>
                        </div>
                        <Badge className={getStatusColor(order.status)}>{getStatusText(order.status)}</Badge>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div>
                          <p className="text-sm font-medium">Producto Principal</p>
                          <p className="text-sm text-gray-600">{order.product}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium">Vendedor</p>
                          <p className="text-sm text-gray-600">{order.vendor}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium">Total</p>
                          <p className="text-sm font-bold">
                            ${order.total} ({order.items} items)
                          </p>
                        </div>
                      </div>

                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">
                          <Eye className="w-4 h-4 mr-2" />
                          Ver Detalles
                        </Button>
                        {order.status === "delivered" && (
                          <Button variant="outline" size="sm">
                            <Star className="w-4 h-4 mr-2" />
                            Calificar
                          </Button>
                        )}
                        {order.status === "shipped" && (
                          <Button variant="outline" size="sm">
                            Rastrear Envío
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Wishlist Tab */}
          <TabsContent value="wishlist" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Mi Lista de Deseos</CardTitle>
                <CardDescription>Productos que te interesan para comprar después</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {wishlistItems.map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <img
                          src={item.image || "/placeholder.svg"}
                          alt={item.name}
                          className="w-16 h-16 rounded-lg object-cover"
                        />
                        <div>
                          <h4 className="font-medium">{item.name}</h4>
                          <p className="text-sm text-gray-500">{item.vendor}</p>
                          <div className="flex items-center space-x-2 mt-1">
                            <Badge variant="secondary" className="text-xs">
                              REGEN {item.regenScore}
                            </Badge>
                            {!item.inStock && (
                              <Badge variant="destructive" className="text-xs">
                                Sin Stock
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="text-right space-y-2">
                        <p className="font-bold text-green-600">${item.price}</p>
                        <div className="flex space-x-2">
                          <Button size="sm" disabled={!item.inStock}>
                            {item.inStock ? "Añadir al Carrito" : "Sin Stock"}
                          </Button>
                          <Button variant="outline" size="sm">
                            <Heart className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Impact Tab */}
          <TabsContent value="impact" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">CO₂ Reducido</CardTitle>
                  <TreePine className="h-4 w-4 text-green-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">{userStats.co2Saved} ton</div>
                  <p className="text-xs text-muted-foreground">Equivale a plantar 12 árboles</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Agua Ahorrada</CardTitle>
                  <Droplets className="h-4 w-4 text-blue-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-600">{userStats.waterSaved}L</div>
                  <p className="text-xs text-muted-foreground">En el último año</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Energía Ahorrada</CardTitle>
                  <Zap className="h-4 w-4 text-yellow-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-yellow-600">{userStats.energySaved} kWh</div>
                  <p className="text-xs text-muted-foreground">Suficiente para 2 meses</p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Tu Evolución Sostenible</CardTitle>
                <CardDescription>Progreso de tu REGEN Score a lo largo del tiempo</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">REGEN Score Actual</span>
                    <span className="text-2xl font-bold text-green-600">{userStats.regenScore}</span>
                  </div>
                  <Progress value={userStats.regenScore} className="h-3" />
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="font-medium">Próximo Nivel</p>
                      <p className="text-gray-500">REGEN Score 85 (7 puntos más)</p>
                    </div>
                    <div>
                      <p className="font-medium">NFTs Coleccionados</p>
                      <p className="text-gray-500">{userStats.nftsCollected} de 12 disponibles</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Certificaciones Obtenidas</CardTitle>
                <CardDescription>Reconocimientos por tus compras sostenibles</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { name: "Eco Warrior", icon: "🌱", earned: true },
                    { name: "Water Saver", icon: "💧", earned: true },
                    { name: "Energy Efficient", icon: "⚡", earned: true },
                    { name: "Carbon Neutral", icon: "🌍", earned: false },
                  ].map((cert, index) => (
                    <div
                      key={index}
                      className={`p-4 rounded-lg border text-center ${cert.earned ? "bg-green-50 border-green-200" : "bg-gray-50 border-gray-200"}`}
                    >
                      <div className="text-2xl mb-2">{cert.icon}</div>
                      <p className={`text-sm font-medium ${cert.earned ? "text-green-800" : "text-gray-500"}`}>
                        {cert.name}
                      </p>
                      {cert.earned && (
                        <Badge className="mt-2 bg-green-100 text-green-800">
                          <Award className="w-3 h-3 mr-1" />
                          Obtenido
                        </Badge>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
