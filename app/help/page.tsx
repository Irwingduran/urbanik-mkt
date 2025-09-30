import UnderConstruction from '@/components/common/under-construction'

export default function HelpPage() {
  return (
    <UnderConstruction
      title="Centro de Ayuda"
      description="Estamos creando un centro de ayuda completo para resolver todas tus dudas sobre nuestra plataforma de comercio sostenible."
      expectedFeatures={[
        "Preguntas frecuentes (FAQ)",
        "Guías para compradores",
        "Guías para vendedores",
        "Tutoriales de REGEN Score",
        "Soporte técnico",
        "Chat en vivo",
        "Base de conocimientos"
      ]}
      backLink="/"
      backLabel="Volver al Inicio"
    />
  )
}