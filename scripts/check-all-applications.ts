import { prisma } from '../lib/prisma'

async function checkAllApplications() {
  console.log('🔍 Verificando TODAS las solicitudes de vendedores...\n')

  // Get ALL applications
  const allApplications = await prisma.vendorApplication.findMany({
    include: {
      user: {
        select: { id: true, email: true, name: true, role: true }
      }
    },
    orderBy: { createdAt: 'desc' }
  })

  console.log(`📋 Total de solicitudes encontradas: ${allApplications.length}\n`)

  if (allApplications.length > 0) {
    allApplications.forEach((app, index) => {
      console.log(`\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`)
      console.log(`Solicitud #${index + 1}`)
      console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`)
      console.log(`ID: ${app.id}`)
      console.log(`Empresa: ${app.companyName}`)
      console.log(`Estado: ${app.status}`)
      console.log(`Tipo de negocio: ${app.businessType}`)
      console.log(`Usuario ID: ${app.userId}`)
      console.log(`Email del usuario: ${app.user.email}`)
      console.log(`Nombre del usuario: ${app.user.name || 'N/A'}`)
      console.log(`Role del usuario: ${app.user.role}`)
      console.log(`Creada: ${app.createdAt.toLocaleString('es-MX')}`)
      console.log(`Enviada: ${app.submittedAt ? app.submittedAt.toLocaleString('es-MX') : 'No enviada aún'}`)
      console.log(`Revisada: ${app.reviewedAt ? app.reviewedAt.toLocaleString('es-MX') : 'No revisada'}`)
      if (app.rejectionReason) {
        console.log(`❌ Razón rechazo: ${app.rejectionReason}`)
      }
    })
  } else {
    console.log('❌ No se encontraron solicitudes en la base de datos')
  }

  console.log('\n\n📊 Resumen por estado:')
  const byStatus = allApplications.reduce((acc, app) => {
    acc[app.status] = (acc[app.status] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  Object.entries(byStatus).forEach(([status, count]) => {
    console.log(`  ${status}: ${count}`)
  })

  // Check latest users
  console.log('\n\n📋 Últimos 5 usuarios creados:')
  const recentUsers = await prisma.user.findMany({
    orderBy: { createdAt: 'desc' },
    take: 5,
    select: {
      email: true,
      name: true,
      role: true,
      createdAt: true
    }
  })

  recentUsers.forEach((user, index) => {
    console.log(`  ${index + 1}. ${user.email} - Role: ${user.role} - Creado: ${user.createdAt.toLocaleString('es-MX')}`)
  })

  await prisma.$disconnect()
}

checkAllApplications().catch(console.error)
