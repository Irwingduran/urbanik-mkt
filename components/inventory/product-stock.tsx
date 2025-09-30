"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Search, Filter, MoreHorizontal, Edit, Eye, RefreshCw, Leaf } from "lucide-react"

interface Product {
  id: number
  name: string
  sku: string
  category: string
  stock: number
  minStock: number
  price: number
  regenScore: number
  status: string
  image: string
  lastUpdated: string
}

interface ProductStockProps {
  products: Product[]
}

export default function ProductStock({ products }: ProductStockProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")

  const getStatusBadge = (status: string, stock: number, minStock: number) => {
    if (status === "out_of_stock" || stock === 0) {
      return <Badge className="bg-red-100 text-red-800">Agotado</Badge>
    }
    if (status === "low_stock" || stock <= minStock) {
      return <Badge className="bg-yellow-100 text-yellow-800">Stock Bajo</Badge>
    }
    return <Badge className="bg-green-100 text-green-800">Disponible</Badge>
  }

  const getRegenScoreBadge = (score: number) => {
    if (score >= 90) return <Badge className="bg-green-100 text-green-800">Excelente</Badge>
    if (score >= 80) return <Badge className="bg-blue-100 text-blue-800">Muy Bueno</Badge>
    if (score >= 70) return <Badge className="bg-yellow-100 text-yellow-800">Bueno</Badge>
    return <Badge className="bg-gray-100 text-gray-800">Regular</Badge>
  }

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.sku.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "all" || product.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const categories = ["all", ...Array.from(new Set(products.map((p) => p.category)))]

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Gestión de Productos</CardTitle>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Buscar productos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-64"
              />
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  <Filter className="w-4 h-4 mr-2" />
                  Filtrar
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {categories.map((category) => (
                  <DropdownMenuItem key={category} onClick={() => setSelectedCategory(category)}>
                    {category === "all" ? "Todas las categorías" : category}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
            >
              <div className="flex items-center space-x-4">
                <img
                  src={product.image || "/placeholder.svg"}
                  alt={product.name}
                  className="w-16 h-16 rounded-lg object-cover"
                />
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <h3 className="font-medium text-gray-900">{product.name}</h3>
                    {getStatusBadge(product.status, product.stock, product.minStock)}
                  </div>
                  <p className="text-sm text-gray-600">
                    SKU: {product.sku} • {product.category}
                  </p>
                  <div className="flex items-center space-x-4 mt-2">
                    <span className="text-sm text-gray-600">Stock: {product.stock}</span>
                    <span className="text-sm text-gray-600">Precio: ${product.price}</span>
                    <div className="flex items-center space-x-1">
                      <Leaf className="w-4 h-4 text-green-600" />
                      <span className="text-sm font-medium text-green-600">{product.regenScore}</span>
                      {getRegenScoreBadge(product.regenScore)}
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm">
                  <Eye className="w-4 h-4 mr-1" />
                  Ver
                </Button>
                <Button variant="outline" size="sm">
                  <Edit className="w-4 h-4 mr-1" />
                  Editar
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm">
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem>
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Reabastecer
                    </DropdownMenuItem>
                    <DropdownMenuItem>Duplicar</DropdownMenuItem>
                    <DropdownMenuItem className="text-red-600">Eliminar</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
