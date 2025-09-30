"use client"

import React, { useState, useEffect, useRef, ReactNode } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from './button'

interface CarouselProps {
  children: ReactNode[]
  autoPlay?: boolean
  autoPlayInterval?: number
  showDots?: boolean
  showArrows?: boolean
  itemsToShow?: number
  gap?: number
  className?: string
}

export function Carousel({
  children,
  autoPlay = false,
  autoPlayInterval = 3000,
  showDots = true,
  showArrows = true,
  itemsToShow = 1,
  gap = 16,
  className = ""
}: CarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isHovered, setIsHovered] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const totalItems = children.length
  const maxIndex = Math.max(0, totalItems - itemsToShow)

  // Auto-play functionality
  useEffect(() => {
    if (!autoPlay || isHovered || totalItems <= itemsToShow) return

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1))
    }, autoPlayInterval)

    return () => clearInterval(interval)
  }, [autoPlay, autoPlayInterval, isHovered, maxIndex, totalItems, itemsToShow])

  const goToSlide = (index: number) => {
    setCurrentIndex(Math.max(0, Math.min(index, maxIndex)))
  }

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev <= 0 ? maxIndex : prev - 1))
  }

  const goToNext = () => {
    setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1))
  }

  const translateX = -(currentIndex * (100 / itemsToShow))

  return (
    <div
      className={`relative w-full ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Carousel Container */}
      <div className="overflow-hidden rounded-xl" ref={containerRef}>
        <div
          className="flex transition-transform duration-500 ease-in-out"
          style={{
            transform: `translateX(${translateX}%)`,
            gap: `${gap}px`
          }}
        >
          {children.map((child, index) => (
            <div
              key={index}
              className="flex-shrink-0"
              style={{ width: `calc(${100 / itemsToShow}% - ${gap * (itemsToShow - 1) / itemsToShow}px)` }}
            >
              {child}
            </div>
          ))}
        </div>
      </div>

      {/* Navigation Arrows */}
      {showArrows && totalItems > itemsToShow && (
        <>
          <Button
            variant="outline"
            size="sm"
            className="absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white border-gray-200 shadow-lg rounded-full w-10 h-10 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={goToPrevious}
            disabled={currentIndex === 0 && !autoPlay}
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white border-gray-200 shadow-lg rounded-full w-10 h-10 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={goToNext}
            disabled={currentIndex >= maxIndex && !autoPlay}
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </>
      )}

      {/* Dots Indicator */}
      {showDots && totalItems > itemsToShow && (
        <div className="flex justify-center space-x-2 mt-4">
          {Array.from({ length: maxIndex + 1 }).map((_, index) => (
            <button
              key={index}
              className={`w-2 h-2 rounded-full transition-all duration-200 ${
                index === currentIndex
                  ? 'bg-green-500 w-6'
                  : 'bg-gray-300 hover:bg-gray-400'
              }`}
              onClick={() => goToSlide(index)}
            />
          ))}
        </div>
      )}
    </div>
  )
}