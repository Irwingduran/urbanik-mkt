"use client"

import { useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  Award,
  TrendingUp,
  RefreshCw,
  Share2,
  Shield,
  Zap,
  Droplets,
  TreePine,
  Sparkles,
  ArrowRight,
  Play,
} from "lucide-react"

interface NFTEducationProps {
  userType: "vendor" | "user" | null
  onComplete: () => void
}

const nftExamples = {
  vendor: [
    {
      name: "Semilla Verde",
      level: "Inicial",
      description: "Tu primer NFT como proveedor comprometido",
      image: "/placeholder.svg?height=150&width=150",
      evolution: "Se convierte en Hoja Creciente con mejores métricas",
    },
    {
      name: "Hoja Creciente",
      level: "Intermedio",
      description: "Demuestras progreso constante en sostenibilidad",
      image: "/placeholder.svg?height=150&width=150",
      evolution: "Evoluciona a Árbol Floreciente con liderazgo",
    },
    {
      name: "Árbol Floreciente",
      level: "Avanzado",
      description: "Líder en sostenibilidad con impacto verificado",
      image: "/placeholder.svg?height=150&width=150",
      evolution: "Desbloquea beneficios premium y reconocimientos",
    },
  ],
  user: [
    {
      name: "Explorador Verde",
      level: "Inicial",
      description: "Comienzas tu journey hacia la sostenibilidad",
      image: "/placeholder.svg?height=150&width=150",
      evolution: "Progresa según tus compras y acciones",
    },
    {
      name: "Guardián Eco",
      level: "Intermedio",
      description: "Demuestras compromiso con compras sostenibles",
      image: "/placeholder.svg?height=150&width=150",
      evolution: "Avanza a Embajador Verde con más impacto",
    },
    {
      name: "Embajador Verde",
      level: "Avanzado",
      description: "Inspiras a otros con tu estilo de vida sostenible",
      image: "/placeholder.svg?height=150&width=150",
      evolution: "Acceso a comunidad exclusiva y descuentos especiales",
    },
  ],
}

export default function NFTEducation({ userType, onComplete }: NFTEducationProps) {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [animationProgress, setAnimationProgress] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)

  const slides = [
    {
      title: "¿Qué son los NFTs en EcoTech?",
      content: (
        <div className="text-center space-y-3">
          <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-blue-500 rounded-full flex items-center justify-center mx-auto">
            <Award className="w-8 h-8 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Certificados Digitales Únicos</h3>
            <p className="text-xs text-gray-600 max-w-2xl mx-auto">
              Los NFTs en EcoTech son certificados digitales que representan tu compromiso y progreso en sostenibilidad.
              No son solo imágenes, son credenciales verificables de tu impacto ambiental positivo.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-2 mt-3">
            <div className="p-2 bg-green-50 rounded-lg">
              <Shield className="w-5 h-5 text-green-600 mx-auto mb-1" />
              <h4 className="font-semibold text-xs text-green-900">Verificables</h4>
              <p className="text-xs text-green-700">Respaldados por blockchain</p>
            </div>
            <div className="p-2 bg-blue-50 rounded-lg">
              <TrendingUp className="w-5 h-5 text-blue-600 mx-auto mb-1" />
              <h4 className="font-semibold text-xs text-blue-900">Evolutivos</h4>
              <p className="text-xs text-blue-700">Cambian con tu progreso</p>
            </div>
            <div className="p-2 bg-yellow-50 rounded-lg">
              <Sparkles className="w-5 h-5 text-yellow-600 mx-auto mb-1" />
              <h4 className="font-semibold text-xs text-yellow-900">Únicos</h4>
              <p className="text-xs text-yellow-700">Personalizados para ti</p>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "NFTs Dinámicos que Evolucionan",
      content: (
        <div className="space-y-3">
          <div className="text-center mb-3">
            <h3 className="text-lg font-bold text-gray-900 mb-1">Tu NFT Crece Contigo</h3>
            <p className="text-xs text-gray-600">
              A diferencia de los NFTs estáticos, los nuestros evolucionan automáticamente según tus métricas de
              sostenibilidad
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-3">
            {(nftExamples[userType as keyof typeof nftExamples] || nftExamples.vendor).map((nft, index) => (
              <Card key={index} className="border border-gray-200 hover:border-green-500 transition-colors">
                <CardContent className="p-3 text-center">
                  <div className="relative mb-2">
                    <img
                      src={nft.image || "/placeholder.svg"}
                      alt={nft.name}
                      className="w-16 h-16 mx-auto rounded-full"
                    />
                    <Badge
                      className={`absolute -top-1 -right-1 text-xs px-1 py-0 ${
                        index === 0 ? "bg-green-500" : index === 1 ? "bg-blue-500" : "bg-yellow-500"
                      }`}
                    >
                      {nft.level}
                    </Badge>
                  </div>
                  <h4 className="font-bold text-sm text-gray-900 mb-1">{nft.name}</h4>
                  <p className="text-xs text-gray-600 mb-2">{nft.description}</p>
                  <div className="text-xs text-gray-500 bg-gray-50 p-1 rounded">{nft.evolution}</div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="bg-gradient-to-r from-green-50 to-blue-50 p-3 rounded-lg">
            <div className="flex items-center justify-center space-x-2 mb-1">
              <RefreshCw className="w-4 h-4 text-green-600" />
              <span className="font-semibold text-xs text-gray-900">Evolución Automática</span>
            </div>
            <p className="text-xs text-gray-700 text-center">
              Los smart contracts actualizan tu NFT automáticamente cuando mejoras tus métricas. ¡No necesitas hacer
              nada extra!
            </p>
          </div>
        </div>
      ),
    },
    {
      title: "Beneficios y Recompensas",
      content: (
        <div className="space-y-3">
          <div className="text-center mb-3">
            <h3 className="text-lg font-bold text-gray-900 mb-1">Más que una Imagen Digital</h3>
            <p className="text-xs text-gray-600">Cada NFT viene con beneficios reales y oportunidades exclusivas</p>
          </div>

          <div className="grid md:grid-cols-2 gap-3">
            <Card>
              <CardContent className="p-3">
                <div className="flex items-center space-x-2 mb-2">
                  <Share2 className="w-4 h-4 text-blue-600" />
                  <h4 className="font-semibold text-xs text-gray-900">Marca Personal</h4>
                </div>
                <ul className="text-xs text-gray-600 space-y-1">
                  <li>• Comparte en redes sociales</li>
                  <li>• Integra en tu sitio web</li>
                  <li>• Demuestra tu compromiso verde</li>
                  <li>• Personaliza con tu logo</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-3">
                <div className="flex items-center space-x-2 mb-2">
                  <Zap className="w-4 h-4 text-yellow-600" />
                  <h4 className="font-semibold text-xs text-gray-900">Beneficios Exclusivos</h4>
                </div>
                <ul className="text-xs text-gray-600 space-y-1">
                  <li>• Descuentos especiales</li>
                  <li>• Acceso prioritario a productos</li>
                  <li>• Herramientas premium gratis</li>
                  <li>• Comunidad exclusiva</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-3">
                <div className="flex items-center space-x-2 mb-2">
                  <TreePine className="w-4 h-4 text-green-600" />
                  <h4 className="font-semibold text-xs text-gray-900">Impacto Medible</h4>
                </div>
                <ul className="text-xs text-gray-600 space-y-1">
                  <li>• Métricas integradas en metadatos</li>
                  <li>• Historial de progreso</li>
                  <li>• Certificación transparente</li>
                  <li>• Auditoría automática</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-3">
                <div className="flex items-center space-x-2 mb-2">
                  <Droplets className="w-4 h-4 text-blue-600" />
                  <h4 className="font-semibold text-xs text-gray-900">Intercambio y Progreso</h4>
                </div>
                <ul className="text-xs text-gray-600 space-y-1">
                  <li>• Evolución histórica registrada</li>
                  <li>• Intercambia por versiones mejoradas</li>
                  <li>• Colecciona logros especiales</li>
                  <li>• Transfiere a otros wallets</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      ),
    },
  ]

  const nextSlide = useCallback(() => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide((prev) => prev + 1)
      setAnimationProgress(0)
      setIsAnimating(false)
    } else {
      onComplete()
    }
  }, [currentSlide, slides.length, onComplete])

  const prevSlide = useCallback(() => {
    if (currentSlide > 0) {
      setCurrentSlide((prev) => prev - 1)
      setAnimationProgress(0)
      setIsAnimating(false)
    }
  }, [currentSlide])

  const startAnimation = useCallback(() => {
    if (isAnimating) return

    setIsAnimating(true)
    setAnimationProgress(0)

    const interval = setInterval(() => {
      setAnimationProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setIsAnimating(false)
          return 100
        }
        return prev + 2
      })
    }, 50)
  }, [isAnimating])

  return (
    <div>
      <div className="text-center mb-3">
        <h2 className="text-xl font-bold text-gray-900 mb-1">Conoce los NFTs de EcoTech</h2>
        <p className="text-xs text-gray-600">Aprende cómo funcionan nuestros certificados digitales evolutivos</p>
      </div>

      {/* Progress Indicators */}
      <div className="flex justify-center mb-3">
        <div className="flex space-x-1.5">
          {slides.map((_, index) => (
            <div
              key={index}
              className={`w-2 h-2 rounded-full transition-colors ${
                index === currentSlide ? "bg-green-600" : "bg-gray-300"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Slide Content */}
      <Card className="min-h-[300px]">
        <CardContent className="p-4">
          <div className="mb-3">
            <h3 className="text-sm font-semibold text-gray-900 mb-2">{slides[currentSlide].title}</h3>
            <div className="w-full bg-gray-200 rounded-full h-1.5 mb-3">
              <div
                className="bg-green-600 h-1.5 rounded-full transition-all duration-300"
                style={{ width: `${((currentSlide + 1) / slides.length) * 100}%` }}
              />
            </div>
          </div>

          {slides[currentSlide].content}
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between items-center mt-3">
        <Button variant="outline" size="sm" onClick={prevSlide} disabled={currentSlide === 0}>
          Anterior
        </Button>

        <div className="flex items-center space-x-2">
          {currentSlide === 1 && (
            <Button
              variant="outline"
              size="sm"
              onClick={startAnimation}
              disabled={isAnimating}
              className="flex items-center space-x-1 bg-transparent"
            >
              <Play className="w-3 h-3" />
              <span className="text-xs">{isAnimating ? "Animando..." : "Ver Evolución"}</span>
            </Button>
          )}

          {animationProgress > 0 && (
            <div className="flex items-center space-x-1">
              <span className="text-xs text-gray-600">Progreso:</span>
              <Progress value={animationProgress} className="w-24 h-1.5" />
            </div>
          )}
        </div>

        <Button onClick={nextSlide} size="sm" className="bg-green-600 hover:bg-green-700 text-white">
          <span className="text-xs">{currentSlide === slides.length - 1 ? "Finalizar" : "Siguiente"}</span>
          <ArrowRight className="w-3 h-3 ml-1" />
        </Button>
      </div>
    </div>
  )
}
