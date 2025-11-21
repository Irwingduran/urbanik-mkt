"use client"

import { useState, useEffect, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Package, Plus, AlertTriangle, TrendingUp, Leaf, RefreshCw, Loader2 } from "lucide-react"
import { VendorDashboardLayout, VendorDashboardHeader } from "@/components/shared/layout/VendorDashboardLayout"
import ProductStock from "@/components/inventory/product-stock"
import AddProductForm from "@/components/inventory/add-product-form"
import { apiFetch } from "@/lib/api-client"

interface Product {
  id: string
  name: string
  sku: string
  category: string
  stock: number
  minStock: number
  price: number
  regenScore: number
  status: string
  images: string[]
  updatedAt: string
  _count?: {
    orderItems: number
  }
}

interface InventorySummary {
  totalProducts: number
  totalStock: number
  lowStockAlerts: number
  avgRegenScore: number
}

export default function InventoryPage() {
  const [activeTab, setActiveTab] = useState("overview")
  const [showAddProduct, setShowAddProduct] = useState(false)
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [summary, setSummary] = useState<InventorySummary>({
    totalProducts: 0,
    totalStock: 0,
    lowStockAlerts: 0,
    avgRegenScore: 0,
  })

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true)
      const response = await apiFetch("/api/vendor/products?limit=100")
      const data = await response.json()
      
      if (data.success) {
        const fetchedProducts = data.data
        setProducts(fetchedProducts)
        
        // Calculate summary
        const totalStock = fetchedProducts.reduce((acc: number, p: Product) => acc + p.stock, 0)
        const lowStockAlerts = fetchedProducts.filter((p: Product) => p.stock <= p.minStock).length
        const avgRegenScore = fetchedProducts.length > 0 
          ? Math.round(fetchedProducts.reduce((acc: number, p: Product) => acc + p.regenScore, 0) / fetchedProducts.length)
          : 0

        setSummary({
          totalProducts: fetchedProducts.length,
          totalStock,
          lowStockAlerts,
          avgRegenScore
        })
      }
    } catch (error) {
      console.error("Error fetching inventory:", error)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (!showAddProduct) {
      fetchProducts()
    }
  }, [showAddProduct, fetchProducts])

  if (showAddProduct) {
    return (
      <VendorDashboardLayout>
        <VendorDashboardHeader
          title="Agregar Producto"
          subtitle="Completa la información del nuevo producto"
          breadcrumbs={[
            { label: 'Dashboard Vendedor', href: '/dashboard/vendor' },
            { label: 'Inventario', href: '/dashboard/vendor/inventory' },
            { label: 'Agregar Producto' }
          ]}
        />
        <div className="p-6">
          <AddProductForm onBack={() => setShowAddProduct(false)} />
        </div>
      </VendorDashboardLayout>
    )
  }

  if (loading && products.length === 0) {
    return (
      <VendorDashboardLayout>
        <div className="flex items-center justify-center h-96">
          <Loader2 className="w-8 h-8 animate-spin text-green-600" />
        </div>
      </VendorDashboardLayout>
    )
  }

  return (
    <VendorDashboardLayout>
      <VendorDashboardHeader
        title="Gestión de Inventario"
        subtitle="Administra tus productos y stock de manera eficiente"
        breadcrumbs={[
          { label: 'Dashboard Vendedor', href: '/dashboard/vendor' },
          { label: 'Inventario' }
        ]}
        action={
          <Button onClick={() => setShowAddProduct(true)} className="bg-green-600 hover:bg-green-700">
            <Plus className="w-4 h-4 mr-2" />
            Agregar Producto
          </Button>
        }
      />

      <div className="p-6 space-y-6">

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
                      <p className="text-2xl font-bold text-gray-900">{summary.totalProducts}</p>
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
                      <p className="text-2xl font-bold text-gray-900">{summary.totalStock}</p>
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
                      <p className="text-2xl font-bold text-red-600">{summary.lowStockAlerts}</p>
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
                      <p className="text-2xl font-bold text-green-600">{summary.avgRegenScore}</p>
                    </div>
                    <Leaf className="w-8 h-8 text-green-600" />
                  </div>
                </CardContent>
              </Card>
            </div>

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
                  {products
                    .filter((product) => product.stock <= product.minStock)
                    .slice(0, 5)
                    .map((product) => (
                      <div
                        key={product.id}
                        className="flex items-center justify-between p-3 bg-red-50 border border-red-200 rounded-lg"
                      >
                        <div className="flex items-center space-x-3">
                          <img
                            src={product.images?.[0] || "/placeholder.svg"}
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
                    {products.filter((p) => p.stock <= p.minStock).length === 0 && (
                      <p className="text-center text-gray-500 py-4">No hay alertas de stock bajo.</p>
                    )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="products">
            <ProductStock products={products.map(p => ({
              ...p,
              image: p.images?.[0] || "/placeholder.svg",
              lastUpdated: new Date(p.updatedAt).toLocaleDateString()
            }))} />
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
    </VendorDashboardLayout>
  )
}
