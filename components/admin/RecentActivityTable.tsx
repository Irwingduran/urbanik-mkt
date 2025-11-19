'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

interface RecentOrder {
  id: string
  createdAt: string
  status: string
  total: number
  user?: { name: string | null; email: string | null }
  vendorProfile?: { companyName: string | null }
}

function statusColor(status: string) {
  const s = status.toUpperCase()
  if (['PENDING','PROCESSING'].includes(s)) return 'bg-yellow-100 text-yellow-800 border-yellow-200'
  if (['SHIPPED'].includes(s)) return 'bg-blue-100 text-blue-800 border-blue-200'
  if (['DELIVERED'].includes(s)) return 'bg-green-100 text-green-800 border-green-200'
  if (['CANCELLED','FAILED'].includes(s)) return 'bg-red-100 text-red-800 border-red-200'
  return 'bg-gray-100 text-gray-800 border-gray-200'
}

export function RecentActivityTable({ orders, loading }: { orders?: RecentOrder[]; loading?: boolean }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm font-medium">Actividad Reciente (Últimos 10 pedidos)</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="py-6 text-sm text-gray-500">Cargando actividad...</div>
        ) : !orders || orders.length === 0 ? (
          <div className="py-6 text-sm text-gray-500">Sin pedidos recientes</div>
        ) : (
          <div className="space-y-3">
            {orders.map(o => (
              <div key={o.id} className="flex items-center justify-between text-sm p-3 border rounded hover:bg-gray-50">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium truncate max-w-[160px]">{o.vendorProfile?.companyName || 'Vendor'}</span>
                    <Badge className={statusColor(o.status)}>{o.status}</Badge>
                  </div>
                  <p className="text-xs text-gray-500 truncate">{o.user?.email}</p>
                </div>
                <div className="flex flex-col text-right ml-4">
                  <span className="font-semibold">${o.total.toFixed(2)}</span>
                  <span className="text-xs text-gray-400">{new Date(o.createdAt).toLocaleDateString('es-MX')}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
