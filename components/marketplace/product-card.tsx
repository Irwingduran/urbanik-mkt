"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
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
  Eye,
  Plus,
  Minus,
} from "lucide-react"
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks"
import { addItem, updateQuantity, selectCartItemByProductId } from "@/lib/store/slices/cartSlice"

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
  nfts: Array<{
    id: number
    name: string
    emoji: string
    rarity: string
  }>
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

interface ProductCardProps {
  product: Product
  viewMode: "grid" | "list"
}

export function ProductCard({ product, viewMode }: ProductCardProps) {
  const dispatch = useAppDispatch()
  const [isLiked, setIsLiked] = useState(false)
  const [showNFTModal, setShowNFTModal] = useState(false)

  // Get cart item for this product
  const cartItem = useAppSelector(selectCartItemByProductId(product.id))

  const handleAddToCart = () => {
    dispatch(addItem({
      productId: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      vendorId: product.vendor, // Using vendor name as ID for now
      vendorName: product.vendor,
      maxStock: Math.min(product.stock, product.maxOrderQuantity)
    }))
  }

  const handleUpdateQuantity = (newQuantity: number) => {
    dispatch(updateQuantity({
      productId: product.id,
      quantity: newQuantity
    }))
  }

  const getRegenScoreLevel = (score: number) => {
    if (score >= 90) return { level: "Excelente", color: "bg-green-600" }
    if (score >= 80) return { level: "Muy Bueno", color: "bg-green-500" }
    if (score >= 70) return { level: "Bueno", color: "bg-yellow-500" }
    return { level: "Regular", color: "bg-gray-500" }
  }

  const regenLevel = getRegenScoreLevel(product.regenScore)

  if (viewMode === "list") {
    return (
      <Card className="hover:shadow-lg transition-shadow">
        <CardContent className="p-6">
          <div className="flex gap-6">
            {/* Product Image */}
            <div className="relative w-32 h-32 flex-shrink-0">
              <img
                src={product.image || "/placeholder.svg"}
                alt={product.name}
                className="w-full h-full object-cover rounded-lg"
              />
              {product.featured && <Badge className="absolute top-2 left-2 bg-yellow-500 text-white">Destacado</Badge>}
              {!product.inStock && (
                <div className="absolute inset-0 bg-black bg-opacity-50 rounded-lg flex items-center justify-center">
                  <Badge variant="destructive">Sin Stock</Badge>
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="flex-1 space-y-3">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">{product.name}</h3>
                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <span className="flex items-center">
                    <MapPin className="w-4 h-4 mr-1" />
                    {product.vendor} • {product.location}
                  </span>
                  <span className="flex items-center">
                    <Star className="w-4 h-4 mr-1 text-yellow-500" />
                    {product.rating} ({product.reviews})
                  </span>
                </div>
              </div>

              {/* REGEN Score */}
              <div className="flex items-center space-x-3">
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium">REGEN Score</span>
                    <span className="text-sm font-bold text-green-600">{product.regenScore}</span>
                  </div>
                  <div className="flex space-x-1">
                    {[...Array(5)].map((_, i) => (
                      <div
                        key={i}
                        className={`h-2 flex-1 rounded ${
                          i < Math.floor(product.regenScore / 20) ? regenLevel.color : "bg-gray-200"
                        }`}
                      />
                    ))}
                  </div>
                </div>
                <Badge variant="secondary" className={`${regenLevel.color} text-white`}>
                  {regenLevel.level}
                </Badge>
              </div>

              {/* Environmental Metrics */}
              <div className="grid grid-cols-3 gap-4 text-sm">
                {product.metrics.co2Reduced > 0 && (
                  <div className="flex items-center space-x-2">
                    <TreePine className="w-4 h-4 text-green-600" />
                    <span>{product.metrics.co2Reduced} ton CO₂/año</span>
                  </div>
                )}
                {product.metrics.waterSaved > 0 && (
                  <div className="flex items-center space-x-2">
                    <Droplets className="w-4 h-4 text-blue-600" />
                    <span>{product.metrics.waterSaved.toLocaleString()} L/año</span>
                  </div>
                )}
                {product.metrics.energyEfficiency > 0 && (
                  <div className="flex items-center space-x-2">
                    <Zap className="w-4 h-4 text-yellow-600" />
                    <span>{product.metrics.energyEfficiency}% eficiencia</span>
                  </div>
                )}
              </div>

              {/* NFTs and Certifications */}
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-1">
                  {product.nfts.slice(0, 3).map((nft) => (
                    <button
                      key={nft.id}
                      onClick={() => setShowNFTModal(true)}
                      className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
                      title={nft.name}
                    >
                      <span className="text-xs">{nft.emoji}</span>
                    </button>
                  ))}
                  {product.nfts.length > 3 && <span className="text-xs text-gray-500">+{product.nfts.length - 3}</span>}
                </div>

                <div className="flex items-center space-x-1">
                  <Award className="w-4 h-4 text-yellow-600" />
                  <span className="text-sm text-gray-600">{product.certifications.length} certificaciones</span>
                </div>
              </div>
            </div>

            {/* Price and Actions */}
            <div className="w-48 flex flex-col justify-between">
              <div className="text-right">
                <div className="flex items-center justify-end space-x-2 mb-2">
                  {product.originalPrice && (
                    <span className="text-sm text-gray-500 line-through">${product.originalPrice}</span>
                  )}
                  <span className="text-2xl font-bold text-green-600">${product.price}</span>
                </div>
                <Badge variant="outline" className="mb-4">
                  {product.category}
                </Badge>
              </div>

              <div className="space-y-2">
                <Button className="w-full bg-yellow-500 hover:bg-yellow-600 text-white" size="sm">
                  <Award className="w-4 h-4 mr-2" />
                  Solicitar Certificación
                </Button>

                <Button variant="outline" className="w-full bg-transparent" size="sm">
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Solicitar Cotización
                </Button>

                {cartItem ? (
                  <div className="flex items-center justify-between w-full bg-green-50 border border-green-200 rounded-lg p-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8 w-8 p-0 border-green-300"
                      onClick={() => handleUpdateQuantity(cartItem.quantity - 1)}
                    >
                      <Minus className="w-3 h-3" />
                    </Button>
                    <span className="text-sm font-semibold text-green-700">
                      {cartItem.quantity} en carrito
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8 w-8 p-0 border-green-300"
                      onClick={() => handleUpdateQuantity(cartItem.quantity + 1)}
                      disabled={cartItem.quantity >= cartItem.maxStock}
                    >
                      <Plus className="w-3 h-3" />
                    </Button>
                  </div>
                ) : (
                  <Button
                    className="w-full bg-green-600 hover:bg-green-700 text-white"
                    disabled={!product.inStock}
                    size="sm"
                    onClick={handleAddToCart}
                  >
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    {product.inStock ? "Añadir al Carrito" : "Sin Stock"}
                  </Button>
                )}

                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 bg-transparent"
                    onClick={() => setIsLiked(!isLiked)}
                  >
                    <Heart className={`w-4 h-4 ${isLiked ? "fill-red-500 text-red-500" : ""}`} />
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                    <Share2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  // Grid view
  return (
    <Card className="group hover:shadow-lg transition-all duration-300 overflow-hidden">
      <div className="relative">
        <img
          src={product.image || "/placeholder.svg"}
          alt={product.name}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />

        {/* Overlay badges */}
        <div className="absolute top-3 left-3 space-y-2">
          {product.featured && <Badge className="bg-yellow-500 text-white">Destacado</Badge>}
          {product.originalPrice && (
            <Badge className="bg-red-500 text-white">
              -{Math.round((1 - product.price / product.originalPrice) * 100)}%
            </Badge>
          )}
        </div>

        {/* Quick actions */}
        <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity space-y-2">
          <Button
            variant="secondary"
            size="icon"
            className="w-8 h-8 bg-white/90 hover:bg-white"
            onClick={() => setIsLiked(!isLiked)}
          >
            <Heart className={`w-4 h-4 ${isLiked ? "fill-red-500 text-red-500" : ""}`} />
          </Button>
          <Button variant="secondary" size="icon" className="w-8 h-8 bg-white/90 hover:bg-white">
            <Share2 className="w-4 h-4" />
          </Button>
          <Button variant="secondary" size="icon" className="w-8 h-8 bg-white/90 hover:bg-white">
            <Eye className="w-4 h-4" />
          </Button>
        </div>

        {/* Stock overlay */}
        {!product.inStock && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <Badge variant="destructive" className="text-lg px-4 py-2">
              Sin Stock
            </Badge>
          </div>
        )}
      </div>

      <CardContent className="p-4 space-y-3">
        {/* Product Info */}
        <div>
          <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2">{product.name}</h3>
          <div className="flex items-center justify-between text-sm text-gray-500">
            <span className="flex items-center">
              <MapPin className="w-3 h-3 mr-1" />
              {product.vendor}
            </span>
            <span className="flex items-center">
              <Star className="w-3 h-3 mr-1 text-yellow-500" />
              {product.rating} ({product.reviews})
            </span>
          </div>
        </div>

        {/* REGEN Score */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">REGEN Score</span>
            <span className="text-sm font-bold text-green-600">{product.regenScore}</span>
          </div>
          <div className="flex space-x-1 mb-1">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className={`h-1.5 flex-1 rounded ${
                  i < Math.floor(product.regenScore / 20) ? regenLevel.color : "bg-gray-200"
                }`}
              />
            ))}
          </div>
          <Badge variant="secondary" className={`text-xs ${regenLevel.color} text-white`}>
            {regenLevel.level}
          </Badge>
        </div>

        {/* NFTs */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-1">
            {product.nfts.slice(0, 4).map((nft) => (
              <button
                key={nft.id}
                onClick={() => setShowNFTModal(true)}
                className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
                title={nft.name}
              >
                <span className="text-xs">{nft.emoji}</span>
              </button>
            ))}
            {product.nfts.length > 4 && <span className="text-xs text-gray-500">+{product.nfts.length - 4}</span>}
          </div>

          <div className="flex items-center space-x-1">
            <Award className="w-3 h-3 text-yellow-600" />
            <span className="text-xs text-gray-600">{product.certifications.length}</span>
          </div>
        </div>

        {/* Environmental Metrics */}
        <div className="grid grid-cols-3 gap-2 text-xs">
          {product.metrics.co2Reduced > 0 && (
            <div className="flex flex-col items-center text-center">
              <TreePine className="w-4 h-4 text-green-600 mb-1" />
              <span className="font-medium">{product.metrics.co2Reduced}t</span>
              <span className="text-gray-500">CO₂/año</span>
            </div>
          )}
          {product.metrics.waterSaved > 0 && (
            <div className="flex flex-col items-center text-center">
              <Droplets className="w-4 h-4 text-blue-600 mb-1" />
              <span className="font-medium">{(product.metrics.waterSaved / 1000).toFixed(1)}k</span>
              <span className="text-gray-500">L/año</span>
            </div>
          )}
          {product.metrics.energyEfficiency > 0 && (
            <div className="flex flex-col items-center text-center">
              <Zap className="w-4 h-4 text-yellow-600 mb-1" />
              <span className="font-medium">{product.metrics.energyEfficiency}%</span>
              <span className="text-gray-500">eficiencia</span>
            </div>
          )}
        </div>

        {/* Price */}
        <div className="flex items-center justify-between">
          <div>
            {product.originalPrice && (
              <span className="text-sm text-gray-500 line-through">${product.originalPrice}</span>
            )}
            <div className="text-xl font-bold text-green-600">${product.price}</div>
          </div>
          <Badge variant="outline" className="text-xs">
            {product.category}
          </Badge>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2">
          <Button className="w-full bg-yellow-500 hover:bg-yellow-600 text-white" size="sm">
            <Award className="w-4 h-4 mr-2" />
            Solicitar Certificación
          </Button>

          <div className="grid grid-cols-2 gap-2">
            <Button variant="outline" size="sm">
              <MessageSquare className="w-4 h-4 mr-1" />
              Cotizar
            </Button>
            {cartItem ? (
              <div className="flex items-center justify-between bg-green-50 border border-green-200 rounded-lg px-2 py-1">
                <Button
                  variant="outline"
                  size="sm"
                  className="h-7 w-7 p-0 border-green-300"
                  onClick={() => handleUpdateQuantity(cartItem.quantity - 1)}
                >
                  <Minus className="w-3 h-3" />
                </Button>
                <span className="text-xs font-semibold text-green-700 mx-1">
                  {cartItem.quantity}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-7 w-7 p-0 border-green-300"
                  onClick={() => handleUpdateQuantity(cartItem.quantity + 1)}
                  disabled={cartItem.quantity >= cartItem.maxStock}
                >
                  <Plus className="w-3 h-3" />
                </Button>
              </div>
            ) : (
              <Button
                className="bg-green-600 hover:bg-green-700 text-white"
                disabled={!product.inStock}
                size="sm"
                onClick={handleAddToCart}
              >
                <ShoppingCart className="w-4 h-4 mr-1" />
                {product.inStock ? "Carrito" : "Sin Stock"}
              </Button>
            )}
          </div>
        </div>
      </CardContent>

      {/* NFT Modal (placeholder) */}
      {showNFTModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">NFTs Asociados</h3>
            <div className="space-y-3">
              {product.nfts.map((nft) => (
                <div key={nft.id} className="flex items-center space-x-3 p-3 border rounded-lg">
                  <span className="text-2xl">{nft.emoji}</span>
                  <div>
                    <p className="font-medium">{nft.name}</p>
                    <Badge variant="secondary" className="text-xs">
                      {nft.rarity}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
            <Button onClick={() => setShowNFTModal(false)} className="w-full mt-4">
              Cerrar
            </Button>
          </div>
        </div>
      )}
    </Card>
  )
}
