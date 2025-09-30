import UnderConstruction from '@/components/common/under-construction'

export default function NotificationsPage() {
  return (
    <UnderConstruction
      title="Centro de Notificaciones"
      description="Estamos desarrollando un centro completo de notificaciones donde podrás ver y gestionar todas tus alertas y actualizaciones."
      expectedFeatures={[
        "Historial completo de notificaciones",
        "Filtros por categoría",
        "Marcar como leído/no leído",
        "Configuración de preferencias",
        "Notificaciones en tiempo real",
        "Alertas de pedidos y pagos"
      ]}
      backLink="/dashboard"
      backLabel="Volver al Dashboard"
    />
  )
}