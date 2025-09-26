"use client"

import { useState, useMemo } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, Grid3X3, List, X, SlidersHorizontal, Sparkles, Target, Users, Zap } from "lucide-react"
import { ProductCard } from "@/components/marketplace/product-card"
import { MarketplaceFilters } from "@/components/marketplace/marketplace-filters"
import { EnhancedNavbar } from "@/components/layout/enhanced-navbar"

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

// NUEVO: Mock para proyectos comunitarios
const communityProjects = [
  {
    id: 1,
    name: "Reforestación Bosque Urbano",
    progress: 75,
    target: 50000, // $50,000 MXN
    contributors: 1245,
    impact: "10,000 árboles nativos"
  },
  {
    id: 2,
    name: "Instalación Paneles Solares Comunitarios",
    progress: 30,
    target: 200000,
    contributors: 892,
    impact: "100 kW de energía limpia"
  }
]

export default function Marketplace() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [searchTerm, setSearchTerm] = useState("")
  const [showFilters, setShowFilters] = useState(false)
  const [activeTab, setActiveTab] = useState<"products" | "projects">("products") // NUEVO: Tabs para cambiar vista
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

  // NUEVO: Cálculo de impacto en tiempo real
  const realTimeImpact = useMemo(() => {
    return filteredProducts.reduce((acc, product) => ({
      co2Reduced: acc.co2Reduced + (product.metrics?.co2Reduced || 0),
      waterSaved: acc.waterSaved + (product.metrics?.waterSaved || 0),
      energyEfficiency: acc.energyEfficiency + (product.metrics?.energyEfficiency || 0),
    }), { co2Reduced: 0, waterSaved: 0, energyEfficiency: 0 })
  }, [filteredProducts])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-green-50/30">
      {/* Enhanced Navbar */}
      <EnhancedNavbar />

      {/* Modern Hero Section */}
      <div className="relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 via-blue-500/5 to-purple-500/5"></div>
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 25% 25%, rgba(34, 197, 94, 0.05) 0%, transparent 50%),
                           radial-gradient(circle at 75% 75%, rgba(59, 130, 246, 0.05) 0%, transparent 50%)`
        }}></div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {/* Enhanced Navigation Tabs */}
        <div className="flex justify-center mb-12">
          <div className="bg-gray-100 p-1 rounded-xl shadow-inner">
            <div className="flex gap-1">
              <button
                className={`relative px-8 py-4 rounded-lg font-medium transition-all duration-300 ${
                  activeTab === "products"
                    ? "bg-white text-gray-900 shadow-sm"
                    : "text-gray-600 hover:text-gray-900 hover:bg-white/50"
                }`}
                onClick={() => setActiveTab("products")}
              >
                <span className="relative z-10">Products</span>
                <Badge className="ml-2 bg-gray-200 text-gray-700 text-xs">
                  {filteredProducts.length}
                </Badge>
              </button>
              <button
                className={`relative px-8 py-4 rounded-lg font-medium transition-all duration-300 ${
                  activeTab === "projects"
                    ? "bg-white text-gray-900 shadow-sm"
                    : "text-gray-600 hover:text-gray-900 hover:bg-white/50"
                }`}
                onClick={() => setActiveTab("projects")}
              >
                <span className="relative z-10">Community Projects</span>
                <Badge className="ml-2 bg-gray-200 text-gray-700 text-xs">
                  {communityProjects.length}
                </Badge>
              </button>
            </div>
          </div>
        </div>

        {/* Content based on active tab */}
        {activeTab === "products" ? (
          <>
            {/* Enhanced Categories */}
            <div className="mb-12">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-3">Explore by Category</h2>
                <p className="text-gray-600">Find sustainable products that match your values</p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {[
                  { name: 'Energía Solar', icon: '☀️', color: 'from-yellow-500 to-orange-500' },
                  { name: 'Gestión de Agua', icon: '💧', color: 'from-blue-500 to-cyan-500' },
                  { name: 'Movilidad Eléctrica', icon: '🔋', color: 'from-green-500 to-emerald-500' },
                  { name: 'Gestión de Residuos', icon: '♻️', color: 'from-emerald-500 to-green-600' },
                  { name: 'Iluminación', icon: '💡', color: 'from-amber-500 to-yellow-500' },
                  { name: 'Calidad del Aire', icon: '🌬️', color: 'from-cyan-500 to-blue-500' }
                ].map((category) => (
                  <button
                    key={category.name}
                    onClick={() => setFilters(prev => ({
                      ...prev,
                      categories: prev.categories.includes(category.name)
                        ? prev.categories.filter(c => c !== category.name)
                        : [...prev.categories, category.name]
                    }))}
                    className={`group relative p-6 rounded-2xl transition-all duration-300 hover:scale-105 ${
                      filters.categories.includes(category.name)
                        ? 'bg-white shadow-lg ring-2 ring-green-500 ring-offset-2'
                        : 'bg-white/60 hover:bg-white hover:shadow-md'
                    }`}
                  >
                    <div className={`w-12 h-12 bg-gradient-to-br ${category.color} rounded-xl flex items-center justify-center mb-3 mx-auto group-hover:scale-110 transition-transform`}>
                      <span className="text-xl">{category.icon}</span>
                    </div>
                    <div className="text-sm font-medium text-gray-900 text-center leading-tight">
                      {category.name}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Enhanced Search and Controls */}
            <div className="mb-8">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                <div className="flex flex-col lg:flex-row gap-6">
                  {/* Advanced Search */}
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <Input
                        placeholder="Search sustainable products, brands, or impact metrics..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-12 h-12 text-base border-gray-200 focus:border-green-500 focus:ring-green-500/20 rounded-xl"
                      />
                    </div>
                  </div>

                  {/* Enhanced Controls */}
                  <div className="flex items-center gap-3">
                    <Button
                      variant="outline"
                      onClick={() => setShowFilters(!showFilters)}
                      className="relative h-12 px-6 border-gray-200 hover:border-green-300 rounded-xl"
                    >
                      <SlidersHorizontal className="w-4 h-4 mr-2" />
                      Filters
                      {activeFiltersCount > 0 && (
                        <Badge className="ml-2 bg-green-500 text-white min-w-[1.25rem] h-5">
                          {activeFiltersCount}
                        </Badge>
                      )}
                    </Button>

                    <div className="flex bg-gray-100 rounded-xl p-1">
                      <Button
                        variant={viewMode === "grid" ? "default" : "ghost"}
                        size="sm"
                        onClick={() => setViewMode("grid")}
                        className={`rounded-lg transition-all ${viewMode === "grid" ? 'bg-white shadow-sm' : 'hover:bg-white/50'}`}
                      >
                        <Grid3X3 className="w-4 h-4" />
                      </Button>
                      <Button
                        variant={viewMode === "list" ? "default" : "ghost"}
                        size="sm"
                        onClick={() => setViewMode("list")}
                        className={`rounded-lg transition-all ${viewMode === "list" ? 'bg-white shadow-sm' : 'hover:bg-white/50'}`}
                      >
                        <List className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Enhanced Active Filters */}
              {activeFiltersCount > 0 && (
                <div className="mt-6 bg-gradient-to-r from-blue-50/50 to-green-50/50 rounded-2xl p-4 border border-blue-100/50">
                  <div className="flex flex-wrap items-center gap-3">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      <span className="text-sm font-medium text-gray-700">Active filters:</span>
                    </div>

                    {filters.locations.map((location) => (
                      <Badge key={location} className="bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 rounded-full px-3 py-1">
                        <span>📍 {location}</span>
                        <button
                          onClick={() =>
                            setFilters((prev) => ({
                              ...prev,
                              locations: prev.locations.filter((l) => l !== location),
                            }))
                          }
                          className="ml-2 hover:bg-white/20 rounded-full p-0.5 transition-colors"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </Badge>
                    ))}

                    {filters.certifications.map((cert) => (
                      <Badge key={cert} className="bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700 rounded-full px-3 py-1">
                        <span>🏆 {cert}</span>
                        <button
                          onClick={() =>
                            setFilters((prev) => ({
                              ...prev,
                              certifications: prev.certifications.filter((c) => c !== cert),
                            }))
                          }
                          className="ml-2 hover:bg-white/20 rounded-full p-0.5 transition-colors"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </Badge>
                    ))}

                    {filters.categories.map((category) => (
                      <Badge key={category} className="bg-gradient-to-r from-purple-500 to-purple-600 text-white hover:from-purple-600 hover:to-purple-700 rounded-full px-3 py-1">
                        <span>{category}</span>
                        <button
                          onClick={() =>
                            setFilters((prev) => ({
                              ...prev,
                              categories: prev.categories.filter((c) => c !== category),
                            }))
                          }
                          className="ml-2 hover:bg-white/20 rounded-full p-0.5 transition-colors"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </Badge>
                    ))}

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={clearAllFilters}
                      className="ml-auto bg-white/80 hover:bg-white border-gray-200 rounded-full px-4 py-1 text-sm font-medium transition-all hover:shadow-sm"
                    >
                      Clear all ✨
                    </Button>
                  </div>
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

              {/* Enhanced Products Section */}
              <div className="flex-1">
                {/* Modern Results Header */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-1">
                        {filteredProducts.length} Sustainable Products
                      </h3>
                      <div className="flex items-center gap-2 text-gray-600">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        {searchTerm ? (
                          <span>Results for "{searchTerm}" • Transforming the planet</span>
                        ) : (
                          <span>Curated eco-friendly solutions • Making impact accessible</span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <span className="font-medium">Sort by:</span>
                        <select className="bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm font-medium text-gray-700 focus:ring-2 focus:ring-green-500 focus:border-green-500">
                          <option>🔥 Most Relevant</option>
                          <option>💰 Price: Low to High</option>
                          <option>💎 Price: High to Low</option>
                          <option>🌱 Highest REGEN Score</option>
                          <option>⭐ Best Rated</option>
                          <option>🆕 Newest First</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Enhanced Empty State */}
                {filteredProducts.length === 0 ? (
                  <div className="bg-gradient-to-br from-gray-50 to-green-50/30 rounded-3xl border-2 border-dashed border-gray-200 p-16 text-center">
                    <div className="max-w-md mx-auto">
                      <div className="w-24 h-24 bg-gradient-to-br from-green-100 to-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Search className="w-12 h-12 text-green-600" />
                      </div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-3">No products found</h3>
                      <p className="text-gray-600 mb-8 leading-relaxed">
                        Don't worry! Try adjusting your filters or search terms to discover amazing sustainable products.
                      </p>
                      <Button
                        onClick={clearAllFilters}
                        className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-xl px-8 py-3 font-medium transition-all duration-200 hover:scale-105 shadow-lg hover:shadow-xl"
                      >
                        ✨ Clear filters and explore
                      </Button>
                    </div>
                  </div>
                ) : (
                  <>
                    {/* Enhanced Featured Banner */}
                    {filteredProducts.some(p => p.featured) && (
                      <div className="bg-gradient-to-r from-green-500/10 via-green-400/10 to-emerald-500/10 border border-green-200 rounded-2xl p-6 mb-8 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-green-400/20 to-transparent rounded-full -mr-16 -mt-16"></div>
                        <div className="relative flex items-center justify-between">
                          <div>
                            <h3 className="text-lg font-bold text-green-900 mb-1 flex items-center gap-2">
                              <span className="text-xl">⭐</span>
                              Featured Products
                            </h3>
                            <p className="text-green-700">Hand-picked by our sustainability experts</p>
                          </div>
                          <Badge className="bg-gradient-to-r from-green-100 to-green-200 text-green-800 border-green-300 px-3 py-1">
                            {filteredProducts.filter(p => p.featured).length} featured
                          </Badge>
                        </div>
                      </div>
                    )}

                    {/* Enhanced Products Grid */}
                    <div className={
                      viewMode === "grid"
                        ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8"
                        : "space-y-6"
                    }>
                      {filteredProducts.map((product, index) => (
                        <div
                          key={product.id}
                          className="group animate-fade-in-up opacity-0"
                          style={{
                            animationDelay: `${index * 100}ms`,
                            animationFillMode: 'forwards'
                          }}
                        >
                          <ProductCard
                            product={product}
                            viewMode={viewMode}
                          />
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>
          </>
        ) : (
          /* NUEVO: Vista de Proyectos Comunitarios */
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Proyectos Comunitarios</h2>
              <p className="text-gray-600">Tu compra contribuye automáticamente a estos proyectos</p>
            </div>

            <div className="grid gap-6">
              {communityProjects.map((project) => (
                <Card key={project.id} className="overflow-hidden">
                  <CardContent className="p-0">
                    <div className="md:flex">
                      <div className="md:w-2/3 p-6">
                        <h3 className="text-xl font-semibold mb-2">{project.name}</h3>
                        <p className="text-gray-600 mb-4">Impacto: {project.impact}</p>
                        
                        <div className="space-y-3">
                          <div>
                            <div className="flex justify-between text-sm mb-1">
                              <span>Progreso de financiamiento</span>
                              <span>{project.progress}%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-green-600 h-2 rounded-full transition-all duration-300" 
                                style={{ width: `${project.progress}%` }}
                              ></div>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <div className="font-medium">{project.contributors.toLocaleString()}</div>
                              <div className="text-gray-500">Contribuyentes</div>
                            </div>
                            <div>
                              <div className="font-medium">${project.target.toLocaleString()} MXN</div>
                              <div className="text-gray-500">Meta total</div>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="md:w-1/3 bg-green-50 p-6 flex flex-col justify-center">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-green-600 mb-2">
                            ${Math.round(project.target * project.progress / 100).toLocaleString()} MXN
                          </div>
                          <div className="text-green-700">Recaudado</div>
                          <Button className="w-full mt-4" size="sm">
                            Contribuir directamente
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}