import { useEffect, useState } from 'react'

export interface DashboardData {
  user: {
    name: string
    email: string
    memberSince: string
  }
  stats: {
    totalOrders: number
    totalSpent: number
    wishlistItems: number
    regenScore: number
    loyaltyPoints: number
    nftsCollected: number
  }
  impactMetrics: {
    co2Saved: number
    waterSaved: number
    energyGenerated: number
    treesPlanted: number
  }
  trending: {
    co2SavedGrowth: number
    waterSavedGrowth: number
    energyGrowth: number
  }
  recentOrders: Array<{
    id: string
    date: string
    status: string
    total: number
    items: number
    vendor: string
    firstProductImage: string
  }>
}

interface UseUserDashboardResult {
  data: DashboardData | null
  loading: boolean
  error: string | null
  refetch: () => Promise<void>
}

export function useUserDashboard(): UseUserDashboardResult {
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchDashboard = async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch('/api/user/dashboard')

      if (!response.ok) {
        throw new Error(`Failed to fetch dashboard: ${response.statusText}`)
      }

      const result = await response.json()

      if (!result.success) {
        throw new Error(result.error || 'Unknown error')
      }

      setData(result.data)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'An error occurred'
      setError(message)
      console.error('Dashboard fetch error:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDashboard()
  }, [])

  return {
    data,
    loading,
    error,
    refetch: fetchDashboard
  }
}
