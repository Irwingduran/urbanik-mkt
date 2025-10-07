'use client'

import { useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { LoadingSpinner } from '@/components/shared/feedback/LoadingSpinner'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Shield } from 'lucide-react'

export default function VendorLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === 'loading') return

    if (!session) {
      router.push('/auth/signin?callbackUrl=/dashboard/vendor')
      return
    }

    // Verificar que el usuario tenga el rol VENDOR
    const roles = session.user?.roles || []
    const isVendor = roles.includes('VENDOR')
    const isAdmin = roles.includes('ADMIN')

    if (!isVendor && !isAdmin) {
      // No tiene permisos, redirigir al dashboard normal
      router.push('/dashboard?error=vendor_required')
    }
  }, [session, status, router])

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-gray-600">Verificando permisos...</p>
        </div>
      </div>
    )
  }

  if (!session) {
    return null // Redirecting
  }

  const roles = session.user?.roles || []
  const hasAccess = roles.includes('VENDOR') || roles.includes('ADMIN')

  if (!hasAccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="max-w-md w-full">
          <Alert variant="destructive">
            <Shield className="h-4 w-4" />
            <AlertDescription>
              No tienes permisos para acceder al dashboard de vendedor.
              <br />
              <a href="/dashboard" className="underline mt-2 inline-block">
                Volver al dashboard
              </a>
            </AlertDescription>
          </Alert>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
