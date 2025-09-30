import UnderConstruction from '@/components/common/under-construction'

export default function ProfilePage() {
  return (
    <UnderConstruction
      title="Mi Perfil"
      description="Estamos desarrollando una experiencia completa de gestión de perfil que centralizará toda tu información personal y preferencias."
      expectedFeatures={[
        "Información personal",
        "Preferencias de sostenibilidad",
        "Historial de impacto ambiental",
        "Configuración de privacidad",
        "Gestión de notificaciones",
        "Integración con REGEN Score"
      ]}
      backLink="/dashboard"
      backLabel="Volver al Dashboard"
    />
  )
}