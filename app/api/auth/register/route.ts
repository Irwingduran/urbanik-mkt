import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { Prisma } from '@prisma/client'
import bcrypt from 'bcryptjs'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, password } = body

    // Validate required fields
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: 'Name, email, and password are required' },
        { status: 400 }
      )
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      )
    }

    // Password strength validation
    if (password.length < 8) {
      return NextResponse.json(
        { error: 'Password must be at least 8 characters long' },
        { status: 400 }
      )
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 400 }
      )
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Create user with transaction to ensure data consistency
    const newUser = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      // 1. Create the user (with deprecated 'role' field for backward compatibility)
      const user = await tx.user.create({
        data: {
          name,
          email,
          password: hashedPassword,
          role: 'USER', // Keep for backward compatibility, will be DEPRECATED
        }
      })

      // 2. Assign USER role (new multi-role system)
      await tx.userRole.create({
        data: {
          userId: user.id,
          role: 'USER',
          active: true,
        }
      })

      // 3. Create initial UserProfile (legacy compatibility)
      await tx.userProfile.create({
        data: {
          userId: user.id,
          firstName: name.split(' ')[0] || '',
          lastName: name.split(' ').slice(1).join(' ') || '',
        }
      })

      // 4. Create CustomerProfile (new system)
      await tx.customerProfile.create({
        data: {
          userId: user.id,
          loyaltyTier: 'BRONZE',
          rewardPoints: 0,
        }
      })

      return user
    })

    // Return user data (excluding password)
    const { password: _, ...userWithoutPassword } = newUser

    return NextResponse.json(
      {
        message: 'Account created successfully',
        user: userWithoutPassword
      },
      { status: 201 }
    )

  } catch (error) {
    console.error('Registration error:', error)

    // More detailed error for debugging
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    console.error('Error details:', {
      message: errorMessage,
      stack: error instanceof Error ? error.stack : undefined
    })

    return NextResponse.json(
      {
        error: 'Failed to create account. Please try again.',
        details: process.env.NODE_ENV === 'development' ? errorMessage : undefined
      },
      { status: 500 }
    )
  }
}