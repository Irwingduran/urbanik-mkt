"use client"
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import type { PoliciesSettings } from './types'

const schema = z.object({
  terms: z.string(),
  privacy: z.string(),
  sustainabilityCommitment: z.string()
})

interface Props {
  value: PoliciesSettings
  onSave: (data: PoliciesSettings) => Promise<void> | void
}

export default function PoliciesSettingsSection({ value, onSave }: Props) {
  const form = useForm<PoliciesSettings>({
    resolver: zodResolver(schema),
    defaultValues: value
  })

  const submit = async (data: PoliciesSettings) => {
    try {
      await onSave(data)
      toast.success('Políticas guardadas')
    } catch (e) {
      const message = e instanceof Error ? e.message : 'Error al guardar'
      toast.error(message)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Políticas</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-1">
          <Label>Términos de Servicio</Label>
          <Textarea rows={4} {...form.register('terms')} placeholder="Términos..." />
        </div>
        <div className="space-y-1">
          <Label>Política de Privacidad</Label>
          <Textarea rows={4} {...form.register('privacy')} placeholder="Privacidad..." />
        </div>
        <div className="space-y-1">
          <Label>Compromiso de Sostenibilidad</Label>
          <Textarea rows={4} {...form.register('sustainabilityCommitment')} placeholder="Nuestro compromiso..." />
        </div>
        <div className="flex justify-end">
          <Button disabled={!form.formState.isDirty} onClick={form.handleSubmit(submit)}>Guardar Cambios</Button>
        </div>
        <p className="text-[11px] text-gray-400">Futuro: editor enriquecido (markdown / wysiwyg) y versionado.</p>
      </CardContent>
    </Card>
  )
}
