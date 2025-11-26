"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Input } from "@/components/ui/input"
import {
  AlertCircle,
  Search,
  FileText,
  Clock,
  Eye,
  Filter,
} from "lucide-react"
import { formatRegenMarkType } from "@/lib/regenmark"
import Link from "next/link"
import type { RegenMarkType } from "@prisma/client"

interface Evaluation {
  id: string
  type: RegenMarkType
  status: string
  stage: string
  submittedAt: string | null
  createdAt: string
  vendorProfile: {
    companyName: string
    userId: string
  }
  documents: {
    id: string
    name: string
    fileName: string
  }[]
  reviewScore: number | null
  approved: boolean
}

export default function AdminRegenMarksPage() {
  const { status } = useSession()
  const router = useRouter()
  const [evaluations, setEvaluations] = useState<Evaluation[]>([])
  const [filteredEvaluations, setFilteredEvaluations] = useState<Evaluation[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState<string>("all")

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin")
      return
    }

    if (status === "authenticated") {
      fetchEvaluations()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, router])

  useEffect(() => {
    filterEvaluationsList()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm, filterStatus, evaluations])

  const fetchEvaluations = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/admin/regenmarks/evaluations")

      if (!response.ok) {
        throw new Error("Failed to fetch evaluations")
      }

      const data = await response.json()
      setEvaluations(data.evaluations || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido")
    } finally {
      setLoading(false)
    }
  }

  const filterEvaluationsList = () => {
    let filtered = evaluations

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        (ev) =>
          ev.vendorProfile.companyName
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          ev.type.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Filter by status
    if (filterStatus !== "all") {
      filtered = filtered.filter((ev) => ev.status === filterStatus)
    }

    setFilteredEvaluations(filtered)
  }

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      PENDING: { color: "bg-yellow-100 text-yellow-800", label: "Pendiente" },
      SUBMITTED: { color: "bg-blue-100 text-blue-800", label: "Enviado" },
      IN_REVIEW: { color: "bg-purple-100 text-purple-800", label: "En Revisión" },
      AI_PROCESSING: { color: "bg-cyan-100 text-cyan-800", label: "Procesando IA" },
      APPROVED: { color: "bg-green-100 text-green-800", label: "Aprobado" },
      REJECTED: { color: "bg-red-100 text-red-800", label: "Rechazado" },
    }

    const config = statusConfig[status as keyof typeof statusConfig] || {
      color: "bg-gray-100 text-gray-800",
      label: status,
    }

    return <Badge className={config.color}>{config.label}</Badge>
  }

  const getPriorityColor = (daysWaiting: number) => {
    if (daysWaiting > 7) return "border-red-300 bg-red-50"
    if (daysWaiting > 3) return "border-yellow-300 bg-yellow-50"
    return ""
  }

  const calculateDaysWaiting = (submittedAt: string | null) => {
    if (!submittedAt) return 0
    const diff = Date.now() - new Date(submittedAt).getTime()
    return Math.floor(diff / (1000 * 60 * 60 * 24))
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando evaluaciones...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-gray-50 min-h-screen">
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <nav className="flex mb-2" aria-label="Breadcrumb">
            <ol className="inline-flex items-center space-x-1 md:space-x-2">
              <li className="inline-flex items-center">
                <Link href="/dashboard" className="text-sm text-gray-600 hover:text-green-600">Dashboard</Link>
              </li>
              <li className="inline-flex items-center">
                <span className="text-gray-400 mx-2">/</span>
                <Link href="/dashboard/admin" className="text-sm text-gray-600 hover:text-green-600">Admin</Link>
              </li>
              <li className="inline-flex items-center">
                <span className="text-gray-400 mx-2">/</span>
                <span className="text-sm font-medium text-gray-900">RegenMarks</span>
              </li>
            </ol>
          </nav>
          <h1 className="text-3xl font-bold text-gray-900">Evaluaciones de RegenMarks</h1>
          <p className="text-gray-600 mt-1">Revisa y aprueba solicitudes de certificación</p>
        </div>
        <div className="p-6">
          <Alert className="border-red-200 bg-red-50">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800">Error: {error}</AlertDescription>
          </Alert>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">

      {/* Stats Cards */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-blue-600">
                {evaluations.filter((e) => e.status === "SUBMITTED").length}
              </p>
              <p className="text-sm text-gray-600 mt-1">Nuevas</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-purple-600">
                {evaluations.filter((e) => e.status === "IN_REVIEW").length}
              </p>
              <p className="text-sm text-gray-600 mt-1">En Revisión</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-green-600">
                {evaluations.filter((e) => e.status === "APPROVED").length}
              </p>
              <p className="text-sm text-gray-600 mt-1">Aprobadas</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-red-600">
                {evaluations.filter((e) => e.status === "REJECTED").length}
              </p>
              <p className="text-sm text-gray-600 mt-1">Rechazadas</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Buscar por empresa o tipo de RegenMark..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Status Filter */}
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-500" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="all">Todos los estados</option>
                <option value="SUBMITTED">Enviados</option>
                <option value="IN_REVIEW">En Revisión</option>
                <option value="AI_PROCESSING">Procesando IA</option>
                <option value="APPROVED">Aprobados</option>
                <option value="REJECTED">Rechazados</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Evaluations List */}
      <Card>
        <CardHeader>
          <CardTitle>
            Evaluaciones ({filteredEvaluations.length})
          </CardTitle>
          <CardDescription>
            Solicitudes de certificación de sostenibilidad
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filteredEvaluations.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <FileText className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>No hay evaluaciones que coincidan con los filtros</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredEvaluations.map((evaluation) => {
                const daysWaiting = calculateDaysWaiting(evaluation.submittedAt)
                const priorityClass = getPriorityColor(daysWaiting)

                return (
                  <Card
                    key={evaluation.id}
                    className={`border-2 hover:shadow-md transition-shadow ${priorityClass}`}
                  >
                    <CardContent className="pt-4">
                      <div className="flex justify-between items-start">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-semibold text-lg truncate">
                              {evaluation.vendorProfile.companyName}
                            </h3>
                            {daysWaiting > 7 && (
                              <Badge className="bg-red-100 text-red-800">
                                Urgente
                              </Badge>
                            )}
                          </div>

                          <div className="flex flex-wrap gap-2 text-sm text-gray-600 mb-3">
                            <span className="flex items-center gap-1">
                              <FileText className="w-4 h-4" />
                              {formatRegenMarkType(evaluation.type)}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              {evaluation.submittedAt
                                ? `${daysWaiting} días esperando`
                                : "Recién creado"}
                            </span>
                            <span>
                              {evaluation.documents.length} documentos
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            {getStatusBadge(evaluation.status)}
                            {evaluation.reviewScore !== null && (
                              <Badge variant="outline">
                                Score: {evaluation.reviewScore}/100
                              </Badge>
                            )}
                          </div>
                        </div>

                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            onClick={() =>
                              router.push(
                                `/dashboard/admin/regenmarks/${evaluation.id}`
                              )
                            }
                            className="bg-green-600 hover:bg-green-700"
                          >
                            <Eye className="w-4 h-4 mr-2" />
                            Revisar
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
