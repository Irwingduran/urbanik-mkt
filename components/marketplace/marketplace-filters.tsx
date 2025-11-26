"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Slider } from "@/components/ui/slider"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { X, MapPin, Award, Tag, DollarSign, Leaf } from "lucide-react"

interface Filters {
  locations: string[]
  certifications: string[]
  materials: string[]
  priceRange: number[]
  minRegenScore: number
  inStockOnly: boolean
  featuredOnly: boolean
  categories: string[]
}

interface MarketplaceFiltersProps {
  filters: Filters
  setFilters: (filters: Filters) => void
}

const availableLocations = ["Ciudad de México", "Guadalajara", "Monterrey", "Puebla", "Tijuana", "León"]

const availableCertifications = [
  "ISO 14001",
  "Energy Star",
  "LEED",
  "WaterSense",
  "Green Building",
  "CE",
  "FCC",
  "Organic Certified",
  "Smart Home",
  "IP65",
  "Dark Sky",
  "HEPA H13",
  "Medical Grade",
  "Carbon Neutral",
]

const availableMaterials = [
  "Bambú",
  "Algodón Orgánico",
  "Plástico Reciclado",
  "Madera Certificada FSC",
  "Vidrio Reciclado",
  "Cáñamo",
  "Lino",
  "Corcho",
  "Metal Reciclado",
  "Bioplásticos"
]

const availableCategories = [
  "Energía Solar",
  "Gestión de Agua",
  "Movilidad Eléctrica",
  "Gestión de Residuos",
  "Iluminación",
  "Calidad del Aire",
]

export function MarketplaceFilters({ filters, setFilters }: MarketplaceFiltersProps) {
  const updateFilter = (key: keyof Filters, value: string[] | number[] | number | boolean) => {
    setFilters({
      ...filters,
      [key]: value,
    })
  }

  const toggleArrayFilter = (key: "locations" | "certifications" | "categories" | "materials", value: string) => {
    const currentArray = filters[key]
    const newArray = currentArray.includes(value)
      ? currentArray.filter((item) => item !== value)
      : [...currentArray, value]

    updateFilter(key, newArray)
  }

  const clearFilter = (key: keyof Filters) => {
    switch (key) {
      case "locations":
      case "certifications":
      case "categories":
      case "materials":
        updateFilter(key, [])
        break
      case "priceRange":
        updateFilter(key, [0, 25000])
        break
      case "minRegenScore":
        updateFilter(key, 0)
        break
      case "inStockOnly":
      case "featuredOnly":
        updateFilter(key, false)
        break
    }
  }

  return (
    <Card className="sticky top-4">
      <CardHeader>
        <CardTitle className="flex items-center text-lg">
          <Tag className="w-5 h-5 mr-2" />
          Filtros
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Location Filter */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-medium flex items-center">
              <MapPin className="w-4 h-4 mr-2" />
              Ubicación
            </h4>
            {filters.locations.length > 0 && (
              <Button variant="ghost" size="sm" onClick={() => clearFilter("locations")} className="h-6 px-2 text-xs">
                <X className="w-3 h-3" />
              </Button>
            )}
          </div>
          <div className="space-y-2">
            {availableLocations.map((location) => (
              <div key={location} className="flex items-center space-x-2">
                <Checkbox
                  id={`location-${location}`}
                  checked={filters.locations.includes(location)}
                  onCheckedChange={() => toggleArrayFilter("locations", location)}
                />
                <label htmlFor={`location-${location}`} className="text-sm cursor-pointer flex-1">
                  {location}
                </label>
              </div>
            ))}
          </div>
        </div>

        <Separator />

        {/* Certifications Filter */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-medium flex items-center">
              <Award className="w-4 h-4 mr-2" />
              Certificaciones
            </h4>
            {filters.certifications.length > 0 && (
              <div className="flex items-center space-x-2">
                <Badge variant="secondary" className="text-xs">
                  {filters.certifications.length}
                </Badge>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => clearFilter("certifications")}
                  className="h-6 px-2 text-xs"
                >
                  <X className="w-3 h-3" />
                </Button>
              </div>
            )}
          </div>
          <ScrollArea className="h-48">
            <div className="space-y-2 pr-4">
              {availableCertifications.map((cert) => (
                <div key={cert} className="flex items-center space-x-2">
                  <Checkbox
                    id={`cert-${cert}`}
                    checked={filters.certifications.includes(cert)}
                    onCheckedChange={() => toggleArrayFilter("certifications", cert)}
                  />
                  <label htmlFor={`cert-${cert}`} className="text-sm cursor-pointer flex-1">
                    {cert}
                  </label>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>

        <Separator />

        {/* Materials Filter */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-medium flex items-center">
              <Leaf className="w-4 h-4 mr-2" />
              Materiales
            </h4>
            {filters.materials.length > 0 && (
              <div className="flex items-center space-x-2">
                <Badge variant="secondary" className="text-xs">
                  {filters.materials.length}
                </Badge>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => clearFilter("materials")}
                  className="h-6 px-2 text-xs"
                >
                  <X className="w-3 h-3" />
                </Button>
              </div>
            )}
          </div>
          <ScrollArea className="h-32">
            <div className="space-y-2 pr-4">
              {availableMaterials.map((material) => (
                <div key={material} className="flex items-center space-x-2">
                  <Checkbox
                    id={`material-${material}`}
                    checked={filters.materials.includes(material)}
                    onCheckedChange={() => toggleArrayFilter("materials", material)}
                  />
                  <label htmlFor={`material-${material}`} className="text-sm cursor-pointer flex-1">
                    {material}
                  </label>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>

        <Separator />

        {/* Categories Filter */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-medium flex items-center">
              <Tag className="w-4 h-4 mr-2" />
              Categorías
            </h4>
            {filters.categories.length > 0 && (
              <Button variant="ghost" size="sm" onClick={() => clearFilter("categories")} className="h-6 px-2 text-xs">
                <X className="w-3 h-3" />
              </Button>
            )}
          </div>
          <div className="space-y-2">
            {availableCategories.map((category) => (
              <div key={category} className="flex items-center space-x-2">
                <Checkbox
                  id={`category-${category}`}
                  checked={filters.categories.includes(category)}
                  onCheckedChange={() => toggleArrayFilter("categories", category)}
                />
                <label htmlFor={`category-${category}`} className="text-sm cursor-pointer flex-1">
                  {category}
                </label>
              </div>
            ))}
          </div>
        </div>

        <Separator />

        {/* Price Range Filter */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-medium flex items-center">
              <DollarSign className="w-4 h-4 mr-2" />
              Rango de Precio
            </h4>
            {(filters.priceRange[0] > 0 || filters.priceRange[1] < 25000) && (
              <Button variant="ghost" size="sm" onClick={() => clearFilter("priceRange")} className="h-6 px-2 text-xs">
                <X className="w-3 h-3" />
              </Button>
            )}
          </div>
          <div className="space-y-3">
            <Slider
              value={filters.priceRange}
              onValueChange={(value) => updateFilter("priceRange", value)}
              max={25000}
              min={0}
              step={100}
              className="w-full"
            />
            <div className="flex items-center justify-between text-sm text-gray-600">
              <span>${filters.priceRange[0]}</span>
              <span>${filters.priceRange[1]}</span>
            </div>
          </div>
        </div>

        <Separator />

        {/* REGEN Score Filter */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-medium flex items-center">
              <Leaf className="w-4 h-4 mr-2" />
              REGEN Score Mínimo
            </h4>
            {filters.minRegenScore > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => clearFilter("minRegenScore")}
                className="h-6 px-2 text-xs"
              >
                <X className="w-3 h-3" />
              </Button>
            )}
          </div>
          <div className="space-y-3">
            <Slider
              value={[filters.minRegenScore]}
              onValueChange={(value) => updateFilter("minRegenScore", value[0])}
              max={100}
              min={0}
              step={5}
              className="w-full"
            />
            <div className="text-center text-sm text-gray-600">Mínimo: {filters.minRegenScore}</div>
          </div>
        </div>

        <Separator />

        {/* Additional Filters */}
        <div>
          <h4 className="font-medium mb-3">Filtros Adicionales</h4>
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="inStockOnly"
                checked={filters.inStockOnly}
                onCheckedChange={(checked) => updateFilter("inStockOnly", checked === true)}
              />
              <label htmlFor="inStockOnly" className="text-sm cursor-pointer">
                Solo productos disponibles
              </label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="featuredOnly"
                checked={filters.featuredOnly}
                onCheckedChange={(checked) => updateFilter("featuredOnly", checked === true)}
              />
              <label htmlFor="featuredOnly" className="text-sm cursor-pointer">
                Solo productos destacados
              </label>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
