'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { AlertCircle, CheckCircle2, Clock } from 'lucide-react'

export interface SystemStatus {
  database: 'operational' | 'degraded' | 'down'
  apiServer: 'operational' | 'degraded' | 'down'
  authentication: 'operational' | 'degraded' | 'down'
  storage: 'operational' | 'degraded' | 'down'
  responseTime: number
  uptime: number
}

export function SystemStatus() {
  const [status, setStatus] = useState<SystemStatus>({
    database: 'operational',
    apiServer: 'operational',
    authentication: 'operational',
    storage: 'operational',
    responseTime: 45,
    uptime: 99.9,
  })
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date())

  useEffect(() => {
    // Check status immediately and then periodically
    checkStatus()
    const interval = setInterval(checkStatus, 30000) // Check every 30 seconds

    return () => clearInterval(interval)
  }, [])

  const checkStatus = async () => {
    try {
      const start = Date.now()
      const response = await fetch('/api/health')
      const responseTime = Date.now() - start

      if (response.ok) {
        const data = await response.json()
        setStatus({
          database: data.services?.database || 'operational',
          apiServer: data.services?.apiServer || 'operational',
          authentication: data.services?.authentication || 'operational',
          storage: data.services?.storage || 'operational',
          responseTime: data.metrics?.responseTime || responseTime,
          uptime: data.metrics?.uptime || 99.9,
        })
      } else {
        setStatus({
          database: 'degraded',
          apiServer: 'degraded',
          authentication: 'operational',
          storage: 'operational',
          responseTime,
          uptime: 99.9,
        })
      }
      setLastUpdated(new Date())
    } catch (error) {
      console.error('Error checking system status:', error)
      setStatus({
        database: 'down',
        apiServer: 'down',
        authentication: 'operational',
        storage: 'operational',
        responseTime: 0,
        uptime: 99.9,
      })
    }
  }

  const getStatusBadge = (status: string) => {
    const config = {
      operational: { color: 'bg-green-100 text-green-800', icon: CheckCircle2, label: 'Operacional' },
      degraded: { color: 'bg-yellow-100 text-yellow-800', icon: AlertCircle, label: 'Degradado' },
      down: { color: 'bg-red-100 text-red-800', icon: AlertCircle, label: 'Caído' },
    }
    const cfg = config[status as keyof typeof config] || config.down
    const Icon = cfg.icon

    return (
      <div className="flex items-center gap-1">
        <Icon className="w-3 h-3" />
        {cfg.label}
      </div>
    )
  }

  const services = [
    { name: 'Base de Datos', key: 'database' as const },
    { name: 'API Server', key: 'apiServer' as const },
    { name: 'Autenticación', key: 'authentication' as const },
    { name: 'Almacenamiento', key: 'storage' as const },
  ]

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Estado del Sistema</CardTitle>
            <CardDescription>Monitor en tiempo real de servicios</CardDescription>
          </div>
          <div className="text-right">
            <p className="text-sm font-medium text-gray-900">Uptime</p>
            <p className="text-lg font-bold text-green-600">{status.uptime}%</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {services.map((service) => (
            <div key={service.key} className="flex items-center justify-between p-2 rounded-lg bg-gray-50">
              <span className="text-sm font-medium text-gray-700">{service.name}</span>
              <Badge className={
                status[service.key] === 'operational'
                  ? 'bg-green-100 text-green-800'
                  : status[service.key] === 'degraded'
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-red-100 text-red-800'
              }>
                {getStatusBadge(status[service.key])}
              </Badge>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-3 pt-2 border-t border-gray-200">
          <div>
            <p className="text-xs text-gray-600">Tiempo de Respuesta</p>
            <p className="text-lg font-bold text-blue-600">{status.responseTime}ms</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-600">Última actualización</p>
            <p className="text-sm text-gray-700">
              hace {Math.floor((Date.now() - lastUpdated.getTime()) / 1000)}s
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
