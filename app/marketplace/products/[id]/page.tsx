import UnderConstruction from '@/components/common/under-construction'

export default function MarketplaceProductDetailPage() {
  return (
    <UnderConstruction
      title="Producto en Marketplace"
      description="Estamos creando una vista de producto integrada al marketplace con funciones avanzadas de compra y comparación."
      expectedFeatures={[
        "Vista detallada integrada al marketplace",
        "Comparación con productos relacionados",
        "Recomendaciones personalizadas",
        "Agregar a wishlist",
        "Compartir en redes sociales",
        "Vista de vendedor integrada",
        "Sistema de preguntas y respuestas"
      ]}
      backLink="/marketplace"
      backLabel="Volver al Marketplace"
    />
  )
}