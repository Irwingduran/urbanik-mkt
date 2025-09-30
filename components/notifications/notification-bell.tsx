"use client"

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import {
  Bell,
  Package,
  Truck,
  CheckCircle,
  XCircle,
  DollarSign,
  AlertTriangle,
  Star,
  Leaf,
  Clock,
  Trash2,
  CheckCheck
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { ScrollArea } from '@/components/ui/scroll-area'
import Link from 'next/link'

interface Notification {
  id: string
  type: string
  title: string
  message: string
  read: boolean
  actionUrl?: string
  createdAt: string
  orderId?: string
  productId?: string
  product?: {
    id: string
    name: string
    images: string[]
  }
}

const notificationIcons = {
  ORDER_CREATED: Package,
  ORDER_UPDATED: Package,
  ORDER_SHIPPED: Truck,
  ORDER_DELIVERED: CheckCircle,
  ORDER_CANCELLED: XCircle,
  PAYMENT_SUCCESS: DollarSign,
  PAYMENT_FAILED: XCircle,
  STOCK_LOW: AlertTriangle,
  PRODUCT_REVIEW: Star,
  PRICE_ALERT: DollarSign,
  MARKETING: Leaf,
  SYSTEM: AlertTriangle
}

const notificationColors = {
  ORDER_CREATED: 'text-blue-600',
  ORDER_UPDATED: 'text-blue-600',
  ORDER_SHIPPED: 'text-purple-600',
  ORDER_DELIVERED: 'text-green-600',
  ORDER_CANCELLED: 'text-red-600',
  PAYMENT_SUCCESS: 'text-green-600',
  PAYMENT_FAILED: 'text-red-600',
  STOCK_LOW: 'text-yellow-600',
  PRODUCT_REVIEW: 'text-yellow-500',
  PRICE_ALERT: 'text-green-600',
  MARKETING: 'text-green-600',
  SYSTEM: 'text-gray-600'
}

export default function NotificationBell() {
  const { data: session } = useSession()
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (session) {
      fetchNotifications()
      // Set up polling for new notifications every 30 seconds
      const interval = setInterval(fetchNotifications, 30000)
      return () => clearInterval(interval)
    }
  }, [session])

  const fetchNotifications = async () => {
    try {
      const response = await fetch('/api/notifications?limit=20')
      const data = await response.json()

      if (data.success) {
        setNotifications(data.data)
        setUnreadCount(data.meta.unread)
      }
    } catch (error) {
      console.error('Error fetching notifications:', error)
    }
  }

  const markAsRead = async (notificationIds: string[]) => {
    try {
      setLoading(true)
      const response = await fetch('/api/notifications', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ notificationIds })
      })

      if (response.ok) {
        // Update local state
        setNotifications(prev =>
          prev.map(notif =>
            notificationIds.includes(notif.id)
              ? { ...notif, read: true }
              : notif
          )
        )
        setUnreadCount(prev => Math.max(0, prev - notificationIds.length))
      }
    } catch (error) {
      console.error('Error marking notifications as read:', error)
    } finally {
      setLoading(false)
    }
  }

  const markAllAsRead = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/notifications', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ markAllAsRead: true })
      })

      if (response.ok) {
        setNotifications(prev =>
          prev.map(notif => ({ ...notif, read: true }))
        )
        setUnreadCount(0)
      }
    } catch (error) {
      console.error('Error marking all notifications as read:', error)
    } finally {
      setLoading(false)
    }
  }

  const deleteNotification = async (notificationId: string) => {
    try {
      const response = await fetch(`/api/notifications?id=${notificationId}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        setNotifications(prev => prev.filter(notif => notif.id !== notificationId))
        // Update unread count if the deleted notification was unread
        const deletedNotification = notifications.find(n => n.id === notificationId)
        if (deletedNotification && !deletedNotification.read) {
          setUnreadCount(prev => Math.max(0, prev - 1))
        }
      }
    } catch (error) {
      console.error('Error deleting notification:', error)
    }
  }

  const handleNotificationClick = (notification: Notification) => {
    // Mark as read if unread
    if (!notification.read) {
      markAsRead([notification.id])
    }

    // Close dropdown
    setIsOpen(false)

    // Navigate if there's an action URL
    if (notification.actionUrl) {
      window.location.href = notification.actionUrl
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - date.getTime())
    const diffMinutes = Math.ceil(diffTime / (1000 * 60))
    const diffHours = Math.ceil(diffTime / (1000 * 60 * 60))
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    if (diffMinutes < 60) {
      return `hace ${diffMinutes} min`
    } else if (diffHours < 24) {
      return `hace ${diffHours}h`
    } else if (diffDays < 7) {
      return `hace ${diffDays}d`
    } else {
      return date.toLocaleDateString('es-MX', {
        month: 'short',
        day: 'numeric'
      })
    }
  }

  if (!session) {
    return null
  }

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
            >
              {unreadCount > 99 ? '99+' : unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <DropdownMenuLabel className="flex items-center justify-between">
          <span>Notificaciones</span>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={markAllAsRead}
              disabled={loading}
              className="text-xs"
            >
              <CheckCheck className="h-3 w-3 mr-1" />
              Marcar todas como leídas
            </Button>
          )}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />

        <ScrollArea className="h-[400px]">
          {notifications.length === 0 ? (
            <div className="p-4 text-center text-gray-500">
              <Bell className="h-8 w-8 mx-auto mb-2 text-gray-400" />
              <p className="text-sm">No tienes notificaciones</p>
            </div>
          ) : (
            <div className="space-y-1">
              {notifications.map((notification) => {
                const IconComponent = notificationIcons[notification.type as keyof typeof notificationIcons] || Bell
                const iconColor = notificationColors[notification.type as keyof typeof notificationColors] || 'text-gray-600'

                return (
                  <div
                    key={notification.id}
                    className={`relative p-3 hover:bg-gray-50 cursor-pointer border-l-2 ${
                      notification.read
                        ? 'border-transparent bg-white'
                        : 'border-blue-500 bg-blue-50'
                    }`}
                    onClick={() => handleNotificationClick(notification)}
                  >
                    <div className="flex items-start space-x-3">
                      <div className={`flex-shrink-0 ${iconColor}`}>
                        <IconComponent className="h-4 w-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm ${notification.read ? 'text-gray-700' : 'text-gray-900 font-medium'}`}>
                          {notification.title}
                        </p>
                        <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                          {notification.message}
                        </p>
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-xs text-gray-400">
                            {formatDate(notification.createdAt)}
                          </span>
                          {!notification.read && (
                            <div className="h-2 w-2 bg-blue-500 rounded-full"></div>
                          )}
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation()
                          deleteNotification(notification.id)
                        }}
                        className="opacity-0 group-hover:opacity-100 transition-opacity h-6 w-6 p-0"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>

                    {notification.product && (
                      <div className="flex items-center space-x-2 mt-2 p-2 bg-gray-50 rounded text-xs">
                        <img
                          src={notification.product.images[0] || '/placeholder.svg'}
                          alt={notification.product.name}
                          className="h-6 w-6 object-cover rounded"
                        />
                        <span className="text-gray-600 truncate">
                          {notification.product.name}
                        </span>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </ScrollArea>

        {notifications.length > 0 && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/notifications" className="text-center w-full">
                Ver todas las notificaciones
              </Link>
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}