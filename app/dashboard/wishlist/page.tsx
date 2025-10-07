import UnderConstruction from '@/components/common/under-construction'
import { DashboardLayout, DashboardHeader } from "@/components/shared/layout/DashboardLayout"

export default function UserWishlistPage() {
  return (
    <DashboardLayout>
      <DashboardHeader
        title="Lista de Deseos"
        subtitle="Productos que te interesan"
        breadcrumbs={[
          { label: 'Dashboard', href: '/dashboard' },
          { label: 'Lista de Deseos' }
        ]}
      />
      <div className="p-6 space-y-6">
        <UnderConstruction
          title="Mi Lista de Deseos"
          description="Estamos desarrollando una funcionalidad completa de wishlist donde podrás guardar y gestionar tus productos favoritos."
          expectedFeatures={[
            "Guardar productos favoritos",
            "Organizar en listas personalizadas",
            "Alertas de precio",
            "Notificaciones de disponibilidad",
            "Compartir listas con amigos",
            "Análisis de impacto ambiental de tu wishlist"
          ]}
          backLink="/dashboard/user"
          backLabel="Volver al Dashboard"
        />
      </div>
    </DashboardLayout>
  )
}