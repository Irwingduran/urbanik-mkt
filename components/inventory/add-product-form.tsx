"use client"

import React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import {
  ArrowLeft,
  ArrowRight,
  Upload,
  Leaf,
  Award,
  Recycle,
  Droplets,
  Users,
  Heart,
  CheckCircle,
  AlertCircle,
} from "lucide-react"

interface AddProductFormProps {
  onBack: () => void
}

const steps = [
  { id: 1, title: "Información Básica", icon: CheckCircle },
  { id: 2, title: "Impacto Ambiental", icon: Leaf },
  { id: 3, title: "Certificaciones", icon: Award },
  { id: 4, title: "Ciclo de Vida", icon: Recycle },
  { id: 5, title: "Recursos y Eficiencia", icon: Droplets },
  { id: 6, title: "Prácticas Sociales", icon: Users },
  { id: 7, title: "Bienestar Animal", icon: Heart },
  { id: 8, title: "Revisión Final", icon: CheckCircle },
]

const certifications = [
  "ISO 14001",
  "LEED Certified",
  "Energy Star",
  "Carbon Neutral",
  "Certificación Orgánica",
  "FSC Certified",
  "Cradle to Cradle",
  "EPEAT",
  "Green Seal",
  "Fair Trade",
  "B Corp",
  "OEKO-TEX",
]

const sustainabilityBenefits = [
  "Reducción de emisiones CO₂",
  "Ahorro de agua",
  "Energía renovable",
  "Materiales reciclados",
  "Biodegradable",
  "Comercio justo",
  "Producción local",
  "Embalaje sostenible",
  "Durabilidad extendida",
]

export default function AddProductForm({ onBack }: AddProductFormProps) {
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState({
    // Paso 1: Información Básica
    name: "",
    sku: "",
    category: "",
    price: "",
    description: "",
    stock: "",
    minStock: "",
    images: [],

    // Paso 2: Impacto Ambiental
    environmentalImpact: "",
    sustainabilityBenefits: [] as string[],
    carbonFootprint: "",
    waterFootprint: "",
    wasteGenerated: "",

    // Paso 3: Certificaciones
    certifications: [] as string[],
    certificationDocs: [],

    // Paso 4: Ciclo de Vida
    rawMaterials: "",
    production: "",
    distribution: "",
    usage: "",
    disposal: "",
    recyclability: "",
    biodegradability: "",

    // Paso 5: Recursos y Eficiencia
    waterConsumption: "",
    carbonEmissions: "",
    wasteGeneration: "",
    energyEfficiency: "",
    renewableEnergy: "",

    // Paso 6: Prácticas Sociales
    employeeRelations: "",
    communityImpact: "",
    laborCompliance: "",
    fairTrade: false,
    localSourcing: "",

    // Paso 7: Bienestar Animal
    animalTesting: "",
    animalProducts: "",
    animalWelfare: "",
    ethicalAlternatives: "",
  })

  const calculateRegenScore = () => {
    let score = 50 // Base score

    // Certificaciones (max 20 puntos)
    score += Math.min(formData.certifications.length * 3, 20)

    // Beneficios de sostenibilidad (max 15 puntos)
    score += Math.min(formData.sustainabilityBenefits.length * 2, 15)

    // Reciclabilidad (max 10 puntos)
    if (formData.recyclability) score += Number.parseInt(formData.recyclability) / 10

    // Energía renovable (max 5 puntos)
    if (formData.renewableEnergy) score += Number.parseInt(formData.renewableEnergy) / 20

    return Math.min(Math.round(score), 100)
  }

  const nextStep = () => {
    if (currentStep < 8) setCurrentStep(currentStep + 1)
  }

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1)
  }

  const handleSubmit = () => {
    console.log("Producto enviado:", formData)
    alert("¡Producto agregado exitosamente!")
    onBack()
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="name">Nombre del Producto *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Ej: Panel Solar Eficiente 400W"
                />
              </div>
              <div>
                <Label htmlFor="sku">SKU *</Label>
                <Input
                  id="sku"
                  value={formData.sku}
                  onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                  placeholder="Ej: PS-400W-001"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <Label htmlFor="category">Categoría *</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => setFormData({ ...formData, category: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar categoría" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="energia-solar">Energía Solar</SelectItem>
                    <SelectItem value="almacenamiento">Almacenamiento</SelectItem>
                    <SelectItem value="inversores">Inversores</SelectItem>
                    <SelectItem value="movilidad">Movilidad</SelectItem>
                    <SelectItem value="eficiencia">Eficiencia Energética</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="price">Precio (USD) *</Label>
                <Input
                  id="price"
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  placeholder="299.99"
                />
              </div>
              <div>
                <Label htmlFor="stock">Stock Inicial *</Label>
                <Input
                  id="stock"
                  type="number"
                  value={formData.stock}
                  onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                  placeholder="50"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="description">Descripción del Producto *</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Describe detalladamente tu producto, sus características y beneficios..."
                rows={4}
              />
            </div>

            <div>
              <Label>Imágenes del Producto</Label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Arrastra y suelta imágenes aquí o haz clic para seleccionar</p>
                <Button variant="outline" className="mt-4 bg-transparent">
                  Seleccionar Archivos
                </Button>
              </div>
            </div>
          </div>
        )

      case 2:
        return (
          <div className="space-y-6">
            <div>
              <Label htmlFor="environmentalImpact">Descripción del Impacto Ambiental Positivo *</Label>
              <Textarea
                id="environmentalImpact"
                value={formData.environmentalImpact}
                onChange={(e) => setFormData({ ...formData, environmentalImpact: e.target.value })}
                placeholder="Describe cómo tu producto contribuye positivamente al medio ambiente..."
                rows={4}
              />
            </div>

            <div>
              <Label>Beneficios de Sostenibilidad</Label>
              <div className="grid md:grid-cols-3 gap-4 mt-2">
                {sustainabilityBenefits.map((benefit) => (
                  <div key={benefit} className="flex items-center space-x-2">
                    <Checkbox
                      id={benefit}
                      checked={formData.sustainabilityBenefits.includes(benefit)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setFormData({
                            ...formData,
                            sustainabilityBenefits: [...formData.sustainabilityBenefits, benefit],
                          })
                        } else {
                          setFormData({
                            ...formData,
                            sustainabilityBenefits: formData.sustainabilityBenefits.filter((b) => b !== benefit),
                          })
                        }
                      }}
                    />
                    <Label htmlFor={benefit} className="text-sm">
                      {benefit}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <Label htmlFor="carbonFootprint">Huella de Carbono (kg CO₂)</Label>
                <Input
                  id="carbonFootprint"
                  type="number"
                  value={formData.carbonFootprint}
                  onChange={(e) => setFormData({ ...formData, carbonFootprint: e.target.value })}
                  placeholder="0.5"
                />
              </div>
              <div>
                <Label htmlFor="waterFootprint">Huella Hídrica (litros)</Label>
                <Input
                  id="waterFootprint"
                  type="number"
                  value={formData.waterFootprint}
                  onChange={(e) => setFormData({ ...formData, waterFootprint: e.target.value })}
                  placeholder="10"
                />
              </div>
              <div>
                <Label htmlFor="wasteGenerated">Residuos Generados (kg)</Label>
                <Input
                  id="wasteGenerated"
                  type="number"
                  value={formData.wasteGenerated}
                  onChange={(e) => setFormData({ ...formData, wasteGenerated: e.target.value })}
                  placeholder="0.1"
                />
              </div>
            </div>
          </div>
        )

      case 3:
        return (
          <div className="space-y-6">
            <div>
              <Label>Certificaciones Ambientales</Label>
              <div className="grid md:grid-cols-3 gap-4 mt-2">
                {certifications.map((cert) => (
                  <div key={cert} className="flex items-center space-x-2">
                    <Checkbox
                      id={cert}
                      checked={formData.certifications.includes(cert)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setFormData({
                            ...formData,
                            certifications: [...formData.certifications, cert],
                          })
                        } else {
                          setFormData({
                            ...formData,
                            certifications: formData.certifications.filter((c) => c !== cert),
                          })
                        }
                      }}
                    />
                    <Label htmlFor={cert} className="text-sm">
                      {cert}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            {formData.certifications.length > 0 && (
              <div>
                <Label>Certificaciones Seleccionadas</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.certifications.map((cert) => (
                    <Badge key={cert} className="bg-green-100 text-green-800">
                      <Award className="w-3 h-3 mr-1" />
                      {cert}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            <div>
              <Label>Documentos de Certificación</Label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-600">Sube los documentos que respalden tus certificaciones</p>
                <Button variant="outline" size="sm" className="mt-2 bg-transparent">
                  Seleccionar Archivos
                </Button>
              </div>
            </div>
          </div>
        )

      case 4:
        return (
          <div className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="rawMaterials">Extracción de Materias Primas</Label>
                <Textarea
                  id="rawMaterials"
                  value={formData.rawMaterials}
                  onChange={(e) => setFormData({ ...formData, rawMaterials: e.target.value })}
                  placeholder="Describe el proceso de obtención de materias primas..."
                  rows={3}
                />
              </div>
              <div>
                <Label htmlFor="production">Producción</Label>
                <Textarea
                  id="production"
                  value={formData.production}
                  onChange={(e) => setFormData({ ...formData, production: e.target.value })}
                  placeholder="Describe el proceso de producción..."
                  rows={3}
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="distribution">Distribución</Label>
                <Textarea
                  id="distribution"
                  value={formData.distribution}
                  onChange={(e) => setFormData({ ...formData, distribution: e.target.value })}
                  placeholder="Describe el proceso de distribución..."
                  rows={3}
                />
              </div>
              <div>
                <Label htmlFor="usage">Uso del Producto</Label>
                <Textarea
                  id="usage"
                  value={formData.usage}
                  onChange={(e) => setFormData({ ...formData, usage: e.target.value })}
                  placeholder="Describe cómo se usa el producto..."
                  rows={3}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="disposal">Disposición Final</Label>
              <Textarea
                id="disposal"
                value={formData.disposal}
                onChange={(e) => setFormData({ ...formData, disposal: e.target.value })}
                placeholder="Describe qué sucede al final de la vida útil del producto..."
                rows={3}
              />
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="recyclability">Porcentaje de Reciclabilidad (%)</Label>
                <Input
                  id="recyclability"
                  type="number"
                  min="0"
                  max="100"
                  value={formData.recyclability}
                  onChange={(e) => setFormData({ ...formData, recyclability: e.target.value })}
                  placeholder="85"
                />
              </div>
              <div>
                <Label htmlFor="biodegradability">Nivel de Biodegradabilidad</Label>
                <Select
                  value={formData.biodegradability}
                  onValueChange={(value) => setFormData({ ...formData, biodegradability: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar nivel" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="alto">Alto (&lt; 6 meses)</SelectItem>
                    <SelectItem value="medio">Medio (6-24 meses)</SelectItem>
                    <SelectItem value="bajo">Bajo (&gt; 24 meses)</SelectItem>
                    <SelectItem value="no-biodegradable">No biodegradable</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        )

      case 5:
        return (
          <div className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="waterConsumption">Consumo de Agua por Unidad (litros)</Label>
                <Input
                  id="waterConsumption"
                  type="number"
                  value={formData.waterConsumption}
                  onChange={(e) => setFormData({ ...formData, waterConsumption: e.target.value })}
                  placeholder="15"
                />
              </div>
              <div>
                <Label htmlFor="carbonEmissions">Emisiones de Carbono (kg CO₂)</Label>
                <Input
                  id="carbonEmissions"
                  type="number"
                  value={formData.carbonEmissions}
                  onChange={(e) => setFormData({ ...formData, carbonEmissions: e.target.value })}
                  placeholder="2.5"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="wasteGeneration">Residuos Generados (kg)</Label>
                <Input
                  id="wasteGeneration"
                  type="number"
                  value={formData.wasteGeneration}
                  onChange={(e) => setFormData({ ...formData, wasteGeneration: e.target.value })}
                  placeholder="0.5"
                />
              </div>
              <div>
                <Label htmlFor="energyEfficiency">Eficiencia Energética (%)</Label>
                <Input
                  id="energyEfficiency"
                  type="number"
                  min="0"
                  max="100"
                  value={formData.energyEfficiency}
                  onChange={(e) => setFormData({ ...formData, energyEfficiency: e.target.value })}
                  placeholder="92"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="renewableEnergy">Porcentaje de Energía Renovable Utilizada (%)</Label>
              <Input
                id="renewableEnergy"
                type="number"
                min="0"
                max="100"
                value={formData.renewableEnergy}
                onChange={(e) => setFormData({ ...formData, renewableEnergy: e.target.value })}
                placeholder="75"
              />
            </div>
          </div>
        )

      case 6:
        return (
          <div className="space-y-6">
            <div>
              <Label htmlFor="employeeRelations">Relación con Empleados</Label>
              <Textarea
                id="employeeRelations"
                value={formData.employeeRelations}
                onChange={(e) => setFormData({ ...formData, employeeRelations: e.target.value })}
                placeholder="Describe las políticas laborales, beneficios y condiciones de trabajo..."
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="communityImpact">Impacto en Comunidades Locales</Label>
              <Textarea
                id="communityImpact"
                value={formData.communityImpact}
                onChange={(e) => setFormData({ ...formData, communityImpact: e.target.value })}
                placeholder="Describe cómo tu empresa impacta positivamente en las comunidades..."
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="laborCompliance">Cumplimiento de Normativas Laborales</Label>
              <Textarea
                id="laborCompliance"
                value={formData.laborCompliance}
                onChange={(e) => setFormData({ ...formData, laborCompliance: e.target.value })}
                placeholder="Describe el cumplimiento de normativas laborales y derechos humanos..."
                rows={3}
              />
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="fairTrade"
                checked={formData.fairTrade}
                onCheckedChange={(checked) => setFormData({ ...formData, fairTrade: checked as boolean })}
              />
              <Label htmlFor="fairTrade">Certificación de Comercio Justo</Label>
            </div>

            <div>
              <Label htmlFor="localSourcing">Abastecimiento Local (%)</Label>
              <Input
                id="localSourcing"
                type="number"
                min="0"
                max="100"
                value={formData.localSourcing}
                onChange={(e) => setFormData({ ...formData, localSourcing: e.target.value })}
                placeholder="60"
              />
            </div>
          </div>
        )

      case 7:
        return (
          <div className="space-y-6">
            <div>
              <Label>Políticas sobre Pruebas en Animales</Label>
              <RadioGroup
                value={formData.animalTesting}
                onValueChange={(value) => setFormData({ ...formData, animalTesting: value })}
                className="mt-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="no-testing" id="no-testing" />
                  <Label htmlFor="no-testing">No realizamos pruebas en animales</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="limited-testing" id="limited-testing" />
                  <Label htmlFor="limited-testing">Pruebas limitadas cuando es requerido por ley</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="no-policy" id="no-policy" />
                  <Label htmlFor="no-policy">No tenemos política específica</Label>
                </div>
              </RadioGroup>
            </div>

            <div>
              <Label>Uso de Productos de Origen Animal</Label>
              <RadioGroup
                value={formData.animalProducts}
                onValueChange={(value) => setFormData({ ...formData, animalProducts: value })}
                className="mt-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="no-animal-products" id="no-animal-products" />
                  <Label htmlFor="no-animal-products">No utilizamos productos de origen animal</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="ethical-sourcing" id="ethical-sourcing" />
                  <Label htmlFor="ethical-sourcing">
                    Utilizamos productos de origen animal con abastecimiento ético
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="conventional-sourcing" id="conventional-sourcing" />
                  <Label htmlFor="conventional-sourcing">Utilizamos productos de origen animal convencionales</Label>
                </div>
              </RadioGroup>
            </div>

            <div>
              <Label htmlFor="animalWelfare">Políticas de Bienestar Animal</Label>
              <Textarea
                id="animalWelfare"
                value={formData.animalWelfare}
                onChange={(e) => setFormData({ ...formData, animalWelfare: e.target.value })}
                placeholder="Describe las políticas de bienestar animal de tu empresa..."
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="ethicalAlternatives">Alternativas Éticas</Label>
              <Textarea
                id="ethicalAlternatives"
                value={formData.ethicalAlternatives}
                onChange={(e) => setFormData({ ...formData, ethicalAlternatives: e.target.value })}
                placeholder="Describe las alternativas éticas que utilizas en lugar de productos de origen animal..."
                rows={3}
              />
            </div>
          </div>
        )

      case 8:
        const regenScore = calculateRegenScore()
        return (
          <div className="space-y-6">
            <div className="text-center">
              <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Leaf className="w-12 h-12 text-green-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">¡Producto Listo para Enviar!</h3>
              <p className="text-gray-600">Revisa la información antes de publicar tu producto</p>
            </div>

            <Card className="bg-gradient-to-r from-green-50 to-blue-50">
              <CardContent className="p-6">
                <div className="text-center">
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">Puntuación REGEN Estimada</h4>
                  <div className="text-4xl font-bold text-green-600 mb-2">{regenScore}</div>
                  <Badge
                    className={`${regenScore >= 80 ? "bg-green-100 text-green-800" : regenScore >= 60 ? "bg-yellow-100 text-yellow-800" : "bg-red-100 text-red-800"}`}
                  >
                    {regenScore >= 80 ? "Excelente" : regenScore >= 60 ? "Bueno" : "Necesita Mejoras"}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Información del Producto</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <p>
                    <strong>Nombre:</strong> {formData.name || "Sin especificar"}
                  </p>
                  <p>
                    <strong>SKU:</strong> {formData.sku || "Sin especificar"}
                  </p>
                  <p>
                    <strong>Categoría:</strong> {formData.category || "Sin especificar"}
                  </p>
                  <p>
                    <strong>Precio:</strong> ${formData.price || "0"}
                  </p>
                  <p>
                    <strong>Stock:</strong> {formData.stock || "0"} unidades
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Sostenibilidad</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <p>
                    <strong>Certificaciones:</strong> {formData.certifications.length}
                  </p>
                  <p>
                    <strong>Beneficios:</strong> {formData.sustainabilityBenefits.length}
                  </p>
                  <p>
                    <strong>Reciclabilidad:</strong> {formData.recyclability || "0"}%
                  </p>
                  <p>
                    <strong>Energía Renovable:</strong> {formData.renewableEnergy || "0"}%
                  </p>
                </CardContent>
              </Card>
            </div>

            {formData.certifications.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Certificaciones Seleccionadas</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {formData.certifications.map((cert) => (
                      <Badge key={cert} className="bg-green-100 text-green-800">
                        <Award className="w-3 h-3 mr-1" />
                        {cert}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-start space-x-2">
                <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-yellow-800">Antes de enviar</h4>
                  <p className="text-sm text-yellow-700 mt-1">
                    Asegúrate de que toda la información sea precisa. Los productos serán revisados antes de ser
                    publicados.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Button variant="outline" onClick={onBack}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Volver
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Agregar Nuevo Producto</h1>
              <p className="text-gray-600">Completa la información para publicar tu producto sostenible</p>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium text-gray-700">Paso {currentStep} de 8</span>
            <span className="text-sm text-gray-500">{Math.round((currentStep / 8) * 100)}% completado</span>
          </div>
          <Progress value={(currentStep / 8) * 100} className="h-2" />
        </div>

        {/* Steps Navigation */}
        <div className="flex items-center justify-between mb-8 overflow-x-auto">
          {steps.map((step) => {
            const Icon = step.icon
            const isActive = step.id === currentStep
            const isCompleted = step.id < currentStep

            return (
              <div key={step.id} className="flex flex-col items-center min-w-0 flex-1">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${
                    isActive
                      ? "bg-green-600 text-white"
                      : isCompleted
                        ? "bg-green-100 text-green-600"
                        : "bg-gray-100 text-gray-400"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <span className={`text-xs text-center ${isActive ? "text-green-600 font-medium" : "text-gray-500"}`}>
                  {step.title}
                </span>
              </div>
            )
          })}
        </div>

        {/* Form Content */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              {React.createElement(steps[currentStep - 1].icon, { className: "w-5 h-5" })}
              <span>{steps[currentStep - 1].title}</span>
            </CardTitle>
          </CardHeader>
          <CardContent>{renderStepContent()}</CardContent>
        </Card>

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between mt-8">
          <Button variant="outline" onClick={prevStep} disabled={currentStep === 1}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Anterior
          </Button>

          {currentStep === 8 ? (
            <Button onClick={handleSubmit} className="bg-green-600 hover:bg-green-700">
              <CheckCircle className="w-4 h-4 mr-2" />
              Publicar Producto
            </Button>
          ) : (
            <Button onClick={nextStep} className="bg-green-600 hover:bg-green-700">
              Siguiente
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
