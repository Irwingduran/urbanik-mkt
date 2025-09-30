import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, password, role, companyName } = body

    // Validate required fields
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: 'Name, email, and password are required' },
        { status: 400 }
      )
    }

    if (!role || !['USER', 'VENDOR'].includes(role)) {
      return NextResponse.json(
        { error: 'Valid role is required (USER or VENDOR)' },
        { status: 400 }
      )
    }

    if (role === 'VENDOR' && !companyName) {
      return NextResponse.json(
        { error: 'Company name is required for vendor accounts' },
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
    const newUser = await prisma.$transaction(async (tx) => {
      // Create the user
      const user = await tx.user.create({
        data: {
          name,
          email,
          password: hashedPassword,
          role: role as 'USER' | 'VENDOR'
        }
      })

      // Create initial profile
      await tx.userProfile.create({
        data: {
          userId: user.id,
          firstName: name.split(' ')[0] || '',
          lastName: name.split(' ').slice(1).join(' ') || '',
        }
      })

      // If vendor, create vendor profile
      if (role === 'VENDOR' && companyName) {
        await tx.vendor.create({
          data: {
            userId: user.id,
            companyName: companyName,
            description: `Welcome to ${companyName}! We're committed to sustainability.`,
          }
        })
      }

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
    return NextResponse.json(
      { error: 'Failed to create account. Please try again.' },
      { status: 500 }
    )
  }
}