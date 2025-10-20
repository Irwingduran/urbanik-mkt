import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth-config'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const {
      companyName,
      description,
      website,
      phone,
      email,
      address,
      category,
      certifications,
      sustainabilityFocus,
      sustainabilityMetrics,
      contactName
    } = body

    // Get user from database
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: {
        userRoles: {
          where: { active: true },
          select: { role: true }
        },
        vendorApplication: {
          where: {
            status: {
              in: ['PENDING', 'IN_REVIEW'] // Only block if PENDING or IN_REVIEW
            }
          },
          orderBy: { createdAt: 'desc' },
          take: 1
        }
      }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Check if user already has VENDOR role (already approved)
    const hasVendorRole = user.userRoles.some(ur => ur.role === 'VENDOR')
    if (hasVendorRole) {
      return NextResponse.json(
        {
          error: 'Ya eres un vendedor aprobado',
          message: 'Tu solicitud ya fue aprobada. Puedes acceder a tu panel de vendedor.'
        },
        { status: 400 }
      )
    }

    // Check if user has a pending or in-review application
    if (user.vendorApplication && user.vendorApplication.length > 0) {
      const currentApplication = user.vendorApplication[0]
      return NextResponse.json(
        {
          error: currentApplication.status === 'PENDING'
            ? 'Ya tienes una solicitud pendiente'
            : 'Tu solicitud está siendo revisada',
          application: currentApplication
        },
        { status: 400 }
      )
    }

    // If user was REJECTED, they can apply again (no blocking here)

    // Create vendor application
    const application = await prisma.vendorApplication.create({
      data: {
        userId: user.id,
        companyName: companyName || 'New Sustainable Business',
        businessType: category || 'Otro',
        description: description || null,
        website: website || null,
        businessPhone: phone || null,
        businessAddress: address || null,
        taxId: null, // Can be added later
        documents: {
          certifications: certifications || [],
          sustainabilityMetrics: sustainabilityMetrics || {},
          sustainabilityFocus: sustainabilityFocus || [],
          contactName: contactName || user.name,
          contactEmail: email || user.email
        },
        status: 'PENDING',
        submittedAt: new Date()
      }
    })

    return NextResponse.json({
      success: true,
      message: 'Solicitud de vendedor enviada exitosamente',
      application: {
        id: application.id,
        companyName: application.companyName,
        status: application.status,
        submittedAt: application.submittedAt
      }
    })

  } catch (error) {
    console.error('Vendor onboarding error:', error)
    return NextResponse.json(
      { error: 'Failed to submit vendor application' },
      { status: 500 }
    )
  }
}