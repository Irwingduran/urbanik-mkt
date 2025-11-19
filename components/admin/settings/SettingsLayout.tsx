"use client"
import { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import GeneralSettingsSection from './GeneralSettingsSection'
import RegenScoreSettingsSection from './RegenScoreSettingsSection'
import CommissionsSettingsSection from './CommissionsSettingsSection'
import PaymentsSettingsSection from './PaymentsSettingsSection'
import CategoriesSettingsSection from './CategoriesSettingsSection'
import ShippingSettingsSection from './ShippingSettingsSection'
import PoliciesSettingsSection from './PoliciesSettingsSection'
import type { AdminSettings, GeneralSettings, RegenScoreSettings, CommissionSettings, PaymentSettings, ShippingSettings, PoliciesSettings } from './types'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

interface Props { initialSettings: AdminSettings }

export default function SettingsLayout({ initialSettings }: Props) {
  const [settings, setSettings] = useState<AdminSettings>(initialSettings)
  const [savingSection, setSavingSection] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const saveSection = async <T extends keyof AdminSettings>(section: T, value: AdminSettings[T]) => {
    setSavingSection(section as string)
    setError(null)
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ section, data: value })
      })
      const json = await res.json()
      if (!res.ok || !json.success) {
        throw new Error(json.error || 'Error al guardar')
      }
      // Reemplazar estado con snapshot actualizado
      setSettings(json.data)
    } catch (e: any) {
      setError(e.message)
    } finally {
      setSavingSection(null)
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Configuración del Sistema</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-600">Administra parámetros críticos de la plataforma. Al guardar cada sección se aplica inmediatamente.</p>
          {savingSection && (
            <div className="mt-4"><Badge className="bg-blue-100 text-blue-700">Guardando {savingSection}...</Badge></div>
          )}
          {error && (
            <div className="mt-4"><Badge className="bg-red-100 text-red-700">{error}</Badge></div>
          )}
        </CardContent>
      </Card>
      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="flex flex-wrap gap-2">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="regen">REGEN Score</TabsTrigger>
          <TabsTrigger value="commissions">Comisiones</TabsTrigger>
          <TabsTrigger value="payments">Pagos</TabsTrigger>
          <TabsTrigger value="categories">Categorías</TabsTrigger>
          <TabsTrigger value="shipping">Envíos</TabsTrigger>
          <TabsTrigger value="policies">Políticas</TabsTrigger>
        </TabsList>
        <TabsContent value="general">
          <GeneralSettingsSection
            value={settings.general as GeneralSettings}
            onSave={(data) => saveSection('general', data)}
          />
        </TabsContent>
        <TabsContent value="regen">
          <RegenScoreSettingsSection
            value={settings.regenScore as RegenScoreSettings}
            onSave={(data) => saveSection('regenScore', data)}
          />
        </TabsContent>
        <TabsContent value="commissions">
          <CommissionsSettingsSection
            value={settings.commissions as CommissionSettings}
            onSave={(data) => saveSection('commissions', data)}
          />
        </TabsContent>
        <TabsContent value="payments">
          <PaymentsSettingsSection
            value={settings.payments as PaymentSettings}
            onSave={(data) => saveSection('payments', data)}
          />
        </TabsContent>
        <TabsContent value="categories">
          <CategoriesSettingsSection />
        </TabsContent>
        <TabsContent value="shipping">
          <ShippingSettingsSection
            value={settings.shipping as ShippingSettings}
            onSave={(data) => saveSection('shipping', data)}
          />
        </TabsContent>
        <TabsContent value="policies">
          <PoliciesSettingsSection
            value={settings.policies as PoliciesSettings}
            onSave={(data) => saveSection('policies', data)}
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}
