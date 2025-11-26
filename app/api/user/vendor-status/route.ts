import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth-config'
import { prisma } from '@/lib/prisma'
import { logger } from '@/lib/logger'

export type VendorStatus =
  | 'not_applied'
  | 'pending'
  | 'in_review'
  | 'approved'
  | 'rejected'

export interface VendorStatusResponse {
  status: VendorStatus
  hasVendorRole: boolean
  application?: {
    id: string
    companyName: string
    status: string
    submittedAt: Date | null
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
  debug?: {
    userId: string
    userRole: string
    roles: string[]
    evaluatedHasVendorRole: boolean
    vendorProfilePresent: boolean
  }
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    // Get user with all vendor-related data
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: {
        userRoles: {
          where: { active: true },
          select: { role: true }
        },
        vendorProfile: {
          select: {
            id: true,
            companyName: true,
            verificationStatus: true,
            active: true,
            onboardingStatus: true
          }
        },
        vendorApplication: {
          where: {
            status: {
              in: ['PENDING', 'IN_REVIEW', 'REJECTED']
            }
          },
          orderBy: {
            createdAt: 'desc'
          },
          select: {
            id: true,
            companyName: true,
            status: true,
            submittedAt: true,
            reviewedAt: true,
            rejectionReason: true
          }
        }
      }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Check if user has VENDOR role
  const hasVendorRole = user.userRoles.some(ur => ur.role === 'VENDOR') || user.role === 'VENDOR'

    // Determine status
    let status: VendorStatus = 'not_applied'
    let application = undefined
    let vendorProfile = undefined

    // Priority 1: Has active vendor profile and role
    // Prioritize already approved vendor profile (either active true or onboardingStatus APPROVED)
    if (user.vendorProfile && hasVendorRole) {
      const vp = user.vendorProfile
      if (vp.active || vp.onboardingStatus === 'APPROVED' || vp.verificationStatus === 'VERIFIED') {
        status = 'approved'
        vendorProfile = vp
      }
    }

    // If not approved yet, inspect applications
    if (status !== 'approved' && user.vendorApplication && user.vendorApplication.length > 0) {
      const pendingApp = user.vendorApplication.find(app => app.status === 'PENDING')
      const inReviewApp = user.vendorApplication.find(app => app.status === 'IN_REVIEW')
      const rejectedApp = user.vendorApplication.find(app => app.status === 'REJECTED')

      if (pendingApp) {
        status = 'pending'
        application = pendingApp
      } else if (inReviewApp) {
        status = 'in_review'
        application = inReviewApp
      } else if (rejectedApp) {
        status = 'rejected'
        application = rejectedApp
      }
    }

    // If still no status determined
    if (status === 'not_applied' && !user.vendorApplication?.length && !vendorProfile) {
      status = 'not_applied'
    }

    logger.debug('vendor-status.evaluated', {
      userId: user.id,
      hasVendorRole,
      finalStatus: status,
      hasVendorProfile: !!vendorProfile,
      vendorProfileActive: vendorProfile?.active,
      vendorProfileOnboarding: vendorProfile?.onboardingStatus,
      applicationsCount: user.vendorApplication?.length || 0
    })

    const response: VendorStatusResponse = {
      status,
      hasVendorRole,
      application: application || undefined,
      vendorProfile: vendorProfile || undefined,
      debug: {
        userId: user.id,
        userRole: user.role,
        roles: user.userRoles.map(r => r.role),
        evaluatedHasVendorRole: hasVendorRole,
        vendorProfilePresent: !!vendorProfile
      }
    }

    return NextResponse.json(response)

  } catch (error) {
    console.error('Error fetching vendor status:', error)
    return NextResponse.json(
      { error: 'Failed to fetch vendor status' },
      { status: 500 }
    )
  }
}
