import UnderConstruction from '@/components/common/under-construction'

export default function SellPage() {
  return (
    <UnderConstruction
      title="Vende con Nosotros"
      description="Estamos preparando una experiencia completa para que vendedores sostenibles puedan unirse fácilmente a nuestra plataforma."
      expectedFeatures={[
        "Información para nuevos vendedores",
        "Proceso de registro simplificado",
        "Beneficios de vender aquí",
        "Herramientas de marketing",
        "Soporte para vendedores",
        "Calculadora de comisiones"
      ]}
      backLink="/onboarding"
      backLabel="Comenzar Onboarding"
    />
  )
}