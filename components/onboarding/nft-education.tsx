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
        <div className="text-center space-y-6">
          <div className="w-32 h-32 bg-gradient-to-br from-green-500 to-blue-500 rounded-full flex items-center justify-center mx-auto">
            <Award className="w-16 h-16 text-white" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Certificados Digitales Únicos</h3>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Los NFTs en EcoTech son certificados digitales que representan tu compromiso y progreso en sostenibilidad.
              No son solo imágenes, son credenciales verificables de tu impacto ambiental positivo.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-4 mt-8">
            <div className="p-4 bg-green-50 rounded-lg">
              <Shield className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <h4 className="font-semibold text-green-900">Verificables</h4>
              <p className="text-sm text-green-700">Respaldados por blockchain</p>
            </div>
            <div className="p-4 bg-blue-50 rounded-lg">
              <TrendingUp className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <h4 className="font-semibold text-blue-900">Evolutivos</h4>
              <p className="text-sm text-blue-700">Cambian con tu progreso</p>
            </div>
            <div className="p-4 bg-yellow-50 rounded-lg">
              <Sparkles className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
              <h4 className="font-semibold text-yellow-900">Únicos</h4>
              <p className="text-sm text-yellow-700">Personalizados para ti</p>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "NFTs Dinámicos que Evolucionan",
      content: (
        <div className="space-y-6">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Tu NFT Crece Contigo</h3>
            <p className="text-gray-600">
              A diferencia de los NFTs estáticos, los nuestros evolucionan automáticamente según tus métricas de
              sostenibilidad
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {(nftExamples[userType as keyof typeof nftExamples] || nftExamples.vendor).map((nft, index) => (
              <Card key={index} className="border-2 border-gray-200 hover:border-green-500 transition-colors">
                <CardContent className="p-6 text-center">
                  <div className="relative mb-4">
                    <img
                      src={nft.image || "/placeholder.svg"}
                      alt={nft.name}
                      className="w-24 h-24 mx-auto rounded-full"
                    />
                    <Badge
                      className={`absolute -top-2 -right-2 ${
                        index === 0 ? "bg-green-500" : index === 1 ? "bg-blue-500" : "bg-yellow-500"
                      }`}
                    >
                      {nft.level}
                    </Badge>
                  </div>
                  <h4 className="font-bold text-gray-900 mb-2">{nft.name}</h4>
                  <p className="text-sm text-gray-600 mb-3">{nft.description}</p>
                  <div className="text-xs text-gray-500 bg-gray-50 p-2 rounded">🔄 {nft.evolution}</div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="bg-gradient-to-r from-green-50 to-blue-50 p-6 rounded-lg">
            <div className="flex items-center justify-center space-x-4 mb-4">
              <RefreshCw className="w-6 h-6 text-green-600" />
              <span className="font-semibold text-gray-900">Evolución Automática</span>
            </div>
            <p className="text-sm text-gray-700 text-center">
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
        <div className="space-y-6">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Más que una Imagen Digital</h3>
            <p className="text-gray-600">Cada NFT viene con beneficios reales y oportunidades exclusivas</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <Share2 className="w-6 h-6 text-blue-600" />
                  <h4 className="font-semibold text-gray-900">Marca Personal</h4>
                </div>
                <ul className="text-sm text-gray-600 space-y-2">
                  <li>• Comparte en redes sociales</li>
                  <li>• Integra en tu sitio web</li>
                  <li>• Demuestra tu compromiso verde</li>
                  <li>• Personaliza con tu logo</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <Zap className="w-6 h-6 text-yellow-600" />
                  <h4 className="font-semibold text-gray-900">Beneficios Exclusivos</h4>
                </div>
                <ul className="text-sm text-gray-600 space-y-2">
                  <li>• Descuentos especiales</li>
                  <li>• Acceso prioritario a productos</li>
                  <li>• Herramientas premium gratis</li>
                  <li>• Comunidad exclusiva</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <TreePine className="w-6 h-6 text-green-600" />
                  <h4 className="font-semibold text-gray-900">Impacto Medible</h4>
                </div>
                <ul className="text-sm text-gray-600 space-y-2">
                  <li>• Métricas integradas en metadatos</li>
                  <li>• Historial de progreso</li>
                  <li>• Certificación transparente</li>
                  <li>• Auditoría automática</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <Droplets className="w-6 h-6 text-blue-600" />
                  <h4 className="font-semibold text-gray-900">Intercambio y Progreso</h4>
                </div>
                <ul className="text-sm text-gray-600 space-y-2">
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
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Conoce los NFTs de EcoTech</h2>
        <p className="text-gray-600">Aprende cómo funcionan nuestros certificados digitales evolutivos</p>
      </div>

      {/* Progress Indicators */}
      <div className="flex justify-center mb-8">
        <div className="flex space-x-2">
          {slides.map((_, index) => (
            <div
              key={index}
              className={`w-3 h-3 rounded-full transition-colors ${
                index === currentSlide ? "bg-green-600" : "bg-gray-300"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Slide Content */}
      <Card className="min-h-[500px]">
        <CardContent className="p-8">
          <div className="mb-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">{slides[currentSlide].title}</h3>
            <div className="w-full bg-gray-200 rounded-full h-2 mb-6">
              <div
                className="bg-green-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${((currentSlide + 1) / slides.length) * 100}%` }}
              />
            </div>
          </div>

          {slides[currentSlide].content}
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between items-center mt-8">
        <Button variant="outline" onClick={prevSlide} disabled={currentSlide === 0}>
          Anterior
        </Button>

        <div className="flex items-center space-x-4">
          {currentSlide === 1 && (
            <Button
              variant="outline"
              onClick={startAnimation}
              disabled={isAnimating}
              className="flex items-center space-x-2 bg-transparent"
            >
              <Play className="w-4 h-4" />
              <span>{isAnimating ? "Animando..." : "Ver Evolución"}</span>
            </Button>
          )}

          {animationProgress > 0 && (
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">Progreso:</span>
              <Progress value={animationProgress} className="w-32 h-2" />
            </div>
          )}
        </div>

        <Button onClick={nextSlide} className="bg-green-600 hover:bg-green-700 text-white">
          {currentSlide === slides.length - 1 ? "Finalizar" : "Siguiente"}
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  )
}
