import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth-config'
import { prisma } from '@/lib/prisma'

interface RegenMarkEvaluation {
  type: string
  notes?: string
  documentation?: string
}

interface RequestBody {
  productId: string
  selectedRegenMarks: RegenMarkEvaluation[]
  regenScore: number
  productData: {
    name: string
    sku: string
    category: string
    carbonEmissions?: number
    waterConsumption?: number
    renewableEnergy?: number
    recyclability?: number
    sustainabilityBenefits: string[]
  }
}

export async function POST(request: NextRequest) {
  try {
    // Validar sesión
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      )
    }

    // Obtener usuario
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: { userRoles: true }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'Usuario no encontrado' },
        { status: 404 }
      )
    }

    // Validar que sea vendedor
    const isVendor = user.userRoles.some(r => r.role === 'VENDOR' && r.active)
    if (!isVendor) {
      return NextResponse.json(
        { error: 'Solo vendedores pueden solicitar evaluaciones de RegenMarks' },
        { status: 403 }
      )
    }

    const body: RequestBody = await request.json()
    const { productId, selectedRegenMarks, regenScore, productData } = body

    // Validar datos
    if (!productId || !selectedRegenMarks || selectedRegenMarks.length === 0) {
      return NextResponse.json(
        { error: 'Datos incompletos: productId y selectedRegenMarks requeridos' },
        { status: 400 }
      )
    }

    // Validar que el producto existe y pertenece al vendedor
    const product = await prisma.product.findUnique({
      where: { id: productId },
      include: { 
        vendorProfile: {
          select: { userId: true }
        }
      }
    })

    if (!product) {
      return NextResponse.json(
        { error: 'Producto no encontrado' },
        { status: 404 }
      )
    }

    if (product.vendorProfile.userId !== user.id) {
      return NextResponse.json(
        { error: 'No tienes permiso para solicitar evaluación en este producto' },
        { status: 403 }
      )
    }

    // Validar RegenMarks - mapear tipo a enum del modelo
    const regenMarkTypeMap: Record<string, string> = {
      'CARBON_SAVER': 'CARBON_SAVER',
      'WATER_GUARDIAN': 'WATER_GUARDIAN',
      'HUMAN_FIRST': 'HUMAN_FIRST',
      'HUMANE_HERO': 'HUMANE_HERO',
      'CIRCULAR_CHAMPION': 'CIRCULAR_CHAMPION'
    }

    const validMarks = selectedRegenMarks.filter(mark => regenMarkTypeMap[mark.type])
    if (validMarks.length === 0) {
      return NextResponse.json(
        { error: 'No hay tipos de RegenMark válidos en la solicitud' },
        { status: 400 }
      )
    }

    // Obtener perfil de vendedor
    const vendorProfile = await prisma.vendorProfile.findUnique({
      where: { userId: user.id }
    })

    if (!vendorProfile) {
      return NextResponse.json(
        { error: 'Perfil de vendedor no encontrado' },
        { status: 404 }
      )
    }

    // Crear solicitudes de evaluación por cada RegenMark
    const evaluations = await Promise.all(
      validMarks.map(mark => 
        prisma.regenMarkEvaluation.create({
          data: {
            type: regenMarkTypeMap[mark.type] as any,
            vendorProfileId: vendorProfile.id,
            status: 'PENDING',
            stage: 'SUBMITTED',
            submittedAt: new Date(),
            aiScore: regenScore,
            reviewerNotes: mark.notes || '',
            feedback: JSON.stringify({
              documentation: mark.documentation || '',
              productMetadata: {
                name: productData.name,
                sku: productData.sku,
                category: productData.category,
                carbonEmissions: productData.carbonEmissions,
                waterConsumption: productData.waterConsumption,
                renewableEnergy: productData.renewableEnergy,
                recyclability: productData.recyclability,
                sustainabilityBenefits: productData.sustainabilityBenefits,
                regenScore: regenScore
              }
            })
          }
        })
      )
    )

    // Crear notificación para el vendedor
    await prisma.notification.create({
      data: {
        userId: user.id,
        productId: productId,
        type: 'REGENMARK_SUBMITTED',
        title: '✅ Solicitud de Evaluación Enviada',
        message: `Tu solicitud de evaluación para ${validMarks.length} RegenMark(s) en "${productData.name}" ha sido recibida. Te contactaremos con los próximos pasos.`,
        read: false
      }
    })

    return NextResponse.json(
      {
        success: true,
        message: 'Solicitud(es) de evaluación enviada(s) exitosamente',
        evaluationIds: evaluations.map(e => e.id),
        requestedMarks: validMarks.map(m => m.type)
      },
      { status: 201 }
    )

  } catch (error) {
    console.error('Error en solicitud de RegenMark:', error)
    return NextResponse.json(
      { 
        error: 'Error al procesar la solicitud',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

// GET para obtener estado de evaluaciones del vendedor
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      )
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'Usuario no encontrado' },
        { status: 404 }
      )
    }

    const vendorProfile = await prisma.vendorProfile.findUnique({
      where: { userId: user.id }
    })

    if (!vendorProfile) {
      return NextResponse.json(
        { error: 'Perfil de vendedor no encontrado' },
        { status: 404 }
      )
    }

    const evaluations = await prisma.regenMarkEvaluation.findMany({
      where: { vendorProfileId: vendorProfile.id },
      orderBy: { submittedAt: 'desc' },
      take: 50
    })

    return NextResponse.json({
      success: true,
      evaluations,
      total: evaluations.length
    })

  } catch (error) {
    console.error('Error obteniendo evaluaciones:', error)
    return NextResponse.json(
      { error: 'Error al obtener evaluaciones' },
      { status: 500 }
    )
  }
}
