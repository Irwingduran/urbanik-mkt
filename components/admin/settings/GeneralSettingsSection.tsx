"use client"
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import type { GeneralSettings } from './types'

const schema = z.object({
  maintenanceMode: z.boolean(),
  vendorApplicationsEnabled: z.boolean(),
  promotionsEnabled: z.boolean()
})

interface Props {
  value: GeneralSettings
  onSave: (data: GeneralSettings) => Promise<void> | void
}

export default function GeneralSettingsSection({ value, onSave }: Props) {
  const form = useForm<GeneralSettings>({
    resolver: zodResolver(schema),
    defaultValues: value
  })

  useEffect(() => {
    form.reset(value)
  }, [value])

  const submit = async (data: GeneralSettings) => {
    try {
      await onSave(data)
      toast.success('Configuración general guardada')
    } catch (e: any) {
      toast.error(e.message || 'Error al guardar')
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>General</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <Label className="font-medium">Modo Mantenimiento</Label>
            <p className="text-xs text-gray-500">Bloquea acceso público y muestra aviso.</p>
          </div>
          <Switch checked={form.watch('maintenanceMode')} onCheckedChange={(v) => form.setValue('maintenanceMode', v, { shouldDirty: true })} />
        </div>
        <div className="flex items-center justify-between">
          <div>
            <Label className="font-medium">Solicitudes Vendedor</Label>
            <p className="text-xs text-gray-500">Permite nuevas aplicaciones de vendedores.</p>
          </div>
          <Switch checked={form.watch('vendorApplicationsEnabled')} onCheckedChange={(v) => form.setValue('vendorApplicationsEnabled', v, { shouldDirty: true })} />
        </div>
        <div className="flex items-center justify-between">
          <div>
            <Label className="font-medium">Promociones</Label>
            <p className="text-xs text-gray-500">Activa módulos de descuentos y cupones.</p>
          </div>
          <Switch checked={form.watch('promotionsEnabled')} onCheckedChange={(v) => form.setValue('promotionsEnabled', v, { shouldDirty: true })} />
        </div>
        <div className="flex justify-end">
          <Button disabled={!form.formState.isDirty} onClick={form.handleSubmit(submit)}>
            Guardar Cambios
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
