export interface GeneralSettings {
  maintenanceMode: boolean
  vendorApplicationsEnabled: boolean
  promotionsEnabled: boolean
}

export interface RegenScoreSettings {
  weightCarbon: number
  weightWater: number
  weightEnergy: number
  weightWaste: number
  thresholdBronze: number
  thresholdSilver: number
  thresholdGold: number
  thresholdPlatinum: number
}

export interface CommissionSettings {
  baseRate: number // porcentaje base marketplace
  allowCustomVendorRate: boolean
}

export interface PaymentSettings {
  stripeConnected: boolean
  payoutScheduleDays: number
  allowManualPayout: boolean
}

export interface ShippingZone {
  name: string
  multiplier: number
}

export interface ShippingSettings {
  baseCost: number
  freeShippingThreshold: number
  zones: ShippingZone[]
}

export interface PoliciesSettings {
  terms: string
  privacy: string
  sustainabilityCommitment: string
}

export interface AdminSettings {
  general: GeneralSettings
  regenScore: RegenScoreSettings
  commissions: CommissionSettings
  payments: PaymentSettings
  shipping: ShippingSettings
  policies: PoliciesSettings
}

export type SettingsKey = keyof AdminSettings
