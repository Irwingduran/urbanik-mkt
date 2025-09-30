"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Award, Download, Share2, Sparkles, ArrowRight, Star } from "lucide-react"

interface NFTEvolutionCardProps {
  score: number
}

const nftLevels = [
  { name: "Semilla Verde", minScore: 0, maxScore: 49, color: "from-green-400 to-green-500" },
  { name: "Hoja Creciente", minScore: 50, maxScore: 74, color: "from-blue-400 to-blue-500" },
  { name: "Árbol Floreciente", minScore: 75, maxScore: 89, color: "from-purple-400 to-purple-500" },
  { name: "Bosque Guardián", minScore: 90, maxScore: 100, color: "from-yellow-400 to-yellow-500" },
]

export default function NFTEvolutionCard({ score }: NFTEvolutionCardProps) {
  const currentNFT = nftLevels.find((level) => score >= level.minScore && score <= level.maxScore) || nftLevels[0]

  const nextNFT = nftLevels.find((level) => level.minScore > score)
  const progressToNext = nextNFT
    ? ((score - currentNFT.minScore) / (nextNFT.minScore - currentNFT.minScore)) * 100
    : 100

  return (
    <Card className="border-2 border-blue-200">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Award className="w-5 h-5 text-blue-600" />
            <span>Tu NFT Evolutivo</span>
          </div>
          <Badge className="bg-yellow-100 text-yellow-800">
            <Sparkles className="w-3 h-3 mr-1" />
            Dinámico
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Current NFT Display */}
        <div className="text-center">
          <div
            className={`w-32 h-32 bg-gradient-to-br ${currentNFT.color} rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg`}
          >
            <Award className="w-16 h-16 text-white" />
          </div>

          <h3 className="text-xl font-bold text-gray-900 mb-2">{currentNFT.name}</h3>
          <Badge className="bg-blue-100 text-blue-800 mb-4">Nivel Actual</Badge>

          <div className="flex items-center justify-center space-x-4">
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Descargar
            </Button>
            <Button variant="outline" size="sm">
              <Share2 className="w-4 h-4 mr-2" />
              Compartir
            </Button>
          </div>
        </div>

        {/* Evolution Progress */}
        {nextNFT && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">Progreso al siguiente nivel</span>
              <span className="text-sm text-gray-500">{Math.round(progressToNext)}%</span>
            </div>
            <Progress value={progressToNext} className="h-3" />
            <div className="flex items-center justify-between text-xs text-gray-500">
              <span>{currentNFT.name}</span>
              <span>{nextNFT.name}</span>
            </div>
          </div>
        )}

        {/* Next Level Info */}
        {nextNFT ? (
          <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <Star className="w-4 h-4 text-blue-600" />
              <span className="font-medium text-blue-900">Próxima Evolución</span>
            </div>
            <p className="text-sm text-blue-700 mb-3">
              Tu NFT evolucionará a <strong>{nextNFT.name}</strong> cuando alcances {nextNFT.minScore} puntos REGEN.
            </p>
            <div className="flex items-center text-sm text-blue-600">
              <span>Faltan {nextNFT.minScore - score} puntos</span>
              <ArrowRight className="w-4 h-4 ml-2" />
            </div>
          </div>
        ) : (
          <div className="p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <Award className="w-4 h-4 text-yellow-600" />
              <span className="font-medium text-yellow-900">¡Nivel Máximo!</span>
            </div>
            <p className="text-sm text-yellow-700">
              Has alcanzado el nivel más alto. Tu NFT representa el máximo compromiso con la sostenibilidad.
            </p>
          </div>
        )}

        {/* NFT Properties */}
        <div className="space-y-2">
          <h4 className="font-semibold text-gray-900 text-sm">Propiedades del NFT</h4>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="p-2 bg-gray-50 rounded">
              <span className="text-gray-500">Nivel:</span>
              <span className="ml-1 font-medium">{currentNFT.name}</span>
            </div>
            <div className="p-2 bg-gray-50 rounded">
              <span className="text-gray-500">Score:</span>
              <span className="ml-1 font-medium">{score}/100</span>
            </div>
            <div className="p-2 bg-gray-50 rounded">
              <span className="text-gray-500">Rareza:</span>
              <span className="ml-1 font-medium">
                {score >= 90 ? "Legendario" : score >= 75 ? "Épico" : score >= 50 ? "Raro" : "Común"}
              </span>
            </div>
            <div className="p-2 bg-gray-50 rounded">
              <span className="text-gray-500">Emisión:</span>
              <span className="ml-1 font-medium">2024</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
