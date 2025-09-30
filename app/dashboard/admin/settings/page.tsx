import UnderConstruction from '@/components/common/under-construction'

export default function AdminSettingsPage() {
  return (
    <UnderConstruction
      title="Configuración del Sistema"
      description="Panel de control para configurar todos los aspectos de la plataforma, desde parámetros globales hasta configuraciones avanzadas."
      expectedFeatures={[
        "Configuración de REGEN Score",
        "Parámetros de comisiones",
        "Configuración de pagos",
        "Gestión de categorías",
        "Configuración de envíos",
        "Políticas de la plataforma"
      ]}
      backLink="/dashboard/admin"
      backLabel="Volver al Admin Dashboard"
    />
  )
}