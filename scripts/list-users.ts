import { prisma } from '../lib/prisma'

// const prisma = new PrismaClient()

async function main() {
  console.log('📋 Usuarios registrados en la base de datos:\n')
  console.log('='.repeat(80))

  const users = await prisma.user.findMany({
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      createdAt: true,
      userRoles: {
        where: { active: true },
        select: { role: true }
      },
      vendor: {
        select: {
          companyName: true
        }
      }
    },
    orderBy: {
      createdAt: 'asc'
    }
  })

  if (users.length === 0) {
    console.log('❌ No hay usuarios registrados')
    return
  }

  users.forEach((user, index) => {
    console.log(`\n${index + 1}. ${user.name || 'Sin nombre'}`)
    console.log(`   Email: ${user.email}`)
    console.log(`   Rol Legacy: ${user.role}`)
    console.log(`   Roles Activos: ${user.userRoles.map(r => r.role).join(', ')}`)
    if (user.vendor) {
      console.log(`   Empresa: ${user.vendor.companyName}`)
    }
    console.log(`   Creado: ${user.createdAt.toLocaleDateString('es-MX')}`)
    console.log('-'.repeat(80))
  })

  console.log('\n📝 CREDENCIALES PARA LOGIN (Demo Accounts):')
  console.log('='.repeat(80))
  console.log('\n🛒 CLIENTE (Customer):')
  console.log('   Email: demo@customer.com')
  console.log('   Password: password123')

  console.log('\n🏪 VENDEDOR (Vendor):')
  console.log('   Email: demo@vendor.com')
  console.log('   Password: password123')

  console.log('\n👑 ADMINISTRADOR (Admin):')
  console.log('   Email: admin@regenmarket.com')
  console.log('   Password: admin123')

  console.log('\n' + '='.repeat(80))
  console.log('\n💡 Nota: Todas las contraseñas están hasheadas con bcrypt en la DB')
  console.log('   Las contraseñas mostradas arriba son las originales para login\n')
}

main()
  .catch((error) => {
    console.error('Error:', error)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
