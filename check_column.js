/* eslint-disable @typescript-eslint/no-require-imports */
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  try {
    // Try to query the column directly to see if it throws
    const profile = await prisma.vendorProfile.findFirst({
      select: {
        id: true,
        isBanned: true
      }
    })
    console.log('Query successful. isBanned exists.')
    console.log('Profile sample:', profile)
  } catch (e) {
    console.error('Query failed:', e.message)
  } finally {
    await prisma.$disconnect()
  }
}

main()
