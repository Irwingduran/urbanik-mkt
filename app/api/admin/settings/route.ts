import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth-config'
import { loadAllSettings, saveSettingsSection, DEFAULT_SETTINGS } from '@/lib/settings'
import { z } from 'zod'

// Schemas de validación server-side
const generalSchema = z.object({
  maintenanceMode: z.boolean(),
  vendorApplicationsEnabled: z.boolean(),
  promotionsEnabled: z.boolean(),
})
const regenScoreSchema = z.object({
  weightCarbon: z.number().min(0).max(1),
  weightWater: z.number().min(0).max(1),
  weightEnergy: z.number().min(0).max(1),
  weightWaste: z.number().min(0).max(1),
  thresholdBronze: z.number().min(0).max(100),
  thresholdSilver: z.number().min(0).max(100),
  thresholdGold: z.number().min(0).max(100),
  thresholdPlatinum: z.number().min(0).max(100),
}).refine(v => v.weightCarbon + v.weightWater + v.weightEnergy + v.weightWaste === 1, { message: 'La suma de pesos debe ser 1' })
const commissionsSchema = z.object({ baseRate: z.number().min(0).max(100), allowCustomVendorRate: z.boolean() })
const paymentsSchema = z.object({ stripeConnected: z.boolean(), payoutScheduleDays: z.number().min(1).max(30), allowManualPayout: z.boolean() })
const shippingSchema = z.object({
  baseCost: z.number().min(0),
  freeShippingThreshold: z.number().min(0),
  zones: z.array(z.object({ name: z.string(), multiplier: z.number().min(0) }))
})
const policiesSchema = z.object({ terms: z.string(), privacy: z.string(), sustainabilityCommitment: z.string() })

const sectionSchemas: Record<string, z.ZodSchema<any>> = {
  general: generalSchema,
  regenScore: regenScoreSchema,
  commissions: commissionsSchema,
  payments: paymentsSchema,
  shipping: shippingSchema,
  policies: policiesSchema,
}

// GET /api/admin/settings -> retorna todas las configuraciones
export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }
    // Cargar y fusionar con defaults
    const settings = await loadAllSettings()
    return NextResponse.json({ success: true, data: settings })
  } catch (error) {
    console.error('GET /api/admin/settings error', error)
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
  }
}

// POST /api/admin/settings { section, data }
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }
    const body = await request.json()
    const { section, data } = body
    if (!section || !data) {
      return NextResponse.json({ error: 'Missing section or data' }, { status: 400 })
    }
    if (!sectionSchemas[section]) {
      return NextResponse.json({ error: 'Invalid section' }, { status: 400 })
    }
    const parsed = sectionSchemas[section].safeParse(data)
    if (!parsed.success) {
      return NextResponse.json({ error: 'Validation failed', details: parsed.error.flatten() }, { status: 422 })
    }
    // Guardar sección (upsert por claves)
    // Nota: prisma.platformSetting estará disponible tras migración.
    await saveSettingsSection(section as any, parsed.data, (session as any).user.id)
    // Retornar nuevo snapshot
    const updated = await loadAllSettings()
    return NextResponse.json({ success: true, data: updated, updatedSection: section })
  } catch (error) {
    console.error('POST /api/admin/settings error', error)
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
  }
}
