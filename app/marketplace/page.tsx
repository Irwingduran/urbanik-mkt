"use client"

import { useState, useMemo, Suspense } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, Grid3X3, List, X, SlidersHorizontal } from "lucide-react"
import { ProductCard } from "@/components/marketplace/product-card"
import { MarketplaceFilters } from "@/components/marketplace/marketplace-filters"
// New modular components
import { ProductCard as ModularProductCard } from "@/src/features/products/components/ProductCard"
import { LoadingSpinner } from "@/src/shared/components/feedback/LoadingSpinner"
import { ErrorBoundary } from "@/src/shared/components/feedback/ErrorBoundary"
import { CartCounter } from "@/src/features/cart/components/CartCounter"

// Mock products data
const productsData = [
  {
    id: 1,
    name: "Panel Solar Bifacial 450W",
    vendor: "EcoTech Solutions",
    location: "Ciudad de México",
    price: 1299,
    originalPrice: 1499,
    rating: 4.8,
    reviews: 124,
    regenScore: 92,
    image: "/placeholder.svg?height=300&width=300",
    images: ["/placeholder.svg?height=300&width=300"],
    category: "Energía Solar",
    inStock: true,
    featured: true,
    nfts: [
      { id: 1, name: "Solar Pioneer", emoji: "🌞", rarity: "rare" },
      { id: 2, name: "Clean Energy", emoji: "⚡", rarity: "common" },
    ],
    metrics: {
      co2Reduced: 4.2,
      waterSaved: 0,
      energyEfficiency: 95,
    },
    certifications: ["ISO 14001", "Energy Star", "LEED"],
    description: "Panel solar de alta eficiencia con tecnología bifacial para máximo aprovechamiento de la luz solar.",
  },
  {
    id: 2,
    name: "Sistema Captación Agua Lluvia 500L",
    vendor: "AquaTech Verde",
    location: "Guadalajara",
    price: 850,
    rating: 4.6,
    reviews: 89,
    regenScore: 88,
    image: "/placeholder.svg?height=300&width=300",
    images: ["/placeholder.svg?height=300&width=300"],
    category: "Gestión de Agua",
    inStock: true,
    featured: false,
    nfts: [{ id: 3, name: "Water Guardian", emoji: "💧", rarity: "epic" }],
    metrics: {
      co2Reduced: 0.8,
      waterSaved: 15000,
      energyEfficiency: 0,
    },
    certifications: ["WaterSense", "Green Building"],
    description: "Sistema completo para captación y almacenamiento de agua de lluvia con filtros integrados.",
  },
  {
    id: 3,
    name: "Cargador Vehicular Eléctrico 22kW",
    vendor: "GreenEnergy Co",
    location: "Monterrey",
    price: 1800,
    rating: 4.9,
    reviews: 156,
    regenScore: 85,
    image: "/placeholder.svg?height=300&width=300",
    images: ["/placeholder.svg?height=300&width=300"],
    category: "Movilidad Eléctrica",
    inStock: true,
    featured: true,
    nfts: [
      { id: 4, name: "EV Champion", emoji: "🔋", rarity: "rare" },
      { id: 5, name: "Zero Emission", emoji: "🌱", rarity: "common" },
    ],
    metrics: {
      co2Reduced: 3.5,
      waterSaved: 0,
      energyEfficiency: 98,
    },
    certifications: ["CE", "FCC", "Energy Star"],
    description: "Cargador rápido para vehículos eléctricos con tecnología inteligente y conectividad WiFi.",
  },
  {
    id: 4,
    name: "Compostador Inteligente IoT",
    vendor: "SmartCompost",
    location: "Puebla",
    price: 1899,
    rating: 4.4,
    reviews: 67,
    regenScore: 78,
    image: "/placeholder.svg?height=300&width=300",
    images: ["/placeholder.svg?height=300&width=300"],
    category: "Gestión de Residuos",
    inStock: false,
    featured: false,
    nfts: [{ id: 6, name: "Waste Warrior", emoji: "♻️", rarity: "uncommon" }],
    metrics: {
      co2Reduced: 1.2,
      waterSaved: 500,
      energyEfficiency: 85,
    },
    certifications: ["Organic Certified", "Smart Home"],
    description: "Compostador automatizado con sensores IoT para monitoreo y control remoto del proceso.",
  },
  {
    id: 5,
    name: "Luminarias LED Solares Urbanas",
    vendor: "SolarLight Pro",
    location: "Tijuana",
    price: 650,
    originalPrice: 750,
    rating: 4.7,
    reviews: 203,
    regenScore: 90,
    image: "/placeholder.svg?height=300&width=300",
    images: ["/placeholder.svg?height=300&width=300"],
    category: "Iluminación",
    inStock: true,
    featured: true,
    nfts: [{ id: 7, name: "Light Bringer", emoji: "💡", rarity: "common" }],
    metrics: {
      co2Reduced: 2.1,
      waterSaved: 0,
      energyEfficiency: 92,
    },
    certifications: ["IP65", "Energy Star", "Dark Sky"],
    description: "Sistema de iluminación LED solar para espacios urbanos con sensor de movimiento.",
  },
  {
    id: 6,
    name: "Filtro de Aire HEPA Industrial",
    vendor: "CleanAir Tech",
    location: "León",
    price: 3200,
    rating: 4.5,
    reviews: 45,
    regenScore: 82,
    image: "/placeholder.svg?height=300&width=300",
    images: ["/placeholder.svg?height=300&width=300"],
    category: "Calidad del Aire",
    inStock: true,
    featured: false,
    nfts: [{ id: 8, name: "Air Purifier", emoji: "🌬️", rarity: "rare" }],
    metrics: {
      co2Reduced: 0.5,
      waterSaved: 200,
      energyEfficiency: 88,
    },
    certifications: ["HEPA H13", "Medical Grade", "Energy Star"],
    description: "Sistema de filtración de aire industrial con tecnología HEPA para máxima purificación.",
  },
]

export default function Marketplace() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [searchTerm, setSearchTerm] = useState("")
  const [showFilters, setShowFilters] = useState(false)
  const [filters, setFilters] = useState({
    locations: [] as string[],
    certifications: [] as string[],
    priceRange: [0, 25000],
    minRegenScore: 0,
    inStockOnly: false,
    featuredOnly: false,
    categories: [] as string[],
  })

  // Filter products based on current filters
  const filteredProducts = useMemo(() => {
    return productsData.filter((product) => {
      // Search term filter
      if (
        searchTerm &&
        !product.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !product.vendor.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !product.description.toLowerCase().includes(searchTerm.toLowerCase())
      ) {
        return false
      }

      // Location filter
      if (filters.locations.length > 0 && !filters.locations.includes(product.location)) {
        return false
      }

      // Certifications filter
      if (
        filters.certifications.length > 0 &&
        !filters.certifications.some((cert) => product.certifications.includes(cert))
      ) {
        return false
      }

      // Price range filter
      if (product.price < filters.priceRange[0] || product.price > filters.priceRange[1]) {
        return false
      }

      // REGEN Score filter
      if (product.regenScore < filters.minRegenScore) {
        return false
      }

      // Stock filter
      if (filters.inStockOnly && !product.inStock) {
        return false
      }

      // Featured filter
      if (filters.featuredOnly && !product.featured) {
        return false
      }

      // Categories filter
      if (filters.categories.length > 0 && !filters.categories.includes(product.category)) {
        return false
      }

      return true
    })
  }, [searchTerm, filters])

  const activeFiltersCount =
    filters.locations.length +
    filters.certifications.length +
    filters.categories.length +
    (filters.priceRange[0] > 0 || filters.priceRange[1] < 25000 ? 1 : 0) +
    (filters.minRegenScore > 0 ? 1 : 0) +
    (filters.inStockOnly ? 1 : 0) +
    (filters.featuredOnly ? 1 : 0)

  const clearAllFilters = () => {
    setFilters({
      locations: [],
      certifications: [],
      priceRange: [0, 25000],
      minRegenScore: 0,
      inStockOnly: false,
      featuredOnly: false,
      categories: [],
    })
    setSearchTerm("")
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Marketplace Sostenible</h1>
          <p className="text-gray-600">Descubre productos eco-friendly que generan impacto positivo</p>
        </div>

        {/* Search and Controls */}
        <div className="mb-6 space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search Bar */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Buscar productos sostenibles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* View Controls */}
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" onClick={() => setShowFilters(!showFilters)} className="relative">
                <SlidersHorizontal className="w-4 h-4 mr-2" />
                Filtros
                {activeFiltersCount > 0 && <Badge className="ml-2 bg-green-600 text-white">{activeFiltersCount}</Badge>}
              </Button>

              <div className="flex items-center gap-3">
                <div className="flex border rounded-lg">
                  <Button
                    variant={viewMode === "grid" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("grid")}
                    className="rounded-r-none"
                  >
                    <Grid3X3 className="w-4 h-4" />
                  </Button>
                  <Button
                    variant={viewMode === "list" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("list")}
                    className="rounded-l-none"
                  >
                    <List className="w-4 h-4" />
                  </Button>
                </div>

                {/* Redux Cart Counter Demo */}
                <CartCounter />
              </div>
            </div>
          </div>

          {/* Active Filters */}
          {activeFiltersCount > 0 && (
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm text-gray-500">Filtros activos:</span>

              {filters.locations.map((location) => (
                <Badge key={location} variant="secondary" className="bg-blue-100 text-blue-800">
                  📍 {location}
                  <button
                    onClick={() =>
                      setFilters((prev) => ({
                        ...prev,
                        locations: prev.locations.filter((l) => l !== location),
                      }))
                    }
                    className="ml-1 hover:bg-blue-200 rounded-full p-0.5"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              ))}

              {filters.certifications.map((cert) => (
                <Badge key={cert} variant="secondary" className="bg-green-100 text-green-800">
                  🏆 {cert}
                  <button
                    onClick={() =>
                      setFilters((prev) => ({
                        ...prev,
                        certifications: prev.certifications.filter((c) => c !== cert),
                      }))
                    }
                    className="ml-1 hover:bg-green-200 rounded-full p-0.5"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              ))}

              {filters.categories.map((category) => (
                <Badge key={category} variant="secondary" className="bg-purple-100 text-purple-800">
                  📂 {category}
                  <button
                    onClick={() =>
                      setFilters((prev) => ({
                        ...prev,
                        categories: prev.categories.filter((c) => c !== category),
                      }))
                    }
                    className="ml-1 hover:bg-purple-200 rounded-full p-0.5"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              ))}

              <Button variant="outline" size="sm" onClick={clearAllFilters}>
                Limpiar todo
              </Button>
            </div>
          )}
        </div>

        <div className="flex gap-6">
          {/* Filters Sidebar */}
          {showFilters && (
            <div className="w-80 flex-shrink-0">
              <MarketplaceFilters filters={filters} setFilters={setFilters} />
            </div>
          )}

          {/* Products Grid/List */}
          <div className="flex-1">
            {/* Results Header */}
            <div className="flex items-center justify-between mb-6">
              <p className="text-gray-600">
                {filteredProducts.length} productos encontrados
                {searchTerm && ` para "${searchTerm}"`}
              </p>

              <select className="border rounded-lg px-3 py-2 text-sm">
                <option>Más relevantes</option>
                <option>Precio: menor a mayor</option>
                <option>Precio: mayor a menor</option>
                <option>REGEN Score más alto</option>
                <option>Mejor calificados</option>
                <option>Más recientes</option>
              </select>
            </div>

            {/* Products */}
            {filteredProducts.length === 0 ? (
              <Card>
                <CardContent className="text-center py-12">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Search className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No se encontraron productos</h3>
                  <p className="text-gray-500 mb-4">Intenta ajustar tus filtros o términos de búsqueda</p>
                  <Button onClick={clearAllFilters}>Limpiar filtros</Button>
                </CardContent>
              </Card>
            ) : (
              <div
                className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" : "space-y-4"}
              >
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} viewMode={viewMode} />
                ))}
              </div>
            )}

            {/* New Modular Architecture Demo */}
            {filteredProducts.length > 0 && (
              <div className="mt-12">
                <div className="border-t border-gray-200 pt-8">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">
                      New Modular Architecture Demo
                    </h2>
                    <Badge variant="secondary" className="bg-green-100 text-green-800">
                      Feature Preview
                    </Badge>
                  </div>
                  <p className="text-gray-600 mb-6">
                    Showcasing the new feature-based modular architecture with enhanced components
                  </p>

                  <ErrorBoundary>
                    <Suspense fallback={<LoadingSpinner size="lg" />}>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredProducts.slice(0, 3).map((product) => {
                          // Convert the existing product format to our new format
                          const modularProduct = {
                            ...product,
                            id: String(product.id),
                            vendorId: 'vendor1',
                            stock: 25,
                            active: true,
                            co2Reduction: product.co2Reduction || 1.5,
                            waterSaving: product.waterSaving || 500,
                            energyEfficiency: product.energyEfficiency || 85,
                            vendor: {
                              id: 'vendor1',
                              companyName: 'EcoTech Solutions',
                              user: { name: 'Demo Vendor' }
                            },
                            averageRating: product.rating || 4.5,
                            reviewCount: product.reviews || 25,
                            totalSold: 150,
                            isInWishlist: false,
                            createdAt: new Date().toISOString()
                          }

                          return (
                            <ModularProductCard
                              key={`modular-${product.id}`}
                              product={modularProduct}
                              variant="default"
                              showActions={true}
                              onAddToCart={() => console.log('Modular: Add to cart:', product.id)}
                              onToggleWishlist={() => console.log('Modular: Toggle wishlist:', product.id)}
                            />
                          )
                        })}
                      </div>
                    </Suspense>
                  </ErrorBoundary>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
