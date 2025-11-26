"use client"

import { useState, useMemo, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, Grid3X3, List, X } from "lucide-react"
import { ProductCard } from "@/components/marketplace/product-card"
import { MarketplaceFilters } from "@/components/marketplace/marketplace-filters"
import Header from "@/components/layout/header"
import { CartSidebar } from "@/components/cart/cart-sidebar"

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
  materials?: string[]
  description: string
  stock: number
  maxOrderQuantity: number
}

interface ApiProduct {
  id: string
  name: string
  vendorProfile?: {
    companyName?: string
    name?: string
    location?: string
  }
  price: number
  originalPrice?: number
  averageRating: number
  reviewCount: number
  regenScore: number
  images: string[]
  category: string
  stock: number
  featured: boolean
  nfts: unknown[]
  co2Reduction: number
  waterSaving: number
  energyEfficiency: number
  certifications: string[]
  materials?: string[]
  description: string
  maxOrderQuantity: number
}

interface ApiCategory {
  name: string
  icon?: string
}

export default function Marketplace() {
  const searchParams = useSearchParams()
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [searchTerm, setSearchTerm] = useState(searchParams?.get('search') || "")
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Array<{ name: string; icon: string; color: string }>>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filters, setFilters] = useState({
    locations: [] as string[],
    certifications: [] as string[],
    materials: [] as string[],
    priceRange: [0, 25000],
    minRegenScore: 0,
    inStockOnly: false,
    featuredOnly: searchParams?.get('featured') === 'true' || false,
    categories: searchParams?.get('category') ? [searchParams.get('category')!] : [] as string[],
  })

  // Initialize filters from URL params
  useEffect(() => {
    setFilters(prev => {
      const urlFilters = { ...prev }

      if (searchParams?.get('featured') === 'true') {
        urlFilters.featuredOnly = true
      }

      if (searchParams?.get('sale') === 'true') {
        // Handle sale filter - could add a separate sale filter or use existing logic
      }

      if (searchParams?.get('category')) {
        urlFilters.categories = [searchParams.get('category')!]
      }

      return urlFilters
    })
  }, [searchParams])

  // Fetch products from API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true)
        const params = new URLSearchParams()

        if (searchTerm) params.append('search', searchTerm)
        if (filters.featuredOnly) params.append('featured', 'true')
        
        // Add new filters to API params
        if (filters.minRegenScore > 0) {
          params.append('minRegenScore', filters.minRegenScore.toString())
        }

        if (filters.certifications.length > 0) {
          params.append('certifications', filters.certifications.join(','))
        }

        if (filters.materials.length > 0) {
          params.append('materials', filters.materials.join(','))
        }

        if (filters.locations.length > 0) {
          // Map locations to origin
          // Note: In a real app, you might want to be more specific or have a separate origin filter
          // For now, we'll assume location filter maps to origin search
          params.append('origin', filters.locations.join(','))
        }

        if (filters.categories.length > 0) {
          filters.categories.forEach(cat => params.append('category', cat))
        }

        const response = await fetch(`/api/products?${params.toString()}`)
        const data = await response.json()

        if (data.success) {
          // Transform API data to match frontend interface
          const transformedProducts: Product[] = data.data.map((product: ApiProduct) => ({
            id: product.id,
            name: product.name,
            vendor: product.vendorProfile?.companyName || product.vendorProfile?.name || 'Vendor',
            location: product.vendorProfile?.location || 'México',
            price: product.price,
            originalPrice: product.originalPrice,
            rating: product.averageRating,
            reviews: product.reviewCount,
            regenScore: product.regenScore,
            image: product.images[0] || '/placeholder.svg',
            images: product.images,
            category: product.category,
            inStock: product.stock > 0,
            featured: product.featured,
            nfts: product.nfts,
            metrics: {
              co2Reduced: product.co2Reduction,
              waterSaved: product.waterSaving,
              energyEfficiency: product.energyEfficiency,
            },
            certifications: product.certifications,
            materials: product.materials,
            description: product.description,
            stock: product.stock,
            maxOrderQuantity: product.maxOrderQuantity
          }))
          setProducts(transformedProducts)
        } else {
          setError(data.error || 'Failed to fetch products')
        }
      } catch (err) {
        setError('Failed to fetch products')
        console.error('Error fetching products:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [searchTerm, filters])

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('/api/categories')
        const data = await response.json()

        if (data.success) {
          const categoryMap: { [key: string]: { icon: string; color: string } } = {
            'Energía Solar': { icon: '☀️', color: 'from-yellow-500 to-orange-500' },
            'Gestión de Agua': { icon: '💧', color: 'from-blue-500 to-cyan-500' },
            'Movilidad Eléctrica': { icon: '🔋', color: 'from-green-500 to-emerald-500' },
            'Gestión de Residuos': { icon: '♻️', color: 'from-emerald-500 to-green-600' },
            'Iluminación': { icon: '💡', color: 'from-amber-500 to-yellow-500' },
            'Calidad del Aire': { icon: '🌬️', color: 'from-cyan-500 to-blue-500' }
          }

          const transformedCategories = data.data.map((cat: ApiCategory) => ({
            name: cat.name,
            icon: categoryMap[cat.name]?.icon || cat.icon || '🌱',
            color: categoryMap[cat.name]?.color || 'from-green-500 to-green-600'
          }))
          setCategories(transformedCategories)
        }
      } catch (err) {
        console.error('Error fetching categories:', err)
      }
    }

    fetchCategories()
  }, [])

  // Filter products based on current filters
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
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

      // Materials filter
      if (
        filters.materials.length > 0 &&
        product.materials &&
        !filters.materials.some((mat) => product.materials?.includes(mat))
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
  }, [products, searchTerm, filters])

  const activeFiltersCount =
    filters.locations.length +
    filters.certifications.length +
    filters.materials.length +
    filters.categories.length +
    (filters.priceRange[0] > 0 || filters.priceRange[1] < 25000 ? 1 : 0) +
    (filters.minRegenScore > 0 ? 1 : 0) +
    (filters.inStockOnly ? 1 : 0) +
    (filters.featuredOnly ? 1 : 0)

  const clearAllFilters = () => {
    setFilters({
      locations: [],
      certifications: [],
      materials: [],
      priceRange: [0, 25000],
      minRegenScore: 0,
      inStockOnly: false,
      featuredOnly: false,
      categories: [],
    })
    setSearchTerm("")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-green-50/30">
      {/* Enhanced Navbar */}
      <Header />

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
        {/* Enhanced Categories */}
        <div className="mb-12">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((category) => (
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

                {filters.materials.map((mat) => (
                  <Badge key={mat} className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white hover:from-emerald-600 hover:to-emerald-700 rounded-full px-3 py-1">
                    <span>🌿 {mat}</span>
                    <button
                      onClick={() =>
                        setFilters((prev) => ({
                          ...prev,
                          materials: prev.materials.filter((m) => m !== mat),
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
          <div className="w-80 flex-shrink-0">
            <MarketplaceFilters filters={filters} setFilters={setFilters} />
          </div>

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
                      <span>Results for &quot;{searchTerm}&quot; • Transforming the planet</span>
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

            {/* Loading State */}
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 animate-pulse">
                    <div className="h-48 bg-gray-200 rounded-xl mb-4"></div>
                    <div className="h-4 bg-gray-200 rounded mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded mb-4 w-3/4"></div>
                    <div className="flex justify-between items-center">
                      <div className="h-6 bg-gray-200 rounded w-20"></div>
                      <div className="h-8 bg-gray-200 rounded w-24"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : error ? (
              <div className="bg-gradient-to-br from-red-50 to-orange-50/30 rounded-3xl border-2 border-dashed border-red-200 p-16 text-center">
                <div className="max-w-md mx-auto">
                  <div className="w-24 h-24 bg-gradient-to-br from-red-100 to-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <span className="text-3xl">⚠️</span>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">Error loading products</h3>
                  <p className="text-gray-600 mb-8 leading-relaxed">
                    {error}
                  </p>
                  <Button
                    onClick={() => window.location.reload()}
                    className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-xl px-8 py-3 font-medium transition-all duration-200 hover:scale-105 shadow-lg hover:shadow-xl"
                  >
                    🔄 Try again
                  </Button>
                </div>
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="bg-gradient-to-br from-gray-50 to-green-50/30 rounded-3xl border-2 border-dashed border-gray-200 p-16 text-center">
                <div className="max-w-md mx-auto">
                  <div className="w-24 h-24 bg-gradient-to-br from-green-100 to-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Search className="w-12 h-12 text-green-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">No products found</h3>
                  <p className="text-gray-600 mb-8 leading-relaxed">
                    Don&apos;t worry! Try adjusting your filters or search terms to discover amazing sustainable products.
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
      </div>

      {/* Cart Sidebar */}
      <CartSidebar />
    </div>
  )
}