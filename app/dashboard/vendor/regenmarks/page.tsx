"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { VendorDashboardLayout, VendorDashboardHeader } from "@/components/shared/layout/VendorDashboardLayout"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { apiFetch } from "@/lib/api-client"
import {
  Award,
  Plus,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Sparkles,
  TrendingUp,
  Calendar,
  FileText,
} from "lucide-react"
import {
  formatNFTLevel,
  formatRegenMarkType,
  formatScore,
  getExpirationStatus,
  daysUntilExpiration,
} from "@/lib/regenmark"
import type { NFTLevel, RegenMarkType, RegenMarkStatus } from "@prisma/client"

interface RegenMark {
  id: string
  type: RegenMarkType
  score: number
  status: RegenMarkStatus
  issuedAt: string | null
  expiresAt: string | null
  createdAt: string
}

interface Evaluation {
  id: string
  type: RegenMarkType
  status: string
  stage: string
  submittedAt: string | null
  createdAt: string
}

interface VendorData {
  regenScore: number
  nftLevel: NFTLevel
  commission: number
  activeRegenMarks: RegenMark[]
  pendingEvaluations: Evaluation[]
}

export default function VendorRegenMarksPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [vendorData, setVendorData] = useState<VendorData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [requestId, setRequestId] = useState<string | null>(null)

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin")
      return
    }

    if (status === "authenticated") {
      fetchVendorData()
    }
  }, [status, router])

  const fetchVendorData = async () => {
    try {
      setLoading(true)
      const response = await apiFetch("/api/vendor/regenmarks")
      const rid = response.headers.get("x-request-id") || response.headers.get("x-client-request-id")
      if (rid) setRequestId(rid)
      const data = await response.json()
      setVendorData(data)
    } catch (err) {
      const e = err as any
      console.error("Error fetching vendor data:", e)
      // Try to parse body if available
      if (typeof e?.body === "string" && e.body.trim().startsWith("{")) {
        try {
          const parsed = JSON.parse(e.body)
          if (e.status === 404 && parsed.error === "Vendor profile not found") {
            setError("No tienes un perfil de vendedor. Por favor completa el proceso de onboarding primero.")
          } else if (e.status === 401) {
            setError("No estás autenticado. Por favor inicia sesión.")
          } else {
            const detailedError = parsed.details ? `${parsed.error}: ${parsed.details}` : parsed.error
            setError(detailedError || "Error al cargar los datos de RegenMarks")
          }
        } catch {
          setError(e?.message || "Error desconocido al conectar con el servidor")
        }
      } else {
        setError(e?.message || "Error desconocido al conectar con el servidor")
      }
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <VendorDashboardLayout>
        <VendorDashboardHeader
          title="Mis RegenMarks"
          subtitle="Certificaciones de sostenibilidad"
          breadcrumbs={[
            { label: 'Dashboard', href: '/dashboard/vendor' },
            { label: 'RegenMarks' }
          ]}
        />
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Cargando RegenMarks...</p>
          </div>
        </div>
      </VendorDashboardLayout>
    )
  }

  if (error) {
    const isNoProfile = error.includes("perfil de vendedor")
    return (
      <VendorDashboardLayout>
        <VendorDashboardHeader
          title="Mis RegenMarks"
          subtitle="Certificaciones de sostenibilidad"
          breadcrumbs={[
            { label: 'Dashboard', href: '/dashboard/vendor' },
            { label: 'RegenMarks' }
          ]}
        />
        <div className="p-6 space-y-6">
          <Alert className={isNoProfile ? "border-yellow-200 bg-yellow-50" : "border-red-200 bg-red-50"}>
            <AlertCircle className={`h-4 w-4 ${isNoProfile ? "text-yellow-600" : "text-red-600"}`} />
            <AlertDescription className={isNoProfile ? "text-yellow-800" : "text-red-800"}>
              {error}
            </AlertDescription>
          </Alert>
          {isNoProfile && (
            <Card>
              <CardContent className="pt-6">
                <h3 className="font-semibold text-lg mb-2">¿Cómo acceder a RegenMarks?</h3>
                <p className="text-gray-600 mb-4">
                  Para solicitar certificaciones de sostenibilidad, primero necesitas completar el proceso de onboarding como vendedor.
                </p>
                <Button
                  onClick={() => router.push("/onboarding")}
                  className="bg-green-600 hover:bg-green-700"
                >
                  Iniciar Onboarding
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </VendorDashboardLayout>
    )
  }

  if (!vendorData) {
    return (
      <VendorDashboardLayout>
        <VendorDashboardHeader
          title="Mis RegenMarks"
          subtitle="Certificaciones de sostenibilidad"
          breadcrumbs={[
            { label: 'Dashboard', href: '/dashboard/vendor' },
            { label: 'RegenMarks' }
          ]}
        />
        <div className="p-6">
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              No se pudo cargar la información de RegenMarks
            </AlertDescription>
          </Alert>
        </div>
      </VendorDashboardLayout>
    )
  }

  const { regenScore, nftLevel, commission, activeRegenMarks, pendingEvaluations } = vendorData

  return (
    <VendorDashboardLayout>
      <VendorDashboardHeader
        title="Mis RegenMarks"
        subtitle="Gestiona tus certificaciones de sostenibilidad"
        breadcrumbs={[
          { label: 'Dashboard', href: '/dashboard/vendor' },
          { label: 'RegenMarks' }
        ]}
        action={
          <Button
            onClick={() => router.push("/dashboard/vendor/regenmarks/request")}
            className="bg-green-600 hover:bg-green-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            Solicitar RegenMark
          </Button>
        }
      />
      <div className="p-6 space-y-6">
      {process.env.NODE_ENV !== "production" && requestId && (
        <div className="text-xs text-gray-500">Request ID: {requestId}</div>
      )}

      {/* Current Status Card */}
      <Card className="border-green-200 bg-gradient-to-br from-green-50 to-blue-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-green-600" />
            Tu Estado Actual
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <p className="text-sm text-gray-600 mb-1">Nivel NFT</p>
              <p className="text-2xl font-bold text-green-700">
                {formatNFTLevel(nftLevel)}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">REGEN Score</p>
              <p className="text-2xl font-bold text-blue-700">
                {formatScore(regenScore)}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Comisión</p>
              <p className="text-2xl font-bold text-purple-700">{commission}%</p>
            </div>
          </div>

          {activeRegenMarks.length === 0 && (
            <Alert className="mt-4 bg-blue-50 border-blue-200">
              <AlertCircle className="h-4 w-4 text-blue-600" />
              <AlertDescription className="text-blue-800">
                <strong>¡Comienza tu viaje sostenible!</strong>
                <p className="mt-1">
                  Solicita tu primera evaluación de RegenMark para certificar tu
                  impacto ambiental y obtener beneficios como comisión reducida y
                  mayor visibilidad.
                </p>
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Active RegenMarks */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="w-5 h-5" />
            RegenMarks Activos ({activeRegenMarks.length})
          </CardTitle>
          <CardDescription>
            Tus certificaciones aprobadas y activas
          </CardDescription>
        </CardHeader>
        <CardContent>
          {activeRegenMarks.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Award className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>No tienes RegenMarks activos</p>
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => router.push("/dashboard/vendor/regenmarks/request")}
              >
                Solicitar tu primer RegenMark
              </Button>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-4">
              {activeRegenMarks.map((mark) => {
                const expirationDays = daysUntilExpiration(
                  mark.expiresAt ? new Date(mark.expiresAt) : null
                )
                const expirationStatus = getExpirationStatus(expirationDays)

                return (
                  <Card key={mark.id} className="border-2">
                    <CardContent className="pt-6">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="font-semibold text-lg">
                            {formatRegenMarkType(mark.type)}
                          </h3>
                          <p className="text-sm text-gray-600">
                            Score: {formatScore(mark.score)}
                          </p>
                        </div>
                        <Badge
                          className={`${
                            expirationStatus.color === "green"
                              ? "bg-green-100 text-green-800"
                              : expirationStatus.color === "yellow"
                                ? "bg-yellow-100 text-yellow-800"
                                : expirationStatus.color === "orange"
                                  ? "bg-orange-100 text-orange-800"
                                  : "bg-red-100 text-red-800"
                          }`}
                        >
                          {expirationStatus.label}
                        </Badge>
                      </div>

                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2 text-gray-600">
                          <Calendar className="w-4 h-4" />
                          <span>
                            Otorgado:{" "}
                            {mark.issuedAt
                              ? new Date(mark.issuedAt).toLocaleDateString("es-MX")
                              : "N/A"}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                          <Clock className="w-4 h-4" />
                          <span>
                            Expira:{" "}
                            {mark.expiresAt
                              ? new Date(mark.expiresAt).toLocaleDateString("es-MX")
                              : "N/A"}
                          </span>
                        </div>
                      </div>

                      {expirationStatus.urgent && (
                        <Button
                          variant="outline"
                          className="w-full mt-4"
                          size="sm"
                        >
                          <TrendingUp className="w-4 h-4 mr-2" />
                          Renovar Ahora
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Pending Evaluations */}
      {pendingEvaluations.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Evaluaciones en Proceso ({pendingEvaluations.length})
            </CardTitle>
            <CardDescription>
              Solicitudes pendientes de aprobación
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {pendingEvaluations.map((evaluation) => (
                <Card key={evaluation.id} className="border">
                  <CardContent className="pt-4">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="font-semibold">
                          {formatRegenMarkType(evaluation.type)}
                        </h3>
                        <p className="text-sm text-gray-600 mt-1">
                          Solicitado:{" "}
                          {evaluation.submittedAt
                            ? new Date(evaluation.submittedAt).toLocaleDateString(
                                "es-MX"
                              )
                            : new Date(evaluation.createdAt).toLocaleDateString(
                                "es-MX"
                              )}
                        </p>
                      </div>
                      <div className="text-right">
                        <Badge
                          className={
                            evaluation.status === "APPROVED"
                              ? "bg-green-100 text-green-800"
                              : evaluation.status === "REJECTED"
                                ? "bg-red-100 text-red-800"
                                : evaluation.status === "IN_REVIEW"
                                  ? "bg-blue-100 text-blue-800"
                                  : "bg-yellow-100 text-yellow-800"
                          }
                        >
                          {evaluation.status === "PENDING" && "Pendiente"}
                          {evaluation.status === "SUBMITTED" && "Enviado"}
                          {evaluation.status === "IN_REVIEW" && "En Revisión"}
                          {evaluation.status === "APPROVED" && "Aprobado"}
                          {evaluation.status === "REJECTED" && "Rechazado"}
                        </Badge>
                        <p className="text-xs text-gray-500 mt-1">
                          {evaluation.stage === "PAYMENT" && "Esperando pago"}
                          {evaluation.stage === "SUBMITTED" && "Documentos enviados"}
                          {evaluation.stage === "AI_ANALYSIS" && "Análisis IA"}
                          {evaluation.stage === "MANUAL_REVIEW" &&
                            "Revisión manual"}
                          {evaluation.stage === "FINAL_REVIEW" &&
                            "Revisión final"}
                          {evaluation.stage === "COMPLETED" && "Completado"}
                        </p>
                      </div>
                    </div>

                    <div className="mt-4 flex gap-2">
                      <Button variant="outline" size="sm" className="flex-1">
                        <FileText className="w-4 h-4 mr-2" />
                        Ver Detalles
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Info Card */}
      <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
        <CardContent className="pt-6">
          <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-green-600" />
            ¿Qué son los RegenMarks?
          </h3>
          <div className="space-y-2 text-sm text-gray-700">
            <p>
              Los RegenMarks son certificaciones que validan tu compromiso con la
              sostenibilidad en diferentes áreas:
            </p>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li>🌍 <strong>Carbon Saver:</strong> Reducción de emisiones y energía limpia</li>
              <li>💧 <strong>Water Guardian:</strong> Conservación y gestión del agua</li>
              <li>♻️ <strong>Circular Champion:</strong> Economía circular y residuos</li>
              <li>👥 <strong>Human First:</strong> Impacto social y condiciones laborales</li>
              <li>🐾 <strong>Humane Hero:</strong> Prácticas cruelty-free</li>
            </ul>
            <p className="mt-3">
              <strong>Beneficios:</strong> Comisión reducida, mayor visibilidad, badge
              verificado, y más.
            </p>
          </div>
        </CardContent>
      </Card>
      </div>
    </VendorDashboardLayout>
  )
}
