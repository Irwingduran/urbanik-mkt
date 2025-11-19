'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  UserPlus,
  Package,
  ShoppingCart,
  Star,
  AlertCircle,
  CheckCircle2,
  Clock,
  Eye,
} from 'lucide-react'

interface Activity {
  id: string
  type: 'user_created' | 'product_listed' | 'order_placed' | 'review_added' | 'alert' | 'vendor_approved'
  title: string
  description: string
  timestamp: Date
  icon: string
  severity?: 'info' | 'warning' | 'error'
}

export function ActivityFeed() {
  const [activities, setActivities] = useState<Activity[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchActivities()
  }, [])

  const fetchActivities = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/admin/dashboard/activity')

      if (!response.ok) {
        throw new Error('Error al cargar actividad')
      }

      const data = await response.json()
      const typedActivities = data.data.map((activity: any) => ({
        ...activity,
        timestamp: new Date(activity.timestamp),
      }))
      setActivities(typedActivities)
    } catch (error) {
      console.error('Error fetching activities:', error)
      // Fallback to empty array
      setActivities([])
    } finally {
      setLoading(false)
    }
  }

  const getActivityIcon = (type: string) => {
    const iconConfig = {
      user_created: { icon: UserPlus, color: 'text-blue-600' },
      product_listed: { icon: Package, color: 'text-purple-600' },
      order_placed: { icon: ShoppingCart, color: 'text-green-600' },
      review_added: { icon: Star, color: 'text-yellow-600' },
      alert: { icon: AlertCircle, color: 'text-red-600' },
      vendor_approved: { icon: CheckCircle2, color: 'text-green-600' },
    }
    return iconConfig[type as keyof typeof iconConfig] || { icon: Clock, color: 'text-gray-600' }
  }

  const formatTimeAgo = (date: Date) => {
    const seconds = Math.floor((Date.now() - date.getTime()) / 1000)
    if (seconds < 60) return 'hace unos segundos'
    if (seconds < 3600) return `hace ${Math.floor(seconds / 60)} minutos`
    if (seconds < 86400) return `hace ${Math.floor(seconds / 3600)} horas`
    return date.toLocaleDateString('es-MX')
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Eye className="w-5 h-5" />
          Actividad Reciente
        </CardTitle>
        <CardDescription>Eventos importantes de la plataforma</CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="text-center py-8 text-gray-500">Cargando actividad...</div>
        ) : activities.length === 0 ? (
          <div className="text-center py-8 text-gray-500">No hay actividad reciente</div>
        ) : (
          <div className="space-y-3">
            {activities.map((activity) => {
              const { icon: IconComponent, color } = getActivityIcon(activity.type)
              return (
                <div
                  key={activity.id}
                  className="flex items-start gap-3 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
                >
                  <div className={`${color} mt-1`}>
                    <IconComponent className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <p className="font-medium text-gray-900 truncate">{activity.title}</p>
                      {activity.severity && (
                        <Badge
                          className={
                            activity.severity === 'warning'
                              ? 'bg-yellow-100 text-yellow-800'
                              : activity.severity === 'error'
                                ? 'bg-red-100 text-red-800'
                                : 'bg-blue-100 text-blue-800'
                          }
                        >
                          {activity.severity}
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 truncate">{activity.description}</p>
                    <p className="text-xs text-gray-500 mt-1">{formatTimeAgo(activity.timestamp)}</p>
                  </div>
                </div>
              )
            })}
          </div>
        )}
        <Button variant="outline" className="w-full mt-4">
          Ver todo
        </Button>
      </CardContent>
    </Card>
  )
}
