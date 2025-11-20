'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { AlertCircle, CheckCircle } from 'lucide-react'

/**
 * Componente que detecta cambios de rol y muestra notificación
 * Se debe colocar en el layout principal para que funcione en toda la app
 */
export function RoleChangeListener() {
  const { data: session } = useSession()
  const [notification, setNotification] = useState<string | null>(null)
  const [previousRole, setPreviousRole] = useState<string | null>(null)

  useEffect(() => {
    const currentRoles = session?.user?.roles as string[]
    const currentRole = currentRoles?.[0] || 'USER'

    // Si hay cambio de rol significativo
    if (previousRole && previousRole !== currentRole) {
      // Determinar tipo de cambio
      if (currentRole === 'VENDOR' && previousRole === 'USER') {
        setNotification('¡Felicidades! Tu solicitud de vendedor ha sido aprobada')
        
        // Redirigir a dashboard de vendedor después de 2 segundos
        setTimeout(() => {
          window.location.href = '/dashboard/vendor'
        }, 2000)
      } else if (currentRole === 'ADMIN') {
        setNotification('Has sido promovido a administrador')
      } else {
        setNotification(`Tu rol ha cambiado a: ${currentRole}`)
      }

      // Limpiar notificación después de 5 segundos
      setTimeout(() => {
        setNotification(null)
      }, 5000)
    }

    setPreviousRole(currentRole)
  }, [session?.user?.roles, previousRole])

  if (!notification) {
    return null
  }

  return (
    <div className="fixed top-4 right-4 z-50 max-w-md">
      <div className="bg-green-50 border border-green-200 rounded-lg p-4 shadow-lg flex items-start gap-3">
        <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-medium text-green-900">{notification}</p>
        </div>
      </div>
    </div>
  )
}

/**
 * Alternativa: Componente que solo muestra en el dashboard
 */
export function RoleChangeNotification() {
  const { data: session } = useSession()
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'info' } | null>(null)

  useEffect(() => {
    // Verificar si el usuario acaba de ser aprobado
    if (session?.user?.roles?.includes('VENDOR')) {
      const hasSeenNotification = sessionStorage.getItem('vendor_approved_notification')
      
      if (!hasSeenNotification) {
        setMessage({
          text: '¡Tu solicitud como vendedor ha sido aprobada! Ahora puedes acceder a tu dashboard de vendedor.',
          type: 'success'
        })
        sessionStorage.setItem('vendor_approved_notification', 'true')
      }
    }
  }, [session?.user?.roles])

  if (!message) {
    return null
  }

  return (
    <div className="mb-6 p-4 rounded-lg border flex items-start gap-3"
      style={{
        backgroundColor: message.type === 'success' ? '#ecfdf5' : '#eff6ff',
        borderColor: message.type === 'success' ? '#86efac' : '#93c5fd'
      }}
    >
      {message.type === 'success' ? (
        <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
      ) : (
        <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
      )}
      <p className="text-sm font-medium" 
        style={{ color: message.type === 'success' ? '#065f46' : '#1e40af' }}
      >
        {message.text}
      </p>
    </div>
  )
}
