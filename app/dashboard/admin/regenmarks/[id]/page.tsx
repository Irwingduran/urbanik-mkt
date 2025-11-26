"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import {
  AlertCircle,
  FileText,
  Download,
  CheckCircle,
  XCircle,
  Building,
  Calendar,
  Save,
} from "lucide-react"
import { formatRegenMarkType, REGENMARK_TYPES } from "@/lib/regenmark"
import type { RegenMarkType } from "@prisma/client"

interface Document {
  id: string
  name: string
  fileName: string
  url: string
  fileSize: number
  mimeType: string
  uploadedAt: string
}

interface EvaluationDetail {
  id: string
  type: RegenMarkType
  status: string
  stage: string
  submittedAt: string | null
  createdAt: string
  reviewScore: number | null
  reviewerNotes: string | null
  feedback: string | null
  approved: boolean
  vendorProfile: {
    id: string
    companyName: string
    description: string | null
    website: string | null
    certifications: string[]
  }
  documents: Document[]
}

export default function AdminEvaluationDetailPage() {
  const params = useParams()
  const router = useRouter()
  const evaluationId = params.id as string

  const [evaluation, setEvaluation] = useState<EvaluationDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Review form state
  const [reviewScore, setReviewScore] = useState<number>(0)
  const [reviewerNotes, setReviewerNotes] = useState("")
  const [feedback, setFeedback] = useState("")

  useEffect(() => {
    fetchEvaluationDetail()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [evaluationId])

  const fetchEvaluationDetail = async () => {
    try {
      setLoading(true)
      const response = await fetch(
        `/api/admin/regenmarks/evaluations/${evaluationId}`
      )

      if (!response.ok) {
        throw new Error("Failed to fetch evaluation")
      }

      const data = await response.json()
      setEvaluation(data.evaluation)

      // Pre-fill form if already reviewed
      if (data.evaluation.reviewScore !== null) {
        setReviewScore(data.evaluation.reviewScore)
      }
      if (data.evaluation.reviewerNotes) {
        setReviewerNotes(data.evaluation.reviewerNotes)
      }
      if (data.evaluation.feedback) {
        setFeedback(data.evaluation.feedback)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido")
    } finally {
      setLoading(false)
    }
  }

  const handleApprove = async () => {
    if (reviewScore < 60) {
      alert("El score mínimo para aprobar es 60/100")
      return
    }

    if (!confirm("¿Estás seguro de aprobar esta evaluación?")) {
      return
    }

    await submitDecision(true)
  }

  const handleReject = async () => {
    if (!feedback.trim()) {
      alert("Por favor proporciona feedback sobre el rechazo")
      return
    }

    if (!confirm("¿Estás seguro de rechazar esta evaluación?")) {
      return
    }

    await submitDecision(false)
  }

  const submitDecision = async (approved: boolean) => {
    setIsSubmitting(true)

    try {
      const response = await fetch("/api/admin/regenmarks/evaluate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          evaluationId,
          approved,
          reviewScore,
          reviewerNotes,
          feedback,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to submit decision")
      }

      alert(
        approved
          ? "Evaluación aprobada exitosamente"
          : "Evaluación rechazada"
      )
      router.push("/dashboard/admin/regenmarks")
    } catch (err) {
      alert(err instanceof Error ? err.message : "Error al enviar decisión")
    } finally {
      setIsSubmitting(false)
    }
  }

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i]
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando evaluación...</p>
        </div>
      </div>
    )
  }

  if (error || !evaluation) {
    return (
      <>
        <div className="p-6">
          <Alert className="border-red-200 bg-red-50">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800">
              {error || "Evaluación no encontrada"}
            </AlertDescription>
          </Alert>
        </div>
      </>
    )
  }

  const config = REGENMARK_TYPES[evaluation.type]

  return (
    <>

      {/* Vendor Info */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building className="w-5 h-5" />
            Información del Vendedor
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <h3 className="font-semibold text-lg">
              {evaluation.vendorProfile.companyName}
            </h3>
            {evaluation.vendorProfile.description && (
              <p className="text-sm text-gray-600 mt-1">
                {evaluation.vendorProfile.description}
              </p>
            )}
          </div>

          {evaluation.vendorProfile.website && (
            <div>
              <Label className="text-xs">Sitio Web</Label>
              <a
                href={evaluation.vendorProfile.website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-blue-600 hover:underline block"
              >
                {evaluation.vendorProfile.website}
              </a>
            </div>
          )}

          {evaluation.vendorProfile.certifications.length > 0 && (
            <div>
              <Label className="text-xs">Certificaciones Existentes</Label>
              <div className="flex flex-wrap gap-1 mt-1">
                {evaluation.vendorProfile.certifications.map((cert, idx) => (
                  <Badge key={idx} variant="outline">
                    {cert}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* RegenMark Info */}
      <Card>
        <CardHeader>
          <CardTitle>
            {formatRegenMarkType(evaluation.type)}
          </CardTitle>
          <CardDescription>{config.description}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label className="text-xs">Áreas de Enfoque</Label>
              <div className="flex flex-wrap gap-1 mt-2">
                {config.focusAreas.map((area, idx) => (
                  <Badge key={idx} variant="outline" className="text-xs">
                    {area}
                  </Badge>
                ))}
              </div>
            </div>
            <div>
              <Label className="text-xs">Estado</Label>
              <div className="flex items-center gap-2 mt-2">
                <Badge
                  className={
                    evaluation.status === "APPROVED"
                      ? "bg-green-100 text-green-800"
                      : evaluation.status === "REJECTED"
                        ? "bg-red-100 text-red-800"
                        : "bg-blue-100 text-blue-800"
                  }
                >
                  {evaluation.status}
                </Badge>
                <span className="text-sm text-gray-600 flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  {evaluation.submittedAt
                    ? new Date(evaluation.submittedAt).toLocaleDateString("es-MX")
                    : "N/A"}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Documents */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Documentos ({evaluation.documents.length})
          </CardTitle>
          <CardDescription>
            Documentación proporcionada por el vendedor
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {evaluation.documents.map((doc) => (
              <Card key={doc.id} className="border">
                <CardContent className="pt-4">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <FileText className="w-5 h-5 text-blue-600 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">
                          {doc.fileName}
                        </p>
                        <p className="text-xs text-gray-500">
                          {formatFileSize(doc.fileSize)} •{" "}
                          {new Date(doc.uploadedAt).toLocaleDateString("es-MX")}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => window.open(doc.url, "_blank")}
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Ver
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Review Form */}
      {evaluation.status !== "APPROVED" && evaluation.status !== "REJECTED" && (
        <Card className="border-2 border-green-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Save className="w-5 h-5" />
              Evaluación
            </CardTitle>
            <CardDescription>
              Asigna un score y proporciona feedback
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Score */}
            <div>
              <Label htmlFor="score">
                Score (0-100) *
                <span className="text-xs text-gray-500 ml-2">
                  Mínimo 60 para aprobar
                </span>
              </Label>
              <Input
                id="score"
                type="number"
                min="0"
                max="100"
                value={reviewScore}
                onChange={(e) =>
                  setReviewScore(Math.min(100, Math.max(0, parseInt(e.target.value) || 0)))
                }
                className="mt-1"
              />
              <div className="mt-2">
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all ${
                      reviewScore >= 80
                        ? "bg-green-600"
                        : reviewScore >= 60
                          ? "bg-blue-600"
                          : reviewScore >= 40
                            ? "bg-yellow-600"
                            : "bg-red-600"
                    }`}
                    style={{ width: `${reviewScore}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Internal Notes */}
            <div>
              <Label htmlFor="notes">
                Notas Internas (privadas)
              </Label>
              <Textarea
                id="notes"
                value={reviewerNotes}
                onChange={(e) => setReviewerNotes(e.target.value)}
                placeholder="Notas para otros evaluadores..."
                rows={3}
                className="mt-1"
              />
            </div>

            {/* Feedback */}
            <div>
              <Label htmlFor="feedback">
                Feedback para el Vendedor *
              </Label>
              <Textarea
                id="feedback"
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder="Proporciona feedback constructivo..."
                rows={4}
                className="mt-1"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4 border-t">
              <Button
                onClick={handleApprove}
                disabled={isSubmitting || reviewScore < 60}
                className="flex-1 bg-green-600 hover:bg-green-700"
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                Aprobar
              </Button>
              <Button
                onClick={handleReject}
                disabled={isSubmitting || !feedback.trim()}
                variant="destructive"
                className="flex-1"
              >
                <XCircle className="w-4 h-4 mr-2" />
                Rechazar
              </Button>
            </div>

            {reviewScore < 60 && reviewScore > 0 && (
              <Alert className="border-yellow-200 bg-yellow-50">
                <AlertCircle className="h-4 w-4 text-yellow-600" />
                <AlertDescription className="text-yellow-800">
                  Score insuficiente para aprobar. El score mínimo es 60/100.
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
      )}

      {/* Already Reviewed */}
      {(evaluation.status === "APPROVED" || evaluation.status === "REJECTED") && (
        <Card className="border-2 border-blue-200 bg-blue-50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              {evaluation.approved ? (
                <CheckCircle className="w-6 h-6 text-green-600" />
              ) : (
                <XCircle className="w-6 h-6 text-red-600" />
              )}
              <div>
                <p className="font-semibold">
                  Esta evaluación ya fue{" "}
                  {evaluation.approved ? "aprobada" : "rechazada"}
                </p>
                {evaluation.reviewScore !== null && (
                  <p className="text-sm text-gray-600">
                    Score asignado: {evaluation.reviewScore}/100
                  </p>
                )}
                {evaluation.feedback && (
                  <p className="text-sm text-gray-600 mt-2">
                    Feedback: {evaluation.feedback}
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </>
  )
}
