import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting comprehensive database seed...')

  // Create categories first
  const categories = await Promise.all([
    prisma.category.create({
      data: {
        name: 'Energía Solar',
        slug: 'energia-solar',
        description: 'Paneles solares y tecnología de energía renovable',
        icon: '☀️'
      }
    }),
    prisma.category.create({
      data: {
        name: 'Gestión de Agua',
        slug: 'gestion-agua',
        description: 'Sistemas de filtración y conservación de agua',
        icon: '💧'
      }
    }),
    prisma.category.create({
      data: {
        name: 'Movilidad Eléctrica',
        slug: 'movilidad-electrica',
        description: 'Vehículos eléctricos y cargadores',
        icon: '🔋'
      }
    }),
    prisma.category.create({
      data: {
        name: 'Gestión de Residuos',
        slug: 'gestion-residuos',
        description: 'Soluciones de reciclaje y compostaje',
        icon: '♻️'
      }
    }),
    prisma.category.create({
      data: {
        name: 'Iluminación',
        slug: 'iluminacion',
        description: 'Sistemas de iluminación LED y solar',
        icon: '💡'
      }
    }),
    prisma.category.create({
      data: {
        name: 'Calidad del Aire',
        slug: 'calidad-aire',
        description: 'Filtros HEPA y purificadores de aire',
        icon: '🌬️'
      }
    })
  ])

  console.log('✅ Categories created')

  // Hash passwords
  const hashedPassword = await bcrypt.hash('password123', 10)
  const adminPassword = await bcrypt.hash('admin123', 10)

  // Create Customer Demo User
  const customerUser = await prisma.user.upsert({
    where: { email: 'demo@customer.com' },
    update: {},
    create: {
      email: 'demo@customer.com',
      name: 'Demo Customer',
      password: hashedPassword,
      role: 'USER',
      profile: {
        create: {
          firstName: 'Demo',
          lastName: 'Customer',
          phone: '+52 555 123 4567',
          sustainabilityFocus: ['Energía Solar', 'Gestión de Agua'],
          preferredCategories: ['Energía Solar', 'Movilidad Eléctrica'],
          priceRange: '500-2000',
          regenScore: 150,
          loyaltyPoints: 250,
          nftsCollected: [
            { id: 1, name: 'Eco Warrior', emoji: '🌱', rarity: 'common' },
            { id: 2, name: 'Solar Pioneer', emoji: '☀️', rarity: 'rare' }
          ]
        }
      },
      addresses: {
        create: [
          {
            type: 'home',
            name: 'Casa Principal',
            street: 'Av. Insurgentes 123',
            city: 'Ciudad de México',
            state: 'CDMX',
            zipCode: '06700',
            country: 'México',
            isDefault: true
          }
        ]
      }
    }
  })

  // Create Vendor Demo User with Vendor Profile
  const vendorUser = await prisma.user.upsert({
    where: { email: 'demo@vendor.com' },
    update: {},
    create: {
      email: 'demo@vendor.com',
      name: 'Demo Vendor',
      password: hashedPassword,
      role: 'VENDOR',
      profile: {
        create: {
          firstName: 'Demo',
          lastName: 'Vendor',
          phone: '+52 555 987 6543',
          sustainabilityFocus: ['Energía Solar', 'Iluminación'],
          regenScore: 850,
          loyaltyPoints: 1200,
        }
      },
      vendor: {
        create: {
          companyName: 'EcoTech Solutions Demo',
          description: 'Empresa líder en soluciones de energía renovable y tecnología sostenible.',
          website: 'https://ecotech-demo.com',
          phone: '+52 555 987 6543',
          founded: '2020',
          employees: '25-50',
          location: 'Ciudad de México, México',
          regenScore: 92,
          nftLevel: 'Bosque Dorado',
          totalProducts: 15,
          totalSales: 450,
          monthlyRevenue: 125000.50
        }
      }
    }
  })

  // Create Admin Demo User
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@regenmarket.com' },
    update: {},
    create: {
      email: 'admin@regenmarket.com',
      name: 'Admin User',
      password: adminPassword,
      role: 'ADMIN',
      profile: {
        create: {
          firstName: 'Admin',
          lastName: 'User',
          phone: '+52 555 000 0000',
          sustainabilityFocus: ['Gestión de Residuos', 'Calidad del Aire'],
          regenScore: 1000,
          loyaltyPoints: 5000,
        }
      }
    }
  })

  // Get the vendor record for product creation
  const vendorRecord = await prisma.vendor.findUnique({
    where: { userId: vendorUser.id }
  })

  if (!vendorRecord) {
    throw new Error('Vendor record not found')
  }

  // Create sample products
  const products = await Promise.all([
    prisma.product.create({
      data: {
        vendorId: vendorRecord.id,
        name: 'Panel Solar Bifacial 450W',
        description: 'Panel solar de alta eficiencia con tecnología bifacial para máximo aprovechamiento de la luz solar. Ideal para instalaciones residenciales y comerciales.',
        price: 1299,
        originalPrice: 1499,
        sku: 'ECO-PS450-BF-001',
        category: 'Energía Solar',
        subcategory: 'Paneles Solares',
        images: ['/placeholder.svg?height=400&width=400'],
        stock: 25,
        minStock: 5,
        maxOrderQuantity: 10,
        regenScore: 92,
        certifications: ['ISO 14001', 'Energy Star', 'LEED'],
        co2Reduction: 4.2,
        waterSaving: 0,
        energyEfficiency: 95,
        materials: ['Silicio monocristalino', 'Aluminio reciclado', 'Vidrio templado'],
        origin: 'México',
        dimensions: {
          length: 2108,
          width: 1048,
          height: 40,
          weight: 22.5
        },
        nfts: [
          { id: 1, name: 'Solar Pioneer', emoji: '🌞', rarity: 'rare' },
          { id: 2, name: 'Clean Energy', emoji: '⚡', rarity: 'common' }
        ],
        featured: true,
        views: 1245,
        salesCount: 89,
        averageRating: 4.8,
        reviewCount: 124
      }
    }),
    prisma.product.create({
      data: {
        vendorId: vendorRecord.id,
        name: 'Sistema Captación Agua Lluvia 500L',
        description: 'Sistema completo para captación y almacenamiento de agua de lluvia con filtros integrados y sistema de purificación.',
        price: 850,
        sku: 'ATV-CAP-500L-001',
        category: 'Gestión de Agua',
        subcategory: 'Captación Pluvial',
        images: ['/placeholder.svg?height=400&width=400'],
        stock: 18,
        minStock: 5,
        maxOrderQuantity: 3,
        regenScore: 88,
        certifications: ['WaterSense', 'Green Building'],
        co2Reduction: 0.8,
        waterSaving: 15000,
        energyEfficiency: 0,
        materials: ['Polietileno reciclado', 'Filtros de carbón activado'],
        origin: 'México',
        dimensions: {
          length: 120,
          width: 80,
          height: 180,
          weight: 45
        },
        nfts: [
          { id: 4, name: 'Water Guardian', emoji: '💧', rarity: 'epic' }
        ],
        featured: true,
        views: 892,
        salesCount: 67,
        averageRating: 4.6,
        reviewCount: 89
      }
    }),
    prisma.product.create({
      data: {
        vendorId: vendorRecord.id,
        name: 'Cargador Vehicular Eléctrico 22kW',
        description: 'Cargador rápido para vehículos eléctricos con tecnología inteligente y conectividad WiFi. Compatible con todos los estándares.',
        price: 1800,
        sku: 'GEC-CHARG-22KW-001',
        category: 'Movilidad Eléctrica',
        subcategory: 'Cargadores',
        images: ['/placeholder.svg?height=400&width=400'],
        stock: 12,
        minStock: 3,
        maxOrderQuantity: 2,
        regenScore: 85,
        certifications: ['CE', 'FCC', 'Energy Star'],
        co2Reduction: 3.5,
        waterSaving: 0,
        energyEfficiency: 98,
        materials: ['Aluminio reciclado', 'Componentes inteligentes'],
        origin: 'México',
        dimensions: {
          length: 40,
          width: 25,
          height: 60,
          weight: 15
        },
        nfts: [
          { id: 6, name: 'EV Champion', emoji: '🔋', rarity: 'rare' },
          { id: 7, name: 'Zero Emission', emoji: '🌱', rarity: 'common' }
        ],
        featured: true,
        views: 1567,
        salesCount: 123,
        averageRating: 4.9,
        reviewCount: 156
      }
    }),
    prisma.product.create({
      data: {
        vendorId: vendorRecord.id,
        name: 'Luminarias LED Solares Urbanas',
        description: 'Sistema de iluminación LED solar para espacios urbanos con sensor de movimiento y gestión inteligente.',
        price: 650,
        originalPrice: 750,
        sku: 'GEC-LED-SOL-URB-001',
        category: 'Iluminación',
        subcategory: 'LED Solar',
        images: ['/placeholder.svg?height=400&width=400'],
        stock: 28,
        minStock: 8,
        maxOrderQuantity: 15,
        regenScore: 90,
        certifications: ['IP65', 'Energy Star', 'Dark Sky'],
        co2Reduction: 2.1,
        waterSaving: 0,
        energyEfficiency: 92,
        materials: ['Aluminio', 'LED de alta eficiencia', 'Panel solar integrado'],
        origin: 'México',
        dimensions: {
          length: 120,
          width: 30,
          height: 350,
          weight: 12
        },
        nfts: [
          { id: 8, name: 'Light Bringer', emoji: '💡', rarity: 'common' }
        ],
        featured: true,
        views: 2103,
        salesCount: 203,
        averageRating: 4.7,
        reviewCount: 203
      }
    }),
    prisma.product.create({
      data: {
        vendorId: vendorRecord.id,
        name: 'Compostador Inteligente IoT',
        description: 'Compostador automatizado con sensores IoT para monitoreo y control remoto del proceso.',
        price: 1899,
        sku: 'SMART-COMP-IOT-001',
        category: 'Gestión de Residuos',
        subcategory: 'Compostaje',
        images: ['/placeholder.svg?height=400&width=400'],
        stock: 8,
        minStock: 2,
        maxOrderQuantity: 3,
        regenScore: 78,
        certifications: ['Organic Certified', 'Smart Home'],
        co2Reduction: 1.2,
        waterSaving: 500,
        energyEfficiency: 85,
        materials: ['Acero inoxidable', 'Sensores IoT', 'Material biodegradable'],
        origin: 'México',
        dimensions: {
          length: 60,
          width: 60,
          height: 80,
          weight: 25
        },
        nfts: [
          { id: 9, name: 'Waste Warrior', emoji: '♻️', rarity: 'uncommon' }
        ],
        featured: false,
        views: 567,
        salesCount: 34,
        averageRating: 4.4,
        reviewCount: 67
      }
    }),
    prisma.product.create({
      data: {
        vendorId: vendorRecord.id,
        name: 'Filtro de Aire HEPA Industrial',
        description: 'Sistema de filtración de aire industrial con tecnología HEPA para máxima purificación del aire.',
        price: 3200,
        sku: 'CLEAN-AIR-HEPA-IND-001',
        category: 'Calidad del Aire',
        subcategory: 'Filtros HEPA',
        images: ['/placeholder.svg?height=400&width=400'],
        stock: 6,
        minStock: 2,
        maxOrderQuantity: 2,
        regenScore: 82,
        certifications: ['HEPA H13', 'Medical Grade', 'Energy Star'],
        co2Reduction: 0.5,
        waterSaving: 200,
        energyEfficiency: 88,
        materials: ['Filtros HEPA H13', 'Acero galvanizado', 'Sensores de calidad'],
        origin: 'México',
        dimensions: {
          length: 80,
          width: 60,
          height: 120,
          weight: 45
        },
        nfts: [
          { id: 10, name: 'Air Purifier', emoji: '🌬️', rarity: 'rare' }
        ],
        featured: false,
        views: 445,
        salesCount: 23,
        averageRating: 4.5,
        reviewCount: 45
      }
    })
  ])

  console.log('✅ Products created')

  // Create a sample order
  const sampleOrder = await prisma.order.create({
    data: {
      userId: customerUser.id,
      vendorId: vendorRecord.id,
      status: 'DELIVERED',
      total: 1499,
      subtotal: 1299,
      tax: 200,
      shipping: 0,
      shippingAddress: {
        street: 'Av. Insurgentes 123',
        city: 'Ciudad de México',
        state: 'CDMX',
        zipCode: '06700',
        country: 'México'
      },
      trackingNumber: 'ECO123456789',
      actualDelivery: new Date('2024-01-15'),
      paymentMethod: 'credit_card',
      paymentStatus: 'PAID',
      stripePaymentId: 'pi_1ABC123def456',
      items: {
        create: [
          {
            productId: products[0].id,
            quantity: 1,
            price: 1299,
            total: 1299
          }
        ]
      }
    }
  })

  console.log('✅ Sample order created')

  // Create sample reviews
  const sampleReviews = await Promise.all([
    prisma.review.create({
      data: {
        userId: customerUser.id,
        productId: products[0].id,
        rating: 5,
        comment: 'Excelente producto, la instalación fue muy sencilla y ya estoy viendo reducción en mi factura eléctrica. Muy recomendado.',
        verified: true,
        helpful: 12
      }
    }),
    prisma.review.create({
      data: {
        userId: customerUser.id,
        productId: products[1].id,
        rating: 4,
        comment: 'El sistema funciona muy bien, la calidad del agua es notablemente mejor. El único inconveniente fue el tiempo de entrega.',
        verified: true,
        helpful: 8
      }
    })
  ])

  console.log('✅ Sample reviews created')

  console.log('✅ Demo users created:')
  console.log('📧 Customer: demo@customer.com / password123')
  console.log('🏪 Vendor: demo@vendor.com / password123')
  console.log('👑 Admin: admin@regenmarket.com / admin123')

  console.log('🎉 Database seeded successfully!')
  console.log(`📊 Summary:`)
  console.log(`- Categories: ${categories.length}`)
  console.log(`- Products: ${products.length}`)
  console.log(`- Orders: 1`)
  console.log(`- Reviews: ${sampleReviews.length}`)
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })