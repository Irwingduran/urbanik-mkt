"use client"

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useSession } from 'next-auth/react'
import {
  CheckCircle,
  Package,
  Mail,
  Calendar,
  MapPin,
  Truck,
  Download,
  Share2,
  ArrowRight,
  Leaf,
  Gift,
  Star,
  Smartphone
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import Header from '@/components/layout/header'
import Link from 'next/link'

interface OrderDetails {
  id: string
  orderNumber: string
  status: string
  total: number
  createdAt: string
  estimatedDelivery: string
  items: Array<{
    id: string
    name: string
    quantity: number
    price: number
    image: string
    vendor: string
  }>
  shippingAddress: {
    firstName: string
    lastName: string
    street: string
    city: string
    state: string
    zipCode: string
  }
  environmentalImpact: {
    co2Reduced: number
    treesPlanted: number
    waterSaved: number
    plasticReduced: number
  }
}

export default function CheckoutSuccessPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { data: session } = useSession()
  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const orderId = searchParams.get('orderId')

  useEffect(() => {
    if (!session) {
      router.push('/auth/signin')
      return
    }

    if (!orderId) {
      router.push('/cart')
      return
    }

    // Fetch order details
    const fetchOrderDetails = async () => {
      try {
        setIsLoading(true)

        // Mock order details for now
        // In production, this would fetch from /api/orders/${orderId}
        setTimeout(() => {
          const mockOrder: OrderDetails = {
            id: orderId,
            orderNumber: `ORD-${orderId.slice(-8).toUpperCase()}`,
            status: 'CONFIRMED',
            total: 2847.50,
            createdAt: new Date().toISOString(),
            estimatedDelivery: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
            items: [
              {
                id: '1',
                name: 'Panel Solar Policristalino 400W',
                quantity: 2,
                price: 1200.00,
                image: '/placeholder.svg',
                vendor: 'EcoTech Solutions'
              },
              {
                id: '2',
                name: 'Controlador de Carga MPPT 40A',
                quantity: 1,
                price: 447.50,
                image: '/placeholder.svg',
                vendor: 'GreenEnergy Store'
              }
            ],
            shippingAddress: {
              firstName: 'Juan',
              lastName: 'Pérez',
              street: 'Av. Reforma 123, Col. Centro',
              city: 'Ciudad de México',
              state: 'CDMX',
              zipCode: '06000'
            },
            environmentalImpact: {
              co2Reduced: 342,
              treesPlanted: 5,
              waterSaved: 7118,
              plasticReduced: 142
            }
          }
          setOrderDetails(mockOrder)
          setIsLoading(false)
        }, 1000)

      } catch (error) {
        console.error('Error fetching order details:', error)
        setIsLoading(false)
      }
    }

    fetchOrderDetails()
  }, [orderId, session, router])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Cargando detalles del pedido...</p>
          </div>
        </div>
      </div>
    )
  }

  if (!orderDetails) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-2xl mx-auto px-4 py-16 text-center">
          <div className="text-red-500 mb-4">
            <Package className="w-16 h-16 mx-auto" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Pedido no encontrado
          </h1>
          <p className="text-gray-600 mb-8">
            No pudimos encontrar los detalles de tu pedido.
          </p>
          <Link href="/dashboard/user/orders">
            <Button className="bg-green-600 hover:bg-green-700">
              Ver mis pedidos
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-MX', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-6">
            <div className="flex items-center justify-center w-20 h-20 bg-green-600 rounded-full">
              <CheckCircle className="w-10 h-10 text-white" />
            </div>
          </div>

          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            ¡Pedido Confirmado!
          </h1>

          <p className="text-lg text-gray-600 mb-2">
            Gracias por tu compra sostenible
          </p>

          <div className="flex items-center justify-center space-x-4 text-sm text-gray-500">
            <span className="flex items-center">
              <Calendar className="w-4 h-4 mr-1" />
              {formatDate(orderDetails.createdAt)}
            </span>
            <Separator orientation="vertical" className="h-4" />
            <span className="flex items-center">
              <Package className="w-4 h-4 mr-1" />
              {orderDetails.orderNumber}
            </span>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Button variant="outline" className="flex items-center justify-center space-x-2">
            <Download className="w-4 h-4" />
            <span>Descargar Recibo</span>
          </Button>
          <Button variant="outline" className="flex items-center justify-center space-x-2">
            <Smartphone className="w-4 h-4" />
            <span>Añadir a Calendario</span>
          </Button>
          <Button variant="outline" className="flex items-center justify-center space-x-2">
            <Share2 className="w-4 h-4" />
            <span>Compartir</span>
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Status */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Package className="w-5 h-5 mr-2" />
                  Estado del Pedido
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="font-semibold text-gray-900">Pedido Confirmado</p>
                    <p className="text-sm text-gray-600">
                      Tu pedido ha sido recibido y está siendo procesado
                    </p>
                  </div>
                  <Badge className="bg-green-100 text-green-800">
                    Confirmado
                  </Badge>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm text-gray-600">Pedido recibido</span>
                    <span className="text-xs text-gray-400">Ahora</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                    <span className="text-sm text-gray-500">Procesando</span>
                    <span className="text-xs text-gray-400">1-2 días</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                    <span className="text-sm text-gray-500">En camino</span>
                    <span className="text-xs text-gray-400">3-4 días</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                    <span className="text-sm text-gray-500">Entregado</span>
                    <span className="text-xs text-gray-400">5 días</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Products Ordered */}
            <Card>
              <CardHeader>
                <CardTitle>Productos Ordenados</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {orderDetails.items.map((item) => (
                    <div key={item.id} className="flex items-center space-x-4">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900">{item.name}</h3>
                        <p className="text-sm text-gray-600">Por {item.vendor}</p>
                        <p className="text-sm text-gray-500">Cantidad: {item.quantity}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gray-900">
                          ${(item.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Shipping Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Truck className="w-5 h-5 mr-2" />
                  Información de Envío
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-medium text-gray-900 mb-2">Dirección de Entrega</h3>
                    <div className="text-sm text-gray-600 space-y-1">
                      <p className="font-medium text-gray-900">
                        {orderDetails.shippingAddress.firstName} {orderDetails.shippingAddress.lastName}
                      </p>
                      <p>{orderDetails.shippingAddress.street}</p>
                      <p>
                        {orderDetails.shippingAddress.city}, {orderDetails.shippingAddress.state} {orderDetails.shippingAddress.zipCode}
                      </p>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900 mb-2">Detalles del Envío</h3>
                    <div className="text-sm text-gray-600 space-y-1">
                      <p><span className="font-medium">Método:</span> Envío Estándar</p>
                      <p><span className="font-medium">Tiempo:</span> 3-5 días hábiles</p>
                      <p><span className="font-medium">Entrega estimada:</span></p>
                      <p className="font-medium text-gray-900">
                        {formatDate(orderDetails.estimatedDelivery)}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Environmental Impact */}
            <Card className="bg-gradient-to-br from-green-50 to-blue-50 border-green-200">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Leaf className="w-5 h-5 text-green-600 mr-2" />
                  Tu Impacto Positivo
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center p-3 bg-white/70 rounded-lg">
                    <div className="text-2xl font-bold text-green-800">
                      {orderDetails.environmentalImpact.co2Reduced}kg
                    </div>
                    <div className="text-sm text-green-600">CO₂ reducido</div>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <div className="text-center p-2 bg-white/70 rounded-lg">
                      <div className="text-lg font-bold text-green-800">
                        {orderDetails.environmentalImpact.treesPlanted}
                      </div>
                      <div className="text-xs text-green-600">árboles</div>
                    </div>
                    <div className="text-center p-2 bg-white/70 rounded-lg">
                      <div className="text-lg font-bold text-blue-800">
                        {orderDetails.environmentalImpact.waterSaved}L
                      </div>
                      <div className="text-xs text-blue-600">agua</div>
                    </div>
                    <div className="text-center p-2 bg-white/70 rounded-lg">
                      <div className="text-lg font-bold text-purple-800">
                        {orderDetails.environmentalImpact.plasticReduced}kg
                      </div>
                      <div className="text-xs text-purple-600">plástico</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Next Steps */}
            <Card>
              <CardHeader>
                <CardTitle>Próximos Pasos</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start space-x-3">
                  <Mail className="w-5 h-5 text-blue-500 mt-0.5" />
                  <div>
                    <p className="font-medium text-gray-900">Confirmación por Email</p>
                    <p className="text-sm text-gray-600">
                      Recibirás un email con todos los detalles
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Smartphone className="w-5 h-5 text-green-500 mt-0.5" />
                  <div>
                    <p className="font-medium text-gray-900">Seguimiento</p>
                    <p className="text-sm text-gray-600">
                      Te enviaremos el código de seguimiento
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Gift className="w-5 h-5 text-purple-500 mt-0.5" />
                  <div>
                    <p className="font-medium text-gray-900">Puntos REGEN</p>
                    <p className="text-sm text-gray-600">
                      Ganaste 285 puntos con esta compra
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Order Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Resumen del Pedido</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span>${(orderDetails.total / 1.16).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Envío</span>
                    <span className="text-green-600">Gratis</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">IVA</span>
                    <span>${(orderDetails.total - (orderDetails.total / 1.16)).toFixed(2)}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-semibold">
                    <span>Total</span>
                    <span>${orderDetails.total.toFixed(2)} MXN</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Support */}
            <Card>
              <CardContent className="p-4 text-center">
                <h3 className="font-medium text-gray-900 mb-2">¿Necesitas Ayuda?</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Nuestro equipo está aquí para apoyarte
                </p>
                <Button variant="outline" className="w-full">
                  Contactar Soporte
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
          <Link href="/marketplace">
            <Button variant="outline" className="flex items-center">
              Seguir Comprando
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
          <Link href="/dashboard/user/orders">
            <Button className="bg-green-600 hover:bg-green-700 flex items-center">
              Ver Mis Pedidos
              <Package className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>

        {/* Social Sharing */}
        <div className="text-center mt-8 p-6 bg-blue-50 rounded-lg">
          <h3 className="font-semibold text-blue-900 mb-2">
            🌍 ¡Comparte tu Impacto Positivo!
          </h3>
          <p className="text-blue-700 mb-4">
            Cuéntale al mundo sobre tu compra sostenible y motiva a otros a unirse al movimiento
          </p>
          <div className="flex justify-center space-x-4">
            <Button variant="outline" size="sm">
              <Share2 className="w-4 h-4 mr-2" />
              Twitter
            </Button>
            <Button variant="outline" size="sm">
              <Share2 className="w-4 h-4 mr-2" />
              Facebook
            </Button>
            <Button variant="outline" size="sm">
              <Share2 className="w-4 h-4 mr-2" />
              Instagram
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}