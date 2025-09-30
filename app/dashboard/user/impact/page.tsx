import UnderConstruction from '@/components/common/under-construction'

export default function UserImpactPage() {
  return (
    <UnderConstruction
      title="Mi Impacto Ambiental"
      description="Estamos creando un dashboard completo para visualizar y rastrear tu impacto positivo en el medio ambiente a través de tus compras."
      expectedFeatures={[
        "Dashboard de impacto personal",
        "Métricas de CO2 reducido",
        "Agua y energía ahorrada",
        "Progreso hacia objetivos sostenibles",
        "Comparación con otros usuarios",
        "Certificados de impacto",
        "Timeline de acciones sostenibles"
      ]}
      backLink="/dashboard/user"
      backLabel="Volver al Dashboard"
    />
  )
}