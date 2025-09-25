"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Package, Plus, AlertTriangle, TrendingUp, Leaf, RefreshCw } from "lucide-react"
import VendorHeader from "@/components/dashboard/vendor-header"
import ProductStock from "@/components/inventory/product-stock"
import AddProductForm from "@/components/inventory/add-product-form"

// Mock data para el inventario
const inventoryData = {
  summary: {
    totalProducts: 24,
    totalStock: 1247,
    lowStockAlerts: 3,
    avgRegenScore: 82,
  },
  products: [
    {
      id: 1,
      name: "Panel Solar Eficiente 400W",
      sku: "PS-400W-001",
      category: "Energía Solar",
      stock: 45,
      minStock: 10,
      price: 299.99,
      regenScore: 95,
      status: "active",
      image: "/placeholder.svg?height=60&width=60",
      lastUpdated: "2024-01-15",
    },
    {
      id: 2,
      name: "Batería Litio Reciclada 100Ah",
      sku: "BL-100AH-002",
      category: "Almacenamiento",
      stock: 8,
      minStock: 15,
      price: 899.99,
      regenScore: 88,
      status: "low_stock",
      image: "/placeholder.svg?height=60&width=60",
      lastUpdated: "2024-01-14",
    },
    {
      id: 3,
      name: "Inversor Inteligente 5kW",
      sku: "INV-5KW-003",
      category: "Inversores",
      stock: 0,
      minStock: 5,
      price: 1299.99,
      regenScore: 78,
      status: "out_of_stock",
      image: "/placeholder.svg?height=60&width=60",
      lastUpdated: "2024-01-13",
    },
    {
      id: 4,
      name: "Cargador Vehículo Eléctrico",
      sku: "CVE-22KW-004",
      category: "Movilidad",
      stock: 22,
      minStock: 8,
      price: 1899.99,
      regenScore: 91,
      status: "active",
      image: "/placeholder.svg?height=60&width=60",
      lastUpdated: "2024-01-15",
    },
  ],
  categories: [
    { name: "Energía Solar", count: 8, avgScore: 92 },
    { name: "Almacenamiento", count: 6, avgScore: 85 },
    { name: "Inversores", count: 4, avgScore: 79 },
    { name: "Movilidad", count: 6, avgScore: 88 },
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

export default function InventoryPage() {
  const [activeTab, setActiveTab] = useState("overview")
  const [showAddProduct, setShowAddProduct] = useState(false)



  if (showAddProduct) {
    return (
      <div className="min-h-screen bg-gray-50">
        <VendorHeader vendorData={vendorData} />
        <AddProductForm onBack={() => setShowAddProduct(false)} />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <VendorHeader vendorData={vendorData} />

      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Gestión de Inventario</h1>
            <p className="text-gray-600 mt-2">Administra tus productos y stock de manera eficiente</p>
          </div>
          <Button onClick={() => setShowAddProduct(true)} className="bg-green-600 hover:bg-green-700">
            <Plus className="w-4 h-4 mr-2" />
            Agregar Producto
          </Button>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Resumen</TabsTrigger>
            <TabsTrigger value="products">Productos</TabsTrigger>
            <TabsTrigger value="analytics">Analíticas</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Resumen Ejecutivo */}
            <div className="grid md:grid-cols-4 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Total Productos</p>
                      <p className="text-2xl font-bold text-gray-900">{inventoryData.summary.totalProducts}</p>
                    </div>
                    <Package className="w-8 h-8 text-blue-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Stock Total</p>
                      <p className="text-2xl font-bold text-gray-900">{inventoryData.summary.totalStock}</p>
                    </div>
                    <TrendingUp className="w-8 h-8 text-green-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Alertas Stock</p>
                      <p className="text-2xl font-bold text-red-600">{inventoryData.summary.lowStockAlerts}</p>
                    </div>
                    <AlertTriangle className="w-8 h-8 text-red-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">REGEN Score Promedio</p>
                      <p className="text-2xl font-bold text-green-600">{inventoryData.summary.avgRegenScore}</p>
                    </div>
                    <Leaf className="w-8 h-8 text-green-600" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Categorías */}
            <Card>
              <CardHeader>
                <CardTitle>Rendimiento por Categoría</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {inventoryData.categories.map((category, index) => (
                    <div key={index} className="p-4 bg-gray-50 rounded-lg">
                      <h3 className="font-medium text-gray-900">{category.name}</h3>
                      <p className="text-sm text-gray-600">{category.count} productos</p>
                      <div className="flex items-center mt-2">
                        <Leaf className="w-4 h-4 text-green-600 mr-1" />
                        <span className="text-sm font-medium text-green-600">Score: {category.avgScore}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Alertas de Stock */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <AlertTriangle className="w-5 h-5 text-red-600" />
                  <span>Alertas de Reabastecimiento</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {inventoryData.products
                    .filter((product) => product.stock <= product.minStock)
                    .map((product) => (
                      <div
                        key={product.id}
                        className="flex items-center justify-between p-3 bg-red-50 border border-red-200 rounded-lg"
                      >
                        <div className="flex items-center space-x-3">
                          <img
                            src={product.image || "/placeholder.svg"}
                            alt={product.name}
                            className="w-10 h-10 rounded-lg object-cover"
                          />
                          <div>
                            <p className="font-medium text-gray-900">{product.name}</p>
                            <p className="text-sm text-gray-600">
                              Stock: {product.stock} / Mínimo: {product.minStock}
                            </p>
                          </div>
                        </div>
                        <Button size="sm" className="bg-red-600 hover:bg-red-700">
                          <RefreshCw className="w-4 h-4 mr-1" />
                          Reabastecer
                        </Button>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="products">
            <ProductStock products={inventoryData.products} />
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Analíticas de Inventario</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Analíticas Avanzadas</h3>
                  <p className="text-gray-600 mb-4">Próximamente: Reportes detallados de rendimiento de inventario</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
