import { useEffect, useState, useCallback } from 'react'
import { useSession } from 'next-auth/react'

export interface Notification {
  id: string
  userId: string
  productId: string | null
  orderId: string | null
  type: string
  title: string
  message: string
  read: boolean
  actionUrl: string | null
  createdAt: string
  product?: {
    id: string
    name: string
    images: string[]
  } | null
}

export interface NotificationsData {
  notifications: Notification[]
  unreadCount: number
  isLoading: boolean
  error: string | null
  refetch: () => Promise<void>
  markAsRead: (notificationIds: string[]) => Promise<void>
  markAllAsRead: () => Promise<void>
  deleteNotification: (notificationId: string) => Promise<void>
}

export function useNotifications(autoRefresh = false): NotificationsData {
  const { data: session, status: sessionStatus } = useSession()
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchNotifications = useCallback(async () => {
    // Don't fetch if not authenticated
    if (sessionStatus !== 'authenticated' || !session?.user) {
      setIsLoading(false)
      return
    }

    try {
      setIsLoading(true)
      setError(null)

      const response = await fetch('/api/notifications?limit=50')

      if (!response.ok) {
        if (response.status === 401) {
          setError('No autenticado')
          return
        }
        throw new Error('Failed to fetch notifications')
      }

      const data = await response.json()

      if (data.success) {
        setNotifications(data.data || [])
        setUnreadCount(data.meta?.unread || 0)
      }
    } catch (err) {
      console.error('Error fetching notifications:', err)
      setError(err instanceof Error ? err.message : 'Error desconocido')
    } finally {
      setIsLoading(false)
    }
  }, [session, sessionStatus])

  const markAsRead = useCallback(async (notificationIds: string[]) => {
    if (notificationIds.length === 0) return

    try {
      const response = await fetch('/api/notifications', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
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
    } catch (err) {
      console.error('Error marking notifications as read:', err)
    }
  }, [])

  const markAllAsRead = useCallback(async () => {
    try {
      const response = await fetch('/api/notifications', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ markAllAsRead: true })
      })

      if (response.ok) {
        // Update local state
        setNotifications(prev =>
          prev.map(notif => ({ ...notif, read: true }))
        )
        setUnreadCount(0)
      }
    } catch (err) {
      console.error('Error marking all notifications as read:', err)
    }
  }, [])

  const deleteNotification = useCallback(async (notificationId: string) => {
    try {
      const response = await fetch(`/api/notifications?id=${notificationId}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        // Update local state
        setNotifications(prev => {
          const deleted = prev.find(n => n.id === notificationId)
          if (deleted && !deleted.read) {
            setUnreadCount(count => Math.max(0, count - 1))
          }
          return prev.filter(n => n.id !== notificationId)
        })
      }
    } catch (err) {
      console.error('Error deleting notification:', err)
    }
  }, [])

  // Initial fetch
  useEffect(() => {
    fetchNotifications()
  }, [fetchNotifications])

  // Auto-refresh every 30 seconds if enabled
  useEffect(() => {
    if (!autoRefresh) return

    const interval = setInterval(() => {
      fetchNotifications()
    }, 30000) // 30 seconds

    return () => clearInterval(interval)
  }, [autoRefresh, fetchNotifications])

  return {
    notifications,
    unreadCount,
    isLoading,
    error,
    refetch: fetchNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification
  }
}
