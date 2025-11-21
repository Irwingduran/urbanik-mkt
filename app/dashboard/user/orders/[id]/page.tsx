"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { DashboardLayout, DashboardHeader } from "@/components/shared/layout/DashboardLayout"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import {
  ArrowLeft,
  Package,
  Truck,
  MapPin,
  CreditCard,
  Calendar,
  Leaf,
  Droplets,
  Zap,
  AlertCircle,
  XCircle,
  CheckCircle,
  Clock,
  RefreshCw,
  Star
} from "lucide-react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

interface OrderDetail {
  id: string
  createdAt: string
  status: string
  total: number
  subtotal: number
  tax: number
  shippingCost: number
  items: {
    id: string
    quantity: number
    price: number
    product: {
      id: string
      name: string
      images: string[]
    }
  }[]
  shippingAddress: {
    street: string
    city: string
    state: string
    zipCode: string
    country: string
  }
  paymentMethod: string
  trackingNumber?: string
  estimatedDelivery?: string
  actualDelivery?: string
  vendorProfile: {
    companyName: string
    user: {
      name: string
      email: string
    }
  }
  environmentalImpact: {
    co2Saved: number
    waterSaved: number
    energyGenerated: number
  }
}

const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case "delivered":
      return "bg-green-100 text-green-800"
    case "shipped":
      return "bg-blue-100 text-blue-800"
    case "processing":
      return "bg-yellow-100 text-yellow-800"
    case "pending":
      return "bg-gray-100 text-gray-800"
    case "cancelled":
      return "bg-red-100 text-red-800"
    default:
      return "bg-gray-100 text-gray-800"
  }
}

const getStatusLabel = (status: string) => {
  switch (status.toLowerCase()) {
    case "delivered": return "Entregado"
    case "shipped": return "Enviado"
    case "processing": return "Procesando"
    case "pending": return "Pendiente"
    case "cancelled": return "Cancelado"
    default: return status
  }
}

export default function OrderDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const [order, setOrder] = useState<OrderDetail | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")
  const [isCancelling, setIsCancelling] = useState(false)

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await fetch(`/api/user/orders/${params.id}`)
        if (!response.ok) {
          throw new Error('No se pudo cargar el pedido')
        }
        const data = await response.json()
        if (data.success) {
          setOrder(data.data)
        } else {
          throw new Error(data.error || 'Error desconocido')
        }
      } catch (err) {
        console.error(err)
        setError('Error al cargar los detalles del pedido.')
      } finally {
        setIsLoading(false)
      }
    }

    if (params.id) {
      fetchOrder()
    }
  }, [params.id])

  const handleCancelOrder = async () => {
    if (!order) return
    setIsCancelling(true)
    try {
      const response = await fetch(`/api/user/orders/${order.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'cancel', reason: 'User requested cancellation' })
      })
      
      const data = await response.json()
      if (data.success) {
        setOrder({ ...order, status: 'CANCELLED' })
      } else {
        alert('No se pudo cancelar el pedido: ' + data.error)
      }
    } catch (err) {
      console.error(err)
      alert('Error al conectar con el servidor')
    } finally {
      setIsCancelling(false)
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

  if (error || !order) {
    return (
      <DashboardLayout>
        <div className="p-6">
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative" role="alert">
            <strong className="font-bold">Error: </strong>
            <span className="block sm:inline">{error || "Pedido no encontrado"}</span>
          </div>
          <Button variant="outline" className="mt-4" onClick={() => router.back()}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver
          </Button>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <DashboardHeader
        title={`Pedido #${order.id.slice(-8)}`}
        subtitle={`Realizado el ${new Date(order.createdAt).toLocaleDateString()}`}
        breadcrumbs={[
          { label: 'Dashboard', href: '/dashboard' },
          { label: 'Mis Pedidos', href: '/dashboard/user/orders' },
          { label: `#${order.id.slice(-8)}` }
        ]}
        actions={
          <Button variant="outline" onClick={() => router.back()}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver
          </Button>
        }
      />

      <div className="p-6 space-y-6">
        {/* Status Banner */}
        <div className={`p-4 rounded-lg border flex items-center justify-between ${getStatusColor(order.status)} bg-opacity-10 border-opacity-20`}>
          <div className="flex items-center space-x-3">
            {order.status === 'DELIVERED' ? <CheckCircle className="w-6 h-6" /> :
             order.status === 'CANCELLED' ? <XCircle className="w-6 h-6" /> :
             order.status === 'SHIPPED' ? <Truck className="w-6 h-6" /> :
             <Clock className="w-6 h-6" />}
            <div>
              <h3 className="font-medium text-lg">Estado: {getStatusLabel(order.status)}</h3>
              {order.estimatedDelivery && order.status !== 'DELIVERED' && order.status !== 'CANCELLED' && (
                <p className="text-sm opacity-80">Entrega estimada: {new Date(order.estimatedDelivery).toLocaleDateString()}</p>
              )}
            </div>
          </div>
          {order.status === 'PENDING' && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" size="sm" disabled={isCancelling}>
                  Cancelar Pedido
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Esta acción cancelará tu pedido y se iniciará el proceso de reembolso si corresponde. Esta acción no se puede deshacer.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Volver</AlertDialogCancel>
                  <AlertDialogAction onClick={handleCancelOrder} className="bg-red-600 hover:bg-red-700">
                    {isCancelling ? 'Cancelando...' : 'Sí, Cancelar'}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}

          {order.status === 'DELIVERED' && (
            <Button 
              className="bg-yellow-500 hover:bg-yellow-600 text-white"
              onClick={() => router.push(`/dashboard/user/orders/${order.id}/review`)}
            >
              <Star className="w-4 h-4 mr-2" />
              Calificar Productos
            </Button>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Items & Shipping */}
          <div className="lg:col-span-2 space-y-6">
            {/* Items */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Package className="w-5 h-5 mr-2" />
                  Productos
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {order.items.map((item) => (
                  <div key={item.id} className="flex items-center space-x-4 py-4 border-b last:border-0">
                    <img
                      src={item.product.images[0] || "/placeholder.svg"}
                      alt={item.product.name}
                      className="w-16 h-16 rounded-lg object-cover bg-gray-100"
                    />
                    <div className="flex-1">
                      <h4 className="font-medium">{item.product.name}</h4>
                      <p className="text-sm text-gray-500">Vendido por: {order.vendorProfile?.companyName}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">${item.price.toFixed(2)}</p>
                      <p className="text-sm text-gray-500">Cant: {item.quantity}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Environmental Impact */}
            <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-100">
              <CardHeader>
                <CardTitle className="flex items-center text-green-800">
                  <Leaf className="w-5 h-5 mr-2" />
                  Impacto Ambiental de este Pedido
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div className="p-3 bg-white/60 rounded-lg">
                    <Droplets className="w-6 h-6 text-blue-500 mx-auto mb-2" />
                    <p className="text-lg font-bold text-gray-800">{order.environmentalImpact.waterSaved} L</p>
                    <p className="text-xs text-gray-600">Agua Ahorrada</p>
                  </div>
                  <div className="p-3 bg-white/60 rounded-lg">
                    <Zap className="w-6 h-6 text-yellow-500 mx-auto mb-2" />
                    <p className="text-lg font-bold text-gray-800">{order.environmentalImpact.energyGenerated} kWh</p>
                    <p className="text-xs text-gray-600">Energía Generada</p>
                  </div>
                  <div className="p-3 bg-white/60 rounded-lg">
                    <Leaf className="w-6 h-6 text-green-500 mx-auto mb-2" />
                    <p className="text-lg font-bold text-gray-800">{order.environmentalImpact.co2Saved} kg</p>
                    <p className="text-xs text-gray-600">CO₂ Reducido</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column: Summary & Info */}
          <div className="space-y-6">
            {/* Order Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Resumen</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal</span>
                  <span>${order.subtotal?.toFixed(2) || (order.total * 0.84).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Envío</span>
                  <span>${order.shippingCost?.toFixed(2) || "0.00"}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Impuestos</span>
                  <span>${order.tax?.toFixed(2) || (order.total * 0.16).toFixed(2)}</span>
                </div>
                <Separator />
                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span>${order.total.toFixed(2)}</span>
                </div>
              </CardContent>
            </Card>

            {/* Shipping Details */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-base">
                  <MapPin className="w-4 h-4 mr-2" />
                  Dirección de Envío
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-gray-600 space-y-1">
                {order.shippingAddress ? (
                  <>
                    <p>{order.shippingAddress.street}</p>
                    <p>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}</p>
                    <p>{order.shippingAddress.country || 'México'}</p>
                  </>
                ) : (
                  <p>Dirección no disponible</p>
                )}
              </CardContent>
            </Card>

            {/* Payment Details */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-base">
                  <CreditCard className="w-4 h-4 mr-2" />
                  Pago
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-gray-600">
                <p className="capitalize">{order.paymentMethod?.replace('_', ' ') || 'Tarjeta de Crédito'}</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
