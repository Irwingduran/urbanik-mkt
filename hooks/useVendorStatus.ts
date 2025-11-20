import { useEffect, useState, useCallback, useRef } from 'react'
import { useSession } from 'next-auth/react'

export type VendorStatus =
  | 'not_applied'
  | 'pending'
  | 'in_review'
  | 'approved'
  | 'rejected'

export interface VendorStatusData {
  status: VendorStatus
  hasVendorRole: boolean
  isLoading: boolean
  error: string | null
  application?: {
    id: string
    companyName: string
    status: string
    submittedAt: Date
    reviewedAt?: Date | null
    rejectionReason?: string | null
  }
  vendorProfile?: {
    id: string
    companyName: string
    verificationStatus: string
    active: boolean
    onboardingStatus: string
  }
  refetch: () => Promise<void>
}

export function useVendorStatus(): VendorStatusData {
  const { data: session, status: sessionStatus } = useSession()
  const [status, setStatus] = useState<VendorStatus>('not_applied')
  const [hasVendorRole, setHasVendorRole] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [application, setApplication] = useState<VendorStatusData['application']>()
  const [vendorProfile, setVendorProfile] = useState<VendorStatusData['vendorProfile']>()
  
  // Ref para evitar múltiples fetches simultáneos
  const isFetchingRef = useRef(false)
  const hasInitializedRef = useRef(false)

  const fetchVendorStatus = useCallback(async () => {
    // Don't fetch if not authenticated
    if (sessionStatus !== 'authenticated' || !session?.user) {
      setIsLoading(false)
      return
    }

    // Evitar múltiples fetches simultáneos
    if (isFetchingRef.current) {
      return
    }

    try {
      isFetchingRef.current = true
      setIsLoading(true)
      setError(null)

      const response = await fetch('/api/user/vendor-status')

      if (!response.ok) {
        if (response.status === 401) {
          setError('No autenticado')
          return
        }
        throw new Error('Failed to fetch vendor status')
      }

      const data = await response.json()

      setStatus(data.status)
      setHasVendorRole(data.hasVendorRole)
      setApplication(data.application)
      setVendorProfile(data.vendorProfile)
    } catch (err) {
      console.error('Error fetching vendor status:', err)
      setError(err instanceof Error ? err.message : 'Error desconocido')
    } finally {
      setIsLoading(false)
      isFetchingRef.current = false
    }
  }, [session?.user?.email, sessionStatus])

  useEffect(() => {
    // Solo fetch una vez al inicializar si está autenticado
    if (sessionStatus === 'authenticated' && !hasInitializedRef.current) {
      hasInitializedRef.current = true
      fetchVendorStatus()
    }
  }, [sessionStatus, fetchVendorStatus])

  return {
    status,
    hasVendorRole,
    isLoading,
    error,
    application,
    vendorProfile,
    refetch: fetchVendorStatus
  }
}
