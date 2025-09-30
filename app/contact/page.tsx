import UnderConstruction from '@/components/common/under-construction'

export default function ContactPage() {
  return (
    <UnderConstruction
      title="Contacto"
      description="Estamos preparando múltiples canales de contacto para que puedas comunicarte fácilmente con nuestro equipo."
      expectedFeatures={[
        "Formulario de contacto",
        "Soporte por email",
        "Chat en tiempo real",
        "Soporte telefónico",
        "Redes sociales oficiales",
        "Ubicación de oficinas"
      ]}
      backLink="/"
      backLabel="Volver al Inicio"
    />
  )
}