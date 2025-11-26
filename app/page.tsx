"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, ArrowRight, Star, Percent, TrendingUp, Zap, Heart, ShoppingCart, Leaf, Sparkles } from "lucide-react"
import { ProductCarousel } from "@/components/marketplace/product-carousel"
import Header from "@/components/layout/header"
import ImpactBanner from "@/components/home/impact-banner"
import Footer from "@/components/layout/footer"

// Product interface
interface Product {
  id: string
  name: string
  vendor: string
  location: string
  price: number
  originalPrice?: number
  rating: number
  reviews: number
  regenScore: number
  image: string
  images: string[]
  category: string
  inStock: boolean
  featured: boolean
  nfts: Array<{ id: number; name: string; emoji: string; rarity: string }>
  metrics: {
    co2Reduced: number
    waterSaved: number
    energyEfficiency: number
  }
  certifications: string[]
  description: string
  stock: number
  maxOrderQuantity: number
}

export default function Homepage() {
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState("")
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([])
  const [promotionalProducts, setPromotionalProducts] = useState<Product[]>([])
  const [saleProducts, setSaleProducts] = useState<Product[]>([])
  const [activeImpactMetric, setActiveImpactMetric] = useState(0)

  // Handle search - redirect to marketplace with search term
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchTerm.trim()) {
      router.push(`/marketplace?search=${encodeURIComponent(searchTerm.trim())}`)
    } else {
      router.push('/marketplace')
    }
  }

  // Fetch products for different sections
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // Fetch featured products
        const featuredResponse = await fetch('/api/products?featured=true&limit=6')
        const featuredData = await featuredResponse.json()

        // Fetch promotional products
        const promoResponse = await fetch('/api/products?limit=8')
        const promoData = await promoResponse.json()

        // Fetch sale products
        const saleResponse = await fetch('/api/products?sale=true&limit=6')
        const saleData = await saleResponse.json()

        if (featuredData.success) {
          const transformedFeatured = featuredData.data.map(transformProduct)
          setFeaturedProducts(transformedFeatured)
        }

        if (promoData.success) {
          const transformedPromo = promoData.data.slice(0, 8).map(transformProduct)
          setPromotionalProducts(transformedPromo)
        }

        if (saleData.success) {
          const transformedSale = saleData.data.map(transformProduct)
          setSaleProducts(transformedSale)
        }

      } catch (error) {
        console.error('Error fetching products:', error)
      }
    }

    fetchProducts()
  }, [])

  // Rotate impact metrics
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveImpactMetric(prev => (prev + 1) % 3)
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  // Transform API product to frontend format
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const transformProduct = (product: any): Product => ({
    id: product.id,
    name: product.name,
    vendor: product.vendorProfile?.companyName || product.vendorProfile?.name || 'Vendor',
    location: product.vendorProfile?.location || 'México',
    price: product.price,
    originalPrice: product.originalPrice,
    rating: product.averageRating,
    reviews: product.reviewCount,
    regenScore: product.regenScore,
    image: product.images?.[0] || '/placeholder.svg',
    images: product.images || [],
    category: product.category,
    inStock: product.stock > 0,
    featured: product.featured,
    nfts: product.nfts || [],
    metrics: {
      co2Reduced: product.co2Reduction || 0,
      waterSaved: product.waterSaving || 0,
      energyEfficiency: product.energyEfficiency || 0,
    },
    certifications: product.certifications || [],
    description: product.description || '',
    stock: product.stock || 0,
    maxOrderQuantity: product.maxOrderQuantity || 1
  })

  const impactMetrics = [
    { value: "2,847", label: "Toneladas CO₂ ahorradas", icon: Leaf },
    { value: "1.2M", label: "Litros de agua conservados", icon: Zap },
    { value: "156", label: "MW energía limpia generada", icon: Sparkles }
  ]

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero Section - Completamente Rediseñada */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        {/* Background con gradiente animado */}
        <div className="absolute inset-0 bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 animate-gradient-x"></div>
        
        {/* Elementos decorativos */}
        <div className="absolute top-0 left-0 w-72 h-72 bg-green-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute top-0 right-0 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-2000"></div>
        <div className="absolute bottom-0 left-1/2 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-4000"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Badge de impacto */}
          <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm rounded-full px-4 py-2 mb-8 border border-gray-200">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-ping"></div>
            <span className="text-sm font-medium text-gray-700">Marketplace #1 en Sostenibilidad</span>
          </div>

          {/* Headline principal */}
          <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight">
            Urbanika
            <span className="block bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
              Marketplace
            </span>
          </h1>

          {/* Subtítulo */}
          <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
            Descubre productos que no solo transforman tu vida, 
            <span className="font-semibold text-gray-900"> sino también el planeta.</span>
          </p>

          {/* Búsqueda mejorada */}
          <form onSubmit={handleSearch} className="max-w-2xl mx-auto mb-8">
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-green-600 to-blue-600 rounded-2xl blur opacity-25 group-hover:opacity-75 transition duration-1000 group-hover:duration-200"></div>
              <div className="relative flex items-center bg-white rounded-2xl shadow-2xl border border-gray-100">
                <Search className="absolute left-4 text-gray-400 w-6 h-6" />
                <Input
                  type="text"
                  placeholder="Buscar paneles solares, compostadores, movilidad eléctrica..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="flex-1 pl-12 pr-4 py-4 text-lg border-0 bg-transparent focus:ring-0"
                />
                <Button
                  type="submit"
                  className="m-2 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 rounded-xl px-8 py-2 font-semibold"
                >
                  Explorar
                </Button>
              </div>
            </div>
          </form>

          {/* Métricas de impacto en tiempo real */}
          <div className="flex flex-wrap justify-center gap-6 mb-12">
            {impactMetrics.map((metric, index) => {
              const Icon = metric.icon
              return (
                <div
                  key={metric.label}
                  className={`flex items-center gap-3 px-4 py-3 rounded-2xl bg-white/80 backdrop-blur-sm border transition-all duration-500 ${
                    activeImpactMetric === index 
                      ? 'border-green-300 shadow-lg scale-105' 
                      : 'border-gray-200'
                  }`}
                >
                  <div className={`p-2 rounded-lg ${
                    activeImpactMetric === index ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-600'
                  }`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="text-left">
                    <div className="font-bold text-gray-900 text-lg">{metric.value}</div>
                    <div className="text-sm text-gray-600">{metric.label}</div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Acciones rápidas */}
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/marketplace?featured=true">
              <Button className="bg-white text-gray-900 border border-gray-200 hover:bg-gray-50 hover:border-gray-300 rounded-xl px-6">
                <Star className="w-4 h-4 mr-2" />
                Productos Destacados
              </Button>
            </Link>
            <Link href="/marketplace?sale=true">
              <Button className="bg-white text-gray-900 border border-gray-200 hover:bg-gray-50 hover:border-gray-300 rounded-xl px-6">
                <Percent className="w-4 h-4 mr-2" />
                Ofertas Especiales
              </Button>
            </Link>
            <Link href="/onboarding">
              <Button className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white rounded-xl px-6">
                <TrendingUp className="w-4 h-4 mr-2" />
                Vender Productos
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Productos Destacados - Layout Mejorado */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-12">
            <div>
              <Badge className="bg-blue-100 text-blue-800 px-4 py-1 rounded-full text-sm font-medium mb-4">
                Selección exclusiva
              </Badge>
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Productos Destacados
              </h2>
              <p className="text-xl text-gray-600">
                Curated by our sustainability experts for maximum impact
              </p>
            </div>
            <Link href="/marketplace?featured=true">
              <Button variant="outline" className="flex items-center gap-2 rounded-xl">
                Ver todos los destacados
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>

          <ProductCarousel
            products={featuredProducts}
            autoPlay={true}
            showDots={featuredProducts.length > 3}
            itemsToShow={{ mobile: 1, tablet: 2, desktop: 3 }}
          />
        </div>
      </section>

     {/* Banner de Impacto - Versión Comercial Premium */}
      <ImpactBanner />

      {/* Ofertas Especiales - Layout Mejorado */}
      <section className="py-20 bg-orange-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-12">
            <div>
              <Badge className="bg-orange-100 text-orange-800 px-4 py-1 rounded-full text-sm font-medium mb-4">
                Ofertas limitadas
              </Badge>
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Ofertas Especiales
              </h2>
              <p className="text-xl text-gray-600">
                Productos sostenibles con descuentos exclusivos
              </p>
            </div>
            <Link href="/marketplace?sale=true">
              <Button variant="outline" className="flex items-center gap-2 rounded-xl">
                Ver todas las ofertas
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>

          <ProductCarousel
            products={saleProducts}
            autoPlay={false}
            showDots={saleProducts.length > 3}
            itemsToShow={{ mobile: 1, tablet: 2, desktop: 3 }}
          />
        </div>
      </section>

      {/* Productos Populares - Grid Mejorado */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-12">
            <div>
              <Badge className="bg-purple-100 text-purple-800 px-4 py-1 rounded-full text-sm font-medium mb-4">
                Tendencia actual
              </Badge>
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Productos Populares
              </h2>
              <p className="text-xl text-gray-600">
                Lo que la comunidad sostenible está comprando
              </p>
            </div>
            <Link href="/marketplace">
              <Button variant="outline" className="flex items-center gap-2 rounded-xl">
                Explorar marketplace
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>

          <ProductCarousel
            products={promotionalProducts}
            autoPlay={false}
            showDots={promotionalProducts.length > 4}
            itemsToShow={{ mobile: 1, tablet: 2, desktop: 4 }}
          />
        </div>
      </section>

      {/* CTA Final - Completamente Rediseñado */}
      <section className="py-20 bg-gradient-to-br from-green-600 via-green-500 to-emerald-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <Badge className="bg-white/20 text-white px-4 py-1 rounded-full text-sm font-medium mb-6 backdrop-blur-sm">
            Únete al movimiento
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Tu próxima compra puede cambiar el mundo
          </h2>
          <p className="text-xl text-green-100 mb-8 max-w-2xl mx-auto leading-relaxed">
            Cada elección cuenta. Únete a miles de personas que ya están creando un futuro más sostenible con cada compra consciente.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/marketplace">
              <Button size="lg" className="bg-white text-green-600 hover:bg-green-50 rounded-xl px-8 font-semibold shadow-2xl">
                <ShoppingCart className="w-5 h-5 mr-2" />
                Comenzar a Comprar
              </Button>
            </Link>
            <Link href="/onboarding">
              <Button size="lg" variant="outline" className="border-white text-black hover:bg-white/10 rounded-xl px-8 font-semibold">
                <Heart className="w-5 h-5 mr-2" />
                Vender Mis Productos
              </Button>
            </Link>
          </div>
        </div>
      </section>
      <Footer/>
    </div>
  )
}