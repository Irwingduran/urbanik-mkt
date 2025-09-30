import UnderConstruction from '@/components/common/under-construction'

export default function ProductDetailPage() {
  return (
    <UnderConstruction
      title="Detalles del Producto"
      description="Estamos desarrollando una experiencia completa de visualización de productos con información detallada sobre sostenibilidad y características."
      expectedFeatures={[
        "Galería de imágenes HD",
        "Información detallada de sostenibilidad",
        "REGEN Score del producto",
        "Certificaciones y verificaciones",
        "Reviews y calificaciones",
        "Comparación con productos similares",
        "Calculadora de impacto ambiental"
      ]}
      backLink="/marketplace"
      backLabel="Volver al Marketplace"
    />
  )
}