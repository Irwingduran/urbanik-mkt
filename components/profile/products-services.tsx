"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Star, Award, Leaf, Eye, ShoppingCart, TrendingUp } from "lucide-react"
import Image from "next/image"

interface Product {
  id: number
  name: string
  category: string
  price: string
  image: string
  rating: number
  reviews: number
  environmentalBenefits: string[]
  certifications: string[]
  impact: {
    carbonSaved: string
    energyGenerated?: string
    waterPurified?: string
    materialsRecycled?: string
    waterSaved?: string
    plasticReduced?: string
    chemicalsFree?: string
    energyEfficient?: string
  }
}

interface ProductsServicesProps {
  products: Product[]
}

export default function ProductsServices({ products }: ProductsServicesProps) {
  return (
    <div className="space-y-6">
      {/* Products Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Leaf className="w-5 h-5 text-green-600" />
            <span>Productos y Servicios Sostenibles</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-4 gap-4 mb-6">
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{products.length}</div>
              <div className="text-sm text-green-700">Productos Activos</div>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">4.8</div>
              <div className="text-sm text-blue-700">Rating Promedio</div>
            </div>
            <div className="text-center p-4 bg-yellow-50 rounded-lg">
              <div className="text-2xl font-bold text-yellow-600">216</div>
              <div className="text-sm text-yellow-700">Reseñas Totales</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">100%</div>
              <div className="text-sm text-purple-700">Eco-Certificados</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Products Grid */}
      <div className="grid lg:grid-cols-2 gap-6">
        {products.map((product) => (
          <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-shadow">
            <div className="relative">
              <Image
                src={product.image || "/placeholder.svg"}
                alt={product.name}
                width={400}
                height={200}
                className="w-full h-48 object-cover"
              />
              <div className="absolute top-4 right-4">
                <Badge className="bg-green-500 text-white">
                  <Leaf className="w-3 h-3 mr-1" />
                  Eco-Certificado
                </Badge>
              </div>
            </div>

            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-1">{product.name}</h3>
                  <Badge variant="outline" className="text-xs">
                    {product.category}
                  </Badge>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-green-600">{product.price}</div>
                  <div className="flex items-center space-x-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm text-gray-600">
                      {product.rating} ({product.reviews})
                    </span>
                  </div>
                </div>
              </div>

              {/* Environmental Benefits */}
              <div className="mb-4">
                <h4 className="font-semibold text-gray-900 mb-2 flex items-center">
                  <Leaf className="w-4 h-4 mr-2 text-green-600" />
                  Beneficios Ambientales
                </h4>
                <ul className="space-y-1">
                  {product.environmentalBenefits.slice(0, 3).map((benefit, index) => (
                    <li key={index} className="text-sm text-gray-600 flex items-start">
                      <span className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                      {benefit}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Impact Metrics */}
              <div className="mb-4">
                <h4 className="font-semibold text-gray-900 mb-2 flex items-center">
                  <TrendingUp className="w-4 h-4 mr-2 text-blue-600" />
                  Impacto Medible
                </h4>
                <div className="grid grid-cols-2 gap-2">
                  {Object.entries(product.impact)
                    .slice(0, 4)
                    .map(([key, value]) => (
                      <div key={key} className="p-2 bg-gray-50 rounded text-center">
                        <div className="text-xs text-gray-500 capitalize">
                          {key.replace(/([A-Z])/g, " $1").toLowerCase()}
                        </div>
                        <div className="text-sm font-medium text-gray-900">{value}</div>
                      </div>
                    ))}
                </div>
              </div>

              {/* Certifications */}
              <div className="mb-4">
                <h4 className="font-semibold text-gray-900 mb-2 flex items-center">
                  <Award className="w-4 h-4 mr-2 text-yellow-600" />
                  Certificaciones
                </h4>
                <div className="flex flex-wrap gap-1">
                  {product.certifications.map((cert, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {cert}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex space-x-2">
                <Button className="flex-1 bg-green-600 hover:bg-green-700 text-white">
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  Ver Producto
                </Button>
                <Button variant="outline" className="bg-transparent">
                  <Eye className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Product Categories */}
      <Card>
        <CardHeader>
          <CardTitle>Categorías de Productos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            {[
              { name: "Energía Limpia", count: 8, icon: "⚡", color: "bg-yellow-50 text-yellow-700" },
              { name: "Tecnología del Agua", count: 5, icon: "💧", color: "bg-blue-50 text-blue-700" },
              { name: "Construcción Verde", count: 3, icon: "🏗️", color: "bg-green-50 text-green-700" },
              { name: "Transporte Sostenible", count: 2, icon: "🚗", color: "bg-purple-50 text-purple-700" },
              { name: "Gestión de Residuos", count: 4, icon: "♻️", color: "bg-gray-50 text-gray-700" },
              { name: "AgriTech", count: 2, icon: "🌱", color: "bg-emerald-50 text-emerald-700" },
            ].map((category, index) => (
              <div key={index} className={`p-4 rounded-lg ${category.color}`}>
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">{category.icon}</span>
                  <div>
                    <h4 className="font-semibold">{category.name}</h4>
                    <p className="text-sm opacity-75">{category.count} productos</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
