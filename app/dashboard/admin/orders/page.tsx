import UnderConstruction from '@/components/common/under-construction'

export default function AdminOrdersPage() {
  return (
    <UnderConstruction
      title="Gestión de Órdenes"
      description="Vista administrativa completa para monitorear y gestionar todas las órdenes de la plataforma con herramientas de análisis."
      expectedFeatures={[
        "Vista general de todas las órdenes",
        "Resolución de disputas",
        "Monitoreo de pagos",
        "Gestión de reembolsos",
        "Analytics de órdenes",
        "Herramientas de soporte"
      ]}
      backLink="/dashboard/admin"
      backLabel="Volver al Admin Dashboard"
    />
  )
}