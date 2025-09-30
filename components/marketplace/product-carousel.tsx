"use client"

import React from 'react'
import { Carousel } from '@/components/ui/carousel'
import { ProductCard } from './product-card'

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

interface ProductCarouselProps {
  products: Product[]
  title?: string
  subtitle?: string
  autoPlay?: boolean
  showDots?: boolean
  itemsToShow?: {
    mobile: number
    tablet: number
    desktop: number
  }
  className?: string
}

export function ProductCarousel({
  products,
  title,
  subtitle,
  autoPlay = false,
  showDots = true,
  itemsToShow = { mobile: 1, tablet: 2, desktop: 3 },
  className = ""
}: ProductCarouselProps) {
  // Responsive items calculation
  const getItemsToShow = () => {
    if (typeof window !== 'undefined') {
      if (window.innerWidth < 768) return itemsToShow.mobile
      if (window.innerWidth < 1024) return itemsToShow.tablet
      return itemsToShow.desktop
    }
    return itemsToShow.desktop
  }

  const [currentItemsToShow, setCurrentItemsToShow] = React.useState(getItemsToShow())

  React.useEffect(() => {
    const handleResize = () => {
      setCurrentItemsToShow(getItemsToShow())
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [itemsToShow])

  if (!products?.length) {
    return (
      <div className={`${className}`}>
        {title && (
          <div className="mb-6">
            <h3 className="text-2xl font-bold text-gray-900 mb-2">{title}</h3>
            {subtitle && <p className="text-gray-600">{subtitle}</p>}
          </div>
        )}
        <div className="text-center py-12 text-gray-500">
          No products available
        </div>
      </div>
    )
  }

  return (
    <div className={`group ${className}`}>
      {title && (
        <div className="mb-6">
          <h3 className="text-2xl font-bold text-gray-900 mb-2">{title}</h3>
          {subtitle && <p className="text-gray-600">{subtitle}</p>}
        </div>
      )}

      <Carousel
        autoPlay={autoPlay}
        showDots={showDots}
        showArrows={true}
        itemsToShow={currentItemsToShow}
        gap={24}
        className="group"
      >
        {products.map((product) => (
          <div key={product.id} className="h-full">
            <ProductCard
              product={product}
              viewMode="grid"
            />
          </div>
        ))}
      </Carousel>
    </div>
  )
}