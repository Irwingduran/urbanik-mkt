'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Flame, Eye } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface TrendingProduct {
  id: string
  name: string
  vendor: string
  views: number
  sales: number
  price: number
  trend: 'up' | 'down' | 'stable'
  trendPercent: number
  rating: number
  inStock: boolean
}

export function TrendingProducts() {
  const router = useRouter()
  const [products, setProducts] = useState<TrendingProduct[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchTrendingProducts()
  }, [])

  const fetchTrendingProducts = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/admin/dashboard/trending-products')

      if (!response.ok) {
        throw new Error('Error al cargar productos')
      }

      const data = await response.json()
      setProducts(data.data || [])
    } catch (error) {
      console.error('Error fetching trending products:', error)
      // Fallback to empty array
      setProducts([])
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Flame className="w-5 h-5 text-orange-500" />
          Productos Tendencia
        </CardTitle>
        <CardDescription>Productos más vistos esta semana</CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="text-center py-8 text-gray-500">Cargando productos...</div>
        ) : (
          <div className="space-y-2">
            {products.map((product, index) => (
              <div
                key={product.id}
                className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 hover:bg-orange-50 transition-colors"
              >
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center text-white font-bold text-sm">
                  {index + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 truncate">{product.name}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-gray-600">${product.price}</span>
                    <span className="text-xs text-gray-400">•</span>
                    <Eye className="w-3 h-3 text-gray-400" />
                    <span className="text-xs text-gray-600">{product.views} vistas</span>
                    <span className="text-xs text-gray-400">•</span>
                    <span className="text-xs text-green-600">{product.sales} ventas</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {product.trend === 'up' && (
                    <Badge className="bg-green-100 text-green-800">
                      ↑ {product.trendPercent}%
                    </Badge>
                  )}
                  {product.trend === 'down' && (
                    <Badge className="bg-red-100 text-red-800">
                      ↓ {Math.abs(product.trendPercent)}%
                    </Badge>
                  )}
                  {product.trend === 'stable' && (
                    <Badge className="bg-gray-100 text-gray-800">
                      → Estable
                    </Badge>
                  )}
                  {!product.inStock && (
                    <Badge className="bg-yellow-100 text-yellow-800">Sin stock</Badge>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
        <Button variant="outline" className="w-full mt-4">
          Ver todos los productos
        </Button>
      </CardContent>
    </Card>
  )
}
