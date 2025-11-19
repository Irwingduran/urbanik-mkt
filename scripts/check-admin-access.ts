import { prisma } from '../lib/prisma'

async function checkAdminAccess() {
  console.log('🔍 Verificando acceso de administrador...\n')

  // 1. Verificar usuarios con rol ADMIN en campo User.role
  const adminsOldSystem = await prisma.user.findMany({
    where: { role: 'ADMIN' },
    select: { id: true, email: true, name: true, role: true }
  })

  console.log('📋 Usuarios con role=ADMIN en tabla User (sistema antiguo):')
  console.log(adminsOldSystem.length > 0 ? adminsOldSystem : '  ❌ Ninguno encontrado')
  console.log('')

  // 2. Verificar usuarios con rol ADMIN en tabla UserRole
  const adminsNewSystem = await prisma.userRole.findMany({
    where: { role: 'ADMIN', active: true },
    include: { user: { select: { id: true, email: true, name: true, role: true } } }
  })

  console.log('📋 Usuarios con ADMIN en tabla UserRole (sistema nuevo):')
  console.log(adminsNewSystem.length > 0 ? adminsNewSystem : '  ❌ Ninguno encontrado')
  console.log('')

  // 3. Verificar aplicaciones de vendedores
  const vendorApplications = await prisma.vendorApplication.findMany({
    include: { user: { select: { email: true, name: true } } },
    orderBy: { createdAt: 'desc' },
    take: 5
  })

  console.log('📋 Solicitudes de vendedores (últimas 5):')
  if (vendorApplications.length > 0) {
    vendorApplications.forEach(app => {
      console.log(`  - ${app.companyName} (${app.user.email}) - Status: ${app.status}`)
    })
  } else {
    console.log('  ❌ No hay solicitudes de vendedores')
  }
  console.log('')

  // 4. Contar por estado
  const statusCounts = await prisma.$transaction([
    prisma.vendorApplication.count({ where: { status: 'PENDING' } }),
    prisma.vendorApplication.count({ where: { status: 'IN_REVIEW' } }),
    prisma.vendorApplication.count({ where: { status: 'APPROVED' } }),
    prisma.vendorApplication.count({ where: { status: 'REJECTED' } }),
  ])

  console.log('📊 Estadísticas de solicitudes:')
  console.log(`  - Pendientes: ${statusCounts[0]}`)
  console.log(`  - En Revisión: ${statusCounts[1]}`)
  console.log(`  - Aprobadas: ${statusCounts[2]}`)
  console.log(`  - Rechazadas: ${statusCounts[3]}`)
  console.log('')

  // 5. Todos los usuarios
  const allUsers = await prisma.user.findMany({
    select: { id: true, email: true, name: true, role: true },
    take: 10
  })

  console.log('📋 Todos los usuarios (primeros 10):')
  if (allUsers.length > 0) {
    allUsers.forEach(user => {
      console.log(`  - ${user.email} - Role: ${user.role}`)
    })
  } else {
    console.log('  ❌ No hay usuarios en la base de datos')
  }

  await prisma.$disconnect()
}

checkAdminAccess().catch(console.error)
