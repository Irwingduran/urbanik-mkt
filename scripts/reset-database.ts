import { prisma } from '../lib/prisma'
import readline from 'readline'

// const prisma = new PrismaClient()

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

function question(query: string): Promise<string> {
  return new Promise(resolve => rl.question(query, resolve))
}

async function main() {
  console.log('🗑️  RESET DE BASE DE DATOS\n')
  console.log('⚠️  ADVERTENCIA: Esta operación eliminará TODOS los datos de clientes!')
  console.log('    - Usuarios (excepto admin)')
  console.log('    - Perfiles de usuario')
  console.log('    - Perfiles de cliente')
  console.log('    - Vendedores y sus perfiles')
  console.log('    - Productos')
  console.log('    - Órdenes')
  console.log('    - Carritos')
  console.log('    - Wishlist')
  console.log('    - Reviews')
  console.log('    - Notificaciones')
  console.log('    - Aplicaciones de vendedor')
  console.log('')

  const answer = await question('¿Estás seguro de continuar? (escribe "SI" para confirmar): ')

  if (answer.toUpperCase() !== 'SI') {
    console.log('\n❌ Operación cancelada')
    rl.close()
    return
  }

  console.log('\n🔄 Iniciando limpieza de base de datos...\n')

  try {
    // Get admin user to preserve
    const adminUser = await prisma.user.findUnique({
      where: { email: 'admin@regenmarket.com' }
    })

    if (!adminUser) {
      console.log('⚠️  No se encontró usuario admin, se eliminarán TODOS los usuarios')
    } else {
      console.log(`✓ Usuario admin encontrado: ${adminUser.email} (se preservará)`)
    }

    // Delete in order of dependencies
    console.log('\n📊 Eliminando datos...\n')

    // 1. Delete order items first
    const orderItems = await prisma.orderItem.deleteMany({})
    console.log(`✓ OrderItems eliminados: ${orderItems.count}`)

    // 2. Delete orders
    const orders = await prisma.order.deleteMany({})
    console.log(`✓ Orders eliminadas: ${orders.count}`)

    // 3. Delete reviews
    const reviews = await prisma.review.deleteMany({})
    console.log(`✓ Reviews eliminadas: ${reviews.count}`)

    // 4. Delete wishlist items
    const wishlistItems = await prisma.wishlistItem.deleteMany({})
    console.log(`✓ WishlistItems eliminados: ${wishlistItems.count}`)

    // 5. Delete cart items
    const cartItems = await prisma.cartItem.deleteMany({})
    console.log(`✓ CartItems eliminados: ${cartItems.count}`)

    // 6. Delete notifications
    const notifications = await prisma.notification.deleteMany({})
    console.log(`✓ Notifications eliminadas: ${notifications.count}`)

    // 7. Delete products
    const products = await prisma.product.deleteMany({})
    console.log(`✓ Products eliminados: ${products.count}`)

    // 8. Delete vendors
    const vendors = await prisma.vendor.deleteMany({})
    console.log(`✓ Vendors (legacy) eliminados: ${vendors.count}`)

    // 9. Delete vendor profiles
    const vendorProfiles = await prisma.vendorProfile.deleteMany({})
    console.log(`✓ VendorProfiles eliminados: ${vendorProfiles.count}`)

    // 10. Delete vendor applications
    const vendorApplications = await prisma.vendorApplication.deleteMany({})
    console.log(`✓ VendorApplications eliminadas: ${vendorApplications.count}`)

    // 11. Delete customer profiles
    const customerProfiles = await prisma.customerProfile.deleteMany({
      where: adminUser ? {
        userId: { not: adminUser.id }
      } : {}
    })
    console.log(`✓ CustomerProfiles eliminados: ${customerProfiles.count}`)

    // 12. Delete user roles (except admin)
    const userRoles = await prisma.userRole.deleteMany({
      where: adminUser ? {
        userId: { not: adminUser.id }
      } : {}
    })
    console.log(`✓ UserRoles eliminados: ${userRoles.count}`)

    // 13. Delete payment methods
    const paymentMethods = await prisma.paymentMethod.deleteMany({
      where: adminUser ? {
        userId: { not: adminUser.id }
      } : {}
    })
    console.log(`✓ PaymentMethods eliminados: ${paymentMethods.count}`)

    // 14. Delete addresses
    const addresses = await prisma.address.deleteMany({
      where: adminUser ? {
        userId: { not: adminUser.id }
      } : {}
    })
    console.log(`✓ Addresses eliminadas: ${addresses.count}`)

    // 15. Delete user profiles
    const userProfiles = await prisma.userProfile.deleteMany({
      where: adminUser ? {
        userId: { not: adminUser.id }
      } : {}
    })
    console.log(`✓ UserProfiles eliminados: ${userProfiles.count}`)

    // 16. Delete NextAuth sessions
    const sessions = await prisma.session.deleteMany({
      where: adminUser ? {
        userId: { not: adminUser.id }
      } : {}
    })
    console.log(`✓ Sessions eliminadas: ${sessions.count}`)

    // 17. Delete NextAuth accounts
    const accounts = await prisma.account.deleteMany({
      where: adminUser ? {
        userId: { not: adminUser.id }
      } : {}
    })
    console.log(`✓ Accounts eliminadas: ${accounts.count}`)

    // 18. Delete users (except admin)
    const users = await prisma.user.deleteMany({
      where: adminUser ? {
        id: { not: adminUser.id }
      } : {}
    })
    console.log(`✓ Users eliminados: ${users.count}`)

    // Summary
    console.log('\n' + '='.repeat(70))
    console.log('✅ LIMPIEZA COMPLETADA EXITOSAMENTE')
    console.log('='.repeat(70))

    if (adminUser) {
      console.log(`\n👤 Usuario preservado:`)
      console.log(`   Email: ${adminUser.email}`)
      console.log(`   Rol: ADMIN`)
      console.log(`   Password: admin123`)
    }

    console.log('\n📝 Estado de la base de datos:')
    console.log('   - Todas las tablas han sido limpiadas')
    console.log('   - Las estructuras de tablas permanecen intactas')
    console.log('   - El usuario admin ha sido preservado')
    console.log('   - Puedes empezar a registrar nuevos usuarios\n')

  } catch (error) {
    console.error('\n❌ Error durante la limpieza:', error)
    throw error
  } finally {
    await prisma.$disconnect()
    rl.close()
  }
}

main()
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
