"use client"
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import type { ShippingSettings } from './types'

const schema = z.object({
  baseCost: z.number().min(0),
  freeShippingThreshold: z.number().min(0),
  zones: z.array(z.object({ name: z.string(), multiplier: z.number().min(0) }))
})

interface Props {
  value: ShippingSettings
  onSave: (data: ShippingSettings) => Promise<void> | void
}

export default function ShippingSettingsSection({ value, onSave }: Props) {
  const form = useForm<ShippingSettings>({
    resolver: zodResolver(schema),
    defaultValues: value
  })

  const submit = async (data: ShippingSettings) => {
    try {
      await onSave(data)
      toast.success('Configuración de envíos guardada')
    } catch (e) {
      const message = e instanceof Error ? e.message : 'Error al guardar'
      toast.error(message)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Envíos</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-1">
            <Label>Costo Base (MXN)</Label>
            <Input type="number" step="0.5" {...form.register('baseCost', { valueAsNumber: true })} />
          </div>
          <div className="space-y-1">
            <Label>Umbral Envío Gratis (MXN)</Label>
            <Input type="number" step="1" {...form.register('freeShippingThreshold', { valueAsNumber: true })} />
          </div>
        </div>
        <div className="space-y-3">
          <Label>Zonas</Label>
          <ul className="text-sm space-y-1">
            {form.watch('zones').map((z, i) => (
              <li key={i} className="flex justify-between border rounded px-3 py-1 bg-gray-50">
                <span>{z.name}</span>
                <span className="text-xs text-gray-500">x{z.multiplier}</span>
              </li>
            ))}
          </ul>
          <p className="text-xs text-gray-400">Futuro: editor dinámico + geocodificación.</p>
        </div>
        <div className="flex justify-end">
          <Button disabled={!form.formState.isDirty} onClick={form.handleSubmit(submit)}>Guardar Cambios</Button>
        </div>
      </CardContent>
    </Card>
  )
}
