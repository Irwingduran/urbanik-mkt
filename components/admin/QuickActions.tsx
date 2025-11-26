'use client'

import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  UserPlus,
  Store,
  Package,
  Mail,
  FileText,
  Settings,
  BarChart3,
} from 'lucide-react'

interface QuickActionsProps {
  onAction?: (action: string) => void
}

export function QuickActions({ onAction }: QuickActionsProps) {
  const router = useRouter()

  const actions = [
    {
      icon: UserPlus,
      label: 'Crear Usuario',
      description: 'Agregar nuevo usuario',
      onClick: () => {
        onAction?.('create-user')
        router.push('/dashboard/admin/users')
      },
    },
    {
      icon: Store,
      label: 'Revisar Vendedores',
      description: 'Aprobar solicitudes',
      onClick: () => {
        onAction?.('review-vendors')
        router.push('/dashboard/admin/vendors')
      },
    },
    {
      icon: Package,
      label: 'Gestionar Productos',
      description: 'Moderar productos',
      onClick: () => {
        onAction?.('manage-products')
        router.push('/dashboard/admin/products')
      },
    },
    {
      icon: FileText,
      label: 'Ver Reportes',
      description: 'Análisis y métricas',
      onClick: () => {
        onAction?.('view-reports')
        router.push('/dashboard/admin/analytics')
      },
    },
    {
      icon: Mail,
      label: 'Enviar Mensaje',
      description: 'A usuarios/vendedores',
      onClick: () => {
        onAction?.('send-message')
      },
    },
    {
      icon: Settings,
      label: 'Configuración',
      description: 'Ajustes de plataforma',
      onClick: () => {
        onAction?.('settings')
        router.push('/dashboard/admin/settings')
      },
    },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="w-5 h-5" />
          Acciones Rápidas
        </CardTitle>
        <CardDescription>Accesos directos a tareas comunes</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {actions.map((action, index) => {
            const Icon = action.icon
            return (
              <Button
                key={index}
                variant="outline"
                className="h-full flex flex-col items-center justify-center gap-2 py-6 hover:bg-green-50 hover:border-green-300 hover:text-green-700 transition-all"
                onClick={action.onClick}
              >
                <Icon className="w-5 h-5" />
                <span className="text-xs font-medium text-center">{action.label}</span>
              </Button>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
