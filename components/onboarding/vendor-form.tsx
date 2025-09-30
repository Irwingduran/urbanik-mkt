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
import { Store, MapPin, Phone, Mail, FileText, Award, Leaf, Users, Globe, Lightbulb } from "lucide-react"

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

  const sections = [
    { title: "Información General", icon: Store },
    { title: "Ubicación y Contacto", icon: MapPin },
    { title: "Certificaciones", icon: Award },
    { title: "Métricas de Impacto", icon: Leaf },
  ]

  const certificationOptions = [
    "ISO 14001 (Gestión Ambiental)",
    "LEED (Construcción Sostenible)",
    "Energy Star",
    "Cradle to Cradle",
    "Fair Trade",
    "Organic Certification",
    "Carbon Neutral Certified",
    "B-Corp Certification",
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

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault()

      try {
        const response = await fetch('/api/vendor/onboarding', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...formData,
            location: formData.address,
            sustainabilityFocus: Object.entries(formData.sustainabilityMetrics)
              .filter(([_, enabled]) => enabled)
              .map(([metric, _]) => metric)
          })
        })

        const data = await response.json()

        if (response.ok) {
          onSubmit(data)
        } else {
          console.error('Vendor onboarding failed:', data.error)
          // Still proceed to next step for demo purposes
          onSubmit(formData)
        }
      } catch (error) {
        console.error('Error submitting vendor form:', error)
        // Still proceed to next step for demo purposes
        onSubmit(formData)
      }
    },
    [formData, onSubmit],
  )

  const nextSection = useCallback(() => {
    if (currentSection < sections.length - 1) {
      setCurrentSection((prev) => prev + 1)
    }
  }, [currentSection, sections.length])

  const prevSection = useCallback(() => {
    if (currentSection > 0) {
      setCurrentSection((prev) => prev - 1)
    }
  }, [currentSection])

  return (
    <div>
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Información del Proveedor</h2>
        <p className="text-gray-600">Completa tu perfil para obtener tu primer NFT de certificación</p>
      </div>

      {/* Section Navigation */}
      <div className="flex justify-center mb-8">
        <div className="flex space-x-2">
          {sections.map((section, index) => {
            const Icon = section.icon
            const isActive = index === currentSection
            const isCompleted = index < currentSection

            return (
              <div
                key={index}
                className={`flex items-center space-x-2 p-2 rounded-lg transition-colors ${
                  isActive
                    ? "bg-green-100 text-green-700"
                    : isCompleted
                      ? "bg-green-50 text-green-600"
                      : "bg-gray-100 text-gray-500"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="text-sm font-medium">{section.title}</span>
              </div>
            )
          })}
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Section 0: General Information */}
        {currentSection === 0 && (
          <Card>
            <CardContent className="p-6 space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="companyName">Nombre de la Empresa *</Label>
                  <Input
                    id="companyName"
                    value={formData.companyName}
                    onChange={(e) => handleInputChange("companyName", e.target.value)}
                    placeholder="EcoTech Solutions"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="contactName">Nombre del Contacto *</Label>
                  <Input
                    id="contactName"
                    value={formData.contactName}
                    onChange={(e) => handleInputChange("contactName", e.target.value)}
                    placeholder="Juan Pérez"
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="description">Descripción de la Empresa</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange("description", e.target.value)}
                  placeholder="Describe qué hace tu empresa y cómo contribuye a la sostenibilidad..."
                  rows={4}
                />
              </div>

              <div>
                <Label htmlFor="category">Categoría Principal</Label>
                <select
                  id="category"
                  value={formData.category}
                  onChange={(e) => handleInputChange("category", e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="">Selecciona una categoría</option>
                  <option value="energia-limpia">Energía Limpia</option>
                  <option value="agua-tecnologia">Tecnología del Agua</option>
                  <option value="transporte-sostenible">Transporte Sostenible</option>
                  <option value="construccion-verde">Construcción Verde</option>
                  <option value="agricultura-tech">AgriTech</option>
                  <option value="residuos-reciclaje">Gestión de Residuos</option>
                  <option value="otros">Otros</option>
                </select>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="flex items-start space-x-3">
                  <Lightbulb className="w-5 h-5 text-blue-600 mt-1" />
                  <div>
                    <h4 className="font-semibold text-blue-900 mb-1">💡 ¿Sabías que?</h4>
                    <p className="text-sm text-blue-700">
                      Tu NFT inicial se basará en la categoría que selecciones. Por ejemplo, si eliges &quot;Energía Limpia&quot;,
                      recibirás un NFT &quot;Rayo Solar&quot; que evolucionará según tus métricas de energía renovable.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Section 1: Location and Contact */}
        {currentSection === 1 && (
          <Card>
            <CardContent className="p-6 space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="email">Email Corporativo *</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      placeholder="contacto@tuempresa.com"
                      className="pl-10"
                      required
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="phone">Teléfono</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => handleInputChange("phone", e.target.value)}
                      placeholder="+1 (555) 123-4567"
                      className="pl-10"
                    />
                  </div>
                </div>
              </div>

              <div>
                <Label htmlFor="website">Sitio Web</Label>
                <div className="relative">
                  <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    id="website"
                    value={formData.website}
                    onChange={(e) => handleInputChange("website", e.target.value)}
                    placeholder="https://www.tuempresa.com"
                    className="pl-10"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="address">Dirección Completa</Label>
                <Textarea
                  id="address"
                  value={formData.address}
                  onChange={(e) => handleInputChange("address", e.target.value)}
                  placeholder="Calle Principal 123, Ciudad, País, CP 12345"
                  rows={3}
                />
              </div>

              <div className="bg-green-50 p-4 rounded-lg">
                <div className="flex items-start space-x-3">
                  <Users className="w-5 h-5 text-green-600 mt-1" />
                  <div>
                    <h4 className="font-semibold text-green-900 mb-1">🌍 Impacto Local</h4>
                    <p className="text-sm text-green-700">
                      Los compradores podrán filtrar por ubicación para apoyar a proveedores locales. Esto reduce la
                      huella de carbono del transporte y fortalece las economías regionales.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Section 2: Certifications */}
        {currentSection === 2 && (
          <Card>
            <CardContent className="p-6">
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Certificaciones Actuales</h3>
                <p className="text-sm text-gray-600">Selecciona todas las certificaciones que posee tu empresa</p>
              </div>

              <div className="grid md:grid-cols-2 gap-4 mb-6">
                {certificationOptions.map((cert, index) => (
                  <div key={index} className="flex items-start space-x-3 p-3 border rounded-lg hover:bg-gray-50">
                    <Checkbox
                      id={`cert-${index}`}
                      checked={formData.certifications.includes(cert)}
                      onCheckedChange={() => handleCertificationToggle(cert)}
                    />
                    <Label htmlFor={`cert-${index}`} className="text-sm cursor-pointer flex-1">
                      {cert}
                    </Label>
                  </div>
                ))}
              </div>

              {formData.certifications.length > 0 && (
                <div className="mb-6">
                  <h4 className="font-medium text-gray-900 mb-3">Certificaciones Seleccionadas:</h4>
                  <div className="flex flex-wrap gap-2">
                    {formData.certifications.map((cert, index) => (
                      <Badge key={index} className="bg-green-100 text-green-800">
                        <Award className="w-3 h-3 mr-1" />
                        {cert}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              <div className="bg-yellow-50 p-4 rounded-lg">
                <div className="flex items-start space-x-3">
                  <FileText className="w-5 h-5 text-yellow-600 mt-1" />
                  <div>
                    <h4 className="font-semibold text-yellow-900 mb-1">📄 Verificación de Documentos</h4>
                    <p className="text-sm text-yellow-700">
                      Más adelante podrás subir los documentos de tus certificaciones para verificación. Las
                      certificaciones verificadas mejoran tu REGEN SCORE y hacen evolucionar tu NFT más rápido.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Section 3: Sustainability Metrics */}
        {currentSection === 3 && (
          <Card>
            <CardContent className="p-6 space-y-6">
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Métricas de Sostenibilidad</h3>
                <p className="text-sm text-gray-600">Estas métricas ayudarán a calcular tu REGEN SCORE inicial</p>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="carbonReduction">Reducción de CO₂ (toneladas/año)</Label>
                  <Input
                    id="carbonReduction"
                    type="number"
                    value={formData.sustainabilityMetrics.carbonReduction}
                    onChange={(e) => handleMetricChange("carbonReduction", e.target.value)}
                    placeholder="100"
                  />
                </div>
                <div>
                  <Label htmlFor="waterSaving">Ahorro de Agua (litros/año)</Label>
                  <Input
                    id="waterSaving"
                    type="number"
                    value={formData.sustainabilityMetrics.waterSaving}
                    onChange={(e) => handleMetricChange("waterSaving", e.target.value)}
                    placeholder="50000"
                  />
                </div>
                <div>
                  <Label htmlFor="renewableEnergy">Energía Renovable (%)</Label>
                  <Input
                    id="renewableEnergy"
                    type="number"
                    max="100"
                    value={formData.sustainabilityMetrics.renewableEnergy}
                    onChange={(e) => handleMetricChange("renewableEnergy", e.target.value)}
                    placeholder="75"
                  />
                </div>
                <div>
                  <Label htmlFor="wasteReduction">Reducción de Residuos (%)</Label>
                  <Input
                    id="wasteReduction"
                    type="number"
                    max="100"
                    value={formData.sustainabilityMetrics.wasteReduction}
                    onChange={(e) => handleMetricChange("wasteReduction", e.target.value)}
                    placeholder="80"
                  />
                </div>
              </div>

              <div className="bg-gradient-to-r from-green-50 to-blue-50 p-6 rounded-lg">
                <div className="flex items-start space-x-3">
                  <Award className="w-6 h-6 text-green-600 mt-1" />
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">🏆 Tu NFT Evolucionará</h4>
                    <p className="text-sm text-gray-700 mb-3">
                      Basándose en tus métricas, recibirás un NFT dinámico que evolucionará con el tiempo:
                    </p>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>
                        • <strong>Nivel Inicial:</strong> Semilla Verde - Nuevo proveedor comprometido
                      </li>
                      <li>
                        • <strong>Nivel Intermedio:</strong> Hoja Creciente - Mejoras sostenidas
                      </li>
                      <li>
                        • <strong>Nivel Avanzado:</strong> Árbol Floreciente - Liderazgo en sostenibilidad
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-8">
          <Button type="button" variant="outline" onClick={prevSection} disabled={currentSection === 0}>
            Anterior
          </Button>

          {currentSection < sections.length - 1 ? (
            <Button type="button" onClick={nextSection} className="bg-green-600 hover:bg-green-700 text-white">
              Siguiente
            </Button>
          ) : (
            <Button type="submit" className="bg-green-600 hover:bg-green-700 text-white">
              Crear Cuenta
            </Button>
          )}
        </div>
      </form>
    </div>
  )
}
