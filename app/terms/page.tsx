import UnderConstruction from '@/components/common/under-construction'

export default function TermsPage() {
  return (
    <UnderConstruction
      title="Términos y Condiciones"
      description="Estamos redactando nuestros términos y condiciones para garantizar transparencia total en nuestra plataforma de comercio sostenible."
      expectedFeatures={[
        "Condiciones de uso de la plataforma",
        "Políticas para vendedores",
        "Políticas para compradores",
        "Términos de sostenibilidad",
        "Regulaciones de REGEN Score",
        "Política de devoluciones"
      ]}
      backLink="/"
      backLabel="Volver al Inicio"
    />
  )
}