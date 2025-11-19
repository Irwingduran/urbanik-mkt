'use client'

import React, { ReactNode, useCallback } from 'react'
import { useSession, signOut } from 'next-auth/react'
import type { Session } from 'next-auth'
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  BarChart3,
  Settings,
  Store,
  FileText,
  User,
  Leaf,
  Bell,
  LogOut,
  X,
  CheckCircle,
  AlertCircle,
  Info,
  Menu,
  Plus,
  TrendingUp
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from '@/lib/utils'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useNotifications } from '@/hooks/useNotifications'
import { Notification, NotificationType } from '@/types/notifications'

// ============================================================================
// TYPES & CONSTANTES
// ============================================================================

interface NavItem {
  label: string
  href: string
  icon: React.ComponentType<{ className?: string }>
  badge?: string | number
  ariaLabel?: string
}

interface VendorDashboardLayoutProps {
  children: ReactNode
  className?: string
}

interface VendorDashboardHeaderProps {
  title: string
  subtitle?: string
  action?: ReactNode
  breadcrumbs?: { label: string; href?: string }[]
}

// ============================================================================
// CONFIGURACIÓN DE NAVEGACIÓN
// ============================================================================

const vendorNavigationItems: NavItem[] = [
  { label: 'Panel de Control', href: '/dashboard/vendor', icon: LayoutDashboard, ariaLabel: 'Ir al panel de control' },
  { label: 'Inventario', href: '/dashboard/vendor/inventory', icon: Package, ariaLabel: 'Gestionar inventario' },
  { label: 'Pedidos', href: '/dashboard/vendor/orders', icon: ShoppingCart, ariaLabel: 'Ver pedidos' },
  { label: 'RegenMarks', href: '/dashboard/vendor/regenmarks', icon: Leaf, ariaLabel: 'Mis certificaciones de sostenibilidad' },
  { label: 'Clientes', href: '/dashboard/vendor/customers', icon: Users, ariaLabel: 'Ver clientes' },
  { label: 'Analíticas', href: '/dashboard/vendor/analytics', icon: BarChart3, ariaLabel: 'Ver analíticas' },
  { label: 'Reportes', href: '/dashboard/vendor/reports', icon: FileText, ariaLabel: 'Ver reportes' },
  { label: 'Perfil de Tienda', href: '/dashboard/vendor/settings', icon: Store, ariaLabel: 'Configurar tienda' }
]

// ============================================================================
// HOOK: SIDEBAR
// ============================================================================

const useSidebar = () => {
  const [isOpen, setIsOpen] = React.useState(false)
  const [isMobile, setIsMobile] = React.useState(false)

  React.useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024)
      if (window.innerWidth >= 1024) {
        setIsOpen(false)
      }
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const toggle = useCallback(() => setIsOpen(p => !p), [])
  const close = useCallback(() => setIsOpen(false), [])

  return { isOpen, isMobile, toggle, close }
}

// ============================================================================
// UTILIDADES NOTIFICACIONES
// ============================================================================

const legacyTypeMap = [
  { match: ['SUCCESS', 'DELIVERED', 'APPROVED'], to: NotificationType.SUCCESS },
  { match: ['FAILED', 'CANCELLED', 'REJECTED'], to: NotificationType.ERROR },
  { match: ['WARNING', 'STOCK_LOW', 'IN_REVIEW'], to: NotificationType.WARNING }
]

const getLegacyType = (raw: string): NotificationType => {
  const upper = raw.toUpperCase()
  for (const rule of legacyTypeMap) {
    if (rule.match.some(m => upper.includes(m))) return rule.to
  }
  return NotificationType.INFO
}

const getNotificationIcon = (type: NotificationType) => {
  const iconMap: Record<NotificationType, React.ComponentType<{ className?: string }>> = {
    [NotificationType.SUCCESS]: CheckCircle,
    [NotificationType.WARNING]: AlertCircle,
    [NotificationType.ERROR]: AlertCircle,
    [NotificationType.INFO]: Info
  }
  return iconMap[type]
}

const getNotificationColor = (type: NotificationType) => {
  const colorMap: Record<NotificationType, { bg: string; text: string }> = {
    [NotificationType.SUCCESS]: { bg: 'bg-green-100', text: 'text-green-600' },
    [NotificationType.WARNING]: { bg: 'bg-yellow-100', text: 'text-yellow-600' },
    [NotificationType.ERROR]: { bg: 'bg-red-100', text: 'text-red-600' },
    [NotificationType.INFO]: { bg: 'bg-blue-100', text: 'text-blue-600' }
  }
  return colorMap[type]
}

// ============================================================================
// COMPONENTE: ITEM NOTIFICACIÓN
// ============================================================================

const NotificationItem: React.FC<{
  notification: Notification
  onMarkAsRead: (id: string) => void
  onDelete: (id: string) => void
  navigate?: (href: string) => void
}> = ({ notification, onMarkAsRead, onDelete, navigate }) => {
  const legacyType = getLegacyType(notification.type)
  const Icon = getNotificationIcon(legacyType)
  const colors = getNotificationColor(legacyType)

  const go = (href: string) => {
    if (navigate && !href.startsWith('http')) {
      navigate(href)
    } else {
      window.location.href = href
    }
  }

  return (
    <div
      className={cn(
        "p-4 hover:bg-gray-50 transition-colors relative group cursor-pointer",
        !notification.read && "bg-blue-50/50"
      )}
      onClick={() => {
        if (!notification.read) onMarkAsRead(notification.id)
        if (notification.actionHref) go(notification.actionHref)
      }}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          if (!notification.read) onMarkAsRead(notification.id)
          if (notification.actionHref) go(notification.actionHref)
        }
      }}
    >
      <button
        onClick={(e) => {
          e.stopPropagation()
          onDelete(notification.id)
        }}
        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
        aria-label="Eliminar notificación"
      >
        <X className="w-3 h-3 text-gray-400 hover:text-gray-600" />
      </button>
      <div className="flex gap-3">
        <div className={cn(
          "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0",
          colors.bg
        )}>
          <Icon className={cn("w-4 h-4", colors.text)} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <p className="text-sm font-medium text-gray-900">{notification.title}</p>
            {!notification.read && (
              <div className="w-2 h-2 bg-blue-600 rounded-full flex-shrink-0 mt-1" aria-label="No leída" />
            )}
          </div>
          {notification.message && (
            <p className="text-xs text-gray-600 mt-1">{notification.message}</p>
          )}
          <p className="text-xs text-gray-400 mt-1">
            {new Date(notification.createdAt).toLocaleDateString('es-MX', {
              month: 'short',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}
          </p>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// COMPONENTE: POPOVER NOTIFICACIONES
// ============================================================================

const NotificationPopover: React.FC<{
  notifications: Notification[]
  unreadCount: number
  onMarkAsRead: (id: string) => void
  onMarkAllAsRead: () => void
  onDelete: (id: string) => void
  navigate?: (href: string) => void
}> = ({ notifications, unreadCount, onMarkAsRead, onMarkAllAsRead, onDelete, navigate }) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="flex-1 relative"
          aria-label={`Notificaciones${unreadCount > 0 ? `, ${unreadCount} sin leer` : ''}`}
        >
          <Bell className="w-4 h-4 mr-2" />
          Notificaciones
          {unreadCount > 0 && (
            <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-red-500 text-white text-xs">
              {unreadCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="font-semibold text-sm">Notificaciones</h3>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onMarkAllAsRead}
              className="text-xs h-auto p-1"
            >
              Marcar todas como leídas
            </Button>
          )}
        </div>
        <ScrollArea className="h-[300px]">
          {notifications.length === 0 ? (
            <div className="p-8 text-center text-gray-500 text-sm">
              No tienes notificaciones
            </div>
          ) : (
            <div className="divide-y">
              {notifications.map(n => (
                <NotificationItem
                  key={n.id}
                  notification={n}
                  onMarkAsRead={onMarkAsRead}
                  onDelete={onDelete}
                  navigate={navigate}
                />
              ))}
            </div>
          )}
        </ScrollArea>
      </PopoverContent>
    </Popover>
  )
}

// ============================================================================
// COMPONENTES DE SIDEBAR
// ============================================================================

const SidebarHeader: React.FC<{ userName?: string; userEmail?: string }> = ({ userName, userEmail }) => (
  <div className="p-6 border-b border-gray-200">
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
        <Store className="w-5 h-5 text-green-600" />
      </div>
      <div className="min-w-0 flex-1">
        <h2 className="text-sm font-semibold text-gray-900 truncate">Dashboard Vendedor</h2>
        <p className="text-xs text-gray-500 truncate">{userName || userEmail}</p>
      </div>
    </div>
  </div>
)

const BackToUserDashboard: React.FC = () => (
  <Link
    href="/dashboard"
    className="flex flex-col mb-4 bg-gradient-to-r from-blue-600 to-indigo-700 p-3 rounded-lg text-white hover:from-blue-700 hover:to-indigo-800 transition-all cursor-pointer no-underline shadow-md"
  >
    <div className="flex items-center gap-2 mb-1">
      <User className="w-4 h-4" />
      <p className="text-xs font-semibold">Dashboard de Usuario</p>
    </div>
    <p className="text-xs opacity-90">Volver a mi cuenta</p>
  </Link>
)

const NavigationItems: React.FC<{
  items: NavItem[]
  currentPath: string
  onNavigate?: () => void
}> = ({ items, currentPath, onNavigate }) => (
  <nav className="space-y-2" role="navigation" aria-label="Navegación de vendedor">
    {items.map(item => {
      const isActive = currentPath === item.href
      const Icon = item.icon
      return (
        <Link
          key={item.href}
          href={item.href}
          className="no-underline"
          onClick={onNavigate}
        >
          <Button
            variant={isActive ? "secondary" : "ghost"}
            className={cn(
              "w-full justify-start",
              isActive && "bg-green-100 text-green-700 border-green-200"
            )}
            aria-label={item.ariaLabel}
            aria-current={isActive ? 'page' : undefined}
          >
            <Icon className="w-4 h-4 mr-3" />
            <span className="flex-1 text-left">{item.label}</span>
            {item.badge && (
              <Badge
                variant={isActive ? "default" : "secondary"}
                className="ml-2"
              >
                {item.badge}
              </Badge>
            )}
          </Button>
        </Link>
      )
    })}
  </nav>
)

const QuickActions: React.FC<{ onNavigate?: () => void }> = ({ onNavigate }) => {
  const actions = [
    { href: '/dashboard/vendor/inventory?action=create', icon: Plus, label: 'Agregar Producto' },
    { href: '/dashboard/vendor/orders', icon: ShoppingCart, label: 'Ver Pedidos' },
    { href: '/dashboard/vendor/analytics', icon: TrendingUp, label: 'Ver Analíticas' }
  ]
  return (
    <div className="space-y-2">
      <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones Rápidas</p>
      {actions.map(a => {
        const Icon = a.icon
        return (
          <Link key={a.href} href={a.href} className="no-underline" onClick={onNavigate}>
            <Button variant="ghost" className="w-full justify-start">
              <Icon className="w-4 h-4 mr-3" />
              <span className="flex-1 text-left">{a.label}</span>
            </Button>
          </Link>
        )
      })}
    </div>
  )
}

const SidebarFooter: React.FC<{
  notifications: Notification[]
  unreadCount: number
  onMarkAsRead: (id: string) => void
  onMarkAllAsRead: () => void
  onDelete: (id: string) => void
  onSettings: () => void
  onSignOut: () => void
  isSigningOut: boolean
  navigate: (href: string) => void
}> = ({
  notifications,
  unreadCount,
  onMarkAsRead,
  onMarkAllAsRead,
  onDelete,
  onSettings,
  onSignOut,
  isSigningOut,
  navigate
}) => (
  <div className="p-4 border-t border-gray-200 space-y-2">
    <div className="flex items-center gap-2">
      <NotificationPopover
        notifications={notifications}
        unreadCount={unreadCount}
        onMarkAsRead={onMarkAsRead}
        onMarkAllAsRead={onMarkAllAsRead}
        onDelete={onDelete}
        navigate={navigate}
      />
      <Button
        variant="ghost"
        size="sm"
        onClick={onSettings}
        aria-label="Configuración"
      >
        <Settings className="w-4 h-4" />
      </Button>
    </div>
    <Button
      variant="outline"
      size="sm"
      className="w-full text-red-600 hover:text-red-700 hover:bg-red-50"
      onClick={onSignOut}
      disabled={isSigningOut}
      aria-label="Cerrar sesión"
    >
      <LogOut className="w-4 h-4 mr-2" />
      {isSigningOut ? 'Cerrando...' : 'Cerrar Sesión'}
    </Button>
  </div>
)

// ============================================================================
// SIDEBAR PRINCIPAL
// ============================================================================

const Sidebar: React.FC<{
  session: Session
  pathname: string
  isOpen: boolean
  isMobile: boolean
  onClose: () => void
}> = ({ session, pathname, isOpen, isMobile, onClose }) => {
  const router = useRouter()
  const [isSigningOut, setIsSigningOut] = React.useState(false)

  const {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    deleteNotification
  } = useNotifications(true)

  const handleMarkAsRead = useCallback((id: string) => {
    markAsRead([id])
  }, [markAsRead])

  const navigate = useCallback((href: string) => {
    router.push(href)
    if (isMobile) onClose()
  }, [router, isMobile, onClose])

  const handleSignOut = useCallback(async () => {
    setIsSigningOut(true)
    try {
      await signOut({ callbackUrl: '/' })
    } catch (e) {
      console.error('Error signing out:', e)
      setIsSigningOut(false)
    }
  }, [])

  const handleSettings = useCallback(() => {
    navigate('/dashboard/vendor/settings')
  }, [navigate])

  return (
    <>
      {isMobile && isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 transition-transform duration-300 ease-in-out",
          isMobile && !isOpen && "-translate-x-full"
        )}
        aria-label="Sidebar del vendedor"
      >
        <div className="flex flex-col h-full">
          <SidebarHeader
            userName={session.user?.name}
            userEmail={session.user?.email}
          />
          <ScrollArea className="flex-1 p-4">
            <BackToUserDashboard />
            <NavigationItems
              items={vendorNavigationItems}
              currentPath={pathname}
              onNavigate={isMobile ? onClose : undefined}
            />
            <Separator className="my-4" />
            <QuickActions onNavigate={isMobile ? onClose : undefined} />
          </ScrollArea>
          <SidebarFooter
            notifications={notifications}
            unreadCount={unreadCount}
            onMarkAsRead={handleMarkAsRead}
            onMarkAllAsRead={markAllAsRead}
            onDelete={deleteNotification}
            onSettings={handleSettings}
            onSignOut={handleSignOut}
            isSigningOut={isSigningOut}
            navigate={navigate}
          />
        </div>
      </aside>
    </>
  )
}

// ============================================================================
// LAYOUT PRINCIPAL
// ============================================================================

export const VendorDashboardLayout: React.FC<VendorDashboardLayoutProps> = ({
  children,
  className
}) => {
  const { data: session, status } = useSession()
  const pathname = usePathname()
  const { isOpen, isMobile, toggle, close } = useSidebar()

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4" />
          <p className="text-gray-600">Cargando...</p>
        </div>
      </div>
    )
  }

  if (!session?.user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md p-8">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8 text-red-600" />
          </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Acceso Denegado</h2>
          <p className="text-gray-600 mb-6">
            Por favor, inicia sesión para acceder al panel de vendedor.
          </p>
          <Button
            onClick={() => window.location.href = '/login'}
            className="bg-green-600 hover:bg-green-700"
          >
            Iniciar Sesión
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {isMobile && (
        <div className="fixed top-4 right-4 z-50 lg:hidden">
          <Button
            variant="outline"
            size="sm"
            onClick={toggle}
            className="bg-white shadow-md"
            aria-label={isOpen ? "Cerrar menú" : "Abrir menú"}
          >
            <Menu className="w-5 h-5" />
          </Button>
        </div>
      )}
      <Sidebar
        session={session as Session}
        pathname={pathname}
        isOpen={isOpen}
        isMobile={isMobile}
        onClose={close}
      />
      <div className={cn("lg:pl-64 transition-all duration-300")}>
        <main className={cn("min-h-screen", className)}>
          {children}
        </main>
      </div>
    </div>
  )
}

// ============================================================================
// HEADER REUTILIZABLE
// ============================================================================

export const VendorDashboardHeader: React.FC<VendorDashboardHeaderProps> = ({
  title,
  subtitle,
  action,
  breadcrumbs
}) => {
  return (
    <div className="bg-white border-b border-gray-200 px-4 sm:px-6 py-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="min-w-0 flex-1">
          {breadcrumbs && breadcrumbs.length > 0 && (
            <nav className="flex mb-2" aria-label="Breadcrumb">
              <ol className="flex items-center space-x-2 text-sm text-gray-500 flex-wrap">
                {breadcrumbs.map((crumb, index) => (
                  <li key={index} className="flex items-center">
                    {index > 0 && <span className="mr-2">/</span>}
                    {crumb.href ? (
                      <Link
                        href={crumb.href}
                        className="hover:text-gray-700 transition-colors no-underline"
                      >
                        {crumb.label}
                      </Link>
                    ) : (
                      <span className="font-medium text-gray-900">{crumb.label}</span>
                    )}
                  </li>
                ))}
              </ol>
            </nav>
          )}
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">{title}</h1>
          {subtitle && <p className="text-sm sm:text-base text-gray-600 mt-1">{subtitle}</p>}
        </div>
        {action && (
          <div className="flex items-center gap-3 flex-shrink-0">
            {action}
          </div>
        )}
      </div>
    </div>
  )
}