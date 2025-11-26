"use client"
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import type { RegenScoreSettings } from './types'

const schema = z.object({
  weightCarbon: z.number().min(0).max(1),
  weightWater: z.number().min(0).max(1),
  weightEnergy: z.number().min(0).max(1),
  weightWaste: z.number().min(0).max(1),
  thresholdBronze: z.number().min(0).max(100),
  thresholdSilver: z.number().min(0).max(100),
  thresholdGold: z.number().min(0).max(100),
  thresholdPlatinum: z.number().min(0).max(100)
}).refine(v => (v.weightCarbon + v.weightWater + v.weightEnergy + v.weightWaste) === 1, {
  message: 'La suma de los pesos debe ser 1.0'
})

interface Props {
  value: RegenScoreSettings
  onSave: (data: RegenScoreSettings) => Promise<void> | void
}

export default function RegenScoreSettingsSection({ value, onSave }: Props) {
  const form = useForm<RegenScoreSettings>({
    resolver: zodResolver(schema),
    defaultValues: value,
    mode: 'onChange'
  })

  useEffect(() => { form.reset(value) }, [value])

  const submit = async (data: RegenScoreSettings) => {
    try {
      await onSave(data)
      toast.success('Configuración de REGEN Score guardada')
    } catch (e) {
      const message = e instanceof Error ? e.message : 'Error al guardar'
      toast.error(message)
    }
  }

  const numberField = (name: keyof RegenScoreSettings, label: string, step = '0.01') => (
    <div className="space-y-1">
      <Label className="text-xs uppercase tracking-wide">{label}</Label>
      <Input type="number" step={step} {...form.register(name, { valueAsNumber: true })} />
    </div>
  )

  return (
    <Card>
      <CardHeader>
        <CardTitle>REGEN Score</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {numberField('weightCarbon', 'Peso Carbono')}
          {numberField('weightWater', 'Peso Agua')}
          {numberField('weightEnergy', 'Peso Energía')}
          {numberField('weightWaste', 'Peso Residuos')}
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {numberField('thresholdBronze', 'Bronze', '1')}
          {numberField('thresholdSilver', 'Silver', '1')}
          {numberField('thresholdGold', 'Gold', '1')}
          {numberField('thresholdPlatinum', 'Platinum', '1')}
        </div>
        {form.formState.errors.root?.message && (
          <p className="text-sm text-red-600">{form.formState.errors.root.message}</p>
        )}
        <div className="flex justify-end">
          <Button disabled={!form.formState.isDirty || !!form.formState.errors.root} onClick={form.handleSubmit(submit)}>
            Guardar Cambios
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
