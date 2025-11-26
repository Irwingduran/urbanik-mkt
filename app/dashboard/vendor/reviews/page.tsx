"use client"

import { useState, useEffect } from "react"
import { VendorDashboardLayout, VendorDashboardHeader } from "@/components/shared/layout/VendorDashboardLayout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Star, MessageSquare, Calendar, Reply } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { es } from "date-fns/locale"

interface Review {
  id: string
  rating: number
  comment: string
  createdAt: string
  verified: boolean
  vendorReply?: string
  vendorReplyAt?: string
  product: {
    id: string
    name: string
    images: string[]
  }
  user: {
    name: string
    image: string | null
  }
}

export default function VendorReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [replyingTo, setReplyingTo] = useState<string | null>(null)
  const [replyText, setReplyText] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await fetch('/api/vendor/reviews')
        const data = await response.json()
        if (data.success) {
          setReviews(data.data)
        }
      } catch (error) {
        console.error("Error fetching reviews:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchReviews()
  }, [])

  const handleReplySubmit = async (reviewId: string) => {
    if (!replyText.trim()) return

    setIsSubmitting(true)
    try {
      const response = await fetch(`/api/vendor/reviews/${reviewId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reply: replyText })
      })

      const data = await response.json()
      if (data.success) {
        setReviews(prev => prev.map(r => 
          r.id === reviewId 
            ? { ...r, vendorReply: replyText, vendorReplyAt: new Date().toISOString() } 
            : r
        ))
        setReplyingTo(null)
        setReplyText("")
      } else {
        alert(data.error || "Error al enviar respuesta")
      }
    } catch (error) {
      console.error(error)
      alert("Error de conexión")
    } finally {
      setIsSubmitting(false)
    }
  }

  const averageRating = reviews.length > 0
    ? (reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length).toFixed(1)
    : "0.0"

  return (
    <VendorDashboardLayout>
      <VendorDashboardHeader
        title="Reseñas de Productos"
        subtitle="Gestiona y visualiza las opiniones de tus clientes"
      />

      <div className="p-6 space-y-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Calificación Promedio</CardTitle>
              <Star className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{averageRating}</div>
              <p className="text-xs text-muted-foreground">
                Basado en {reviews.length} reseñas
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Reseñas</CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{reviews.length}</div>
              <p className="text-xs text-muted-foreground">
                +0% desde el mes pasado
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Reviews List */}
        <Card>
          <CardHeader>
            <CardTitle>Reseñas Recientes</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
              </div>
            ) : reviews.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <MessageSquare className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>Aún no tienes reseñas.</p>
              </div>
            ) : (
              <div className="space-y-6">
                {reviews.map((review) => (
                  <div key={review.id} className="border-b border-gray-100 pb-6 last:border-0 last:pb-0">
                    <div className="flex flex-col md:flex-row gap-4">
                      {/* Product Image */}
                      <div className="shrink-0">
                        <img
                          src={review.product.images[0] || "/placeholder.svg"}
                          alt={review.product.name}
                          className="w-16 h-16 rounded-lg object-cover bg-gray-100"
                        />
                      </div>

                      {/* Review Content */}
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h4 className="font-medium text-gray-900">{review.product.name}</h4>
                            <div className="flex items-center space-x-2 mt-1">
                              <div className="flex text-yellow-400">
                                {[...Array(5)].map((_, i) => (
                                  <Star
                                    key={i}
                                    className={`w-4 h-4 ${i < review.rating ? "fill-current" : "text-gray-300"}`}
                                  />
                                ))}
                              </div>
                              <span className="text-sm text-gray-500 font-medium">{review.rating}.0</span>
                            </div>
                          </div>
                          <div className="text-sm text-gray-500 flex items-center">
                            <Calendar className="w-3 h-3 mr-1" />
                            {formatDistanceToNow(new Date(review.createdAt), { addSuffix: true, locale: es })}
                          </div>
                        </div>

                        <p className="text-gray-700 mb-3">{review.comment}</p>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-xs font-bold text-gray-600">
                              {review.user.name.charAt(0)}
                            </div>
                            <span className="text-sm text-gray-600">{review.user.name}</span>
                            {review.verified && (
                              <Badge variant="outline" className="text-xs text-green-600 border-green-200 bg-green-50">
                                Compra Verificada
                              </Badge>
                            )}
                          </div>
                        </div>

                        {/* Vendor Reply Section */}
                        <div className="mt-4">
                          {review.vendorReply ? (
                            <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-semibold text-gray-900">Tu Respuesta</span>
                                <span className="text-xs text-gray-500">
                                  {review.vendorReplyAt && formatDistanceToNow(new Date(review.vendorReplyAt), { addSuffix: true, locale: es })}
                                </span>
                              </div>
                              <p className="text-sm text-gray-700">{review.vendorReply}</p>
                            </div>
                          ) : (
                            <div>
                              {replyingTo === review.id ? (
                                <div className="space-y-3 mt-3">
                                  <Textarea
                                    placeholder="Escribe tu respuesta al cliente..."
                                    value={replyText}
                                    onChange={(e) => setReplyText(e.target.value)}
                                    className="min-h-[100px]"
                                  />
                                  <div className="flex space-x-2">
                                    <Button 
                                      size="sm" 
                                      onClick={() => handleReplySubmit(review.id)}
                                      disabled={isSubmitting || !replyText.trim()}
                                    >
                                      {isSubmitting ? 'Enviando...' : 'Enviar Respuesta'}
                                    </Button>
                                    <Button 
                                      size="sm" 
                                      variant="ghost" 
                                      onClick={() => {
                                        setReplyingTo(null)
                                        setReplyText("")
                                      }}
                                    >
                                      Cancelar
                                    </Button>
                                  </div>
                                </div>
                              ) : (
                                <Button 
                                  variant="outline" 
                                  size="sm" 
                                  className="mt-2"
                                  onClick={() => {
                                    setReplyingTo(review.id)
                                    setReplyText("")
                                  }}
                                >
                                  <Reply className="w-4 h-4 mr-2" />
                                  Responder
                                </Button>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </VendorDashboardLayout>
  )
}
