"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Star,
  MapPin,
  Award,
  ShoppingCart,
  Heart,
  Share2,
  MessageSquare,
  TreePine,
  Droplets,
  Zap,
  ArrowLeft,
  CheckCircle,
  Truck,
  ShieldCheck,
  Minus,
  Plus
} from "lucide-react"
import Header from "@/components/layout/header"
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks"
import { addItem, updateQuantity, selectCartItemByProductId } from "@/lib/store/slices/cartSlice"
import Link from "next/link"

interface ProductDetail {
  id: string
  name: string
  description: string
  price: number
  originalPrice?: number
  sku: string
  category: string
  images: string[]
  stock: number
  maxOrderQuantity: number
  regenScore: number
  certifications: string[]
  co2Reduction: number
  waterSaving: number
  energyEfficiency: number
  dimensions?: any
  materials?: string[]
  origin?: string
  nfts: any[]
  featured: boolean
  averageRating: number
  reviewCount: number
  vendorProfile: {
    id: string
    companyName: string
    description?: string
    website?: string
    phone?: string
    regenScore: number
    totalProducts: number
    totalSales: number
    name: string
    email: string
    location?: string
  }
  reviews: any[]
}

export default function ProductDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { data: session } = useSession()
  const dispatch = useAppDispatch()
  
  const [product, setProduct] = useState<ProductDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedImage, setSelectedImage] = useState(0)
  const [quantity, setQuantity] = useState(1)

  const cartItem = useAppSelector(selectCartItemByProductId(product?.id || ""))

  useEffect(() => {
    if (params.id) {
      fetchProduct(params.id as string)
    }
  }, [params.id])

  const fetchProduct = async (id: string) => {
    try {
      setLoading(true)
      const response = await fetch(`/api/products/${id}`)
      const data = await response.json()
      
      if (response.ok) {
        setProduct(data.data || data)
      } else {
        console.error("Error fetching product:", data.error)
      }
    } catch (error) {
      console.error("Error fetching product:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddToCart = () => {
    if (!product) return
    
    dispatch(addItem({
      productId: product.id,
      name: product.name,
      price: product.price,
      image: product.images[0] || "/placeholder.svg",
      vendorId: product.vendorProfile.companyName, // Using company name as ID for now to match existing logic
      vendorName: product.vendorProfile.companyName,
      maxStock: Math.min(product.stock, product.maxOrderQuantity)
    }))
  }

  const handleUpdateCartQuantity = (newQuantity: number) => {
    if (!product) return
    dispatch(updateQuantity({
      productId: product.id,
      quantity: newQuantity
    }))
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
          </div>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Producto no encontrado</h2>
          <Link href="/marketplace">
            <Button>Volver al Marketplace</Button>
          </Link>
        </div>
      </div>
    )
  }

  const getRegenScoreColor = (score: number) => {
    if (score >= 90) return "text-green-600"
    if (score >= 80) return "text-blue-600"
    if (score >= 70) return "text-yellow-600"
    return "text-gray-600"
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb / Back */}
        <div className="mb-6">
          <Link href="/marketplace" className="inline-flex items-center text-sm text-gray-600 hover:text-green-600">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver al Marketplace
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left Column: Images */}
          <div className="space-y-4">
            <div className="aspect-square bg-white rounded-2xl overflow-hidden border border-gray-200 relative">
              <img 
                src={product.images[selectedImage] || "/placeholder.svg"} 
                alt={product.name}
                className="w-full h-full object-cover"
              />
              {product.featured && (
                <Badge className="absolute top-4 left-4 bg-yellow-500 text-white">
                  Destacado
                </Badge>
              )}
            </div>
            
            {product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-4">
                {product.images.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`aspect-square rounded-lg overflow-hidden border-2 ${
                      selectedImage === index ? "border-green-600" : "border-transparent"
                    }`}
                  >
                    <img src={img} alt={`${product.name} ${index + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            {/* Sustainability Metrics Card */}
            <Card className="bg-gradient-to-br from-green-50 to-blue-50 border-green-100">
              <CardHeader>
                <CardTitle className="flex items-center text-green-800">
                  <TreePine className="w-5 h-5 mr-2" />
                  Impacto Ambiental por Unidad
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div className="p-3 bg-white bg-opacity-60 rounded-lg">
                    <div className="text-2xl font-bold text-green-700">{product.co2Reduction}kg</div>
                    <div className="text-xs text-green-800 font-medium">CO₂ Reducido</div>
                  </div>
                  <div className="p-3 bg-white bg-opacity-60 rounded-lg">
                    <div className="text-2xl font-bold text-blue-700">{product.waterSaving}L</div>
                    <div className="text-xs text-blue-800 font-medium">Agua Ahorrada</div>
                  </div>
                  <div className="p-3 bg-white bg-opacity-60 rounded-lg">
                    <div className="text-2xl font-bold text-yellow-700">{product.energyEfficiency}%</div>
                    <div className="text-xs text-yellow-800 font-medium">Eficiencia Energética</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column: Product Info */}
          <div className="space-y-8">
            <div>
              <div className="flex items-center justify-between mb-2">
                <Badge variant="outline" className="text-sm">
                  {product.category}
                </Badge>
                <div className="flex items-center text-yellow-500">
                  <Star className="w-4 h-4 fill-current" />
                  <span className="ml-1 font-medium text-gray-900">{product.averageRating.toFixed(1)}</span>
                  <span className="ml-1 text-gray-500">({product.reviewCount} reseñas)</span>
                </div>
              </div>
              
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
              
              <div className="flex items-center text-gray-600 mb-4">
                <MapPin className="w-4 h-4 mr-1" />
                <span>{product.vendorProfile.location || "México"}</span>
                <span className="mx-2">•</span>
                <span className="text-green-600 font-medium">{product.vendorProfile.companyName}</span>
              </div>

              <div className="flex items-end space-x-4 mb-6">
                <div className="text-4xl font-bold text-gray-900">
                  ${product.price.toLocaleString('es-MX')}
                </div>
                {product.originalPrice && (
                  <div className="text-xl text-gray-500 line-through mb-1">
                    ${product.originalPrice.toLocaleString('es-MX')}
                  </div>
                )}
              </div>

              <div className="prose prose-sm text-gray-600 mb-6">
                <p>{product.description}</p>
              </div>

              {/* REGEN Score */}
              <div className="bg-gray-50 rounded-xl p-4 mb-6 border border-gray-100">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-gray-900">REGEN Score</span>
                  <span className={`text-2xl font-bold ${getRegenScoreColor(product.regenScore)}`}>
                    {product.regenScore}/100
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5 mb-2">
                  <div 
                    className="bg-gradient-to-r from-green-500 to-green-600 h-2.5 rounded-full" 
                    style={{ width: `${product.regenScore}%` }}
                  ></div>
                </div>
                <p className="text-xs text-gray-500">
                  Este producto cumple con altos estándares de sostenibilidad y regeneración ambiental.
                </p>
              </div>

              {/* Actions */}
              <div className="space-y-4">
                {cartItem ? (
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center border border-gray-300 rounded-lg">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleUpdateCartQuantity(cartItem.quantity - 1)}
                      >
                        <Minus className="w-4 h-4" />
                      </Button>
                      <span className="w-12 text-center font-medium">{cartItem.quantity}</span>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleUpdateCartQuantity(cartItem.quantity + 1)}
                        disabled={cartItem.quantity >= product.stock}
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                    <Button className="flex-1 bg-green-600 hover:bg-green-700" onClick={() => router.push('/cart')}>
                      Ver Carrito
                    </Button>
                  </div>
                ) : (
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center border border-gray-300 rounded-lg">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        disabled={quantity <= 1}
                      >
                        <Minus className="w-4 h-4" />
                      </Button>
                      <span className="w-12 text-center font-medium">{quantity}</span>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                        disabled={quantity >= product.stock}
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                    <Button 
                      className="flex-1 bg-green-600 hover:bg-green-700 text-white h-12 text-lg"
                      onClick={() => {
                        dispatch(addItem({
                          productId: product.id,
                          name: product.name,
                          price: product.price,
                          image: product.images[0] || "/placeholder.svg",
                          vendorId: product.vendorProfile.companyName,
                          vendorName: product.vendorProfile.companyName,
                          maxStock: Math.min(product.stock, product.maxOrderQuantity),
                          quantity: quantity
                        }))
                      }}
                      disabled={product.stock === 0}
                    >
                      <ShoppingCart className="w-5 h-5 mr-2" />
                      {product.stock > 0 ? "Añadir al Carrito" : "Agotado"}
                    </Button>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <Button variant="outline" className="w-full">
                    <Heart className="w-4 h-4 mr-2" />
                    Guardar
                  </Button>
                  <Button variant="outline" className="w-full">
                    <Share2 className="w-4 h-4 mr-2" />
                    Compartir
                  </Button>
                </div>
              </div>

              {/* Trust Badges */}
              <div className="grid grid-cols-3 gap-4 pt-6 border-t border-gray-100">
                <div className="flex flex-col items-center text-center text-xs text-gray-600">
                  <Truck className="w-6 h-6 mb-2 text-gray-400" />
                  <span>Envío Carbono Neutral</span>
                </div>
                <div className="flex flex-col items-center text-center text-xs text-gray-600">
                  <ShieldCheck className="w-6 h-6 mb-2 text-gray-400" />
                  <span>Garantía de Calidad</span>
                </div>
                <div className="flex flex-col items-center text-center text-xs text-gray-600">
                  <Award className="w-6 h-6 mb-2 text-gray-400" />
                  <span>Certificado Verificado</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs Section */}
        <div className="mt-16">
          <Tabs defaultValue="details">
            <TabsList className="w-full justify-start border-b rounded-none h-auto p-0 bg-transparent">
              <TabsTrigger 
                value="details" 
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-green-600 data-[state=active]:bg-transparent py-4 px-6"
              >
                Detalles y Especificaciones
              </TabsTrigger>
              <TabsTrigger 
                value="vendor" 
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-green-600 data-[state=active]:bg-transparent py-4 px-6"
              >
                Sobre el Vendedor
              </TabsTrigger>
              <TabsTrigger 
                value="reviews" 
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-green-600 data-[state=active]:bg-transparent py-4 px-6"
              >
                Reseñas ({product.reviewCount})
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="details" className="py-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-lg font-semibold mb-4">Especificaciones Técnicas</h3>
                  <dl className="space-y-4">
                    {product.materials && product.materials.length > 0 && (
                      <div className="grid grid-cols-3 gap-4 pb-4 border-b border-gray-100">
                        <dt className="font-medium text-gray-500">Materiales</dt>
                        <dd className="col-span-2 text-gray-900">{product.materials.join(", ")}</dd>
                      </div>
                    )}
                    {product.origin && (
                      <div className="grid grid-cols-3 gap-4 pb-4 border-b border-gray-100">
                        <dt className="font-medium text-gray-500">Origen</dt>
                        <dd className="col-span-2 text-gray-900">{product.origin}</dd>
                      </div>
                    )}
                    <div className="grid grid-cols-3 gap-4 pb-4 border-b border-gray-100">
                      <dt className="font-medium text-gray-500">SKU</dt>
                      <dd className="col-span-2 text-gray-900">{product.sku}</dd>
                    </div>
                  </dl>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-4">Certificaciones</h3>
                  <div className="flex flex-wrap gap-2">
                    {product.certifications.map((cert, index) => (
                      <Badge key={index} variant="secondary" className="px-3 py-1">
                        <CheckCircle className="w-3 h-3 mr-2 text-green-600" />
                        {cert}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="vendor" className="py-8">
              <div className="flex items-start space-x-6">
                <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center text-2xl font-bold text-gray-500">
                  {product.vendorProfile.companyName.charAt(0)}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{product.vendorProfile.companyName}</h3>
                  <div className="flex items-center space-x-4 text-sm text-gray-600 mb-4">
                    <span className="flex items-center">
                      <MapPin className="w-4 h-4 mr-1" />
                      {product.vendorProfile.location || "Ubicación no especificada"}
                    </span>
                    <span className="flex items-center">
                      <Award className="w-4 h-4 mr-1" />
                      REGEN Score: {product.vendorProfile.regenScore}
                    </span>
                  </div>
                  <p className="text-gray-600 max-w-2xl mb-4">
                    {product.vendorProfile.description || "Este vendedor no ha proporcionado una descripción."}
                  </p>
                  <Button variant="outline">Ver Perfil del Vendedor</Button>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="reviews" className="py-8">
              {product.reviews.length > 0 ? (
                <div className="space-y-6">
                  {product.reviews.map((review) => (
                    <div key={review.id} className="border-b border-gray-100 pb-6 last:border-0">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <div className="font-semibold">{review.user.name}</div>
                          {review.verified && (
                            <Badge variant="outline" className="text-xs text-green-600 border-green-200 bg-green-50">
                              Compra Verificada
                            </Badge>
                          )}
                        </div>
                        <div className="flex text-yellow-400">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className={`w-4 h-4 ${i < review.rating ? "fill-current" : "text-gray-300"}`} />
                          ))}
                        </div>
                      </div>
                      <p className="text-gray-600">{review.comment}</p>
                      {review.vendorReply && (
                        <div className="mt-4 bg-gray-50 p-4 rounded-lg border border-gray-100 ml-8">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-semibold text-sm text-gray-900">Respuesta del Vendedor</span>
                            {review.vendorReplyAt && (
                              <span className="text-xs text-gray-500">
                                • {new Date(review.vendorReplyAt).toLocaleDateString()}
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-700">{review.vendorReply}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-gray-500">
                  <MessageSquare className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p>Aún no hay reseñas para este producto.</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  )
}