"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Star, ThumbsUp, MessageSquare, Filter, TrendingUp } from "lucide-react"

interface Review {
  id: number
  customerName: string
  company: string
  rating: number
  date: string
  comment: string
  verified: boolean
  helpful: number
}

interface CustomerReviewsProps {
  reviews: Review[]
}

export default function CustomerReviews({ reviews }: CustomerReviewsProps) {
  const averageRating = reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
  const ratingDistribution = [5, 4, 3, 2, 1].map((rating) => ({
    rating,
    count: reviews.filter((review) => review.rating === rating).length,
    percentage: (reviews.filter((review) => review.rating === rating).length / reviews.length) * 100,
  }))

  return (
    <div className="space-y-6">
      {/* Reviews Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Star className="w-5 h-5 text-yellow-500" />
              <span>Opiniones de Clientes</span>
            </div>
            <Button variant="outline" size="sm">
              <Filter className="w-4 h-4 mr-2" />
              Filtrar
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            {/* Rating Summary */}
            <div className="text-center">
              <div className="text-4xl font-bold text-gray-900 mb-2">{averageRating.toFixed(1)}</div>
              <div className="flex justify-center mb-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`w-5 h-5 ${star <= averageRating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
                  />
                ))}
              </div>
              <div className="text-sm text-gray-600">{reviews.length} reseñas totales</div>
            </div>

            {/* Rating Distribution */}
            <div className="space-y-2">
              {ratingDistribution.map((dist) => (
                <div key={dist.rating} className="flex items-center space-x-2">
                  <span className="text-sm w-8">{dist.rating}★</span>
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div className="bg-yellow-400 h-2 rounded-full" style={{ width: `${dist.percentage}%` }}></div>
                  </div>
                  <span className="text-sm text-gray-600 w-8">{dist.count}</span>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Reviews */}
      <Card>
        <CardHeader>
          <CardTitle>Reseñas Recientes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {reviews.map((review) => (
              <div key={review.id} className="border-b border-gray-100 pb-6 last:border-b-0">
                <div className="flex items-start space-x-4">
                  <Avatar>
                    <AvatarFallback className="bg-green-100 text-green-700">
                      {review.customerName
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <h4 className="font-semibold text-gray-900">{review.customerName}</h4>
                        <p className="text-sm text-gray-600">{review.company}</p>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center space-x-1 mb-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`w-4 h-4 ${
                                star <= review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                              }`}
                            />
                          ))}
                        </div>
                        <p className="text-xs text-gray-500">{new Date(review.date).toLocaleDateString()}</p>
                      </div>
                    </div>

                    <p className="text-gray-700 mb-3">{review.comment}</p>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        {review.verified && (
                          <Badge className="bg-green-100 text-green-800 text-xs">✓ Compra Verificada</Badge>
                        )}
                      </div>

                      <div className="flex items-center space-x-2">
                        <Button variant="ghost" size="sm" className="text-gray-500 hover:text-gray-700">
                          <ThumbsUp className="w-4 h-4 mr-1" />
                          {review.helpful}
                        </Button>
                        <Button variant="ghost" size="sm" className="text-gray-500 hover:text-gray-700">
                          <MessageSquare className="w-4 h-4 mr-1" />
                          Responder
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Review Insights */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <TrendingUp className="w-5 h-5 text-blue-600" />
            <span>Insights de Reseñas</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="p-4 bg-green-50 rounded-lg">
              <h4 className="font-semibold text-green-900 mb-2">Aspectos Más Valorados</h4>
              <ul className="text-sm text-green-700 space-y-1">
                <li>• Calidad del producto (95%)</li>
                <li>• Impacto ambiental (92%)</li>
                <li>• Servicio al cliente (89%)</li>
                <li>• Facilidad de instalación (87%)</li>
              </ul>
            </div>

            <div className="p-4 bg-blue-50 rounded-lg">
              <h4 className="font-semibold text-blue-900 mb-2">Tendencias Recientes</h4>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• +15% en satisfacción general</li>
                <li>• +22% menciones de sostenibilidad</li>
                <li>• +8% recomendaciones</li>
                <li>• 98% tasa de retención</li>
              </ul>
            </div>

            <div className="p-4 bg-yellow-50 rounded-lg">
              <h4 className="font-semibold text-yellow-900 mb-2">Áreas de Mejora</h4>
              <ul className="text-sm text-yellow-700 space-y-1">
                <li>• Tiempo de entrega (3%)</li>
                <li>• Documentación técnica (2%)</li>
                <li>• Precio competitivo (1%)</li>
                <li>• Variedad de productos (1%)</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
