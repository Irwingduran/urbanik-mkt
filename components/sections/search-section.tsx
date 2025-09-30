"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Search, Filter, MapPin, Star, TreePine, Droplets, Zap, Recycle } from "lucide-react"

const categories = [
  { id: "all", label: "Todos", icon: Star },
  { id: "carbon", label: "Carbono Neutral", icon: TreePine },
  { id: "water", label: "Ahorro Agua", icon: Droplets },
  { id: "energy", label: "Energía Limpia", icon: Zap },
  { id: "waste", label: "Cero Residuos", icon: Recycle },
]

export default function SearchSection() {
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Encuentra Productos Sostenibles</h2>
            <p className="text-gray-600">Busca por categorías de impacto, certificaciones y ubicación del proveedor</p>
          </div>

          {/* Search Bar */}
          <div className="relative mb-8">
            <div className="flex items-center bg-gray-50 rounded-2xl p-2 shadow-sm border border-gray-200">
              <Search className="w-5 h-5 text-gray-400 ml-4" />
              <input
                type="text"
                placeholder="Buscar productos eco-friendly, servicios sostenibles..."
                className="flex-1 bg-transparent px-4 py-3 focus:outline-none text-gray-700"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <div className="flex items-center space-x-2 mr-2">
                <Button variant="ghost" size="icon" className="text-gray-500">
                  <MapPin className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="icon" className="text-gray-500">
                  <Filter className="w-4 h-4" />
                </Button>
                <Button className="bg-green-600 hover:bg-green-700 text-white px-6">Buscar</Button>
              </div>
            </div>
          </div>

          {/* Category Filters */}
          <div className="flex flex-wrap gap-3 justify-center mb-8">
            {categories.map((category) => {
              const Icon = category.icon
              const isSelected = selectedCategory === category.id
              return (
                <Button
                  key={category.id}
                  variant={isSelected ? "default" : "outline"}
                  className={`rounded-full px-6 py-3 transition-all ${
                    isSelected
                      ? "bg-green-600 hover:bg-green-700 text-white"
                      : "border-gray-300 hover:border-green-500 hover:text-green-600"
                  }`}
                  onClick={() => setSelectedCategory(category.id)}
                >
                  <Icon className="w-4 h-4 mr-2" />
                  {category.label}
                </Button>
              )
            })}
          </div>

          {/* Quick Filters */}
          <div className="flex flex-wrap gap-2 justify-center">
            <Badge variant="outline" className="hover:bg-green-50 cursor-pointer">
              🏆 Estrella Verde
            </Badge>
            <Badge variant="outline" className="hover:bg-blue-50 cursor-pointer">
              🌊 Certificado Agua
            </Badge>
            <Badge variant="outline" className="hover:bg-yellow-50 cursor-pointer">
              ⚡ Energía Renovable
            </Badge>
            <Badge variant="outline" className="hover:bg-gray-50 cursor-pointer">
              🔄 Huella Cero
            </Badge>
            <Badge variant="outline" className="hover:bg-green-50 cursor-pointer">
              🏪 Proveedor Local
            </Badge>
          </div>
        </div>
      </div>
    </section>
  )
}
