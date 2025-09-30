'use client'

// Modular ProductCard component with multiple variants

import React from 'react'
import Image from 'next/image'
import { Heart, ShoppingCart, Star, Leaf, Droplets, Zap } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Product } from '@/src/shared/types/api.types'
import { cn } from '@/lib/utils'

export interface ProductCardProps {
  product: Product
  variant?: 'default' | 'compact' | 'detailed' | 'list'
  showActions?: boolean
  showSustainabilityMetrics?: boolean
  className?: string
  onAddToCart?: (product: Product) => void
  onAddToWishlist?: (product: Product) => void
  onRemoveFromWishlist?: (product: Product) => void
  onClick?: (product: Product) => void
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  variant = 'default',
  showActions = true,
  showSustainabilityMetrics = true,
  className,
  onAddToCart,
  onAddToWishlist,
  onRemoveFromWishlist,
  onClick,
}) => {
  const handleCardClick = () => {
    onClick?.(product)
  }

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation()
    onAddToCart?.(product)
  }

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (product.isInWishlist) {
      onRemoveFromWishlist?.(product)
    } else {
      onAddToWishlist?.(product)
    }
  }

  const renderRegenScore = () => {
    const scoreColor =
      product.regenScore >= 80 ? 'bg-green-500' :
      product.regenScore >= 60 ? 'bg-yellow-500' :
      'bg-orange-500'

    return (
      <div className="flex items-center gap-1">
        <Leaf className="w-3 h-3 text-green-600" />
        <span className="text-xs font-medium">
          {product.regenScore}/100
        </span>
        <div className="w-8 h-1 bg-gray-200 rounded-full overflow-hidden">
          <div
            className={cn("h-full rounded-full", scoreColor)}
            style={{ width: `${product.regenScore}%` }}
          />
        </div>
      </div>
    )
  }

  const renderRating = () => {
    if (!product.averageRating || product.reviewCount === 0) return null

    return (
      <div className="flex items-center gap-1">
        <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
        <span className="text-xs font-medium">{product.averageRating.toFixed(1)}</span>
        <span className="text-xs text-gray-500">({product.reviewCount})</span>
      </div>
    )
  }

  const renderPrice = () => (
    <div className="flex items-center gap-2">
      <span className="text-lg font-bold text-gray-900">
        ${product.price.toFixed(2)}
      </span>
      {product.originalPrice && product.originalPrice > product.price && (
        <>
          <span className="text-sm text-gray-500 line-through">
            ${product.originalPrice.toFixed(2)}
          </span>
          <Badge variant="destructive" className="text-xs">
            {Math.round((1 - product.price / product.originalPrice) * 100)}% OFF
          </Badge>
        </>
      )}
    </div>
  )

  const renderSustainabilityMetrics = () => {
    if (!showSustainabilityMetrics) return null

    const metrics = [
      { icon: Leaf, value: product.co2Reduction, unit: 'kg CO₂', color: 'text-green-600' },
      { icon: Droplets, value: product.waterSaving, unit: 'L H₂O', color: 'text-blue-600' },
      { icon: Zap, value: product.energyEfficiency, unit: 'kWh', color: 'text-yellow-600' },
    ].filter(metric => metric.value > 0)

    if (metrics.length === 0) return null

    return (
      <div className="flex gap-2 text-xs">
        {metrics.map((metric, index) => (
          <div key={index} className={cn("flex items-center gap-1", metric.color)}>
            <metric.icon className="w-3 h-3" />
            <span>{metric.value}{metric.unit}</span>
          </div>
        ))}
      </div>
    )
  }

  const renderActions = () => {
    if (!showActions) return null

    return (
      <div className="flex gap-2">
        <Button
          onClick={handleWishlistToggle}
          variant="outline"
          size="sm"
          className="flex-1"
        >
          <Heart
            className={cn(
              "w-4 h-4",
              product.isInWishlist
                ? "fill-red-500 text-red-500"
                : "text-gray-500"
            )}
          />
        </Button>
        <Button
          onClick={handleAddToCart}
          size="sm"
          className="flex-1"
          disabled={!product.inStock}
        >
          <ShoppingCart className="w-4 h-4 mr-1" />
          {product.inStock ? 'Add to Cart' : 'Out of Stock'}
        </Button>
      </div>
    )
  }

  // Compact variant
  if (variant === 'compact') {
    return (
      <Card
        className={cn(
          "group cursor-pointer hover:shadow-md transition-shadow",
          className
        )}
        onClick={handleCardClick}
      >
        <CardContent className="p-3">
          <div className="flex gap-3">
            <div className="relative w-16 h-16 flex-shrink-0">
              <Image
                src={product.images[0] || '/placeholder-product.jpg'}
                alt={product.name}
                fill
                className="object-cover rounded-md"
              />
              {product.featured && (
                <Badge className="absolute -top-1 -right-1 text-xs">Featured</Badge>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-medium text-sm truncate">{product.name}</h3>
              <p className="text-xs text-gray-600 truncate">{product.vendor?.companyName}</p>
              {renderPrice()}
              <div className="flex items-center justify-between mt-1">
                {renderRegenScore()}
                {renderRating()}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  // List variant
  if (variant === 'list') {
    return (
      <Card
        className={cn(
          "group cursor-pointer hover:shadow-md transition-shadow",
          className
        )}
        onClick={handleCardClick}
      >
        <CardContent className="p-4">
          <div className="flex gap-4">
            <div className="relative w-24 h-24 flex-shrink-0">
              <Image
                src={product.images[0] || '/placeholder-product.jpg'}
                alt={product.name}
                fill
                className="object-cover rounded-lg"
              />
              {product.featured && (
                <Badge className="absolute -top-1 -right-1 text-xs">Featured</Badge>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="font-semibold text-base line-clamp-2">{product.name}</h3>
                  <p className="text-sm text-gray-600">{product.vendor?.companyName}</p>
                </div>
                {renderPrice()}
              </div>
              <p className="text-sm text-gray-700 line-clamp-2 mb-2">{product.description}</p>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  {renderRegenScore()}
                  {renderRating()}
                  {renderSustainabilityMetrics()}
                </div>
                {showActions && (
                  <div className="flex gap-2">
                    <Button
                      onClick={handleWishlistToggle}
                      variant="outline"
                      size="sm"
                    >
                      <Heart
                        className={cn(
                          "w-4 h-4",
                          product.isInWishlist
                            ? "fill-red-500 text-red-500"
                            : "text-gray-500"
                        )}
                      />
                    </Button>
                    <Button
                      onClick={handleAddToCart}
                      size="sm"
                      disabled={!product.inStock}
                    >
                      <ShoppingCart className="w-4 h-4 mr-1" />
                      Add to Cart
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  // Default and detailed variants
  return (
    <Card
      className={cn(
        "group cursor-pointer hover:shadow-lg transition-all duration-200",
        variant === 'detailed' && "max-w-sm",
        className
      )}
      onClick={handleCardClick}
    >
      <div className="relative">
        <div className="aspect-square relative overflow-hidden rounded-t-lg">
          <Image
            src={product.images[0] || '/placeholder-product.jpg'}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-200"
          />
          {product.featured && (
            <Badge className="absolute top-2 left-2">Featured</Badge>
          )}
          {!product.inStock && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <Badge variant="secondary">Out of Stock</Badge>
            </div>
          )}
        </div>
      </div>

      <CardContent className="p-4">
        <div className="space-y-2">
          <div>
            <h3 className="font-semibold text-base line-clamp-2 group-hover:text-green-600 transition-colors">
              {product.name}
            </h3>
            <p className="text-sm text-gray-600">{product.vendor?.companyName}</p>
          </div>

          {variant === 'detailed' && (
            <p className="text-sm text-gray-700 line-clamp-3">{product.description}</p>
          )}

          <div className="flex items-center justify-between">
            {renderRegenScore()}
            {renderRating()}
          </div>

          {showSustainabilityMetrics && (
            <div className="pt-1">
              {renderSustainabilityMetrics()}
            </div>
          )}

          {renderPrice()}

          {product.certifications.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {product.certifications.slice(0, 2).map((cert, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {cert}
                </Badge>
              ))}
              {product.certifications.length > 2 && (
                <Badge variant="outline" className="text-xs">
                  +{product.certifications.length - 2} more
                </Badge>
              )}
            </div>
          )}
        </div>
      </CardContent>

      {showActions && (
        <CardFooter className="p-4 pt-0">
          {renderActions()}
        </CardFooter>
      )}
    </Card>
  )
}