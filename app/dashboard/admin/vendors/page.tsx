import UnderConstruction from '@/components/common/under-construction'

export default function AdminVendorsPage() {
  return (
    <UnderConstruction
      title="Gestión de Vendedores"
      description="Herramientas avanzadas para administrar vendedores, aprobar solicitudes y monitorear el rendimiento de las tiendas."
      expectedFeatures={[
        "Aprobación de nuevos vendedores",
        "Gestión de REGEN Score",
        "Monitoreo de performance",
        "Verificación de certificaciones",
        "Configuración de comisiones",
        "Herramientas de moderación"
      ]}
      backLink="/dashboard/admin"
      backLabel="Volver al Admin Dashboard"
    />
  )
}