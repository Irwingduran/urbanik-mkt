import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth-config'
import { prisma } from '@/lib/prisma'

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
}

export async function GET(request: NextRequest) {
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
    const hasVendorRole = user.userRoles.some(ur => ur.role === 'VENDOR')

    // Determine status
    let status: VendorStatus = 'not_applied'
    let application = undefined
    let vendorProfile = undefined

    // Priority 1: Has active vendor profile and role
    if (user.vendorProfile && user.vendorProfile.active && hasVendorRole) {
      status = 'approved'
      vendorProfile = user.vendorProfile
    }
    // Priority 2: Has pending or in-review application
    else if (user.vendorApplication && user.vendorApplication.length > 0) {
      // IMPORTANT: Prioritize PENDING/IN_REVIEW over REJECTED
      // This prevents users from accessing onboarding if they have an active application
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
    // Priority 3: Never applied
    else {
      status = 'not_applied'
    }

    const response: VendorStatusResponse = {
      status,
      hasVendorRole,
      application: application || undefined,
      vendorProfile: vendorProfile || undefined
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
