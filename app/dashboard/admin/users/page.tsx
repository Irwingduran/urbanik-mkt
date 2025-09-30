import UnderConstruction from '@/components/common/under-construction'

export default function AdminUsersPage() {
  return (
    <UnderConstruction
      title="Gestión de Usuarios"
      description="Estamos desarrollando herramientas completas para administrar todos los usuarios de la plataforma con funciones avanzadas de moderación."
      expectedFeatures={[
        "Lista completa de usuarios",
        "Filtros y búsqueda avanzada",
        "Gestión de roles y permisos",
        "Suspender/activar cuentas",
        "Historial de actividades",
        "Métricas de engagement",
        "Herramientas de soporte"
      ]}
      backLink="/dashboard/admin"
      backLabel="Volver al Admin Dashboard"
    />
  )
}