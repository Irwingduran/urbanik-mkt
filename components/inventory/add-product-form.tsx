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
import { apiFetch } from "@/lib/api-client"

interface AddProductFormProps {
  onBack: () => void
}

type RegenMarkKey = "carbon_saver" | "water_guardian" | "human_first" | "humane_hero" | "circular_champion"

interface FormDataType {
  // Paso 1: Información Básica
  name: string
  sku: string
  category: string
  price: string
  description: string
  stock: string
  minStock: string
  images: File[]

  // Paso 2: Impacto Ambiental
  environmentalImpact: string
  sustainabilityBenefits: string[]
  carbonFootprint: string
  waterFootprint: string
  wasteGenerated: string

  // Paso 3: Ciclo de Vida
  rawMaterials: string
  production: string
  distribution: string
  usage: string
  disposal: string
  recyclability: string
  biodegradability: string

  // Paso 4: Recursos y Eficiencia
  waterConsumption: string
  carbonEmissions: string
  wasteGeneration: string
  energyEfficiency: string
  renewableEnergy: string

  // RegenMarks (Paso 5)
  selectedRegenMarks: string[]
  regenMarkData: Record<RegenMarkKey, { notes: string; documentation: string }>
  regenMarkEvaluations?: Array<{ type: string; notes: string; documentation: string }>
}

const steps = [
  { id: 1, title: "Información Básica", icon: CheckCircle },
  { id: 2, title: "Impacto Ambiental", icon: Leaf },
  { id: 3, title: "Ciclo de Vida", icon: Recycle },
  { id: 4, title: "Recursos y Eficiencia", icon: Droplets },
  { id: 5, title: "Revisión Final", icon: CheckCircle },
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
  const [formData, setFormData] = useState<FormDataType>({
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

    // Paso 3: Ciclo de Vida
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

    // RegenMarks (Paso 5)
    selectedRegenMarks: [] as string[],
    regenMarkData: {
      carbon_saver: { notes: "", documentation: "" },
      water_guardian: { notes: "", documentation: "" },
      human_first: { notes: "", documentation: "" },
      humane_hero: { notes: "", documentation: "" },
      circular_champion: { notes: "", documentation: "" },
    },
  })

  const calculateRegenScore = () => {
    let score = 50 // Base score

    // Beneficios de sostenibilidad (max 15 puntos)
    score += Math.min(formData.sustainabilityBenefits.length * 2, 15)

    // Reciclabilidad (max 10 puntos)
    if (formData.recyclability) score += Number.parseInt(formData.recyclability) / 10

    // Energía renovable (max 5 puntos)
    if (formData.renewableEnergy) score += Number.parseInt(formData.renewableEnergy) / 20

    return Math.min(Math.round(score), 100)
  }

  const detectRegenMarkEligibility = () => {
    const regenScore = calculateRegenScore()
    const minimumScore = 60
    
    if (regenScore < minimumScore) {
      return { eligible: false, applicableMarks: [] }
    }

    const applicableMarks: Array<{ type: string; strength: string; reason: string }> = []

    // CARBON_SAVER: Energía renovable > 50% OR emisiones < 2 kg CO₂
    if (
      (formData.renewableEnergy && Number.parseInt(formData.renewableEnergy) > 50) ||
      (formData.carbonEmissions && Number.parseInt(formData.carbonEmissions) < 2) ||
      formData.sustainabilityBenefits.includes("Energía renovable") ||
      formData.sustainabilityBenefits.includes("Reducción de emisiones CO₂")
    ) {
      applicableMarks.push({
        type: "CARBON_SAVER",
        strength: formData.renewableEnergy && Number.parseInt(formData.renewableEnergy) > 50 ? "strong" : "moderate",
        reason: "Tu producto tiene reducción significativa de carbono",
      })
    }

    // WATER_GUARDIAN: Consumo de agua < 10 litros/unidad OR beneficio "Ahorro de agua"
    if (
      (formData.waterConsumption && Number.parseInt(formData.waterConsumption) < 10) ||
      formData.sustainabilityBenefits.includes("Ahorro de agua")
    ) {
      applicableMarks.push({
        type: "WATER_GUARDIAN",
        strength: "strong",
        reason: "Tu producto conserva agua significativamente",
      })
    }

    // HUMAN_FIRST: Comercio justo OR producción local > 70%
    if (
      formData.sustainabilityBenefits.includes("Comercio justo") ||
      formData.sustainabilityBenefits.includes("Producción local")
    ) {
      applicableMarks.push({
        type: "HUMAN_FIRST",
        strength: "strong",
        reason: "Tu producto tiene compromiso con comunidades",
      })
    }

    // HUMANE_HERO: Beneficios sin animales (biodegradable, materials reciclados)
    if (
      formData.sustainabilityBenefits.includes("Biodegradable") ||
      formData.sustainabilityBenefits.includes("Materiales reciclados")
    ) {
      applicableMarks.push({
        type: "HUMANE_HERO",
        strength: "moderate",
        reason: "Tu producto es ético y humano-first",
      })
    }

    // CIRCULAR_CHAMPION: Reciclabilidad > 80% O Biodegradable
    if (
      (formData.recyclability && Number.parseInt(formData.recyclability) > 80) ||
      formData.sustainabilityBenefits.includes("Biodegradable")
    ) {
      applicableMarks.push({
        type: "CIRCULAR_CHAMPION",
        strength: formData.recyclability && Number.parseInt(formData.recyclability) > 80 ? "strong" : "moderate",
        reason: "Tu producto es completamente circular",
      })
    }

    return {
      eligible: applicableMarks.length > 0,
      applicableMarks,
    }
  }

  const nextStep = () => {
    if (currentStep < 5) setCurrentStep(currentStep + 1)
  }

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1)
  }

  const [clientErrors, setClientErrors] = useState<string[]>([])

  const validateClient = () => {
    const errs: string[] = []
    if (!formData.name) errs.push("Nombre es requerido")
    if (!formData.sku) errs.push("SKU es requerido")
    if (!formData.category) errs.push("Categoría es requerida")
    if (!formData.price) errs.push("Precio es requerido")
    if (!formData.description || formData.description.length < 10) errs.push("Descripción mínima 10 caracteres")
    if (!formData.stock) errs.push("Stock inicial requerido")
    return errs
  }

  const handleSubmit = async () => {
    try {
      const errs = validateClient()
      if (errs.length) {
        setClientErrors(errs)
        return
      } else {
        setClientErrors([])
      }
      const submitData: FormDataType & { regenScore: number } = {
        ...formData,
        regenScore: calculateRegenScore(),
      }

      // Si hay RegenMarks seleccionados, preparar para envío
      if (formData.selectedRegenMarks.length > 0) {
        const regenMarkEvaluations = formData.selectedRegenMarks.map((mark) => {
          const markKey = mark.toLowerCase() as keyof typeof formData.regenMarkData
          const markData = formData.regenMarkData[markKey] || { notes: "", documentation: "" }
          return {
            type: mark,
            notes: markData.notes || "",
            documentation: markData.documentation || "",
          }
        })
        submitData.regenMarkEvaluations = regenMarkEvaluations
      }

      console.log("Producto enviado:", submitData)

      // Primero guardar el producto
      const productResponse = await apiFetch('/api/vendor/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          description: formData.description,
          price: formData.price,
          sku: formData.sku,
          category: formData.category,
          stock: formData.stock,
          minStock: formData.minStock,
          co2Reduction: formData.carbonEmissions ? Number.parseFloat(formData.carbonEmissions) : 0,
          waterSaving: formData.waterConsumption ? Number.parseFloat(formData.waterConsumption) : 0,
          energyEfficiency: formData.energyEfficiency ? Number.parseFloat(formData.energyEfficiency) : 0,
          sustainabilityBenefits: formData.sustainabilityBenefits
        })
      })

      const productResult = await productResponse.json()
      const productId = productResult.data.id
      console.log('Producto creado:', productResult)
      alert(`¡Producto "${formData.name}" creado exitosamente!`)

      // Luego solicitar evaluaciones de RegenMarks si existen
      if (formData.selectedRegenMarks.length > 0) {
        try {
          const regenMarkResponse = await apiFetch('/api/regenmarks/request-evaluation', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              productId: productId,
              selectedRegenMarks: formData.selectedRegenMarks.map(mark => ({
                type: mark,
                notes: formData.regenMarkData[mark.toLowerCase() as keyof typeof formData.regenMarkData]?.notes || '',
                documentation: formData.regenMarkData[mark.toLowerCase() as keyof typeof formData.regenMarkData]?.documentation || ''
              })),
              regenScore: calculateRegenScore(),
              productData: {
                name: formData.name,
                sku: formData.sku,
                category: formData.category,
                carbonEmissions: formData.carbonEmissions ? Number.parseFloat(formData.carbonEmissions) : undefined,
                waterConsumption: formData.waterConsumption ? Number.parseFloat(formData.waterConsumption) : undefined,
                renewableEnergy: formData.renewableEnergy ? Number.parseFloat(formData.renewableEnergy) : undefined,
                recyclability: formData.recyclability ? Number.parseFloat(formData.recyclability) : undefined,
                sustainabilityBenefits: formData.sustainabilityBenefits
              }
            })
          })
          const result = await regenMarkResponse.json()
          console.log('RegenMarks solicitados:', result)
          alert(`Se han solicitado ${result.requestedMarks.length} evaluación(es) de RegenMarks.`)
        } catch (regenMarkError) {
          console.error('Error al solicitar RegenMarks:', regenMarkError)
          alert('Producto agregado, pero hubo error al procesar RegenMarks. Intenta más tarde.')
        }
      }

      onBack()
    } catch (error: any) {
      console.error("Error al enviar producto:", error)
      if (error?.body) {
        try {
          const parsed = JSON.parse(error.body)
          if (parsed.code === 'VALIDATION_FAILED' && parsed.details) {
            const flatErrors = Object.values(parsed.details)
              .filter(Boolean)
              .flat()
              .map(e => String(e)) as string[]
            setClientErrors(flatErrors)
            return
          }
          alert(`Error al guardar el producto: ${parsed.error}${parsed.details ? ' - ' + JSON.stringify(parsed.details) : ''}`)
          return
        } catch {}
      }
      alert("Error al guardar el producto. Intenta de nuevo.")
    }
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

      case 4:
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

      case 5:
        const regenScore = calculateRegenScore()
        const regenMarkEligibility = detectRegenMarkEligibility()
        
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

            {/* RegenMarks Condicional */}
            {regenMarkEligibility.eligible && (
              <Card className="bg-gradient-to-r from-emerald-50 to-teal-50 border-emerald-200">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-emerald-900">
                    <Leaf className="w-6 h-6 text-emerald-600" />
                    🌱 ¡Tu producto califica para RegenMarks!
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-emerald-800">
                    Tu producto cumple con los estándares para{" "}
                    <strong>{regenMarkEligibility.applicableMarks.length} certificacione(s)</strong> de sostenibilidad.
                    Esto puede mejorar tu visibilidad y beneficios comerciales.
                  </p>

                  <div className="space-y-3">
                    {regenMarkEligibility.applicableMarks.map((mark) => (
                      <div
                        key={mark.type}
                        className="flex items-start gap-3 p-3 bg-white rounded-lg border border-emerald-100"
                      >
                        <Checkbox
                          checked={formData.selectedRegenMarks.includes(mark.type)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setFormData({
                                ...formData,
                                selectedRegenMarks: [...formData.selectedRegenMarks, mark.type],
                              })
                            } else {
                              setFormData({
                                ...formData,
                                selectedRegenMarks: formData.selectedRegenMarks.filter((m) => m !== mark.type),
                              })
                            }
                          }}
                          id={`regen-${mark.type}`}
                        />
                        <div className="flex-1">
                          <label
                            htmlFor={`regen-${mark.type}`}
                            className="font-medium text-emerald-900 cursor-pointer block"
                          >
                            {mark.type === "CARBON_SAVER" && "♻️ Carbon Saver - Reduce Emisiones"}
                            {mark.type === "WATER_GUARDIAN" && "💧 Water Guardian - Conserva Agua"}
                            {mark.type === "HUMAN_FIRST" && "👥 Human First - Impacto Social"}
                            {mark.type === "HUMANE_HERO" && "🤝 Humane Hero - Ética y Bienestar"}
                            {mark.type === "CIRCULAR_CHAMPION" && "🔄 Circular Champion - Economía Circular"}
                          </label>
                          <p className="text-xs text-emerald-700 mt-1">{mark.reason}</p>
                          <p className="text-xs text-emerald-600 mt-1">
                            Confianza: {mark.strength === "strong" ? "🟢 Alto" : "🟡 Moderado"}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {formData.selectedRegenMarks.length > 0 && (
                    <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg">
                      <p className="text-sm text-emerald-800">
                        <strong>Seleccionaste {formData.selectedRegenMarks.length} RegenMark(s)</strong> para
                        evaluación. Se te contactará con los siguientes pasos.
                      </p>
                    </div>
                  )}
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
            <span className="text-sm font-medium text-gray-700">Paso {currentStep} de 5</span>
            <span className="text-sm text-gray-500">{Math.round((currentStep / 5) * 100)}% completado</span>
          </div>
          <Progress value={(currentStep / 5) * 100} className="h-2" />
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

        {clientErrors.length > 0 && (
          <div className="mt-4 space-y-2">
            {clientErrors.map((err, i) => (
              <div key={i} className="text-sm text-red-600 flex items-center">
                <AlertCircle className="w-4 h-4 mr-1" /> {err}
              </div>
            ))}
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between mt-8">
          <Button variant="outline" onClick={prevStep} disabled={currentStep === 1}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Anterior
          </Button>

          {currentStep === 5 ? (
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
