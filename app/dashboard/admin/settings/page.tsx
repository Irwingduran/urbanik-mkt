'use client'

import SettingsLayout from '@/components/admin/settings/SettingsLayout'
import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Card, CardContent } from '@/components/ui/card'

export default function AdminSettingsPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [initialSettings, setInitialSettings] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/signin')
      return
    }

    if (status === 'authenticated' && session?.user.role !== 'ADMIN') {
      router.push('/dashboard')
      return
    }

    if (status === 'authenticated') {
      loadSettings()
    }
  }, [status, session, router])

  const loadSettings = async () => {
    try {
      const response = await fetch('/api/admin/settings')
      const data = await response.json()
      if (data.success) {
        setInitialSettings(data.data)
      }
    } catch (error) {
      console.error('Error loading settings:', error)
    } finally {
      setLoading(false)
    }
  }

  if (status === 'loading' || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin">
          <div className="h-12 w-12 border-4 border-gray-300 border-t-green-600 rounded-full"></div>
        </div>
      </div>
    )
  }

  if (!session || session.user.role !== 'ADMIN') {
    return null
  }

  return (
    <>
      <div className="p-6">
          {initialSettings ? (
            <SettingsLayout initialSettings={initialSettings} />
          ) : (
            <Card>
              <CardContent className="p-8 text-center text-gray-500">
                Error al cargar la configuración
              </CardContent>
            </Card>
          )}
        </div>
    </>
  )
}