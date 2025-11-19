"use client"

import type React from "react"
import { useState, useCallback, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Store,
  MapPin,
  Phone,
  Mail,
  Globe,
  Award,
  Leaf,
  Info,
  Sparkles
} from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { toast } from "sonner"

interface VendorFormProps {
  onSubmit: (data: Record<string, unknown>) => void
}

export default function VendorForm({ onSubmit }: VendorFormProps) {
  const [formData, setFormData] = useState({
    // Business Info
    companyName: "",
    contactName: "",
    businessType: "",
    description: "",

    // Contact
    email: "",
    phone: "",
    website: "",
    address: "",

    // Category
    category: "",

    // Sustainability Intent (opcional)
    sustainabilityIntent: "",
    certifications: [] as string[],
    sustainabilityGoals: [] as string[],
    // Extended Environmental Certifications (new granular list)
    environmentalCertifications: [] as string[],
    certificationDocuments: [] as File[],
    // Social Practices
    laborPractices: "",
    communityImpact: "",
    laborCompliance: "",
    fairTradeCertified: false,
    localSourcingPercent: "", // string to simplify input handling
    // Animal Welfare
    animalTestingPolicy: "", // NO_TESTING | LIMITED_LEGAL | NO_POLICY
    animalOriginUse: "", // NO_ANIMAL_PRODUCTS | ETHICAL_ANIMAL_PRODUCTS | CONVENTIONAL_ANIMAL_PRODUCTS
    animalWelfarePolicies: "",
    ethicalAlternatives: "",
  })

  const [currentSection, setCurrentSection] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({})
  const [generalError, setGeneralError] = useState<string | null>(null)

  const sections = [
    { title: "Información Básica", icon: Store },
    { title: "Contacto", icon: MapPin },
    { title: "Categoría", icon: Award },
    { title: "Sostenibilidad", icon: Leaf },
    { title: "Impacto Social & Bienestar", icon: Info },
  ]

  const businessTypeOptions = [
    "LLC",
    "Individual",
    "Corporation",
    "Cooperative",
    "Non-profit",
  ]

  const certificationOptions = [
    // Legacy options (maintained for backward compatibility)
    "ISO 14001 (Gestión Ambiental)",
    "ISO 50001 (Gestión Energética)",
    "B Corp",
    "LEED",
    "Fair Trade",
    "Organic/Orgánico",
    "Energy Star",
    "Carbono Neutral",
  ]

  // New environmental certification reference list (normalized, uppercase keys optional later)
  const environmentalCertificationOptions = [
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

  const sustainabilityGoalOptions = [
    "Reducir emisiones de carbono",
    "Conservar agua",
    "Gestión de residuos",
    "Energía renovable",
    "Economía circular",
    "Impacto social positivo",
    "Bienestar animal",
  ]

  const handleInputChange = useCallback((field: string, value: string | string[] | boolean) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
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

  const handleGoalToggle = useCallback((goal: string) => {
    setFormData((prev) => ({
      ...prev,
      sustainabilityGoals: prev.sustainabilityGoals.includes(goal)
        ? prev.sustainabilityGoals.filter((g) => g !== goal)
        : [...prev.sustainabilityGoals, goal],
    }))
  }, [])

  const handleEnvironmentalCertificationToggle = useCallback((cert: string) => {
    setFormData(prev => ({
      ...prev,
      environmentalCertifications: prev.environmentalCertifications.includes(cert)
        ? prev.environmentalCertifications.filter(c => c !== cert)
        : [...prev.environmentalCertifications, cert]
    }))
  }, [])

  const handleCertificationDocsChange = useCallback((files: FileList | null) => {
    if (!files) return
    setFormData(prev => ({
      ...prev,
      certificationDocuments: Array.from(files)
    }))
  }, [])

  // Upload helper: uploads selected files to /api/upload and returns array of metadata
  const uploadCertificationDocuments = useCallback(async (): Promise<
    { url: string; filename: string; type?: string; size?: number }[]
  > => {
    if (!formData.certificationDocuments || formData.certificationDocuments.length === 0) return []
    const uploads = formData.certificationDocuments.map(async (file) => {
      const fd = new FormData()
      fd.append('file', file)
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: fd
      })
      const data = await res.json()
      if (!res.ok) {
        throw new Error(data?.error || 'Upload failed')
      }
      return {
        url: data.url as string,
        filename: data.filename as string,
        type: data.type as string | undefined,
        size: data.size as number | undefined,
      }
    })
    return Promise.all(uploads)
  }, [formData.certificationDocuments])

  // Validación por sección
  const validateSection = useCallback(() => {
    switch (currentSection) {
      case 0: // Información Básica
        return (
          formData.companyName.trim() !== "" &&
          formData.contactName.trim() !== "" &&
          formData.businessType !== ""
        )
      case 1: // Contacto
        return (
          formData.email.trim() !== "" &&
          /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email) &&
          formData.phone.trim() !== ""
        )
      case 2: // Categoría
        return formData.category !== ""
      case 3: // Sostenibilidad (opcional)
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
      setGeneralError(null)
      setFieldErrors({})

      try {
        // 1) Subir documentos (si existen)
        let uploadedDocs: { url: string; filename: string; type?: string; size?: number }[] = []
        try {
          uploadedDocs = await uploadCertificationDocuments()
        } catch (err) {
          console.error('Upload error:', err)
          setGeneralError('Error al subir documentos de certificación. Intenta de nuevo.')
          setIsSubmitting(false)
          return
        }

        const response = await fetch("/api/vendor/onboarding", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            companyName: formData.companyName,
            contactName: formData.contactName,
            businessType: formData.businessType,
            description: formData.description,
            email: formData.email,
            phone: formData.phone,
            website: formData.website,
            businessAddress: formData.address,
            category: formData.category,
            certifications: formData.certifications,
            sustainabilityGoals: formData.sustainabilityGoals,
            sustainabilityIntent: formData.sustainabilityIntent,
            environmentalCertifications: formData.environmentalCertifications,
            certificationDocuments: uploadedDocs,
            laborPractices: formData.laborPractices,
            communityImpact: formData.communityImpact,
            laborCompliance: formData.laborCompliance,
            fairTradeCertified: formData.fairTradeCertified,
            localSourcingPercent: formData.localSourcingPercent,
            animalTestingPolicy: formData.animalTestingPolicy,
            animalOriginUse: formData.animalOriginUse,
            animalWelfarePolicies: formData.animalWelfarePolicies,
            ethicalAlternatives: formData.ethicalAlternatives,
            // NOTE: certificationDocuments need multipart handling in future endpoint; currently omitted
          }),
        })

        const data = await response.json()

        if (response.ok) {
          toast.success("Solicitud enviada. Estamos revisando tu aplicación.")
          onSubmit(data)
        } else {
          // Manejo específico por status
          if (response.status === 401) {
            setGeneralError("Necesitas iniciar sesión para continuar. Por favor inicia sesión e inténtalo de nuevo.")
          } else if (response.status === 403) {
            setGeneralError("Acceso denegado. No tienes permisos para realizar esta acción.")
          } else if (response.status === 400) {
            // Errores de validación desde Zod
            if (data?.details?.fieldErrors) {
              setFieldErrors(data.details.fieldErrors as Record<string, string[]>)
              setGeneralError("Por favor corrige los campos marcados.")
            } else {
              setGeneralError(data.error || "Error de validación")
            }
          } else {
            setGeneralError(data.error || "Error al enviar el formulario")
          }
          console.error("Vendor onboarding failed:", data)
        }
      } catch (error) {
        console.error("Error submitting vendor form:", error)
        setGeneralError("Error al enviar el formulario. Por favor intenta de nuevo.")
      } finally {
        setIsSubmitting(false)
      }
    },
    [formData, onSubmit, isSubmitting]
  )

  // Cuando hay errores de validación, cambiar a la sección correspondiente y hacer scroll
  useEffect(() => {
    const keys = Object.keys(fieldErrors)
    if (keys.length === 0) return

    // Mapear campos -> sección
    const sectionByField: Record<string, number> = {
      companyName: 0,
      contactName: 0,
      businessType: 0,
      email: 1,
      phone: 1,
      businessAddress: 1,
      address: 1,
      category: 2,
      environmentalCertifications: 4,
      certificationDocuments: 4,
    }

    for (const key of keys) {
      const sectionIndex = sectionByField[key]
      if (sectionIndex !== undefined) {
        setCurrentSection(sectionIndex)
        // Intentar hacer scroll al campo si existe un elemento con ese id
        const el = document.getElementById(key) || document.getElementById(
          key === 'businessAddress' ? 'address' : key
        )
        if (el && 'scrollIntoView' in el) {
          setTimeout(() => el.scrollIntoView({ behavior: 'smooth', block: 'center' }), 50)
        }
        break
      }
    }
  }, [fieldErrors])

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
    <div className="space-y-4">
      {/* Errores generales */}
      {generalError && (
        <Alert className="bg-red-50 border-red-200">
          <AlertDescription className="text-sm text-red-800">
            {generalError}
          </AlertDescription>
        </Alert>
      )}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-1">
          Registro de Vendedor
        </h2>
        <p className="text-sm text-gray-600">
          Completa tu perfil básico para comenzar
        </p>
      </div>

      {/* Section Navigation */}
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

      {/* Section 0: Business Information */}
      {currentSection === 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Información de la Empresa</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid md:grid-cols-2 gap-3">
              <div>
                <Label htmlFor="companyName" className="text-xs">
                  Nombre de la Empresa *
                </Label>
                <Input
                  id="companyName"
                  value={formData.companyName}
                  onChange={(e) => handleInputChange("companyName", e.target.value)}
                  placeholder="EcoTech Solutions"
                  className={`h-9 text-sm ${fieldErrors.companyName ? 'border-red-300 focus:ring-red-500' : ''}`}
                  required
                />
                {fieldErrors.companyName && (
                  <p className="mt-1 text-[11px] text-red-600">{fieldErrors.companyName[0]}</p>
                )}
              </div>
              <div>
                <Label htmlFor="contactName" className="text-xs">
                  Nombre del Representante Legal *
                </Label>
                <Input
                  id="contactName"
                  value={formData.contactName}
                  onChange={(e) => handleInputChange("contactName", e.target.value)}
                  placeholder="Juan Pérez"
                  className={`h-9 text-sm ${fieldErrors.contactName ? 'border-red-300 focus:ring-red-500' : ''}`}
                  required
                />
                {fieldErrors.contactName && (
                  <p className="mt-1 text-[11px] text-red-600">{fieldErrors.contactName[0]}</p>
                )}
              </div>
            </div>

            <div>
              <Label htmlFor="businessType" className="text-xs">
                Tipo de Negocio *
              </Label>
              <select
                id="businessType"
                value={formData.businessType}
                onChange={(e) => handleInputChange("businessType", e.target.value)}
                className="w-full h-9 px-3 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              >
                <option value="">Selecciona...</option>
                {businessTypeOptions.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
              {fieldErrors.businessType && (
                <p className="mt-1 text-[11px] text-red-600">{fieldErrors.businessType[0]}</p>
              )}
            </div>

            <div>
              <Label htmlFor="description" className="text-xs">
                Descripción de la Empresa
              </Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
                placeholder="Describe tu empresa, productos y servicios..."
                className="text-sm"
                rows={3}
              />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Section 1: Contact */}
      {currentSection === 1 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Información de Contacto</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid md:grid-cols-2 gap-3">
              <div>
                <Label htmlFor="email" className="text-xs">
                  Email Corporativo *
                </Label>
                <div className="relative">
                  <Mail className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400 w-3.5 h-3.5" />
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    placeholder="contacto@empresa.com"
                    className={`pl-8 h-9 text-sm ${fieldErrors.email ? 'border-red-300 focus:ring-red-500' : ''}`}
                    required
                  />
                </div>
                {fieldErrors.email && (
                  <p className="mt-1 text-[11px] text-red-600">{fieldErrors.email[0]}</p>
                )}
              </div>
              <div>
                <Label htmlFor="phone" className="text-xs">
                  Teléfono *
                </Label>
                <div className="relative">
                  <Phone className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400 w-3.5 h-3.5" />
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    placeholder="+52 (555) 123-4567"
                    className={`pl-8 h-9 text-sm ${fieldErrors.phone ? 'border-red-300 focus:ring-red-500' : ''}`}
                    required
                  />
                </div>
                {fieldErrors.phone && (
                  <p className="mt-1 text-[11px] text-red-600">{fieldErrors.phone[0]}</p>
                )}
              </div>
            </div>

            <div>
              <Label htmlFor="website" className="text-xs">
                Sitio Web
              </Label>
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
              <Label htmlFor="address" className="text-xs">
                Dirección Física *
              </Label>
              <Textarea
                id="address"
                value={formData.address}
                onChange={(e) => handleInputChange("address", e.target.value)}
                placeholder="Calle, Número, Colonia, Ciudad, Estado, CP"
                className={`text-sm ${fieldErrors.businessAddress ? 'border-red-300 focus:ring-red-500' : ''}`}
                rows={2}
                required
              />
              {fieldErrors.businessAddress && (
                <p className="mt-1 text-[11px] text-red-600">{fieldErrors.businessAddress[0]}</p>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Section 2: Category */}
      {currentSection === 2 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Categoría de Productos</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <Label htmlFor="category" className="text-xs">
                Categoría Principal *
              </Label>
              <select
                id="category"
                value={formData.category}
                onChange={(e) => handleInputChange("category", e.target.value)}
                className="w-full h-9 px-3 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              >
                <option value="">Selecciona...</option>
                <option value="energia-limpia">Energía Limpia</option>
                <option value="agua-tecnologia">Tecnología del Agua</option>
                <option value="transporte-sostenible">Transporte Sostenible</option>
                <option value="construccion-verde">Construcción Verde</option>
                <option value="agricultura-tech">AgriTech</option>
                <option value="residuos-reciclaje">Gestión de Residuos</option>
                <option value="moda-sostenible">Moda Sostenible</option>
                <option value="alimentos-organicos">Alimentos Orgánicos</option>
                <option value="cosmetica-natural">Cosmética Natural</option>
                <option value="tecnologia-limpia">Tecnología Limpia</option>
              </select>
              {fieldErrors.category && (
                <p className="mt-1 text-[11px] text-red-600">{fieldErrors.category[0]}</p>
              )}
            </div>

            <Alert className="bg-blue-50 border-blue-200">
              <Info className="h-4 w-4 text-blue-600" />
              <AlertDescription className="text-xs text-blue-800">
                Podrás agregar más categorías después de completar el registro
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      )}

      {/* Section 3: Sustainability (Optional) */}
      {currentSection === 3 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-green-600" />
              Compromiso de Sostenibilidad
            </CardTitle>
            <p className="text-xs text-gray-600">
              Sección opcional - Ayúdanos a conocer tus iniciativas sostenibles
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Sustainability Intent */}
            <div>
              <Label htmlFor="sustainabilityIntent" className="text-xs">
                ¿Qué te motiva a ser un vendedor sostenible?
              </Label>
              <Textarea
                id="sustainabilityIntent"
                value={formData.sustainabilityIntent}
                onChange={(e) =>
                  handleInputChange("sustainabilityIntent", e.target.value)
                }
                placeholder="Comparte tu visión y compromiso con la sostenibilidad..."
                className="text-sm"
                rows={3}
              />
            </div>

            {/* Existing Certifications */}
            <div>
              <Label className="text-sm font-medium">
                ¿Tienes certificaciones actuales?
              </Label>
              <p className="text-xs text-gray-600 mb-2">
                Selecciona las que ya posees (opcional)
              </p>
              <div className="grid md:grid-cols-2 gap-2 max-h-48 overflow-y-auto">
                {certificationOptions.map((cert, index) => (
                  <div
                    key={index}
                    className="flex items-center space-x-2 p-2 border rounded hover:bg-gray-50"
                  >
                    <Checkbox
                      id={`cert-${index}`}
                      checked={formData.certifications.includes(cert)}
                      onCheckedChange={() => handleCertificationToggle(cert)}
                    />
                    <Label
                      htmlFor={`cert-${index}`}
                      className="text-xs cursor-pointer flex-1"
                    >
                      {cert}
                    </Label>
                  </div>
                ))}
              </div>
              {formData.certifications.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1">
                  {formData.certifications.map((cert, index) => (
                    <Badge key={index} className="bg-green-100 text-green-800 text-xs">
                      {cert}
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            {/* Sustainability Goals */}
            <div>
              <Label className="text-sm font-medium">
                Objetivos de Sostenibilidad
              </Label>
              <p className="text-xs text-gray-600 mb-2">
                ¿En qué áreas estás trabajando? (opcional)
              </p>
              <div className="grid md:grid-cols-2 gap-2">
                {sustainabilityGoalOptions.map((goal, index) => (
                  <div
                    key={index}
                    className="flex items-center space-x-2 p-2 border rounded hover:bg-gray-50"
                  >
                    <Checkbox
                      id={`goal-${index}`}
                      checked={formData.sustainabilityGoals.includes(goal)}
                      onCheckedChange={() => handleGoalToggle(goal)}
                    />
                    <Label
                      htmlFor={`goal-${index}`}
                      className="text-xs cursor-pointer flex-1"
                    >
                      {goal}
                    </Label>
                  </div>
                ))}
              </div>
              {formData.sustainabilityGoals.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1">
                  {formData.sustainabilityGoals.map((goal, index) => (
                    <Badge
                      key={index}
                      className="bg-blue-100 text-blue-800 text-xs"
                    >
                      {goal}
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            {/* RegenMark System Info */}
            <Alert className="bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
              <Sparkles className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-xs">
                <strong className="text-green-900">
                  ¿Quieres destacar tu compromiso sostenible?
                </strong>
                <p className="text-gray-700 mt-1">
                  Después de completar el registro, podrás solicitar{" "}
                  <strong>evaluaciones de RegenMark</strong> para certificar tu
                  impacto ambiental y social. Esto te dará:
                </p>
                <ul className="list-disc list-inside mt-1 space-y-0.5 text-gray-700">
                  <li>Badge verificado en tus productos</li>
                  <li>Comisión reducida (hasta 7%)</li>
                  <li>Mayor visibilidad en el marketplace</li>
                  <li>NFT que evoluciona con tu desempeño</li>
                </ul>
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      )}

      {/* Section 4: Social & Animal Welfare */}
      {currentSection === 4 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Info className="w-5 h-5 text-green-600" />
              Impacto Social & Bienestar Animal
            </CardTitle>
            <p className="text-xs text-gray-600">
              Información para reforzar transparencia y futuras evaluaciones RegenMark.
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Environmental Certifications Expanded */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Certificaciones Ambientales</Label>
              <p className="text-xs text-gray-600">Selecciona las certificaciones que posees actualmente.</p>
              <div className="grid md:grid-cols-2 gap-2 max-h-48 overflow-y-auto">
                {environmentalCertificationOptions.map((cert, idx) => (
                  <div key={cert} className="flex items-center space-x-2 p-2 border rounded hover:bg-gray-50">
                    <Checkbox
                      id={`env-cert-${idx}`}
                      checked={formData.environmentalCertifications.includes(cert)}
                      onCheckedChange={() => handleEnvironmentalCertificationToggle(cert)}
                    />
                    <Label htmlFor={`env-cert-${idx}`} className="text-xs cursor-pointer flex-1">
                      {cert}
                    </Label>
                  </div>
                ))}
              </div>
              {formData.environmentalCertifications.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1">
                  {formData.environmentalCertifications.map(c => (
                    <Badge key={c} className="bg-emerald-100 text-emerald-800 text-xs">{c}</Badge>
                  ))}
                </div>
              )}
              <div className="mt-3 space-y-1">
                <Label htmlFor="certDocs" className="text-xs">Documentos de Certificación (PDF/Imagen)</Label>
                <Input
                  id="certDocs"
                  type="file"
                  multiple
                  onChange={e => handleCertificationDocsChange(e.target.files)}
                  className="text-xs"
                  accept=".pdf,.png,.jpg,.jpeg,.webp"
                />
                {/* Hint de obligatoriedad si aplica */}
                {((formData.environmentalCertifications?.length || 0) > 0 ||
                  ["alimentos-organicos", "cosmetica-natural"].includes(formData.category)) && (
                  <p className="text-[11px] text-red-600">Requerido: adjunta al menos un documento como evidencia.</p>
                )}
                {fieldErrors.certificationDocuments && (
                  <p className="text-[11px] text-red-600">{fieldErrors.certificationDocuments[0]}</p>
                )}
                <p className="text-[10px] text-gray-500">Puedes subir imágenes o PDF. Tamaño máximo 5MB por archivo.</p>
                {/* Selected files preview */}
                {formData.certificationDocuments.length > 0 && (
                  <ul className="mt-2 list-disc list-inside text-[11px] text-gray-700">
                    {formData.certificationDocuments.map((f, idx) => (
                      <li key={`${f.name}-${idx}`}>{f.name} ({Math.round(f.size / 1024)} KB)</li>
                    ))}
                  </ul>
                )}
              </div>
            </div>

            {/* Social Practices */}
            <div className="space-y-3">
              <Label className="text-sm font-medium">Prácticas Sociales</Label>
              <div className="space-y-2">
                <Label htmlFor="laborPractices" className="text-xs">Relación con Empleados</Label>
                <Textarea
                  id="laborPractices"
                  rows={3}
                  className="text-xs"
                  value={formData.laborPractices}
                  onChange={e => handleInputChange('laborPractices', e.target.value)}
                  placeholder="Describe políticas laborales, beneficios y condiciones de trabajo..."
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="communityImpact" className="text-xs">Impacto en Comunidades Locales</Label>
                <Textarea
                  id="communityImpact"
                  rows={3}
                  className="text-xs"
                  value={formData.communityImpact}
                  onChange={e => handleInputChange('communityImpact', e.target.value)}
                  placeholder="Cómo impacta positivamente tu empresa en las comunidades..."
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="laborCompliance" className="text-xs">Cumplimiento de Normativas Laborales</Label>
                <Textarea
                  id="laborCompliance"
                  rows={3}
                  className="text-xs"
                  value={formData.laborCompliance}
                  onChange={e => handleInputChange('laborCompliance', e.target.value)}
                  placeholder="Describe el cumplimiento de normativas y derechos humanos..."
                />
              </div>
              <div className="grid md:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label htmlFor="fairTradeCertified" className="text-xs">Certificación de Comercio Justo</Label>
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id="fairTradeCertified"
                      checked={formData.fairTradeCertified}
                      onCheckedChange={(checked) => setFormData(prev => ({ ...prev, fairTradeCertified: !!checked }))}
                    />
                    <Label htmlFor="fairTradeCertified" className="text-xs">Empresa certificada</Label>
                  </div>
                </div>
                <div className="space-y-1">
                  <Label htmlFor="localSourcingPercent" className="text-xs">Abastecimiento Local (%)</Label>
                  <Input
                    id="localSourcingPercent"
                    type="number"
                    min={0}
                    max={100}
                    className="h-8 text-xs"
                    value={formData.localSourcingPercent}
                    onChange={e => handleInputChange('localSourcingPercent', e.target.value)}
                    placeholder="Ej: 45"
                  />
                </div>
              </div>
            </div>

            {/* Animal Welfare */}
            <div className="space-y-3">
              <Label className="text-sm font-medium">Bienestar Animal</Label>
              <div className="space-y-2">
                <Label htmlFor="animalTestingPolicy" className="text-xs">Políticas sobre Pruebas en Animales</Label>
                <select
                  id="animalTestingPolicy"
                  value={formData.animalTestingPolicy}
                  onChange={e => handleInputChange('animalTestingPolicy', e.target.value)}
                  className="w-full h-9 px-3 text-xs border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="">Selecciona...</option>
                  <option value="NO_TESTING">No realizamos pruebas en animales</option>
                  <option value="LIMITED_LEGAL">Pruebas limitadas cuando es requerido por ley</option>
                  <option value="NO_POLICY">No tenemos política específica</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="animalOriginUse" className="text-xs">Uso de Productos de Origen Animal</Label>
                <select
                  id="animalOriginUse"
                  value={formData.animalOriginUse}
                  onChange={e => handleInputChange('animalOriginUse', e.target.value)}
                  className="w-full h-9 px-3 text-xs border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="">Selecciona...</option>
                  <option value="NO_ANIMAL_PRODUCTS">No utilizamos productos de origen animal</option>
                  <option value="ETHICAL_ANIMAL_PRODUCTS">Abastecimiento ético de productos animales</option>
                  <option value="CONVENTIONAL_ANIMAL_PRODUCTS">Uso convencional</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="animalWelfarePolicies" className="text-xs">Políticas de Bienestar Animal</Label>
                <Textarea
                  id="animalWelfarePolicies"
                  rows={3}
                  className="text-xs"
                  value={formData.animalWelfarePolicies}
                  onChange={e => handleInputChange('animalWelfarePolicies', e.target.value)}
                  placeholder="Describe las políticas de bienestar animal..."
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="ethicalAlternatives" className="text-xs">Alternativas Éticas</Label>
                <Textarea
                  id="ethicalAlternatives"
                  rows={3}
                  className="text-xs"
                  value={formData.ethicalAlternatives}
                  onChange={e => handleInputChange('ethicalAlternatives', e.target.value)}
                  placeholder="Describe sustituciones o alternativas éticas empleadas..."
                />
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Navigation */}
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
            {isSubmitting ? "Procesando..." : "Completar Registro"}
          </Button>
        )}
      </div>
    </div>
  )
}
