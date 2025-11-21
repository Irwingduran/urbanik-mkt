'use client'

import { useSession } from 'next-auth/react'
import { useCallback } from 'react'

/**
 * Hook para refrescar la sesión del usuario
 * Útil cuando se ha actualizado el rol en la BD y quieres que se refleje inmediatamente
 */
export function useSessionRefresh() {
  const { data: session, update } = useSession()

  const refreshSession = useCallback(async () => {
    try {
      // Trigger a session update in NextAuth
      // This will call the jwt callback which checks the database
      await update()
      return true
    } catch (error) {
      console.error('Error refreshing session:', error)
      return false
    }
  }, [update])

  return {
    session,
    refreshSession,
    isLoading: !session
  }
}

/**
 * Hook para esperar cambios de rol
 * Útil después de que el admin aprueba una solicitud de vendedor
 */
export function useRoleChangeListener() {
  const { data: session, update } = useSession()

  const waitForRoleChange = useCallback(async (targetRole: string, maxWaitTime = 30000) => {
    const startTime = Date.now()
    
    while (Date.now() - startTime < maxWaitTime) {
      // Actualizar sesión
      const result = await update()
      
      // Verificar si el rol cambió
      const hasRole = (result?.user?.roles as string[])?.includes(targetRole)
      
      if (hasRole) {
        return true
      }

      // Esperar 2 segundos antes de reintentar
      await new Promise(resolve => setTimeout(resolve, 2000))
    }

    return false
  }, [update])

  return {
    session,
    waitForRoleChange
  }
}
