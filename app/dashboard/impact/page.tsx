import UnderConstruction from '@/components/common/under-construction'
import { DashboardLayout, DashboardHeader } from "@/components/shared/layout/DashboardLayout"

export default function UserImpactPage() {
  return (
    <DashboardLayout>
      <DashboardHeader
        title="Mi Impacto Ambiental"
        subtitle="Seguimiento de tu contribución sostenible"
        breadcrumbs={[
          { label: 'Dashboard', href: '/dashboard' },
          { label: 'Mi Impacto Ambiental' }
        ]}
      />
      <div className="p-6 space-y-6">
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
      </div>
    </DashboardLayout>
  )
}