/**
 * Data Migration Script: Single Role → Multi-Role System
 *
 * This script migrates existing users from the old single-role system
 * to the new multi-role system with separate customer/vendor profiles.
 *
 * Run this AFTER the schema migration:
 * npx ts-node prisma/migrations/data-migration-multi-role.ts
 */

import { PrismaClient, Role } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🚀 Starting data migration to multi-role system...\n')

  try {
    // Get all existing users
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        profile: true,
        vendor: true,
      }
    })

    console.log(`📊 Found ${users.length} users to migrate\n`)

    let customerCount = 0
    let vendorCount = 0
    let adminCount = 0
    let errors = 0

    for (const user of users) {
      try {
        console.log(`Processing user: ${user.email} (${user.role})...`)

        // Map old USER role to new CUSTOMER role
        const newRole = user.role === 'USER' ? 'CUSTOMER' : user.role

        // Check if UserRole already exists
        const existingUserRole = await prisma.userRole.findUnique({
          where: {
            userId_role: {
              userId: user.id,
              role: newRole as Role
            }
          }
        })

        // Create UserRole if it doesn't exist
        if (!existingUserRole) {
          await prisma.userRole.create({
            data: {
              userId: user.id,
              role: newRole as Role,
              active: true,
              grantedAt: new Date(),
            }
          })
          console.log(`  ✓ Created UserRole: ${newRole}`)
        } else {
          console.log(`  → UserRole already exists: ${newRole}`)
        }

        // Create CustomerProfile for all users
        const existingCustomerProfile = await prisma.customerProfile.findUnique({
          where: { userId: user.id }
        })

        if (!existingCustomerProfile) {
          await prisma.customerProfile.create({
            data: {
              userId: user.id,
              favoriteCategories: user.profile?.preferredCategories || [],
              sustainabilityInterests: user.profile?.sustainabilityFocus || [],
              priceRange: user.profile?.priceRange,
              loyaltyTier: 'BRONZE',
              rewardPoints: user.profile?.loyaltyPoints || 0,
            }
          })
          console.log(`  ✓ Created CustomerProfile`)
          customerCount++
        } else {
          console.log(`  → CustomerProfile already exists`)
        }

        // Create VendorProfile for vendors
        if ((user.role === 'VENDOR' || user.role === 'ADMIN') && user.vendor) {
          const existingVendorProfile = await prisma.vendorProfile.findUnique({
            where: { userId: user.id }
          })

          if (!existingVendorProfile) {
            await prisma.vendorProfile.create({
              data: {
                userId: user.id,
                companyName: user.vendor.companyName,
                description: user.vendor.description,
                website: user.vendor.website,
                businessPhone: user.vendor.phone,
                logo: user.vendor.logo,
                banner: user.vendor.coverImage,

                // Set as verified since they were already vendors
                onboardingStatus: 'APPROVED',
                verificationStatus: 'VERIFIED',
                verifiedAt: new Date(),

                // Migrate metrics
                totalProducts: user.vendor.totalProducts,
                activeProducts: user.vendor.totalProducts,
                totalSales: user.vendor.monthlyRevenue,
                totalOrders: user.vendor.totalSales,

                // Sustainability
                regenScore: user.vendor.regenScore,

                // Status
                active: true,
                suspended: false,
              }
            })
            console.log(`  ✓ Created VendorProfile`)
            vendorCount++
          } else {
            console.log(`  → VendorProfile already exists`)
          }
        }

        if (user.role === 'ADMIN') {
          adminCount++
        }

        console.log(`  ✅ User migrated successfully\n`)

      } catch (error) {
        console.error(`  ❌ Error migrating user ${user.email}:`, error)
        errors++
      }
    }

    console.log('\n' + '='.repeat(60))
    console.log('📈 Migration Summary:')
    console.log('='.repeat(60))
    console.log(`Total users processed: ${users.length}`)
    console.log(`Customer profiles created: ${customerCount}`)
    console.log(`Vendor profiles created: ${vendorCount}`)
    console.log(`Admin users: ${adminCount}`)
    console.log(`Errors: ${errors}`)
    console.log('='.repeat(60))

    if (errors === 0) {
      console.log('\n✅ Migration completed successfully!')
    } else {
      console.log('\n⚠️  Migration completed with errors. Please review the logs.')
    }

  } catch (error) {
    console.error('❌ Migration failed:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

main()
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
