"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Award, CheckCircle, Clock, XCircle, AlertTriangle, Plus, FileText, Calendar, RefreshCw } from "lucide-react"

interface Certification {
  name: string
  status: "verified" | "pending" | "expired" | "rejected"
  expiryDate?: string
  submittedDate?: string
}

interface CertificationsPanelProps {
  certifications: Certification[]
}

export default function CertificationsPanel({ certifications }: CertificationsPanelProps) {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "verified":
        return <CheckCircle className="w-4 h-4 text-green-600" />
      case "pending":
        return <Clock className="w-4 h-4 text-yellow-600" />
      case "expired":
        return <XCircle className="w-4 h-4 text-red-600" />
      case "rejected":
        return <XCircle className="w-4 h-4 text-red-600" />
      default:
        return <Clock className="w-4 h-4 text-gray-600" />
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "verified":
        return <Badge className="bg-green-100 text-green-800">Verificada</Badge>
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800">Pendiente</Badge>
      case "expired":
        return <Badge className="bg-red-100 text-red-800">Expirada</Badge>
      case "rejected":
        return <Badge className="bg-red-100 text-red-800">Rechazada</Badge>
      default:
        return <Badge className="bg-gray-100 text-gray-800">Desconocido</Badge>
    }
  }

  const getDaysUntilExpiry = (expiryDate: string) => {
    const today = new Date()
    const expiry = new Date(expiryDate)
    const diffTime = expiry.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  const verifiedCount = certifications.filter((cert) => cert.status === "verified").length
  const totalCount = certifications.length
  const completionRate = (verifiedCount / totalCount) * 100

  return (
    <div className="space-y-6">
      {/* Overview Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Award className="w-5 h-5 text-blue-600" />
              <span>Resumen de Certificaciones</span>
            </div>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Solicitar Nueva
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{verifiedCount}</div>
              <div className="text-sm text-green-700">Verificadas</div>
            </div>
            <div className="text-center p-4 bg-yellow-50 rounded-lg">
              <div className="text-2xl font-bold text-yellow-600">
                {certifications.filter((cert) => cert.status === "pending").length}
              </div>
              <div className="text-sm text-yellow-700">Pendientes</div>
            </div>
            <div className="text-center p-4 bg-red-50 rounded-lg">
              <div className="text-2xl font-bold text-red-600">
                {certifications.filter((cert) => cert.status === "expired").length}
              </div>
              <div className="text-sm text-red-700">Expiradas</div>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Progreso de Certificación</span>
              <span>{Math.round(completionRate)}%</span>
            </div>
            <Progress value={completionRate} className="h-2" />
          </div>
        </CardContent>
      </Card>

      {/* Certifications List */}
      <Card>
        <CardHeader>
          <CardTitle>Mis Certificaciones</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {certifications.map((cert, index) => {
              const daysUntilExpiry = cert.expiryDate ? getDaysUntilExpiry(cert.expiryDate) : null
              const isExpiringSoon = daysUntilExpiry !== null && daysUntilExpiry <= 30 && daysUntilExpiry > 0

              return (
                <div key={index} className="p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      {getStatusIcon(cert.status)}
                      <h3 className="font-semibold text-gray-900">{cert.name}</h3>
                    </div>
                    {getStatusBadge(cert.status)}
                  </div>

                  <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-600">
                    {cert.expiryDate && (
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-4 h-4" />
                        <span>
                          Vence: {new Date(cert.expiryDate).toLocaleDateString()}
                          {isExpiringSoon && (
                            <span className="ml-2 text-yellow-600 font-medium">({daysUntilExpiry} días)</span>
                          )}
                        </span>
                      </div>
                    )}

                    {cert.submittedDate && (
                      <div className="flex items-center space-x-2">
                        <FileText className="w-4 h-4" />
                        <span>Enviada: {new Date(cert.submittedDate).toLocaleDateString()}</span>
                      </div>
                    )}
                  </div>

                  {isExpiringSoon && (
                    <div className="mt-3 p-2 bg-yellow-50 border border-yellow-200 rounded flex items-center space-x-2">
                      <AlertTriangle className="w-4 h-4 text-yellow-600" />
                      <span className="text-sm text-yellow-800">Esta certificación vence pronto</span>
                    </div>
                  )}

                  <div className="mt-3 flex space-x-2">
                    {cert.status === "verified" && (
                      <Button variant="outline" size="sm">
                        <FileText className="w-4 h-4 mr-2" />
                        Ver Certificado
                      </Button>
                    )}

                    {cert.status === "expired" && (
                      <Button variant="outline" size="sm">
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Renovar
                      </Button>
                    )}

                    {cert.status === "pending" && (
                      <Button variant="outline" size="sm">
                        <Clock className="w-4 h-4 mr-2" />
                        Ver Estado
                      </Button>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Available Certifications */}
      <Card>
        <CardHeader>
          <CardTitle>Certificaciones Disponibles</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            {[
              {
                name: "B-Corp Certification",
                description: "Certificación de empresa con propósito",
                impact: "+15 REGEN",
              },
              { name: "Cradle to Cradle", description: "Diseño circular y sostenible", impact: "+12 REGEN" },
              { name: "Fair Trade", description: "Comercio justo y ético", impact: "+10 REGEN" },
              { name: "Organic Certification", description: "Productos orgánicos certificados", impact: "+8 REGEN" },
            ].map((cert, index) => (
              <div key={index} className="p-4 border border-dashed border-gray-300 rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-2">{cert.name}</h4>
                <p className="text-sm text-gray-600 mb-3">{cert.description}</p>
                <div className="flex items-center justify-between">
                  <Badge className="bg-green-100 text-green-800">{cert.impact}</Badge>
                  <Button variant="outline" size="sm">
                    Solicitar
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
