import UnderConstruction from '@/components/common/under-construction'

export default function SettingsPage() {
  return (
    <UnderConstruction
      title="Configuraciones"
      description="Estamos creando un centro de configuración completo donde podrás personalizar tu experiencia en la plataforma."
      expectedFeatures={[
        "Configuración de cuenta",
        "Preferencias de notificaciones",
        "Configuración de privacidad",
        "Métodos de pago",
        "Direcciones guardadas",
        "Configuración de sostenibilidad"
      ]}
      backLink="/dashboard"
      backLabel="Volver al Dashboard"
    />
  )
}