"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ChevronLeft, ChevronRight, Star, Leaf, Award } from "lucide-react"
import Image from "next/image"

const featuredProducts = [
  {
    id: 1,
    name: "Panel Solar Bifacial 450W",
    vendor: "EcoTech Solutions",
    price: 12500,
    originalPrice: 15000,
    regenScore: 92,
    rating: 4.8,
    reviews: 124,
    image: "/placeholder.svg?height=200&width=300",
    badge: "Más Vendido",
  },
  {
    id: 2,
    name: "Cargador Vehicular Eléctrico 22kW",
    vendor: "ElectroGreen",
    price: 18750,
    originalPrice: 22000,
    regenScore: 85,
    rating: 4.9,
    reviews: 156,
    image: "/placeholder.svg?height=200&width=300",
    badge: "Nuevo",
  },
  {
    id: 3,
    name: "Luminarias LED Solares Urbanas",
    vendor: "LuzVerde Urbana",
    price: 6800,
    originalPrice: 8500,
    regenScore: 90,
    rating: 4.7,
    reviews: 203,
    image: "/placeholder.svg?height=200&width=300",
    badge: "Oferta",
  },
  {
    id: 4,
    name: "Sistema de Captación de Agua Lluvia",
    vendor: "AquaTech Verde",
    price: 8900,
    originalPrice: null,
    regenScore: 88,
    rating: 4.6,
    reviews: 89,
    image: "/placeholder.svg?height=200&width=300",
    badge: "Destacado",
  },
]

export default function FeaturedCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0)

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex === featuredProducts.length - 1 ? 0 : prevIndex + 1))
  }

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? featuredProducts.length - 1 : prevIndex - 1))
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Productos Destacados</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Descubre los productos más populares y mejor calificados por nuestra comunidad sostenible
          </p>
        </div>

        <div className="relative max-w-6xl mx-auto">
          {/* Carousel Container */}
          <div className="overflow-hidden rounded-2xl">
            <div
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
              {featuredProducts.map((product) => (
                <div key={product.id} className="w-full flex-shrink-0">
                  <Card className="mx-4 hover:shadow-xl transition-shadow">
                    <CardContent className="p-0">
                      <div className="grid md:grid-cols-2 gap-0">
                        {/* Product Image */}
                        <div className="relative h-64 md:h-80 bg-gray-100">
                          <Image
                            src={product.image || "/placeholder.svg"}
                            alt={product.name}
                            fill
                            className="object-cover"
                          />
                          <Badge className="absolute top-4 left-4 bg-green-600 text-white">{product.badge}</Badge>
                        </div>

                        {/* Product Info */}
                        <div className="p-8 flex flex-col justify-center">
                          <div className="mb-4">
                            <h3 className="text-2xl font-bold text-gray-900 mb-2">{product.name}</h3>
                            <p className="text-gray-600 mb-3">{product.vendor}</p>

                            {/* Rating */}
                            <div className="flex items-center space-x-2 mb-4">
                              <div className="flex items-center">
                                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                <span className="ml-1 text-sm font-medium">{product.rating}</span>
                              </div>
                              <span className="text-sm text-gray-500">({product.reviews} reseñas)</span>
                            </div>

                            {/* REGEN Score */}
                            <div className="flex items-center space-x-2 mb-4">
                              <Leaf className="w-4 h-4 text-green-600" />
                              <span className="text-sm font-medium">REGEN Score:</span>
                              <Badge className="bg-green-100 text-green-800">{product.regenScore}</Badge>
                            </div>
                          </div>

                          {/* Price */}
                          <div className="mb-6">
                            {product.originalPrice && (
                              <span className="text-lg text-gray-500 line-through block">
                                ${product.originalPrice.toLocaleString()}
                              </span>
                            )}
                            <span className="text-3xl font-bold text-green-600">${product.price.toLocaleString()}</span>
                          </div>

                          {/* Actions */}
                          <div className="flex space-x-3">
                            <Button className="flex-1 bg-green-600 hover:bg-green-700">Ver Producto</Button>
                            <Button variant="outline" className="flex-1 bg-transparent">
                              <Award className="w-4 h-4 mr-2" />
                              Certificar
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation Buttons */}
          <Button
            variant="outline"
            size="icon"
            className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-4 bg-white shadow-lg"
            onClick={prevSlide}
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-4 bg-white shadow-lg"
            onClick={nextSlide}
          >
            <ChevronRight className="w-4 h-4" />
          </Button>

          {/* Dots Indicator */}
          <div className="flex justify-center space-x-2 mt-8">
            {featuredProducts.map((_, index) => (
              <button
                key={index}
                className={`w-3 h-3 rounded-full transition-colors ${
                  index === currentIndex ? "bg-green-600" : "bg-gray-300"
                }`}
                onClick={() => setCurrentIndex(index)}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
