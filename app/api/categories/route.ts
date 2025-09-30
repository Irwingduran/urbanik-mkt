import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      where: {
        active: true,
        parentId: null // Only get top-level categories
      },
      include: {
        children: {
          where: {
            active: true
          }
        }
      },
      orderBy: {
        name: 'asc'
      }
    })

    const transformedCategories = categories.map((category: typeof categories[0]) => ({
      id: category.id,
      name: category.name,
      slug: category.slug,
      description: category.description,
      icon: category.icon,
      children: category.children.map((child: typeof category.children[0]) => ({
        id: child.id,
        name: child.name,
        slug: child.slug,
        description: child.description,
        icon: child.icon
      }))
    }))

    return NextResponse.json({
      success: true,
      data: transformedCategories
    })

  } catch (error) {
    console.error('Error fetching categories:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch categories' },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}