"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Award, Download, Share2, Calendar, Star, TrendingUp, Sparkles } from "lucide-react"

interface NFTEvolutionHistoryProps {
  evolution: Array<{
    level: string
    dateAchieved: string
    score: number
    description: string
    image: string
    benefits: string[]
  }>
}

export default function NFTEvolutionHistory({ evolution }: NFTEvolutionHistoryProps) {
  const currentNFT = evolution[evolution.length - 1]
  const nextLevels = [
    { name: "Árbol Floreciente", minScore: 75, color: "from-purple-400 to-purple-500" },
    { name: "Bosque Guardián", minScore: 90, color: "from-yellow-400 to-yellow-500" },
  ]

  const nextLevel = nextLevels.find((level) => currentNFT.score < level.minScore)

  return (
    <div className="space-y-6">
      {/* Current NFT Showcase */}
      <Card className="border-2 border-green-200">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Award className="w-5 h-5 text-green-600" />
              <span>NFT Actual</span>
            </div>
            <Badge className="bg-yellow-100 text-yellow-800">
              <Sparkles className="w-3 h-3 mr-1" />
              Activo
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-8">
            {/* NFT Display */}
            <div className="text-center">
              <div className="w-64 h-64 bg-gradient-to-br from-green-400 to-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-2xl">
                <Award className="w-32 h-32 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">{currentNFT.level}</h2>
              <p className="text-gray-600 mb-4">{currentNFT.description}</p>
              <div className="flex justify-center space-x-3">
                <Button>
                  <Download className="w-4 h-4 mr-2" />
                  Descargar
                </Button>
                <Button variant="outline">
                  <Share2 className="w-4 h-4 mr-2" />
                  Compartir
                </Button>
              </div>
            </div>

            {/* NFT Details */}
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Detalles del NFT</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-500">Nivel:</span>
                    <div className="font-medium">{currentNFT.level}</div>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-500">REGEN Score:</span>
                    <div className="font-medium">{currentNFT.score}/100</div>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-500">Fecha:</span>
                    <div className="font-medium">{new Date(currentNFT.dateAchieved).toLocaleDateString()}</div>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-500">Rareza:</span>
                    <div className="font-medium">
                      {currentNFT.score >= 90 ? "Legendario" : currentNFT.score >= 75 ? "Épico" : "Raro"}
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Beneficios Incluidos</h3>
                <ul className="space-y-2">
                  {currentNFT.benefits.map((benefit, index) => (
                    <li key={index} className="flex items-center space-x-2 text-sm">
                      <Star className="w-4 h-4 text-yellow-500" />
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {nextLevel && (
                <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <TrendingUp className="w-4 h-4 text-blue-600" />
                    <span className="font-medium text-blue-900">Próxima Evolución</span>
                  </div>
                  <p className="text-sm text-blue-700 mb-2">
                    Tu NFT evolucionará a <strong>{nextLevel.name}</strong> cuando alcances {nextLevel.minScore} puntos
                    REGEN.
                  </p>
                  <div className="text-sm text-blue-600">Faltan {nextLevel.minScore - currentNFT.score} puntos</div>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Evolution Timeline */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Calendar className="w-5 h-5 text-blue-600" />
            <span>Historial de Evolución</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {evolution.map((nft, index) => (
              <div key={index} className="flex items-start space-x-6 p-6 bg-gray-50 rounded-xl">
                <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-blue-500 rounded-xl flex items-center justify-center shadow-lg">
                  <Award className="w-10 h-10 text-white" />
                </div>

                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">{nft.level}</h3>
                    <div className="flex items-center space-x-2">
                      <Badge className="bg-green-100 text-green-800">Score: {nft.score}</Badge>
                      <Badge variant="outline">{new Date(nft.dateAchieved).toLocaleDateString()}</Badge>
                    </div>
                  </div>
                  <p className="text-gray-600 mb-3">{nft.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {nft.benefits.map((benefit, benefitIndex) => (
                      <Badge key={benefitIndex} variant="outline" className="text-xs">
                        {benefit}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* NFT Collection Gallery */}
      <Card>
        <CardHeader>
          <CardTitle>Galería de Colección</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-4 gap-6">
            {evolution.map((nft, index) => (
              <div key={index} className="text-center">
                <div className="w-32 h-32 bg-gradient-to-br from-green-400 to-blue-500 rounded-xl flex items-center justify-center mx-auto mb-3 shadow-lg">
                  <Award className="w-16 h-16 text-white" />
                </div>
                <h4 className="font-medium text-gray-900 mb-1">{nft.level}</h4>
                <p className="text-xs text-gray-500">{new Date(nft.dateAchieved).toLocaleDateString()}</p>
                <Badge className="mt-2 bg-green-100 text-green-800 text-xs">Score: {nft.score}</Badge>
              </div>
            ))}

            {/* Future NFTs */}
            {nextLevels
              .filter((level) => currentNFT.score < level.minScore)
              .map((level, index) => (
                <div key={`future-${index}`} className="text-center opacity-50">
                  <div
                    className={`w-32 h-32 bg-gradient-to-br ${level.color} rounded-xl flex items-center justify-center mx-auto mb-3 shadow-lg`}
                  >
                    <Award className="w-16 h-16 text-white" />
                  </div>
                  <h4 className="font-medium text-gray-900 mb-1">{level.name}</h4>
                  <p className="text-xs text-gray-500">Próximo nivel</p>
                  <Badge variant="outline" className="mt-2 text-xs">
                    Score: {level.minScore}+
                  </Badge>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
