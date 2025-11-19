import { prisma } from '../lib/prisma'

async function createTestApplication() {
  console.log('🚀 Creando solicitud de vendedor de prueba...\n')

  // Get the most recent user who is not already a vendor
  const user = await prisma.user.findFirst({
    where: {
      email: {
        not: {
          in: ['admin@regenmarket.com', 'demo@vendor.com']
        }
      }
    },
    orderBy: { createdAt: 'desc' }
  })

  if (!user) {
    console.log('❌ No se encontró ningún usuario para crear la solicitud')
    console.log('Creando un usuario de prueba...')

    const testUser = await prisma.user.create({
      data: {
        email: 'test-vendor@example.com',
        name: 'Test Vendor',
        role: 'USER',
        password: null // OAuth user
      }
    })

    console.log(`✅ Usuario de prueba creado: ${testUser.email}`)

    // Create application for test user
    const application = await prisma.vendorApplication.create({
      data: {
        userId: testUser.id,
        companyName: 'Test Company - Sustainable Solutions',
        businessType: 'Tecnología Sostenible',
        description: 'Una empresa de prueba dedicada a soluciones sostenibles',
        website: 'https://test-company.com',
        businessPhone: '+1 555-0123',
        businessAddress: 'Calle Test 123, Ciudad Test',
        taxId: 'TEST123456',
        status: 'PENDING',
        submittedAt: new Date(),
        documents: {
          certifications: ['ISO 14001', 'B-Corp'],
          sustainabilityMetrics: {
            carbonReduction: '100',
            waterSaving: '50000'
          }
        }
      }
    })

    console.log('\n✅ Solicitud de prueba creada exitosamente!')
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.log(`ID: ${application.id}`)
    console.log(`Empresa: ${application.companyName}`)
    console.log(`Usuario: ${testUser.email}`)
    console.log(`Estado: ${application.status}`)
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.log('\n📋 Ahora puedes:')
    console.log('1. Ir a /dashboard/admin/vendors')
    console.log('2. Ver la solicitud pendiente')
    console.log('3. Aprobar o rechazar la solicitud')

  } else {
    console.log(`📋 Usando usuario existente: ${user.email}\n`)

    // Check if user already has an application
    const existingApp = await prisma.vendorApplication.findFirst({
      where: {
        userId: user.id,
        status: {
          in: ['PENDING', 'IN_REVIEW']
        }
      }
    })

    if (existingApp) {
      console.log('⚠️  Este usuario ya tiene una solicitud pendiente/en revisión')
      console.log(`   Estado: ${existingApp.status}`)
      console.log(`   Empresa: ${existingApp.companyName}`)
      return
    }

    // Create new application
    const application = await prisma.vendorApplication.create({
      data: {
        userId: user.id,
        companyName: `${user.name || 'Usuario'} - Sustainable Business`,
        businessType: 'Tecnología Sostenible',
        description: 'Solicitud de prueba creada automáticamente',
        website: 'https://example.com',
        businessPhone: '+1 555-9999',
        businessAddress: 'Calle Prueba 456, Ciudad Demo',
        taxId: 'AUTO123456',
        status: 'PENDING',
        submittedAt: new Date(),
        documents: {
          certifications: ['Energy Star', 'Fair Trade'],
          sustainabilityMetrics: {
            carbonReduction: '75',
            renewableEnergy: '80'
          }
        }
      }
    })

    console.log('✅ Solicitud de prueba creada exitosamente!')
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.log(`ID: ${application.id}`)
    console.log(`Empresa: ${application.companyName}`)
    console.log(`Usuario: ${user.email}`)
    console.log(`Estado: ${application.status}`)
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.log('\n📋 Ahora puedes:')
    console.log('1. Iniciar sesión como admin@regenmarket.com')
    console.log('2. Ir a /dashboard/admin/vendors')
    console.log('3. Ver la solicitud pendiente')
    console.log('4. Aprobar o rechazar la solicitud')
  }

  await prisma.$disconnect()
}

createTestApplication().catch(console.error)
