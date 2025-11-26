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
      firstName,
      lastName,
      phone,
      city,
      state,
      birthDate,
      sustainabilityFocus,
      preferredCategories,
      priceRange,
      notifyNewProducts,
      notifyPriceAlerts,
      notifyOrderUpdates,
      notifySustainability,
      notifyMarketing
    } = body

    // Get user from database
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: { profile: true }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Create or update user profile
    const profileData = {
      userId: user.id,
      firstName: firstName || '',
      lastName: lastName || '',
      phone: phone || null,
      birthDate: birthDate ? new Date(birthDate) : null,
      sustainabilityFocus: sustainabilityFocus || [],
      preferredCategories: preferredCategories || [],
      priceRange: priceRange || null,
      notifyNewProducts: notifyNewProducts ?? true,
      notifyPriceAlerts: notifyPriceAlerts ?? true,
      notifyOrderUpdates: notifyOrderUpdates ?? true,
      notifySustainability: notifySustainability ?? true,
      notifyMarketing: notifyMarketing ?? false,
      regenScore: user.profile?.regenScore || 0,
      loyaltyPoints: user.profile?.loyaltyPoints || 0,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      nftsCollected: (user.profile?.nftsCollected || []) as any[]
    }

    let profile
    if (user.profile) {
      // Update existing profile
      profile = await prisma.userProfile.update({
        where: { userId: user.id },
        data: profileData
      })
    } else {
      // Create new profile
      profile = await prisma.userProfile.create({
        data: profileData
      })
    }

    // If it's a new customer, create their address if city/state provided
    if (city || state) {
      const existingAddress = await prisma.address.findFirst({
        where: {
          userId: user.id,
          type: 'home'
        }
      })

      if (existingAddress) {
        // Update existing home address
        await prisma.address.update({
          where: { id: existingAddress.id },
          data: {
            city: city || existingAddress.city,
            state: state || existingAddress.state,
            name: 'Home Address'
          }
        })
      } else {
        // Create new home address
        await prisma.address.create({
          data: {
            userId: user.id,
            type: 'home',
            name: 'Home Address',
            street: '', // Will be filled later
            city: city || '',
            state: state || '',
            zipCode: '', // Will be filled later
            country: 'México',
            isDefault: true
          }
        })
      }
    }

    return NextResponse.json({
      message: 'Profile updated successfully',
      profile: profile
    })

  } catch (error) {
    console.error('Profile update error:', error)
    return NextResponse.json(
      { error: 'Failed to update profile' },
      { status: 500 }
    )
  }
}