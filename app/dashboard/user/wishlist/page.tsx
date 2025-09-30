import UnderConstruction from '@/components/common/under-construction'

export default function UserWishlistPage() {
  return (
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
  )
}