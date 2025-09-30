import UnderConstruction from '@/components/common/under-construction'

export default function ForgotPasswordPage() {
  return (
    <UnderConstruction
      title="Recuperar Contraseña"
      description="Estamos implementando un sistema seguro de recuperación de contraseñas para garantizar la seguridad de tu cuenta."
      expectedFeatures={[
        "Envío de email de recuperación",
        "Validación de tokens seguros",
        "Restablecimiento de contraseña",
        "Notificaciones de seguridad",
        "Verificación en dos pasos"
      ]}
      backLink="/auth/signin"
      backLabel="Volver al Login"
    />
  )
}