import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession()

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
      founded,
      employees,
      location,
      contactName,
      contactEmail,
      contactPhone,
      businessRegistration,
      taxId,
      certifications,
      sustainabilityFocus
    } = body

    // Get user from database
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: { vendor: true, profile: true }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    if (user.role !== 'VENDOR') {
      return NextResponse.json(
        { error: 'User is not a vendor' },
        { status: 403 }
      )
    }

    // Create or update user profile for vendor
    const profileData = {
      userId: user.id,
      firstName: contactName?.split(' ')[0] || user.name?.split(' ')[0] || '',
      lastName: contactName?.split(' ').slice(1).join(' ') || user.name?.split(' ').slice(1).join(' ') || '',
      phone: contactPhone || phone,
      sustainabilityFocus: sustainabilityFocus || [],
      preferredCategories: sustainabilityFocus || [],
      regenScore: 50, // Starting vendor score
      loyaltyPoints: 100, // Starting points for vendors
      nftsCollected: [
        {
          id: 1,
          name: 'Semilla Verde Empresarial',
          emoji: '🌱',
          rarity: 'common',
          level: 'Inicial',
          description: 'Tu primer NFT como proveedor sostenible certificado'
        }
      ]
    }

    let profile
    if (user.profile) {
      profile = await prisma.userProfile.update({
        where: { userId: user.id },
        data: profileData
      })
    } else {
      profile = await prisma.userProfile.create({
        data: profileData
      })
    }

    // Create or update vendor profile
    const vendorData = {
      userId: user.id,
      companyName: companyName || 'New Sustainable Business',
      description: description || `Welcome to ${companyName || 'our business'}! We're committed to sustainable products and practices.`,
      website: website || null,
      phone: phone || null,
      founded: founded || null,
      employees: employees || null,
      location: location || null,
      regenScore: 50,
      nftLevel: 'Semilla Verde',
      totalProducts: 0,
      totalSales: 0,
      monthlyRevenue: 0
    }

    let vendor
    if (user.vendor) {
      vendor = await prisma.vendor.update({
        where: { userId: user.id },
        data: vendorData
      })
    } else {
      vendor = await prisma.vendor.create({
        data: vendorData
      })
    }

    return NextResponse.json({
      message: 'Vendor onboarding completed successfully',
      vendor: vendor,
      profile: profile
    })

  } catch (error) {
    console.error('Vendor onboarding error:', error)
    return NextResponse.json(
      { error: 'Failed to complete vendor onboarding' },
      { status: 500 }
    )
  }
}