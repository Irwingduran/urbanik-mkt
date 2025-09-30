import UnderConstruction from '@/components/common/under-construction'

export default function VendorsPage() {
  return (
    <UnderConstruction
      title="Directorio de Vendedores"
      description="Estamos desarrollando un directorio completo de vendedores sostenibles con perfiles detallados y métricas de impacto."
      expectedFeatures={[
        "Perfiles completos de vendedores",
        "REGEN Score de cada tienda",
        "Certificaciones verificadas",
        "Impacto ambiental por vendedor",
        "Reviews y calificaciones",
        "Búsqueda y filtros avanzados"
      ]}
      backLink="/marketplace"
      backLabel="Volver al Marketplace"
    />
  )
}