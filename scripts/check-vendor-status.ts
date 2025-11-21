/**
 * Script de diagnóstico para verificar el estado de un usuario vendedor
 *
 * Uso: npx ts-node scripts/check-vendor-status.ts <email>
 */

import { prisma } from '../lib/prisma'

// const prisma = new PrismaClient()

async function checkVendorStatus(email: string) {
  try {
    console.log(`\n🔍 Verificando estado del usuario: ${email}\n`)

    // 1. Buscar usuario
    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        userRoles: true,
        vendorProfile: {
          include: {
            regenMarks: true,
            evaluations: true,
          }
        }
      }
    })

    if (!user) {
      console.log('❌ Usuario no encontrado')
      return
    }

    console.log('✅ Usuario encontrado:')
    console.log(`   ID: ${user.id}`)
    console.log(`   Nombre: ${user.name}`)
    console.log(`   Email: ${user.email}`)

    // 2. Verificar roles
    console.log(`\n👤 Roles del usuario:`)
    if (user.userRoles.length === 0) {
      console.log('   ⚠️  No tiene roles asignados')
    } else {
      user.userRoles.forEach(role => {
        console.log(`   - ${role.role} ${role.active ? '(activo)' : '(inactivo)'}`)
      })
    }

    // 3. Verificar perfil de vendedor
    console.log(`\n🏪 Perfil de Vendedor:`)
    if (!user.vendorProfile) {
      console.log('   ❌ No tiene perfil de vendedor creado')
      console.log('   💡 Solución: El usuario debe completar el proceso de onboarding en /onboarding')
      return
    }

    console.log('   ✅ Perfil de vendedor encontrado:')
    console.log(`   ID: ${user.vendorProfile.id}`)
    console.log(`   Empresa: ${user.vendorProfile.companyName}`)
    console.log(`   Estado de onboarding: ${user.vendorProfile.onboardingStatus}`)
    console.log(`   Estado de verificación: ${user.vendorProfile.verificationStatus}`)
    console.log(`   NFT Level: ${user.vendorProfile.nftLevel}`)
    console.log(`   REGEN Score: ${user.vendorProfile.regenScore}`)
    console.log(`   Comisión: ${user.vendorProfile.commissionRate}%`)

    // 4. Verificar RegenMarks
    console.log(`\n🌿 RegenMarks:`)
    if (user.vendorProfile.regenMarks.length === 0) {
      console.log('   📭 No tiene RegenMarks activos')
    } else {
      console.log(`   📊 Total: ${user.vendorProfile.regenMarks.length}`)
      user.vendorProfile.regenMarks.forEach(mark => {
        console.log(`   - ${mark.type}: Score ${mark.score}, Estado: ${mark.status}`)
      })
    }

    // 5. Verificar Evaluaciones
    console.log(`\n📋 Evaluaciones:`)
    if (user.vendorProfile.evaluations.length === 0) {
      console.log('   📭 No tiene evaluaciones pendientes')
    } else {
      console.log(`   📊 Total: ${user.vendorProfile.evaluations.length}`)
      user.vendorProfile.evaluations.forEach(evaluation => {
        console.log(`   - ${evaluation.type}: ${evaluation.status}, Etapa: ${evaluation.stage}`)
      })
    }

    console.log('\n✅ Diagnóstico completado\n')

  } catch (error) {
    console.error('\n❌ Error durante el diagnóstico:', error)
  } finally {
    await prisma.$disconnect()
  }
}

// Obtener email del argumento
const email = process.argv[2]

if (!email) {
  console.log('❌ Por favor proporciona un email')
  console.log('Uso: npx ts-node scripts/check-vendor-status.ts <email>')
  process.exit(1)
}

checkVendorStatus(email)
