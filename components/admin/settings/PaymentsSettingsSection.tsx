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
import type { PaymentSettings } from './types'
import { Badge } from '@/components/ui/badge'

const schema = z.object({
  stripeConnected: z.boolean(),
  payoutScheduleDays: z.number().min(1).max(30),
  allowManualPayout: z.boolean()
})

interface Props {
  value: PaymentSettings
  onSave: (data: PaymentSettings) => Promise<void> | void
}

export default function PaymentsSettingsSection({ value, onSave }: Props) {
  const form = useForm<PaymentSettings>({
    resolver: zodResolver(schema),
    defaultValues: value
  })

  const submit = async (data: PaymentSettings) => {
    try {
      await onSave(data)
      toast.success('Configuración de pagos guardada')
    } catch (e) {
      const message = e instanceof Error ? e.message : 'Error al guardar'
      toast.error(message)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Pagos</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between border rounded p-3">
          <div>
            <Label>Stripe Conectado</Label>
            <p className="text-xs text-gray-500">Estado de la integración principal.</p>
          </div>
          <Switch checked={form.watch('stripeConnected')} onCheckedChange={v => form.setValue('stripeConnected', v, { shouldDirty: true })} />
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-1">
            <Label>Días para Payout</Label>
            <Input type="number" {...form.register('payoutScheduleDays', { valueAsNumber: true })} />
            <p className="text-xs text-gray-500">Periodicidad distribución ingresos.</p>
          </div>
          <div className="flex items-center justify-between border rounded p-3">
            <div>
              <Label>Payout Manual</Label>
              <p className="text-xs text-gray-500">Permite solicitar pago adelantado.</p>
            </div>
            <Switch checked={form.watch('allowManualPayout')} onCheckedChange={v => form.setValue('allowManualPayout', v, { shouldDirty: true })} />
          </div>
        </div>
        <div className="rounded border p-4 bg-gray-50 space-y-2">
          <p className="text-xs text-gray-600">Gateways conectados:</p>
          <div className="flex flex-wrap gap-2">
            <Badge className={form.watch('stripeConnected') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}>Stripe</Badge>
            <Badge className="bg-gray-100 text-gray-600">(Próximamente) PayPal</Badge>
            <Badge className="bg-gray-100 text-gray-600">(Próximamente) OpenPay</Badge>
          </div>
          <p className="text-xs text-gray-400">Futuro: health-check dinámico.</p>
        </div>
        <div className="flex justify-end">
          <Button disabled={!form.formState.isDirty} onClick={form.handleSubmit(submit)}>Guardar Cambios</Button>
        </div>
      </CardContent>
    </Card>
  )
}
