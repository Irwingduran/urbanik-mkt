"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { DashboardLayout, DashboardHeader } from "@/components/shared/layout/DashboardLayout"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Star, CheckCircle } from "lucide-react"
import { cn } from "@/lib/utils"

interface OrderItem {
  id: string
  productId: string
  quantity: number
  price: number
  product: {
    id: string
    name: string
    images: string[]
  }
  userRating: number | null
}

interface OrderDetail {
  id: string
  createdAt: string
  items: OrderItem[]
}

export default function OrderReviewPage() {
  const params = useParams()
  const router = useRouter()
  const [order, setOrder] = useState<OrderDetail | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [submitting, setSubmitting] = useState<string | null>(null) // productId being submitted

  // Form states per product
  const [ratings, setRatings] = useState<Record<string, number>>({})
  const [comments, setComments] = useState<Record<string, string>>({})

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await fetch(`/api/user/orders/${params.id}`)
        if (!response.ok) throw new Error('Error loading order')
        const data = await response.json()
        if (data.success) {
          setOrder(data.data)
        }
      } catch (err) {
        console.error(err)
      } finally {
        setIsLoading(false)
      }
    }

    if (params.id) {
      fetchOrder()
    }
  }, [params.id])

  const handleRatingChange = (productId: string, rating: number) => {
    setRatings(prev => ({ ...prev, [productId]: rating }))
  }

  const handleCommentChange = (productId: string, comment: string) => {
    setComments(prev => ({ ...prev, [productId]: comment }))
  }

  const handleSubmitReview = async (productId: string) => {
    const rating = ratings[productId]
    const comment = comments[productId]

    if (!rating) return

    setSubmitting(productId)
    try {
      const response = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId,
          rating,
          comment
        })
      })

      const data = await response.json()

      if (data.success) {
        // Update local state to show as reviewed
        setOrder(prev => {
          if (!prev) return null
          return {
            ...prev,
            items: prev.items.map(item => 
              item.productId === productId 
                ? { ...item, userRating: rating } 
                : item
            )
          }
        })
      } else {
        alert(data.error || 'Error al enviar reseña')
      }
    } catch (error) {
      console.error(error)
      alert('Error de conexión')
    } finally {
      setSubmitting(null)
    }
  }

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
        </div>
      </DashboardLayout>
    )
  }

  if (!order) return null

  return (
    <DashboardLayout>
      <DashboardHeader
        title="Calificar Productos"
        subtitle={`Pedido #${order.id.slice(-8)}`}
        breadcrumbs={[
          { label: 'Dashboard', href: '/dashboard' },
          { label: 'Mis Pedidos', href: '/dashboard/user/orders' },
          { label: `#${order.id.slice(-8)}`, href: `/dashboard/user/orders/${order.id}` },
          { label: 'Calificar' }
        ]}
        actions={
          <Button variant="outline" onClick={() => router.back()}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver
          </Button>
        }
      />

      <div className="p-6 space-y-6 max-w-3xl mx-auto">
        {order.items.map((item) => (
          <Card key={item.id}>
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-6">
                {/* Product Info */}
                <div className="flex items-start space-x-4 md:w-1/3">
                  <img
                    src={item.product.images[0] || "/placeholder.svg"}
                    alt={item.product.name}
                    className="w-20 h-20 rounded-lg object-cover bg-gray-100"
                  />
                  <div>
                    <h3 className="font-medium text-gray-900">{item.product.name}</h3>
                    <p className="text-sm text-gray-500 mt-1">Cantidad: {item.quantity}</p>
                  </div>
                </div>

                {/* Review Form or Status */}
                <div className="flex-1">
                  {item.userRating ? (
                    <div className="h-full flex flex-col items-center justify-center text-center p-4 bg-green-50 rounded-lg border border-green-100">
                      <CheckCircle className="w-8 h-8 text-green-600 mb-2" />
                      <h4 className="font-medium text-green-800">¡Gracias por tu opinión!</h4>
                      <div className="flex mt-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={cn(
                              "w-5 h-5",
                              star <= item.userRating! ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
                            )}
                          />
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div>
                        <Label className="mb-2 block">Calificación</Label>
                        <div className="flex space-x-2">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              key={star}
                              type="button"
                              onClick={() => handleRatingChange(item.productId, star)}
                              className="focus:outline-none transition-transform hover:scale-110"
                            >
                              <Star
                                className={cn(
                                  "w-8 h-8",
                                  star <= (ratings[item.productId] || 0)
                                    ? "text-yellow-400 fill-yellow-400"
                                    : "text-gray-300 hover:text-yellow-200"
                                )}
                              />
                            </button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <Label htmlFor={`comment-${item.id}`}>Comentario (Opcional)</Label>
                        <Textarea
                          id={`comment-${item.id}`}
                          placeholder="¿Qué te pareció este producto?"
                          value={comments[item.productId] || ''}
                          onChange={(e) => handleCommentChange(item.productId, e.target.value)}
                          className="mt-1.5"
                        />
                      </div>

                      <Button 
                        onClick={() => handleSubmitReview(item.productId)}
                        disabled={!ratings[item.productId] || submitting === item.productId}
                        className="w-full md:w-auto"
                      >
                        {submitting === item.productId ? 'Enviando...' : 'Enviar Calificación'}
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </DashboardLayout>
  )
}
