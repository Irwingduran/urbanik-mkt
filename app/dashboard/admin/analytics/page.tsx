import UnderConstruction from '@/components/common/under-construction'

export default function AdminAnalyticsPage() {
  return (
    <UnderConstruction
      title="Analytics Administrativos"
      description="Dashboard ejecutivo con métricas avanzadas y análisis profundo del rendimiento de toda la plataforma."
      expectedFeatures={[
        "Métricas de crecimiento de usuarios",
        "Analytics de ventas globales",
        "Impacto ambiental de la plataforma",
        "Performance de vendedores",
        "Análisis de comportamiento",
        "Reportes financieros ejecutivos"
      ]}
      backLink="/dashboard/admin"
      backLabel="Volver al Admin Dashboard"
    />
  )
}