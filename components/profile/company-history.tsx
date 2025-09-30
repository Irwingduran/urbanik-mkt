"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Target, Heart, Users, Lightbulb, Award } from "lucide-react"

interface CompanyHistoryProps {
  history: {
    founded: string
    milestones: Array<{
      year: string
      title: string
      description: string
      impact: string
    }>
    vision: string
    mission: string
    values: string[]
  }
  detailed?: boolean
}

export default function CompanyHistory({ history, detailed = false }: CompanyHistoryProps) {
  return (
    <div className="space-y-6">
      {/* Company Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Target className="w-5 h-5 text-green-600" />
            <span>Nuestra Historia</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2 flex items-center">
                <Heart className="w-4 h-4 mr-2 text-red-500" />
                Misión
              </h3>
              <p className="text-gray-600 text-sm">{history.mission}</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2 flex items-center">
                <Lightbulb className="w-4 h-4 mr-2 text-yellow-500" />
                Visión
              </h3>
              <p className="text-gray-600 text-sm">{history.vision}</p>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
              <Users className="w-4 h-4 mr-2 text-blue-500" />
              Valores Fundamentales
            </h3>
            <div className="flex flex-wrap gap-2">
              {history.values.map((value, index) => (
                <Badge key={index} variant="outline" className="bg-green-50 text-green-700 border-green-200">
                  {value}
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Timeline */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Calendar className="w-5 h-5 text-blue-600" />
            <span>Línea de Tiempo</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-green-500 to-blue-500"></div>

            <div className="space-y-8">
              {history.milestones.map((milestone, index) => (
                <div key={index} className="relative flex items-start space-x-6">
                  {/* Timeline Dot */}
                  <div className="relative z-10 w-16 h-16 bg-gradient-to-br from-green-500 to-blue-500 rounded-full flex items-center justify-center text-white font-bold shadow-lg">
                    {milestone.year}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div
                      className={`p-6 bg-white rounded-xl shadow-sm border-l-4 ${
                        index % 2 === 0 ? "border-green-500" : "border-blue-500"
                      }`}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <h3 className="text-lg font-semibold text-gray-900">{milestone.title}</h3>
                        <Badge
                          className={`${index % 2 === 0 ? "bg-green-100 text-green-800" : "bg-blue-100 text-blue-800"}`}
                        >
                          {milestone.year}
                        </Badge>
                      </div>
                      <p className="text-gray-600 mb-4">{milestone.description}</p>
                      <div className="flex items-center space-x-2">
                        <Award className="w-4 h-4 text-yellow-500" />
                        <span className="text-sm font-medium text-gray-700">Impacto:</span>
                        <span className="text-sm text-green-600 font-medium">{milestone.impact}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {detailed && (
        <Card>
          <CardHeader>
            <CardTitle>Reconocimientos y Certificaciones</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { name: "B-Corp Certification", year: "2021", issuer: "B Lab" },
                { name: "ISO 14001", year: "2019", issuer: "ISO" },
                { name: "Energy Star Partner", year: "2020", issuer: "EPA" },
                { name: "LEED Gold", year: "2022", issuer: "USGBC" },
                { name: "Carbon Neutral", year: "2023", issuer: "Climate Neutral" },
                { name: "Fair Trade Certified", year: "2021", issuer: "Fair Trade USA" },
              ].map((cert, index) => (
                <div key={index} className="p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex items-center space-x-2 mb-2">
                    <Award className="w-4 h-4 text-yellow-500" />
                    <span className="font-medium text-gray-900">{cert.name}</span>
                  </div>
                  <div className="text-sm text-gray-600">
                    <p>Año: {cert.year}</p>
                    <p>Emisor: {cert.issuer}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
