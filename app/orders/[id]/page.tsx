"use client"

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useParams, useRouter } from 'next/navigation'
import {
  Package,
  Truck,
  CheckCircle,
  XCircle,
  Clock,
  ArrowLeft,
  Leaf,
  RotateCcw,
  MapPin,
  CreditCard,
  Copy,
  Star,
  MessageSquare,
  Download,
  ExternalLink
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Progress } from '@/components/ui/progress'
import Header from '@/components/layout/header'
import Link from 'next/link'

interface OrderDetails {
  id: string
  status: string
  total: number
  subtotal: number
  tax: number
  shipping: number
  paymentMethod: string
  paymentStatus: string
  trackingNumber?: string
  estimatedDelivery?: string
  actualDelivery?: string
  shippingAddress: {
    name: string
    street: string
    city: string
    state: string
    zipCode: string
    country: string
  }
  createdAt: string
  updatedAt: string
  user: {
    id: string
    name: string
    email: string
  }
  vendor: {
    id: string
    companyName: string
    user: { name: string }
  }
  items: Array<{
    id: string
    quantity: number
    price: number
    total: number
    product: {
      id: string
      name: string
      images: string[]
      regenScore: number
      certifications: string[]
    }
  }>
  environmentalImpact: {
    co2Saved: number
    waterSaved: number
    energyGenerated: number
  }
  itemCount: number
  totalRegenScore: number
}

const statusConfig = {
  PENDING: {
    icon: Clock,
    color: 'bg-yellow-100 text-yellow-800',
    label: 'Pendiente',
    progress: 25
  },
  PROCESSING: {
    icon: Package,
    color: 'bg-blue-100 text-blue-800',
    label: 'Procesando',
    progress: 50
  },
  SHIPPED: {
    icon: Truck,
    color: 'bg-purple-100 text-purple-800',
    label: 'Enviado',
    progress: 75
  },
  DELIVERED: {
    icon: CheckCircle,
    color: 'bg-green-100 text-green-800',
    label: 'Entregado',
    progress: 100
  },
  CANCELLED: {
    icon: XCircle,
    color: 'bg-red-100 text-red-800',
    label: 'Cancelado',
    progress: 0
  },
  RETURNED: {
    icon: RotateCcw,
    color: 'bg-gray-100 text-gray-800',
    label: 'Devuelto',
    progress: 0
  }
}

const statusSteps = [
  { key: 'PENDING', label: 'Pendiente' },
  { key: 'PROCESSING', label: 'Procesando' },
  { key: 'SHIPPED', label: 'Enviado' },
  { key: 'DELIVERED', label: 'Entregado' }
]

export default function OrderDetailsPage() {
  const { data: session } = useSession()
  const params = useParams()
  const router = useRouter()
  const [order, setOrder] = useState<OrderDetails | null>(null)
  const [loading, setLoading] = useState(true)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (session && params.id) {
      fetchOrderDetails()
    }
  }, [session, params.id])

  const fetchOrderDetails = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/orders/${params.id}`)
      const data = await response.json()

      if (data.success) {
        setOrder(data.data)
      } else {
        console.error('Error fetching order:', data.error)
        if (response.status === 404) {
          router.push('/orders')
        }
      }
    } catch (error) {
      console.error('Error fetching order:', error)
    } finally {
      setLoading(false)
    }
  }

  const copyTrackingNumber = () => {
    if (order?.trackingNumber) {
      navigator.clipboard.writeText(order.trackingNumber)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-MX', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getStatusIcon = (status: string) => {
    const config = statusConfig[status as keyof typeof statusConfig]
    if (!config) return Clock
    return config.icon
  }

  const getStatusColor = (status: string) => {
    const config = statusConfig[status as keyof typeof statusConfig]
    return config?.color || 'bg-gray-100 text-gray-800'
  }

  const getStatusLabel = (status: string) => {
    const config = statusConfig[status as keyof typeof statusConfig]
    return config?.label || status
  }

  const getStatusProgress = (status: string) => {
    const config = statusConfig[status as keyof typeof statusConfig]
    return config?.progress || 0
  }

  const getCurrentStepIndex = (status: string) => {
    return statusSteps.findIndex(step => step.key === status)
  }

  if (!session) {
    router.push('/auth/signin')
    return null
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Cargando detalles del pedido...</p>
          </div>
        </div>
      </div>
    )
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-12">
            <Package className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Pedido no encontrado</h3>
            <p className="text-gray-600 mb-6">El pedido que buscas no existe o no tienes permisos para verlo.</p>
            <Link href="/orders">
              <Button className="bg-green-600 hover:bg-green-700 text-white">
                Volver a Mis Pedidos
              </Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const StatusIcon = getStatusIcon(order.status)
  const currentStepIndex = getCurrentStepIndex(order.status)

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <Link href="/orders">
              <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-900">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Volver a Mis Pedidos
              </Button>
            </Link>
            <div className="text-right">
              <h1 className="text-2xl font-bold text-gray-900">
                Pedido #{order.id.slice(-8).toUpperCase()}
              </h1>
              <p className="text-gray-600">
                Realizado el {formatDate(order.createdAt)}
              </p>
            </div>
          </div>

          {/* Status Progress */}
          {!['CANCELLED', 'RETURNED'].includes(order.status) && (
            <Card className="mb-6">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Estado del Pedido</h3>
                  <Badge className={getStatusColor(order.status)}>
                    <StatusIcon className="w-3 h-3 mr-1" />
                    {getStatusLabel(order.status)}
                  </Badge>
                </div>
                <div className="relative">
                  <Progress value={getStatusProgress(order.status)} className="h-2 mb-4" />
                  <div className="flex justify-between">
                    {statusSteps.map((step, index) => (
                      <div key={step.key} className="flex flex-col items-center">
                        <div
                          className={`w-3 h-3 rounded-full ${
                            index <= currentStepIndex
                              ? 'bg-green-600'
                              : 'bg-gray-300'
                          }`}
                        />
                        <span className={`text-xs mt-1 ${
                          index <= currentStepIndex
                            ? 'text-green-600 font-medium'
                            : 'text-gray-500'
                        }`}>
                          {step.label}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Items */}
            <Card>
              <CardHeader>
                <CardTitle>Productos Pedidos ({order.itemCount})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex items-center space-x-4 p-4 border rounded-lg">
                      <div className="w-16 h-16 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                        <img
                          src={item.product.images[0] || '/placeholder.svg'}
                          alt={item.product.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900">{item.product.name}</h4>
                        <div className="flex items-center space-x-2 mt-1">
                          <Badge variant="secondary" className="text-xs">
                            REGEN Score: {item.product.regenScore}
                          </Badge>
                          {item.product.certifications.slice(0, 2).map((cert) => (
                            <Badge key={cert} variant="outline" className="text-xs">
                              {cert}
                            </Badge>
                          ))}
                        </div>
                        <p className="text-sm text-gray-600 mt-1">
                          ${item.price.toFixed(2)} × {item.quantity}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-lg">${item.total.toFixed(2)}</p>
                        <Link href={`/marketplace/products/${item.product.id}`}>
                          <Button variant="ghost" size="sm" className="text-xs">
                            <ExternalLink className="w-3 h-3 mr-1" />
                            Ver Producto
                          </Button>
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Environmental Impact */}
            <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
              <CardHeader>
                <CardTitle className="flex items-center text-green-900">
                  <Leaf className="w-5 h-5 mr-2" />
                  Impacto Ambiental de tu Compra
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-700">
                      {order.environmentalImpact.co2Saved.toFixed(1)}kg
                    </div>
                    <div className="text-sm text-green-600">CO₂ Reducido</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-700">
                      {order.environmentalImpact.waterSaved.toFixed(0)}L
                    </div>
                    <div className="text-sm text-blue-600">Agua Ahorrada</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-700">
                      {order.totalRegenScore}
                    </div>
                    <div className="text-sm text-green-600">Puntos REGEN Obtenidos</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Shipping Tracking */}
            {order.trackingNumber && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Truck className="w-5 h-5 mr-2" />
                    Información de Envío
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700">Número de Seguimiento</label>
                      <div className="flex items-center space-x-2 mt-1">
                        <code className="text-sm bg-gray-100 px-2 py-1 rounded font-mono">
                          {order.trackingNumber}
                        </code>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={copyTrackingNumber}
                          className="text-xs"
                        >
                          <Copy className="w-3 h-3 mr-1" />
                          {copied ? 'Copiado' : 'Copiar'}
                        </Button>
                      </div>
                    </div>
                    {order.estimatedDelivery && (
                      <div>
                        <label className="text-sm font-medium text-gray-700">Entrega Estimada</label>
                        <p className="text-sm text-gray-900 mt-1">
                          {formatDate(order.estimatedDelivery)}
                        </p>
                      </div>
                    )}
                    {order.actualDelivery && (
                      <div>
                        <label className="text-sm font-medium text-gray-700">Entregado</label>
                        <p className="text-sm text-gray-900 mt-1">
                          {formatDate(order.actualDelivery)}
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Order Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Resumen del Pedido</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Subtotal:</span>
                    <span>${order.subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Envío:</span>
                    <span className={order.shipping === 0 ? 'text-green-600' : ''}>
                      {order.shipping === 0 ? 'Gratis' : `$${order.shipping.toFixed(2)}`}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Impuestos:</span>
                    <span>${order.tax.toFixed(2)}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between text-lg font-semibold">
                    <span>Total:</span>
                    <span>${order.total.toFixed(2)} MXN</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Payment Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CreditCard className="w-5 h-5 mr-2" />
                  Información de Pago
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div>
                    <span className="text-sm text-gray-600">Método de pago:</span>
                    <p className="font-medium">{order.paymentMethod}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600">Estado del pago:</span>
                    <Badge
                      className={
                        order.paymentStatus === 'PAID'
                          ? 'bg-green-100 text-green-800'
                          : order.paymentStatus === 'FAILED'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }
                    >
                      {order.paymentStatus === 'PAID' ? 'Pagado' :
                       order.paymentStatus === 'FAILED' ? 'Fallido' : 'Pendiente'}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Shipping Address */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MapPin className="w-5 h-5 mr-2" />
                  Dirección de Envío
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-sm space-y-1">
                  <p className="font-medium">{order.shippingAddress.name}</p>
                  <p>{order.shippingAddress.street}</p>
                  <p>
                    {order.shippingAddress.city}, {order.shippingAddress.state}
                  </p>
                  <p>
                    {order.shippingAddress.zipCode}, {order.shippingAddress.country}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Vendor Information */}
            <Card>
              <CardHeader>
                <CardTitle>Información del Vendedor</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="font-medium">{order.vendor.companyName}</p>
                  <p className="text-sm text-gray-600">
                    Por {order.vendor.user.name}
                  </p>
                  <div className="flex space-x-2 mt-3">
                    <Button variant="outline" size="sm" className="flex-1">
                      <MessageSquare className="w-4 h-4 mr-1" />
                      Contactar
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Actions */}
            {order.status === 'DELIVERED' && (
              <Card>
                <CardHeader>
                  <CardTitle>Acciones</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button variant="outline" className="w-full">
                    <Star className="w-4 h-4 mr-2" />
                    Escribir Reseña
                  </Button>
                  <Button variant="outline" className="w-full">
                    <Download className="w-4 h-4 mr-2" />
                    Descargar Factura
                  </Button>
                  <Button variant="outline" className="w-full">
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Solicitar Devolución
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}