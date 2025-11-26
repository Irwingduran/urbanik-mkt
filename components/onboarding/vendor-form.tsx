"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { toast } from "sonner"
import {
  Store,
  MapPin,
  Award,
  Leaf,
  Info,
  Mail,
  Phone,
  Globe,
  Upload,
  X,
  FileText,
  Heart
} from "lucide-react"
import { submitVendorRegenMarks } from "@/lib/services/regenmarks"
import { RegenMarkType } from "@prisma/client"
import { VendorOnboardingSchema, type VendorOnboardingValues, BusinessTypeEnum, AnimalTestingPolicyEnum, AnimalOriginUseEnum } from "@/lib/schemas/vendor-onboarding"

interface VendorFormProps {
  onSubmit: (data: Record<string, unknown>) => void
}

export default function VendorForm({ onSubmit }: VendorFormProps) {
  const [currentSection, setCurrentSection] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [uploadingFiles, setUploadingFiles] = useState(false)
  

  const form = useForm<VendorOnboardingValues>({
    resolver: zodResolver(VendorOnboardingSchema),
    defaultValues: {
      companyName: "",
      contactName: "",
      businessType: "" as unknown as VendorOnboardingValues['businessType'], // ✅ Corregido: string vacío compatible con enum
      description: "",
      email: "",
      phone: "",
      website: "",
      address: "",
      category: "",
      sustainabilityIntent: "",
      certifications: [],
      sustainabilityGoals: [],
      environmentalCertifications: [],
      certificationDocuments: [],
      laborPractices: "",
      communityImpact: "",
      laborCompliance: "",
      fairTradeCertified: false,
      localSourcingPercent: "", // ✅ Corregido: string en lugar de undefined
      animalTestingPolicy: "" as unknown as VendorOnboardingValues['animalTestingPolicy'], // ✅ Corregido
      animalOriginUse: "" as unknown as VendorOnboardingValues['animalOriginUse'], // ✅ Corregido
      animalWelfarePolicies: "",
      ethicalAlternatives: "",
    },
    mode: "onChange",
  })

  const {
    register,
    handleSubmit,
    trigger,
    setValue,
    watch,
    formState: { errors, isValid },
  } = form

  // ✅ Helper para manejar checkboxes de arrays
  const handleArrayCheckboxChange = (
    field: keyof VendorOnboardingValues, 
    value: string, 
    checked: boolean
  ) => {
    const currentArray = watch(field) as string[] || []
    const updatedArray = checked 
      ? [...currentArray, value]
      : currentArray.filter(item => item !== value)
    
    setValue(field, updatedArray as unknown as VendorOnboardingValues[keyof VendorOnboardingValues], { shouldValidate: true })
  }

  // ✅ Helper para verificar si un checkbox está checked
  const isCheckboxChecked = (field: keyof VendorOnboardingValues, value: string): boolean => {
    const array = watch(field) as string[] || []
    return array.includes(value)
  }

  const sections = [
    { title: "Información Básica", icon: Store, fields: ["companyName", "contactName", "businessType", "description"] },
    { title: "Contacto", icon: MapPin, fields: ["email", "phone", "website", "address"] },
    { title: "Categoría", icon: Award, fields: ["category"] },
    { title: "Sostenibilidad", icon: Leaf, fields: ["sustainabilityIntent", "certifications", "sustainabilityGoals"] },
    { title: "Impacto Social", icon: Info, fields: ["environmentalCertifications", "certificationDocuments", "laborPractices", "communityImpact", "laborCompliance", "fairTradeCertified", "localSourcingPercent"] },
    { title: "Bienestar Animal", icon: Heart, fields: ["animalTestingPolicy", "animalOriginUse", "animalWelfarePolicies", "ethicalAlternatives"] },
  ]

  const businessTypeOptions = BusinessTypeEnum.options
  
  const certificationOptions = [
    "ISO 14001 (Gestión Ambiental)",
    "ISO 50001 (Gestión Energética)",
    "B Corp",
    "LEED",
    "Fair Trade",
    "Organic/Orgánico",
    "Energy Star",
    "Carbono Neutral",
  ]

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

  // Helper to handle file selection
  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return
    
    setUploadingFiles(true)
    const files = Array.from(e.target.files)
    const newDocs = []

    try {
      for (const file of files) {
        // ✅ Validación de tamaño de archivo
        if (file.size > 5 * 1024 * 1024) { // 5MB
          toast.error(`El archivo ${file.name} es demasiado grande (máximo 5MB)`)
          continue
        }

        const fd = new FormData()
        fd.append('file', file)
        
        const res = await fetch('/api/upload', {
          method: 'POST',
          body: fd
        })
        
        if (!res.ok) throw new Error('Error subiendo archivo')
        
        const data = await res.json()
        newDocs.push({
          url: data.url,
          filename: data.filename || file.name,
          type: file.type,
          size: file.size
        })
      }

      const currentDocs = watch("certificationDocuments") || []
      setValue("certificationDocuments", [...currentDocs, ...newDocs], { shouldValidate: true })
      
      if (newDocs.length > 0) {
        toast.success("Documentos subidos correctamente")
      }
    } catch (error) {
      console.error(error)
      toast.error("Error al subir documentos")
    } finally {
      setUploadingFiles(false)
      // Reset input
      e.target.value = ""
    }
  }

  const removeDocument = (index: number) => {
    const currentDocs = watch("certificationDocuments") || []
    setValue(
      "certificationDocuments", 
      currentDocs.filter((_, i) => i !== index),
      { shouldValidate: true }
    )
  }

  const handleNext = async () => {
    const currentFields = sections[currentSection].fields as (keyof VendorOnboardingValues)[]
    const isValid = await trigger(currentFields)
    
    if (isValid) {
      setCurrentSection(prev => Math.min(prev + 1, sections.length - 1))
    } else {
      toast.error("Por favor completa los campos requeridos correctamente")
    }
  }

  const handlePrev = () => {
    setCurrentSection(prev => Math.max(prev - 1, 0))
  }

  const onFormSubmit = async (data: VendorOnboardingValues) => {
  console.log("📝 Iniciando envío del formulario...", data);
  setIsSubmitting(true);
  
  try {
    // ✅ Limpiar datos antes de enviar
    const submitData = {
      ...data,
      website: data.website || undefined,
      localSourcingPercent: data.localSourcingPercent || undefined,
      animalTestingPolicy: data.animalTestingPolicy || undefined,
      animalOriginUse: data.animalOriginUse || undefined,
    };

    console.log("📤 Datos a enviar:", submitData);

    const response = await fetch("/api/vendor/onboarding", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(submitData),
    });

    console.log("📨 Respuesta del servidor:", response.status);

    const result = await response.json();
    console.log("📄 Resultado:", result);

    if (!response.ok) {
      throw new Error(result.error || "Error al enviar el formulario");
    }

    // Handle RegenMarks logic
    const marks: { type: RegenMarkType; metrics: Record<string, unknown> }[] = [];
    if (data.environmentalCertifications?.includes("Carbon Neutral")) {
      marks.push({ type: "CARBON_SAVER", metrics: { carbonNeutral: true } });
    }
    if (data.environmentalCertifications?.includes("Energy Star")) {
      marks.push({ type: "CARBON_SAVER", metrics: { sustainabilityReport: true } });
    }

    if (marks.length > 0) {
      try {
        await submitVendorRegenMarks({ marks });
        console.log("✅ RegenMarks enviados correctamente");
      } catch (e) {
        console.warn("⚠️ RegenMarks submission skipped:", e);
      }
    }

    console.log("🎉 Formulario enviado exitosamente");
    toast.success("Solicitud enviada exitosamente");
    
    // ✅ Llama a la función onSubmit prop
    onSubmit(result);
    
  } catch (error) {
    console.error("❌ Error en el envío:", error);
    const message = error instanceof Error ? error.message : "Error al procesar la solicitud";
    toast.error(message);
  } finally {
    setIsSubmitting(false);
  }
}

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && e.target instanceof HTMLInputElement) {
      e.preventDefault()
      if (currentSection < sections.length - 1) {
        handleNext()
      }
    }
  }

  return (
    <div className="w-full space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900">Registro de Vendedor</h2>
        <p className="text-gray-500">Completa tu perfil para comenzar a vender</p>
      </div>

      {/* Progress Steps */}
      <div className="flex justify-between items-center px-2 relative max-w-4xl mx-auto">
        <div className="absolute left-0 top-1/2 w-full h-0.5 bg-gray-200 -z-10" />
        {sections.map((section, idx) => {
          const Icon = section.icon
          const isActive = idx === currentSection
          const isCompleted = idx < currentSection
          
          return (
            <div key={idx} className="flex flex-col items-center bg-white px-2">
              <div 
                className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all ${
                  isActive ? "border-green-600 bg-green-50 text-green-600" :
                  isCompleted ? "border-green-600 bg-green-600 text-white" :
                  "border-gray-300 text-gray-400"
                }`}
              >
                <Icon className="w-5 h-5" />
              </div>
              <span className={`text-[10px] mt-1 font-medium ${isActive ? "text-green-700" : "text-gray-500"}`}>
                {section.title}
              </span>
            </div>
          )
        })}
      </div>

      <form onSubmit={handleSubmit(onFormSubmit)} onKeyDown={handleKeyDown}>
        <Card className="border-t-4 border-t-green-600 shadow-lg">
          
          <CardHeader>
            <CardTitle>{sections[currentSection].title}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 p-6 md:p-8">
            
            {/* SECTION 0: BASIC INFO */}
            {currentSection === 0 && (
              <div className="space-y-4">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="companyName">Nombre de la Empresa *</Label>
                    <Input 
                      id="companyName" 
                      {...register("companyName")} 
                      className={errors.companyName ? "border-red-500" : ""}
                    />
                    {errors.companyName && <p className="text-xs text-red-500">{errors.companyName.message}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="contactName">Representante Legal *</Label>
                    <Input 
                      id="contactName" 
                      {...register("contactName")}
                      className={errors.contactName ? "border-red-500" : ""}
                    />
                    {errors.contactName && <p className="text-xs text-red-500">{errors.contactName.message}</p>}
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="businessType">Tipo de Negocio *</Label>
                    <select
                      id="businessType"
                      {...register("businessType")}
                      className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    >
                      <option value="">Selecciona...</option>
                      {businessTypeOptions.map(opt => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                    {errors.businessType && <p className="text-xs text-red-500">{errors.businessType.message}</p>}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Descripción</Label>
                  <Textarea 
                    id="description" 
                    {...register("description")} 
                    placeholder="Describe tu negocio..."
                    rows={4}
                  />
                </div>
              </div>
            )}

            {/* SECTION 1: CONTACT */}
            {currentSection === 1 && (
              <div className="space-y-4">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Corporativo *</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input 
                        id="email" 
                        type="email" 
                        {...register("email")} 
                        className={`pl-9 ${errors.email ? "border-red-500" : ""}`}
                      />
                    </div>
                    {errors.email && <p className="text-xs text-red-500">{errors.email.message}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Teléfono *</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input 
                        id="phone" 
                        {...register("phone")} 
                        className={`pl-9 ${errors.phone ? "border-red-500" : ""}`}
                      />
                    </div>
                    {errors.phone && <p className="text-xs text-red-500">{errors.phone.message}</p>}
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="website">Sitio Web</Label>
                    <div className="relative">
                      <Globe className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input 
                        id="website" 
                        {...register("website")} 
                        className="pl-9"
                        placeholder="https://"
                      />
                    </div>
                    {errors.website && <p className="text-xs text-red-500">{errors.website.message}</p>}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Dirección Física *</Label>
                  <Textarea 
                    id="address" 
                    {...register("address")} 
                    className={errors.address ? "border-red-500" : ""}
                  />
                  {errors.address && <p className="text-xs text-red-500">{errors.address.message}</p>}
                </div>
              </div>
            )}

            {/* SECTION 2: CATEGORY */}
            {currentSection === 2 && (
              <div className="space-y-4">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="category">Categoría Principal *</Label>
                    <select
                      id="category"
                      {...register("category")}
                      className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
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
                    {errors.category && <p className="text-xs text-red-500">{errors.category.message}</p>}
                  </div>
                </div>
                
                <Alert className="bg-blue-50 text-blue-800 border-blue-200">
                  <Info className="h-4 w-4" />
                  <AlertDescription>
                    Podrás agregar más categorías secundarias una vez aprobado tu perfil.
                  </AlertDescription>
                </Alert>
              </div>
            )}

            {/* SECTION 3: SUSTAINABILITY */}
            {currentSection === 3 && (
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label>Intención de Sostenibilidad</Label>
                  <Textarea 
                    {...register("sustainabilityIntent")} 
                    placeholder="¿Qué motiva tu compromiso sostenible?"
                  />
                </div>

                <div className="space-y-3">
                  <Label>Certificaciones Actuales (Opcional)</Label>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {certificationOptions.map((cert) => (
                      <div key={cert} className="flex items-center space-x-2">
                        <Checkbox 
                          id={cert} 
                          checked={isCheckboxChecked("certifications", cert)}
                          onCheckedChange={(checked) => 
                            handleArrayCheckboxChange("certifications", cert, checked as boolean)
                          }
                        />
                        <Label htmlFor={cert} className="font-normal cursor-pointer">{cert}</Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <Label>Objetivos Futuros</Label>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {sustainabilityGoalOptions.map((goal) => (
                      <div key={goal} className="flex items-center space-x-2">
                        <Checkbox 
                          id={goal} 
                          checked={isCheckboxChecked("sustainabilityGoals", goal)}
                          onCheckedChange={(checked) => 
                            handleArrayCheckboxChange("sustainabilityGoals", goal, checked as boolean)
                          }
                        />
                        <Label htmlFor={goal} className="font-normal cursor-pointer">{goal}</Label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* SECTION 4: SOCIAL & IMPACT */}
            {currentSection === 4 && (
              <div className="space-y-6">
                <div className="space-y-4">
                  <Label className="text-base font-semibold">Certificaciones Ambientales & Evidencia</Label>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    {environmentalCertificationOptions.map((cert) => (
                      <div key={cert} className="flex items-center space-x-2">
                        <Checkbox 
                          id={`env-${cert}`} 
                          checked={isCheckboxChecked("environmentalCertifications", cert)}
                          onCheckedChange={(checked) => 
                            handleArrayCheckboxChange("environmentalCertifications", cert, checked as boolean)
                          }
                        />
                        <Label htmlFor={`env-${cert}`} className="font-normal cursor-pointer">{cert}</Label>
                      </div>
                    ))}
                  </div>

                  <div className="border-2 border-dashed border-gray-200 rounded-lg p-6 text-center hover:bg-gray-50 transition-colors">
                    <Input 
                      type="file" 
                      id="file-upload" 
                      className="hidden" 
                      multiple 
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={handleFileSelect}
                      disabled={uploadingFiles}
                    />
                    <Label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center gap-2">
                      <Upload className="h-8 w-8 text-gray-400" />
                      <span className="text-sm font-medium text-gray-700">
                        {uploadingFiles ? "Subiendo..." : "Sube tus documentos de certificación"}
                      </span>
                      <span className="text-xs text-gray-500">PDF, JPG, PNG (Max 5MB)</span>
                    </Label>
                  </div>

                  {/* File List */}
                  {(watch("certificationDocuments") || []).length > 0 && (
                    <div className="space-y-2">
                      {watch("certificationDocuments").map((doc, idx) => (
                        <div key={idx} className="flex items-center justify-between p-2 bg-gray-50 rounded border text-sm">
                          <div className="flex items-center gap-2">
                            <FileText className="h-4 w-4 text-blue-500" />
                            <span className="truncate max-w-[200px]">{doc.filename}</span>
                          </div>
                          <Button 
                            type="button" 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => removeDocument(idx)}
                          >
                            <X className="h-4 w-4 text-red-500" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                  {errors.certificationDocuments && (
                    <p className="text-xs text-red-500">{errors.certificationDocuments.message}</p>
                  )}
                </div>

                <div className="space-y-4 pt-4 border-t">
                  <Label className="text-base font-semibold">Prácticas Sociales</Label>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label>Prácticas Laborales</Label>
                      <Textarea {...register("laborPractices")} placeholder="Describe tus políticas laborales..." />
                    </div>

                    <div className="space-y-2">
                      <Label>Impacto Comunitario</Label>
                      <Textarea {...register("communityImpact")} placeholder="¿Cómo apoyas a tu comunidad?" />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label>Cumplimiento Laboral</Label>
                      <Textarea {...register("laborCompliance")} placeholder="Cumplimiento de normas laborales..." />
                    </div>
                    <div className="space-y-2">
                      <Label>Porcentaje de Abastecimiento Local</Label>
                      <Input {...register("localSourcingPercent")} placeholder="Ej. 50%" />
                      {errors.localSourcingPercent && <p className="text-xs text-red-500">{errors.localSourcingPercent.message}</p>}
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="fairTrade" 
                      checked={watch("fairTradeCertified")}
                      onCheckedChange={(checked) => setValue("fairTradeCertified", !!checked, { shouldValidate: true })}
                    />
                    <Label htmlFor="fairTrade">Certificación Comercio Justo (Fair Trade)</Label>
                  </div>
                </div>
              </div>
            )}

            {/* SECTION 5: ANIMAL WELFARE */}
            {currentSection === 5 && (
              <div className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="animalTestingPolicy">Política de Pruebas en Animales</Label>
                    <select
                      id="animalTestingPolicy"
                      {...register("animalTestingPolicy")}
                      className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    >
                      <option value="">Selecciona...</option>
                      {AnimalTestingPolicyEnum.options.map(opt => (
                        <option key={opt} value={opt}>
                          {opt === "NO_TESTING" && "Sin pruebas en animales"}
                          {opt === "LIMITED_LEGAL" && "Limitado por ley"}
                          {opt === "NO_POLICY" && "Sin política específica"}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="animalOriginUse">Uso de Productos de Origen Animal</Label>
                    <select
                      id="animalOriginUse"
                      {...register("animalOriginUse")}
                      className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    >
                      <option value="">Selecciona...</option>
                      {AnimalOriginUseEnum.options.map(opt => (
                        <option key={opt} value={opt}>
                          {opt === "NO_ANIMAL_PRODUCTS" && "Sin productos animales (Vegano)"}
                          {opt === "ETHICAL_ANIMAL_PRODUCTS" && "Origen ético certificado"}
                          {opt === "CONVENTIONAL_ANIMAL_PRODUCTS" && "Convencional"}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Políticas de Bienestar Animal</Label>
                  <Textarea 
                    {...register("animalWelfarePolicies")} 
                    placeholder="Describe tus políticas de bienestar animal..."
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Alternativas Éticas</Label>
                  <Textarea 
                    {...register("ethicalAlternatives")} 
                    placeholder="¿Ofreces alternativas a productos animales?"
                    rows={3}
                  />
                </div>
              </div>
            )}

          </CardContent>
        </Card>

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-6">
          <Button
            type="button"
            variant="outline"
            onClick={handlePrev}
            disabled={currentSection === 0 || isSubmitting}
          >
            Anterior
          </Button>

          {currentSection < sections.length - 1 ? (
            <Button type="button" onClick={handleNext}>
              Siguiente
            </Button>
          ) : (
            <Button 
            type="submit" 
            className="bg-green-600 hover:bg-green-700 text-white"
            disabled={isSubmitting || uploadingFiles}
            onClick={() => console.log("🖱️ Botón clickeado - isValid:", isValid, "errors:", errors)}
            >
            {isSubmitting ? "Enviando..." : "Enviar Registro"}
            </Button>
            
          )}
        </div>
      </form>
    </div>
  )
}
