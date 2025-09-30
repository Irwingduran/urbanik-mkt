import UnderConstruction from '@/components/common/under-construction'

export default function BestSellersPage() {
  return (
    <UnderConstruction
      title="Más Vendidos"
      description="Estamos creando una sección especial que destaca los productos más populares con el mayor impacto positivo."
      expectedFeatures={[
        "Ranking de productos más vendidos",
        "Filtros por categoría",
        "Productos con mejor REGEN Score",
        "Trending sostenible",
        "Recomendaciones personalizadas",
        "Impacto ambiental acumulado"
      ]}
      backLink="/marketplace"
      backLabel="Volver al Marketplace"
    />
  )
}