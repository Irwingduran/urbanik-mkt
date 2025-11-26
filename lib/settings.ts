import { AdminSettings } from '@/components/admin/settings/types'

// Defaults centralizados
export const DEFAULT_SETTINGS: AdminSettings = {
  general: {
    maintenanceMode: false,
    vendorApplicationsEnabled: true,
    promotionsEnabled: true,
  },
  regenScore: {
    weightCarbon: 0.25,
    weightWater: 0.25,
    weightEnergy: 0.25,
    weightWaste: 0.25,
    thresholdBronze: 20,
    thresholdSilver: 40,
    thresholdGold: 60,
    thresholdPlatinum: 80,
  },
  commissions: {
    baseRate: 15,
    allowCustomVendorRate: true,
  },
  payments: {
    stripeConnected: false,
    payoutScheduleDays: 7,
    allowManualPayout: false,
  },
  shipping: {
    baseCost: 89,
    freeShippingThreshold: 999,
    zones: [
      { name: 'Nacional', multiplier: 1 },
    ],
  },
  policies: {
    terms: '',
    privacy: '',
    sustainabilityCommitment: '',
  }
}

export async function loadAllSettings(): Promise<AdminSettings> {
  try {
    // TODO: Cambiar a: const rows = await prisma.platformSetting.findMany()
    // Una vez que Prisma Client regenere correctamente
    const rows: Array<{ group: string; key: string; value: unknown }> = [] // Temporary fallback: always use defaults
    const merged = { ...DEFAULT_SETTINGS } as unknown as Record<string, Record<string, unknown>>
    for (const row of rows) {
      if (!merged[row.group]) merged[row.group] = {}
      merged[row.group][row.key] = row.value
    }
    return merged as unknown as AdminSettings
  } catch (error) {
    console.warn('Error loading settings from DB, using defaults:', error)
    return DEFAULT_SETTINGS
  }
}

export async function saveSettingsSection<T extends keyof AdminSettings>(
  section: T,
  data: AdminSettings[T]
) {
  const entries = Object.entries(data as unknown as Record<string, unknown>)
  for (const [key, value] of entries) {
    try {
      // TODO: Cambiar a: await prisma.platformSetting.upsert({...})
      // Una vez que Prisma Client regenere correctamente
      console.log(`Would save: ${section}.${key} =`, value)
      // Temporary: no-op while Prisma Client is being fixed
    } catch (error) {
      console.error(`Error saving setting ${section}.${key}:`, error)
      throw error
    }
  }
}
