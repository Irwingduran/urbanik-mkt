import UnderConstruction from '@/components/common/under-construction'

export default function CategoriesPage() {
  return (
    <UnderConstruction
      title="Explorar Categorías"
      description="Estamos creando una experiencia completa de navegación por categorías con filtros avanzados y recomendaciones personalizadas."
      expectedFeatures={[
        "Navegación visual por categorías",
        "Subcategorías detalladas",
        "Filtros de sostenibilidad",
        "Productos destacados por categoría",
        "Comparación de REGEN Score",
        "Recomendaciones personalizadas"
      ]}
      backLink="/marketplace"
      backLabel="Volver al Marketplace"
    />
  )
}