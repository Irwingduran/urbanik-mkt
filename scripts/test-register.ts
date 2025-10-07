import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function testRegistration() {
  console.log('🧪 Testing Registration Flow\n')

  const testUser = {
    name: 'Test User',
    email: 'test@example.com',
    password: 'password123'
  }

  console.log('1️⃣ Verificando que el usuario no existe...')
  const existing = await prisma.user.findUnique({
    where: { email: testUser.email }
  })

  if (existing) {
    console.log('   ⚠️  Usuario ya existe, eliminando...')
    await prisma.user.delete({ where: { email: testUser.email } })
  }
  console.log('   ✅ Usuario no existe\n')

  console.log('2️⃣ Hasheando password...')
  const hashedPassword = await bcrypt.hash(testUser.password, 10)
  console.log('   ✅ Password hasheado\n')

  try {
    console.log('3️⃣ Creando usuario en transacción...')

    const newUser = await prisma.$transaction(async (tx) => {
      // 1. Create user
      console.log('   → Creando User...')
      const user = await tx.user.create({
        data: {
          name: testUser.name,
          email: testUser.email,
          password: hashedPassword,
          role: 'USER', // Legacy compatibility
        }
      })
      console.log('   ✅ User creado:', user.id)

      // 2. Assign CUSTOMER role
      console.log('   → Creando UserRole...')
      await tx.userRole.create({
        data: {
          userId: user.id,
          role: 'CUSTOMER',
          active: true,
        }
      })
      console.log('   ✅ UserRole creado')

      // 3. Create UserProfile (legacy)
      console.log('   → Creando UserProfile...')
      await tx.userProfile.create({
        data: {
          userId: user.id,
          firstName: testUser.name.split(' ')[0] || '',
          lastName: testUser.name.split(' ').slice(1).join(' ') || '',
        }
      })
      console.log('   ✅ UserProfile creado')

      // 4. Create CustomerProfile
      console.log('   → Creando CustomerProfile...')
      await tx.customerProfile.create({
        data: {
          userId: user.id,
          loyaltyTier: 'BRONZE',
          rewardPoints: 0,
        }
      })
      console.log('   ✅ CustomerProfile creado')

      return user
    })

    console.log('\n✅ REGISTRO EXITOSO!')
    console.log('='.repeat(70))
    console.log('Usuario creado:', {
      id: newUser.id,
      email: newUser.email,
      name: newUser.name,
    })

    // Verify data
    console.log('\n4️⃣ Verificando datos creados...')
    const verification = await prisma.user.findUnique({
      where: { id: newUser.id },
      include: {
        userRoles: true,
        profile: true,
        customerProfile: true,
      }
    })

    console.log('\n📊 Datos verificados:')
    console.log('   User:', verification?.email)
    console.log('   UserRoles:', verification?.userRoles.map(r => r.role))
    console.log('   UserProfile:', verification?.profile ? 'Existe' : 'NO EXISTE')
    console.log('   CustomerProfile:', verification?.customerProfile ? 'Existe' : 'NO EXISTE')

    // Cleanup
    console.log('\n🧹 Limpiando usuario de prueba...')
    await prisma.user.delete({ where: { id: newUser.id } })
    console.log('   ✅ Usuario eliminado\n')

  } catch (error) {
    console.error('\n❌ ERROR EN REGISTRO:')
    console.error(error)
    throw error
  }
}

testRegistration()
  .catch((error) => {
    console.error('Test failed:', error)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
