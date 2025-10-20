"use client"

import type React from "react"
import { useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Store, MapPin, Phone, Mail, Globe, Award, Leaf } from "lucide-react"

interface VendorFormProps {
  onSubmit: (data: Record<string, unknown>) => void
}

export default function VendorForm({ onSubmit }: VendorFormProps) {
  const [formData, setFormData] = useState({
    companyName: "",
    contactName: "",
    email: "",
    phone: "",
    website: "",
    address: "",
    description: "",
    category: "",
    certifications: [] as string[],
    sustainabilityMetrics: {
      carbonReduction: "",
      waterSaving: "",
      renewableEnergy: "",
      wasteReduction: "",
    },
  })

  const [currentSection, setCurrentSection] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const sections = [
    { title: "Información Básica", icon: Store },
    { title: "Contacto", icon: MapPin },
    { title: "Certificaciones", icon: Award },
    { title: "Impacto", icon: Leaf },
  ]

  const certificationOptions = [
    "ISO 14001",
    "LEED",
    "Energy Star",
    "Fair Trade",
    "Organic",
    "B-Corp",
  ]

  const handleInputChange = useCallback((field: string, value: string | string[]) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }, [])

  const handleMetricChange = useCallback((metric: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      sustainabilityMetrics: {
        ...prev.sustainabilityMetrics,
        [metric]: value,
      },
    }))
  }, [])

  const handleCertificationToggle = useCallback((cert: string) => {
    setFormData((prev) => ({
      ...prev,
      certifications: prev.certifications.includes(cert)
        ? prev.certifications.filter((c) => c !== cert)
        : [...prev.certifications, cert],
    }))
  }, [])

  // Validación por sección
  const validateSection = useCallback(() => {
    switch (currentSection) {
      case 0: // Información Básica
        return formData.companyName.trim() !== "" && formData.contactName.trim() !== ""
      case 1: // Contacto
        return formData.email.trim() !== "" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)
      case 2: // Certificaciones (opcional)
        return true
      case 3: // Métricas (opcional)
        return true
      default:
        return true
    }
  }, [currentSection, formData])

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault()
      
      // Prevenir múltiples envíos
      if (isSubmitting) return
      
      setIsSubmitting(true)

      try {
        const response = await fetch('/api/vendor/onboarding', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...formData,
            location: formData.address,
            sustainabilityFocus: Object.entries(formData.sustainabilityMetrics)
              .filter(([_, value]) => value && value.trim() !== '')
              .map(([metric, _]) => metric)
          })
        })

        const data = await response.json()

        if (response.ok) {
          onSubmit(data)
        } else {
          console.error('Vendor onboarding failed:', data.error)
          onSubmit(formData)
        }
      } catch (error) {
        console.error('Error submitting vendor form:', error)
        onSubmit(formData)
      } finally {
        setIsSubmitting(false)
      }
    },
    [formData, onSubmit, isSubmitting],
  )

  const nextSection = useCallback(() => {
    // Validar antes de avanzar
    if (!validateSection()) {
      alert("Por favor completa los campos requeridos antes de continuar")
      return
    }

    if (currentSection < sections.length - 1) {
      setCurrentSection((prev) => prev + 1)
    }
  }, [currentSection, sections.length, validateSection])

  const prevSection = useCallback(() => {
    if (currentSection > 0) {
      setCurrentSection((prev) => prev - 1)
    }
  }, [currentSection])

  return (
    <div className="space-y-3">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-1">Información del Proveedor</h2>
        <p className="text-sm text-gray-600">Completa tu perfil para comenzar</p>
      </div>

      {/* Compact Section Navigation */}
      <div className="flex justify-center gap-2">
        {sections.map((section, index) => {
          const Icon = section.icon
          const isActive = index === currentSection
          const isCompleted = index < currentSection

          return (
            <div
              key={index}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                isActive
                  ? "bg-green-100 text-green-700"
                  : isCompleted
                    ? "bg-green-50 text-green-600"
                    : "bg-gray-100 text-gray-500"
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{section.title}</span>
            </div>
          )
        })}
      </div>

      {/* Section 0: General Information */}
      {currentSection === 0 && (
        <Card>
          <CardContent className="p-4 space-y-3">
            <div className="grid md:grid-cols-2 gap-3">
              <div>
                <Label htmlFor="companyName" className="text-xs">Nombre de la Empresa *</Label>
                <Input
                  id="companyName"
                  value={formData.companyName}
                  onChange={(e) => handleInputChange("companyName", e.target.value)}
                  placeholder="EcoTech Solutions"
                  className="h-9 text-sm"
                />
              </div>
              <div>
                <Label htmlFor="contactName" className="text-xs">Nombre del Contacto *</Label>
                <Input
                  id="contactName"
                  value={formData.contactName}
                  onChange={(e) => handleInputChange("contactName", e.target.value)}
                  placeholder="Juan Pérez"
                  className="h-9 text-sm"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="description" className="text-xs">Descripción</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
                placeholder="Describe tu empresa..."
                className="text-sm"
                rows={2}
              />
            </div>

            <div>
              <Label htmlFor="category" className="text-xs">Categoría Principal</Label>
              <select
                id="category"
                value={formData.category}
                onChange={(e) => handleInputChange("category", e.target.value)}
                className="w-full h-9 px-3 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="">Selecciona...</option>
                <option value="energia-limpia">Energía Limpia</option>
                <option value="agua-tecnologia">Tecnología del Agua</option>
                <option value="transporte-sostenible">Transporte Sostenible</option>
                <option value="construccion-verde">Construcción Verde</option>
                <option value="agricultura-tech">AgriTech</option>
                <option value="residuos-reciclaje">Gestión de Residuos</option>
              </select>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Section 1: Contact */}
      {currentSection === 1 && (
        <Card>
          <CardContent className="p-4 space-y-3">
            <div className="grid md:grid-cols-2 gap-3">
              <div>
                <Label htmlFor="email" className="text-xs">Email *</Label>
                <div className="relative">
                  <Mail className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400 w-3.5 h-3.5" />
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    placeholder="contacto@empresa.com"
                    className="pl-8 h-9 text-sm"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="phone" className="text-xs">Teléfono</Label>
                <div className="relative">
                  <Phone className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400 w-3.5 h-3.5" />
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    placeholder="+1 (555) 123-4567"
                    className="pl-8 h-9 text-sm"
                  />
                </div>
              </div>
            </div>

            <div>
              <Label htmlFor="website" className="text-xs">Sitio Web</Label>
              <div className="relative">
                <Globe className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400 w-3.5 h-3.5" />
                <Input
                  id="website"
                  value={formData.website}
                  onChange={(e) => handleInputChange("website", e.target.value)}
                  placeholder="https://www.empresa.com"
                  className="pl-8 h-9 text-sm"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="address" className="text-xs">Dirección</Label>
              <Textarea
                id="address"
                value={formData.address}
                onChange={(e) => handleInputChange("address", e.target.value)}
                placeholder="Calle, Ciudad, País"
                className="text-sm"
                rows={2}
              />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Section 2: Certifications */}
      {currentSection === 2 && (
        <Card>
          <CardContent className="p-4">
            <h3 className="text-sm font-semibold text-gray-900 mb-2">Certificaciones</h3>

            <div className="grid md:grid-cols-2 gap-2 mb-3">
              {certificationOptions.map((cert, index) => (
                <div key={index} className="flex items-center space-x-2 p-2 border rounded hover:bg-gray-50">
                  <Checkbox
                    id={`cert-${index}`}
                    checked={formData.certifications.includes(cert)}
                    onCheckedChange={() => handleCertificationToggle(cert)}
                  />
                  <Label htmlFor={`cert-${index}`} className="text-xs cursor-pointer flex-1">
                    {cert}
                  </Label>
                </div>
              ))}
            </div>

            {formData.certifications.length > 0 && (
              <div>
                <h4 className="text-xs font-medium text-gray-900 mb-2">Seleccionadas:</h4>
                <div className="flex flex-wrap gap-1">
                  {formData.certifications.map((cert, index) => (
                    <Badge key={index} className="bg-green-100 text-green-800 text-xs">
                      {cert}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Section 3: Sustainability Metrics */}
      {currentSection === 3 && (
        <Card>
          <CardContent className="p-4 space-y-3">
            <h3 className="text-sm font-semibold text-gray-900 mb-2">Métricas de Sostenibilidad</h3>

            <div className="grid md:grid-cols-2 gap-3">
              <div>
                <Label htmlFor="carbonReduction" className="text-xs">CO₂ (ton/año)</Label>
                <Input
                  id="carbonReduction"
                  type="number"
                  value={formData.sustainabilityMetrics.carbonReduction}
                  onChange={(e) => handleMetricChange("carbonReduction", e.target.value)}
                  placeholder="100"
                  className="h-9 text-sm"
                />
              </div>
              <div>
                <Label htmlFor="waterSaving" className="text-xs">Agua (L/año)</Label>
                <Input
                  id="waterSaving"
                  type="number"
                  value={formData.sustainabilityMetrics.waterSaving}
                  onChange={(e) => handleMetricChange("waterSaving", e.target.value)}
                  placeholder="50000"
                  className="h-9 text-sm"
                />
              </div>
              <div>
                <Label htmlFor="renewableEnergy" className="text-xs">Energía Renovable (%)</Label>
                <Input
                  id="renewableEnergy"
                  type="number"
                  max="100"
                  value={formData.sustainabilityMetrics.renewableEnergy}
                  onChange={(e) => handleMetricChange("renewableEnergy", e.target.value)}
                  placeholder="75"
                  className="h-9 text-sm"
                />
              </div>
              <div>
                <Label htmlFor="wasteReduction" className="text-xs">Reducción Residuos (%)</Label>
                <Input
                  id="wasteReduction"
                  type="number"
                  max="100"
                  value={formData.sustainabilityMetrics.wasteReduction}
                  onChange={(e) => handleMetricChange("wasteReduction", e.target.value)}
                  placeholder="80"
                  className="h-9 text-sm"
                />
              </div>
            </div>

            <div className="bg-gradient-to-r from-green-50 to-blue-50 p-3 rounded-lg">
              <p className="text-xs text-gray-700">
                💡 <strong>Tu NFT evolucionará</strong> basándose en estas métricas y tu desempeño en ventas
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Compact Navigation */}
      <div className="flex justify-between pt-2">
        <Button
          type="button"
          variant="outline"
          onClick={prevSection}
          disabled={currentSection === 0}
          size="sm"
          className="text-xs"
        >
          Anterior
        </Button>

        {currentSection < sections.length - 1 ? (
          <Button
            type="button"
            onClick={nextSection}
            className="bg-green-600 hover:bg-green-700 text-white text-xs"
            size="sm"
          >
            Siguiente
          </Button>
        ) : (
          <Button
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="bg-green-600 hover:bg-green-700 text-white text-xs disabled:opacity-50"
            size="sm"
          >
            {isSubmitting ? "Procesando..." : "Completar"}
          </Button>
        )}
      </div>
    </div>
  )
}