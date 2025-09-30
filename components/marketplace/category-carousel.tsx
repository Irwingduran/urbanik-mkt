"use client"

import React from 'react'
import Link from 'next/link'
import { Carousel } from '@/components/ui/carousel'

interface Category {
  name: string
  icon: string
  color: string
  count?: number
  href: string
}

interface CategoryCarouselProps {
  categories: Category[]
  title?: string
  subtitle?: string
  className?: string
}

export function CategoryCarousel({
  categories,
  title,
  subtitle,
  className = ""
}: CategoryCarouselProps) {
  const [currentItemsToShow, setCurrentItemsToShow] = React.useState(6)

  React.useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setCurrentItemsToShow(2)
      } else if (window.innerWidth < 768) {
        setCurrentItemsToShow(3)
      } else if (window.innerWidth < 1024) {
        setCurrentItemsToShow(4)
      } else if (window.innerWidth < 1280) {
        setCurrentItemsToShow(5)
      } else {
        setCurrentItemsToShow(6)
      }
    }

    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  if (!categories?.length) {
    return null
  }

  return (
    <div className={className}>
      {title && (
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-3">{title}</h2>
          {subtitle && <p className="text-gray-600">{subtitle}</p>}
        </div>
      )}

      <Carousel
        autoPlay={false}
        showDots={categories.length > currentItemsToShow}
        showArrows={true}
        itemsToShow={currentItemsToShow}
        gap={16}
        className="group"
      >
        {categories.map((category) => (
          <Link key={category.name} href={category.href}>
            <div className="group/item bg-white rounded-2xl p-6 text-center hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer border border-gray-100 h-full">
              <div className={`w-16 h-16 bg-gradient-to-br ${category.color} rounded-2xl flex items-center justify-center mb-4 mx-auto group-hover/item:scale-110 transition-transform shadow-lg`}>
                <span className="text-2xl">{category.icon}</span>
              </div>
              <h3 className="font-semibold text-gray-900 text-sm leading-tight mb-2">
                {category.name}
              </h3>
              {category.count && (
                <p className="text-xs text-gray-500">
                  {category.count} productos
                </p>
              )}
              <div className="mt-2 text-xs text-green-600 opacity-0 group-hover/item:opacity-100 transition-opacity">
                Explorar →
              </div>
            </div>
          </Link>
        ))}
      </Carousel>
    </div>
  )
}