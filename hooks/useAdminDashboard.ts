import { useQuery } from '@tanstack/react-query'

interface AdminDashboardStats {
  totalUsers: number
  totalVendors: number
  totalProducts: number
  totalOrders: number
  pendingVendors: number
  activeOrders: number
  monthlyRevenue: number
  averageRegenScore: number
  nftDistribution: Record<string, number>
}

interface RecentOrder {
  id: string
  createdAt: string
  status: string
  total: number
  user?: { name: string | null; email: string | null }
  vendorProfile?: { companyName: string | null }
}

interface TopVendor {
  id: string
  companyName: string
  totalSales: string // Decimal as string from prisma
  user?: { name: string | null; email: string | null }
  regenScore?: number
  nftLevel?: string
}

interface AdminDashboardResponse {
  success: boolean
  data: {
    stats: AdminDashboardStats
    recentActivity: RecentOrder[]
    topVendors: TopVendor[]
  }
}

async function fetchDashboard(): Promise<AdminDashboardResponse> {
  const res = await fetch('/api/admin/dashboard', { credentials: 'include' })
  if (!res.ok) {
    throw new Error(`Error ${res.status}`)
  }
  return res.json()
}

export function useAdminDashboard() {
  const query = useQuery<AdminDashboardResponse, Error>({
    queryKey: ['adminDashboard'],
    queryFn: fetchDashboard,
    refetchInterval: 1000 * 60 * 2, // refresh every 2 minutes
  })

  return {
    data: query.data?.data,
    stats: query.data?.data.stats,
    recentActivity: query.data?.data.recentActivity,
    topVendors: query.data?.data.topVendors,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
    isFetching: query.isFetching,
  }
}
