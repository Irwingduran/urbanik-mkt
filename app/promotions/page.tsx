import UnderConstruction from '@/components/common/under-construction'

export default function PromotionsPage() {
  return (
    <UnderConstruction
      title="Promociones Sostenibles"
      description="Estamos preparando promociones especiales que impulsan productos sostenibles con descuentos y ofertas exclusivas."
      expectedFeatures={[
        "Ofertas en productos sostenibles",
        "Descuentos por impacto ambiental",
        "Promociones por REGEN Score",
        "Cupones ecológicos",
        "Ofertas flash verdes",
        "Descuentos por volumen sostenible"
      ]}
      backLink="/marketplace"
      backLabel="Volver al Marketplace"
    />
  )
}