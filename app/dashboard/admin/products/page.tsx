import UnderConstruction from '@/components/common/under-construction'

export default function AdminProductsPage() {
  return (
    <UnderConstruction
      title="Gestión de Productos"
      description="Sistema completo para moderar, aprobar y gestionar todos los productos de la plataforma con herramientas de calidad."
      expectedFeatures={[
        "Moderación de productos",
        "Verificación de sostenibilidad",
        "Gestión de categorías",
        "Control de calidad",
        "Reportes de productos",
        "Herramientas de búsqueda avanzada"
      ]}
      backLink="/dashboard/admin"
      backLabel="Volver al Admin Dashboard"
    />
  )
}