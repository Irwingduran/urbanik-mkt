import { useQuery } from '@tanstack/react-query'

interface AdminHealth {
  apiStatus: string
  databaseStatus: string
  storageStatus: string
  timestamp: string
  uptime: number
}

async function fetchHealth(): Promise<AdminHealth> {
  const res = await fetch('/api/admin/health', { credentials: 'include' })
  if (!res.ok) throw new Error('Health error ' + res.status)
  const json = await res.json()
  return json.data
}

export function useAdminHealth() {
  const query = useQuery<AdminHealth, Error>({
    queryKey: ['adminHealth'],
    queryFn: fetchHealth,
    refetchInterval: 1000 * 60, // 1 min
  })
  return {
    health: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  }
}
