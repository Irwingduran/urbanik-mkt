"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AlertCircle, HelpCircle, Award, RefreshCw, MessageSquare, Settings, Download, Share2 } from "lucide-react"

export default function ActionButtons() {
  const primaryActions = [
    {
      title: "Solicitar Certificación",
      description: "Aplica para nuevas certificaciones",
      icon: Award,
      color: "bg-blue-600 hover:bg-blue-700",
      action: () => console.log("Solicitar certificación"),
    },
    {
      title: "Reportar Problema",
      description: "Informa sobre algún inconveniente",
      icon: AlertCircle,
      color: "bg-red-600 hover:bg-red-700",
      action: () => console.log("Reportar problema"),
    },
    {
      title: "Actualizar Métricas",
      description: "Sube nuevos datos de sostenibilidad",
      icon: RefreshCw,
      color: "bg-green-600 hover:bg-green-700",
      action: () => console.log("Actualizar métricas"),
    },
  ]

  const secondaryActions = [
    {
      title: "Soporte Técnico",
      icon: HelpCircle,
      action: () => console.log("Soporte técnico"),
    },
    {
      title: "Configuración",
      icon: Settings,
      action: () => console.log("Configuración"),
    },
    {
      title: "Descargar Reporte",
      icon: Download,
      action: () => console.log("Descargar reporte"),
    },
    {
      title: "Compartir Perfil",
      icon: Share2,
      action: () => console.log("Compartir perfil"),
    },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Acciones Principales</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Primary Actions */}
        <div className="space-y-3">
          {primaryActions.map((action, index) => {
            const Icon = action.icon
            return (
              <Button key={index} onClick={action.action} className={`w-full justify-start text-white ${action.color}`}>
                <Icon className="w-4 h-4 mr-3" />
                <div className="text-left">
                  <div className="font-medium">{action.title}</div>
                  <div className="text-xs opacity-90">{action.description}</div>
                </div>
              </Button>
            )
          })}
        </div>

        {/* Secondary Actions */}
        <div className="pt-4 border-t border-gray-200">
          <div className="grid grid-cols-2 gap-2">
            {secondaryActions.map((action, index) => {
              const Icon = action.icon
              return (
                <Button
                  key={index}
                  variant="outline"
                  onClick={action.action}
                  className="flex flex-col items-center p-3 h-auto bg-transparent"
                >
                  <Icon className="w-5 h-5 mb-1" />
                  <span className="text-xs">{action.title}</span>
                </Button>
              )
            })}
          </div>
        </div>

        {/* Emergency Contact */}
        <div className="pt-4 border-t border-gray-200">
          <Button variant="outline" className="w-full justify-start bg-transparent">
            <MessageSquare className="w-4 h-4 mr-2" />
            Chat en Vivo - Soporte 24/7
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
