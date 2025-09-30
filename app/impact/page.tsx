import UnderConstruction from '@/components/common/under-construction'

export default function ImpactPage() {
  return (
    <UnderConstruction
      title="Nuestro Impacto Ambiental"
      description="Estamos creando un dashboard transparente que muestra el impacto positivo real de nuestra comunidad en el planeta."
      expectedFeatures={[
        "Impacto global de la plataforma",
        "CO2 reducido por la comunidad",
        "Agua y energía ahorrada",
        "Árboles plantados",
        "Certificados de impacto",
        "Metas globales de sostenibilidad"
      ]}
      backLink="/"
      backLabel="Volver al Inicio"
    />
  )
}