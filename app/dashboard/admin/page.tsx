import UnderConstruction from '@/components/common/under-construction'

export default function AdminDashboardPage() {
  return (
    <UnderConstruction
      title="Panel de Administración"
      description="Estamos desarrollando un sistema completo de administración para gestionar toda la plataforma con herramientas avanzadas de control y análisis."
      expectedFeatures={[
        "Dashboard ejecutivo con métricas clave",
        "Gestión de usuarios y vendedores",
        "Control de productos y categorías",
        "Analytics de toda la plataforma",
        "Configuración del sistema",
        "Herramientas de moderación",
        "Reportes financieros avanzados"
      ]}
      backLink="/dashboard"
      backLabel="Volver al Dashboard"
    />
  )
}