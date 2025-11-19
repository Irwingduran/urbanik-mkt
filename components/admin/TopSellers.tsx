'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { TrendingUp, Store } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface Seller {
  id: string
  name: string
  email: string
  totalSales: number
  revenue: number
  productCount: number
  rating: number
  isActive: boolean
}

export function TopSellers() {
  const router = useRouter()
  const [sellers, setSellers] = useState<Seller[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchTopSellers()
  }, [])

  const fetchTopSellers = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/admin/dashboard/top-sellers')

      if (!response.ok) {
        throw new Error('Error al cargar vendedores')
      }

      const data = await response.json()
      setSellers(data.data || [])
    } catch (error) {
      console.error('Error fetching top sellers:', error)
      // Fallback to empty array
      setSellers([])
    } finally {
      setLoading(false)
    }
  }

  const getRankBadge = (index: number) => {
    const badges = [
      { color: 'bg-yellow-100 text-yellow-800', label: '🥇 1°' },
      { color: 'bg-gray-200 text-gray-800', label: '🥈 2°' },
      { color: 'bg-orange-100 text-orange-800', label: '🥉 3°' },
    ]
    if (index < 3) return badges[index]
    return { color: 'bg-blue-50 text-blue-700', label: `${index + 1}°` }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5" />
          Mejores Vendedores
        </CardTitle>
        <CardDescription>Top 5 vendedores por ingresos</CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="text-center py-8 text-gray-500">Cargando vendedores...</div>
        ) : (
          <div className="space-y-2">
            {sellers.map((seller, index) => (
              <div
                key={seller.id}
                className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 hover:bg-green-50 transition-colors"
              >
                <Badge className={getRankBadge(index).color}>{getRankBadge(index).label}</Badge>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 truncate">{seller.name}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-gray-600">${seller.revenue.toLocaleString()}</span>
                    <span className="text-xs text-gray-400">•</span>
                    <span className="text-xs text-gray-600">{seller.totalSales} ventas</span>
                    <span className="text-xs text-gray-400">•</span>
                    <span className="text-xs text-yellow-600">⭐ {seller.rating}</span>
                  </div>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => router.push(`/dashboard/admin/vendors/${seller.id}`)}
                >
                  <Store className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
        <Button variant="outline" className="w-full mt-4">
          Ver todos los vendedores
        </Button>
      </CardContent>
    </Card>
  )
}
