"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Search, X, Loader2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { productsIndex } from "@/lib/algolia"
import { useRouter } from "next/navigation"
import Image from "next/image"

interface SearchResult {
  objectID: string
  name: string
  vendor: string
  price: number
  image: string
  category: string
  regenScore: number
}

export default function SearchBox() {
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<SearchResult[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const searchRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  useEffect(() => {
    const searchProducts = async () => {
      if (query.length < 2) {
        setResults([])
        setShowResults(false)
        return
      }

      setIsLoading(true)
      try {
        const { hits } = await productsIndex.search(query, {
          hitsPerPage: 8,
          attributesToRetrieve: ["objectID", "name", "vendor", "price", "image", "category", "regenScore"],
        })

        setResults(hits as SearchResult[])
        setShowResults(true)
      } catch (error) {
        console.error("Search error:", error)
        setResults([])
      } finally {
        setIsLoading(false)
      }
    }

    const debounceTimer = setTimeout(searchProducts, 300)
    return () => clearTimeout(debounceTimer)
  }, [query])

  const handleProductClick = (productId: string) => {
    router.push(`/products/${productId}`)
    setShowResults(false)
    setQuery("")
  }

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      router.push(`/marketplace?search=${encodeURIComponent(query)}`)
      setShowResults(false)
    }
  }

  return (
    <div ref={searchRef} className="relative w-full max-w-lg">
      <form onSubmit={handleSearchSubmit}>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            type="text"
            placeholder="Buscar productos sostenibles..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-10 pr-10"
            onFocus={() => query.length >= 2 && setShowResults(true)}
          />
          {query && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
              onClick={() => {
                setQuery("")
                setResults([])
                setShowResults(false)
              }}
            >
              <X className="w-3 h-3" />
            </Button>
          )}
          {isLoading && (
            <Loader2 className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 animate-spin text-gray-400" />
          )}
        </div>
      </form>

      {/* Search Results Dropdown */}
      {showResults && (
        <Card className="absolute top-full left-0 right-0 mt-1 z-50 max-h-96 overflow-y-auto">
          <CardContent className="p-0">
            {results.length > 0 ? (
              <div className="divide-y">
                {results.map((product) => (
                  <button
                    key={product.objectID}
                    onClick={() => handleProductClick(product.objectID)}
                    className="w-full p-4 text-left hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <Image
                        src={product.image || "/placeholder.svg"}
                        alt={product.name}
                        width={48}
                        height={48}
                        className="rounded-lg object-cover"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-gray-900 truncate">{product.name}</h4>
                        <p className="text-sm text-gray-500">
                          {product.vendor} • {product.category}
                        </p>
                        <div className="flex items-center space-x-2 mt-1">
                          <span className="font-bold text-green-600">${product.price}</span>
                          <Badge variant="secondary" className="text-xs">
                            REGEN {product.regenScore}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </button>
                ))}

                {query && (
                  <button
                    onClick={handleSearchSubmit}
                    className="w-full p-4 text-center text-green-600 hover:bg-gray-50 border-t"
                  >
                    Ver todos los resultados para &quot;{query}&quot;
                  </button>
                )}
              </div>
            ) : query.length >= 2 && !isLoading ? (
              <div className="p-4 text-center text-gray-500">No se encontraron productos para &quot;{query}&quot;</div>
            ) : null}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
