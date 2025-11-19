"use client"
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import type { CommissionSettings } from './types'

const schema = z.object({
  baseRate: z.number().min(0).max(100),
  allowCustomVendorRate: z.boolean()
})

interface Props {
  value: CommissionSettings
  onSave: (data: CommissionSettings) => Promise<void> | void
}

export default function CommissionsSettingsSection({ value, onSave }: Props) {
  const form = useForm<CommissionSettings>({
    resolver: zodResolver(schema),
    defaultValues: value
  })

  const submit = async (data: CommissionSettings) => {
    try {
      await onSave(data)
      toast.success('Comisiones actualizadas')
    } catch (e: any) {
      toast.error(e.message || 'Error al guardar')
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Comisiones</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-1">
            <Label>Comisión Base (%)</Label>
            <Input type="number" step="0.1" {...form.register('baseRate', { valueAsNumber: true })} />
            <p className="text-xs text-gray-500">Porcentaje aplicado a ventas estándar.</p>
          </div>
          <div className="flex items-center justify-between border rounded p-3">
            <div>
              <Label>Custom por Vendedor</Label>
              <p className="text-xs text-gray-500">Permite override individual.</p>
            </div>
            <Switch checked={form.watch('allowCustomVendorRate')} onCheckedChange={v => form.setValue('allowCustomVendorRate', v, { shouldDirty: true })} />
          </div>
        </div>
        <div className="rounded border p-4 bg-gray-50">
          <p className="text-xs text-gray-600">Listado de overrides (placeholder):</p>
          <ul className="mt-2 text-sm list-disc list-inside text-gray-700">
            <li>EcoCorp (ID v123) - 12%</li>
            <li>GreenTech (ID v456) - 18%</li>
          </ul>
          <p className="text-xs text-gray-400 mt-2">Futuro: tabla editable con búsqueda y paginación.</p>
        </div>
        <div className="flex justify-end">
          <Button disabled={!form.formState.isDirty} onClick={form.handleSubmit(submit)}>Guardar Cambios</Button>
        </div>
      </CardContent>
    </Card>
  )
}
