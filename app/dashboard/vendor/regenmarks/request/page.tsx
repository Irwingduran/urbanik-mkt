"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { VendorDashboardLayout, VendorDashboardHeader } from "@/components/shared/layout/VendorDashboardLayout"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import {
  ArrowLeft,
  Check,
  AlertCircle,
  FileText,
  Clock,
  DollarSign,
  Upload,
  Info,
} from "lucide-react"
import {
  REGENMARK_TYPES,
  DOCUMENT_REQUIREMENTS,
  getEvaluationCostRange,
  getEvaluationTimeRange,
  formatRegenMarkType,
} from "@/lib/regenmark"
import type { RegenMarkType } from "@prisma/client"
import DocumentUploadForm from "@/components/vendor/regenmarks/DocumentUploadForm"

export default function RequestRegenMarkPage() {
  const router = useRouter()
  const [selectedType, setSelectedType] = useState<RegenMarkType | null>(null)
  const [step, setStep] = useState<"select" | "upload" | "confirm">("select")
  const [uploadedDocuments, setUploadedDocuments] = useState<File[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSelectType = (type: RegenMarkType) => {
    setSelectedType(type)
    setStep("upload")
  }

  const handleDocumentsUploaded = (files: File[]) => {
    setUploadedDocuments(files)
  }

  const handleSubmitRequest = async () => {
    if (!selectedType) return

    setIsSubmitting(true)
    setError(null)

    try {
      // Create FormData for file upload
      const formData = new FormData()
      formData.append("type", selectedType)

      uploadedDocuments.forEach((file, index) => {
        formData.append(`document_${index}`, file)
      })

      const response = await fetch("/api/vendor/regenmarks/request", {
        method: "POST",
        body: formData,
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to submit request")
      }

      // Success - redirect to dashboard
      router.push("/dashboard/vendor/regenmarks")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido")
      setIsSubmitting(false)
    }
  }

  const handleBack = () => {
    if (step === "upload") {
      setStep("select")
      setSelectedType(null)
      setUploadedDocuments([])
    } else {
      router.back()
    }
  }

  return (
    <VendorDashboardLayout>
      <VendorDashboardHeader
        title="Solicitar RegenMark"
        subtitle={
          step === "select" ? "Selecciona el tipo de certificación" :
          step === "upload" ? "Carga los documentos requeridos" :
          "Confirma tu solicitud"
        }
        breadcrumbs={[
          { label: 'Dashboard', href: '/dashboard/vendor' },
          { label: 'RegenMarks', href: '/dashboard/vendor/regenmarks' },
          { label: 'Solicitar' }
        ]}
        action={
          <Button variant="outline" size="sm" onClick={handleBack}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver
          </Button>
        }
      />
      <div className="p-6 max-w-6xl mx-auto space-y-6">

      {/* Error Alert */}
      {error && (
        <Alert className="border-red-200 bg-red-50">
          <AlertCircle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">{error}</AlertDescription>
        </Alert>
      )}

      {/* Step 1: Select RegenMark Type */}
      {step === "select" && (
        <div className="space-y-4">
          <Alert className="bg-blue-50 border-blue-200">
            <Info className="h-4 w-4 text-blue-600" />
            <AlertDescription className="text-blue-800">
              <strong>Nota:</strong> Por ahora, las solicitudes de evaluación son
              gratuitas mientras implementamos el sistema de pagos. Podrás
              solicitar cualquier RegenMark sin costo.
            </AlertDescription>
          </Alert>

          <div className="grid md:grid-cols-2 gap-4">
            {(Object.keys(REGENMARK_TYPES) as RegenMarkType[]).map((type) => {
              const config = REGENMARK_TYPES[type]
              const costRange = getEvaluationCostRange(type)
              const timeRange = getEvaluationTimeRange(type)
              const requirements = DOCUMENT_REQUIREMENTS[type]

              return (
                <Card
                  key={type}
                  className="cursor-pointer hover:border-green-500 hover:shadow-md transition-all"
                  onClick={() => handleSelectType(type)}
                >
                  <CardHeader>
                    <CardTitle className="text-xl">
                      {formatRegenMarkType(type)}
                    </CardTitle>
                    <CardDescription>{config.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Focus Areas */}
                    <div>
                      <p className="text-sm font-medium mb-2">Áreas de enfoque:</p>
                      <div className="flex flex-wrap gap-1">
                        {config.focusAreas.slice(0, 3).map((area, idx) => (
                          <Badge
                            key={idx}
                            variant="outline"
                            className="text-xs"
                          >
                            {area}
                          </Badge>
                        ))}
                        {config.focusAreas.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{config.focusAreas.length - 3} más
                          </Badge>
                        )}
                      </div>
                    </div>

                    {/* Requirements Preview */}
                    <div>
                      <p className="text-sm font-medium mb-2">
                        Documentos requeridos:
                      </p>
                      <ul className="text-sm text-gray-600 space-y-1">
                        {requirements.required.slice(0, 2).map((req, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <Check className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                            <span>{req}</span>
                          </li>
                        ))}
                        {requirements.required.length > 2 && (
                          <li className="text-xs text-gray-500 ml-6">
                            +{requirements.required.length - 2} documentos más
                          </li>
                        )}
                      </ul>
                    </div>

                    {/* Meta Information */}
                    <div className="grid grid-cols-2 gap-2 pt-3 border-t text-xs text-gray-600">
                      <div className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{timeRange.formatted}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <DollarSign className="w-3.5 h-3.5" />
                        <span className="line-through">
                          {costRange.min.toLocaleString("es-MX")}
                        </span>
                        <Badge className="ml-1 bg-green-100 text-green-800">
                          Gratis
                        </Badge>
                      </div>
                    </div>

                    <Button className="w-full bg-green-600 hover:bg-green-700">
                      Seleccionar
                    </Button>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      )}

      {/* Step 2: Upload Documents */}
      {step === "upload" && selectedType && (
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">
                {formatRegenMarkType(selectedType)}
              </CardTitle>
              <CardDescription>
                {REGENMARK_TYPES[selectedType].description}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <DocumentUploadForm
                regenMarkType={selectedType}
                onDocumentsChange={handleDocumentsUploaded}
              />
            </CardContent>
          </Card>

          <div className="flex justify-between">
            <Button variant="outline" onClick={() => setStep("select")}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Cambiar RegenMark
            </Button>
            <Button
              onClick={handleSubmitRequest}
              disabled={uploadedDocuments.length === 0 || isSubmitting}
              className="bg-green-600 hover:bg-green-700"
            >
              {isSubmitting ? (
                <>
                  <Clock className="w-4 h-4 mr-2 animate-spin" />
                  Enviando...
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4 mr-2" />
                  Enviar Solicitud
                </>
              )}
            </Button>
          </div>
        </div>
      )}
      </div>
    </VendorDashboardLayout>
  )
}
