'use client'

import React, { ReactNode, useMemo, useCallback } from 'react'
import { useSession, signOut } from 'next-auth/react'
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  BarChart3,
  Settings,
  Store,
  Heart,
  User,
  Shield,
  Leaf,
  FileText,
  Bell,
  LogOut,
  X,
  CheckCircle,
  AlertCircle,
  Info,
  Menu,
  Clock,
  Flag
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
import { useVendorStatus } from '@/hooks/useVendorStatus'

// ============================================================================
// TYPES & CONSTANTS
// ============================================================================

export enum UserRole {
  USER = 'USER',
  VENDOR = 'VENDOR',
  ADMIN = 'ADMIN'
}

export enum NotificationType {
  SUCCESS = 'success',
  INFO = 'info',
  WARNING = 'warning',
  ERROR = 'error'
}

interface LegacyNotification {
  id: number
  type: NotificationType
  title: string
  message: string
  time: string
  read: boolean
}

interface NavItem {
  label: string
  href: string
  icon: React.ComponentType<{ className?: string }>
  badge?: string | number
  roles: UserRole[]
  ariaLabel?: string
}

interface DashboardLayoutProps {
  children: ReactNode
  className?: string
}

interface DashboardHeaderProps {
  title: string
  subtitle?: string
  actions?: ReactNode
  breadcrumbs?: { label: string; href?: string }[]
}

// ============================================================================
// NAVIGATION CONFIGURATION
// ============================================================================

const navigationItems: NavItem[] = [
  // User Navigation
  {
    label: 'Inicio',
    href: '/dashboard',
    icon: LayoutDashboard,
    roles: [UserRole.USER],
    ariaLabel: 'Ir a inicio'
  },
  {
    label: 'Ordenes',
    href: '/dashboard/orders',
    icon: ShoppingCart,
    roles: [UserRole.USER],
    ariaLabel: 'Ver mis ordenes'
  },
  {
    label: 'Lista de deseos',
    href: '/dashboard/wishlist',
    icon: Heart,
    roles: [UserRole.USER],
    ariaLabel: 'Ver lista de deseos'
  },
  {
    label: 'Impacto',
    href: '/dashboard/impact',
    icon: Leaf,
    roles: [UserRole.USER],
    ariaLabel: 'Ver mi impacto ambiental'
  },
  {
    label: 'Perfil',
    href: '/dashboard/profile',
    icon: User,
    roles: [UserRole.USER],
    ariaLabel: 'Ver mi perfil'
  },

  // Vendor Navigation
  {
    label: 'Panel de control',
    href: '/dashboard/vendor',
    icon: LayoutDashboard,
    roles: [UserRole.VENDOR],
    ariaLabel: 'Panel de control del vendedor'
  },
  {
    label: 'Productos',
    href: '/dashboard/vendor/inventory',
    icon: Package,
    roles: [UserRole.VENDOR],
    ariaLabel: 'Gestionar productos'
  },
  {
    label: 'Pedidos',
    href: '/dashboard/vendor/orders',
    icon: ShoppingCart,
    roles: [UserRole.VENDOR],
    ariaLabel: 'Ver pedidos'
  },
  {
    label: 'RegenMarks',
    href: '/dashboard/vendor/regenmarks',
    icon: Leaf,
    roles: [UserRole.VENDOR],
    ariaLabel: 'Mis certificaciones de sostenibilidad'
  },
  {
    label: 'Analíticas',
    href: '/dashboard/vendor/analytics',
    icon: BarChart3,
    roles: [UserRole.VENDOR],
    ariaLabel: 'Ver analíticas'
  },
  {
    label: 'Perfil de la tienda',
    href: '/dashboard/vendor/profile',
    icon: Store,
    roles: [UserRole.VENDOR],
    ariaLabel: 'Editar perfil de la tienda'
  },
  {
    label: 'Envíos',
    href: '/dashboard/vendor/shipping',
    icon: FileText,
    roles: [UserRole.VENDOR],
    ariaLabel: 'Gestionar envíos'
  },

  // Admin Navigation - Essential only
  {
    label: 'Panel de Control',
    href: '/dashboard/admin',
    icon: LayoutDashboard,
    roles: [UserRole.ADMIN],
    ariaLabel: 'Panel de control del administrador'
  },
  {
    label: 'Vendedores',
    href: '/dashboard/admin/vendors',
    icon: Store,
    roles: [UserRole.ADMIN],
    ariaLabel: 'Gestionar vendedores'
  },
  {
    label: 'RegenMarks',
    href: '/dashboard/admin/regenmarks',
    icon: Leaf,
    roles: [UserRole.ADMIN],
    ariaLabel: 'Evaluar solicitudes de RegenMark'
  },
  {
    label: 'Moderación',
    href: '/dashboard/admin/moderation',
    icon: Flag,
    roles: [UserRole.ADMIN],
    ariaLabel: 'Gestionar reportes de contenido'
  },
  {
    label: 'Perfil',
    href: '/dashboard/admin/profile',
    icon: User,
    roles: [UserRole.ADMIN],
    ariaLabel: 'Mi perfil de administrador'
  },
]

// ============================================================================
// CUSTOM HOOKS
// ============================================================================

// Removed: useNotifications hook is now imported from @/hooks/useNotifications

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

  const toggle = useCallback(() => setIsOpen(prev => !prev), [])
  const close = useCallback(() => setIsOpen(false), [])

  return { isOpen, isMobile, toggle, close }
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

const getRoleDisplayName = (role: string): string => {
  const roleMap: Record<string, string> = {
    [UserRole.USER]: 'Dashboard',
    [UserRole.VENDOR]: 'Dashboard Ventas',
    [UserRole.ADMIN]: 'Admin Dashboard'
  }
  return roleMap[role] || 'Dashboard'
}

const getRoleIcon = (role: string): React.ComponentType<{ className?: string }> => {
  const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
    [UserRole.USER]: User,
    [UserRole.VENDOR]: Store,
    [UserRole.ADMIN]: Shield
  }
  return iconMap[role] || LayoutDashboard
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
// COMPONENTS
// ============================================================================

const NotificationItem: React.FC<{
  notification: any
  onMarkAsRead: (id: string) => void
  onDelete: (id: string) => void
}> = ({ notification, onMarkAsRead, onDelete }) => {
  // Map notification types to legacy types for icons
  const getLegacyType = (type: string): NotificationType => {
    if (type.includes('SUCCESS') || type.includes('DELIVERED') || type.includes('APPROVED')) {
      return NotificationType.SUCCESS
    } else if (type.includes('FAILED') || type.includes('CANCELLED') || type.includes('REJECTED')) {
      return NotificationType.ERROR
    } else if (type.includes('WARNING') || type.includes('STOCK_LOW') || type.includes('IN_REVIEW')) {
      return NotificationType.WARNING
    }
    return NotificationType.INFO
  }

  const legacyType = getLegacyType(notification.type)
  const Icon = getNotificationIcon(legacyType)
  const colors = getNotificationColor(legacyType)

  return (
    <div
      className={cn(
        "p-4 hover:bg-gray-50 transition-colors relative group cursor-pointer",
        !notification.read && "bg-blue-50/50"
      )}
      onClick={() => {
        if (!notification.read) {
          onMarkAsRead(notification.id)
        }
        // Navigate if there's an action URL
        if (notification.actionUrl) {
          window.location.href = notification.actionUrl
        }
      }}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          if (!notification.read) {
            onMarkAsRead(notification.id)
          }
          if (notification.actionUrl) {
            window.location.href = notification.actionUrl
          }
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
            <p className="text-sm font-medium text-gray-900">
              {notification.title}
            </p>
            {!notification.read && (
              <div className="w-2 h-2 bg-blue-600 rounded-full flex-shrink-0 mt-1" aria-label="No leída"></div>
            )}
          </div>
          <p className="text-xs text-gray-600 mt-1">
            {notification.message}
          </p>
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

const NotificationPopover: React.FC<{
  notifications: any[]
  unreadCount: number
  onMarkAsRead: (id: string) => void
  onMarkAllAsRead: () => void
  onDelete: (id: string) => void
}> = ({ notifications, unreadCount, onMarkAsRead, onMarkAllAsRead, onDelete }) => {
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
              {notifications.map((notification) => (
                <NotificationItem
                  key={notification.id}
                  notification={notification}
                  onMarkAsRead={onMarkAsRead}
                  onDelete={onDelete}
                />
              ))}
            </div>
          )}
        </ScrollArea>
      </PopoverContent>
    </Popover>
  )
}

const SidebarHeader: React.FC<{
  role: string
  userName?: string
  userEmail?: string
}> = ({ role, userName, userEmail }) => {
  const RoleIcon = getRoleIcon(role)
  
  return (
    <div className="p-6 border-b border-gray-200">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
          <RoleIcon className="w-5 h-5 text-green-600" />
        </div>
        <div className="min-w-0 flex-1">
          <h2 className="text-sm font-semibold text-gray-900 truncate">
            {getRoleDisplayName(role)}
          </h2>
          <p className="text-xs text-gray-500 truncate">
            {userName || userEmail}
          </p>
        </div>
      </div>
    </div>
  )
}

const VendorBanner: React.FC = () => {
  const { status: vendorStatus, hasVendorRole } = useVendorStatus()

  // APPROVED - Show "Mi Tienda" button to access vendor dashboard
  if (hasVendorRole || vendorStatus === 'approved') {
    return (
      <Link
        href="/dashboard/vendor"
        className="flex flex-col mb-4 bg-gradient-to-r from-blue-600 to-indigo-700 p-3 rounded-lg text-white hover:from-blue-700 hover:to-indigo-800 transition-all cursor-pointer no-underline shadow-md"
      >
        <div className="flex items-center gap-2 mb-1">
          <Store className="w-4 h-4" />
          <p className="text-xs font-semibold">Mi Tienda</p>
        </div>
        <p className="text-xs opacity-90">Accede a tu panel de vendedor</p>
      </Link>
    )
  }

  // PENDING or IN_REVIEW - Show "Verificando datos" button
  if (vendorStatus === 'pending' || vendorStatus === 'in_review') {
    return (
      <Link
        href="/dashboard"
        className="flex flex-col mb-4 bg-gradient-to-r from-yellow-500 to-orange-500 p-3 rounded-lg text-white hover:from-yellow-600 hover:to-orange-600 transition-all cursor-pointer no-underline"
      >
        <div className="flex items-center gap-2 mb-1">
          <Clock className="w-4 h-4" />
          <p className="text-xs font-semibold">Verificando datos</p>
        </div>
        <p className="text-xs opacity-90">Tu solicitud está siendo revisada</p>
      </Link>
    )
  }

  // REJECTED or NOT_APPLIED - Show "¿Quieres vender?" button
  return (
    <Link
      href="/onboarding"
      className="flex flex-col mb-4 bg-gradient-to-r from-blue-500 to-purple-600 p-3 rounded-lg text-white hover:from-blue-600 hover:to-purple-700 transition-all cursor-pointer no-underline"
    >
      <div className="flex items-center gap-2 mb-1">
        <Store className="w-4 h-4" />
        <p className="text-xs font-semibold">¿Quieres vender?</p>
      </div>
      <p className="text-xs opacity-90">
        {vendorStatus === 'rejected' ? 'Vuelve a aplicar' : 'Conviértete en vendedor'}
      </p>
    </Link>
  )
}

const NavigationItems: React.FC<{
  items: NavItem[]
  currentPath: string
  onNavigate?: () => void
}> = ({ items, currentPath, onNavigate }) => {
  return (
    <nav className="space-y-2" role="navigation" aria-label="Navegación principal">
      {items.map((item) => {
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
}

const QuickActions: React.FC<{ role: string; onNavigate?: () => void }> = ({ role, onNavigate }) => {
  const actions = useMemo(() => {
    const actionMap: Record<string, { href: string; icon: React.ComponentType<{ className?: string }>; label: string; badge?: number }[]> = {
      [UserRole.USER]: [
        { href: '/marketplace', icon: Store, label: 'Explorar Productos' }
      ],
      [UserRole.VENDOR]: [
        { href: '/dashboard/vendor/inventory?action=create', icon: Package, label: 'Agregar Producto' }
      ],
      [UserRole.ADMIN]: [
        {
          href: '/dashboard/admin/vendors?status=pending',
          icon: Store,
          label: 'Solicitudes Pendientes',
          // TODO: Fetch real count from API
          badge: undefined // Will be populated with real data
        }
      ]
    }
    return actionMap[role] || []
  }, [role])

  if (actions.length === 0) return null

  return (
    <div className="space-y-2">
      <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">
        Acciones Rápidas
      </p>
      {actions.map((action) => {
        const Icon = action.icon
        return (
          <Link key={action.href} href={action.href} className="no-underline" onClick={onNavigate}>
            <Button variant="ghost" className="w-full justify-start relative">
              <Icon className="w-4 h-4 mr-3" />
              <span className="flex-1 text-left">{action.label}</span>
              {action.badge && action.badge > 0 && (
                <Badge className="ml-2 bg-yellow-500 text-white">
                  {action.badge}
                </Badge>
              )}
            </Button>
          </Link>
        )
      })}
    </div>
  )
}

const SidebarFooter: React.FC<{
  notifications: any[]
  unreadCount: number
  onMarkAsRead: (id: string) => void
  onMarkAllAsRead: () => void
  onDelete: (id: string) => void
  onSettings: () => void
  onSignOut: () => void
  isSigningOut: boolean
  showNotifications: boolean // New prop to control notification visibility
}> = ({
  notifications,
  unreadCount,
  onMarkAsRead,
  onMarkAllAsRead,
  onDelete,
  onSettings,
  onSignOut,
  isSigningOut,
  showNotifications
}) => {
  return (
    <div className="p-4 border-t border-gray-200 space-y-2">
      <div className="flex items-center gap-2">
        {showNotifications && (
          <NotificationPopover
            notifications={notifications}
            unreadCount={unreadCount}
            onMarkAsRead={onMarkAsRead}
            onMarkAllAsRead={onMarkAllAsRead}
            onDelete={onDelete}
          />
        )}
        <Button
          variant="ghost"
          size="sm"
          onClick={onSettings}
          className={showNotifications ? '' : 'flex-1'}
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
}

const Sidebar: React.FC<{
  session: any
  pathname: string
  filteredNavItems: NavItem[]
  isOpen: boolean
  isMobile: boolean
  onClose: () => void
}> = ({ session, pathname, filteredNavItems, isOpen, isMobile, onClose }) => {
  const router = useRouter()
  const [isSigningOut, setIsSigningOut] = React.useState(false)
  
  const {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    deleteNotification
  } = useNotifications(true) // Enable auto-refresh

  // Wrapper to convert single ID to array for markAsRead
  const handleMarkAsRead = useCallback((id: string) => {
    markAsRead([id])
  }, [markAsRead])

  const handleSignOut = useCallback(async () => {
    setIsSigningOut(true)
    try {
      await signOut({ callbackUrl: '/' })
    } catch (error) {
      console.error('Error signing out:', error)
      setIsSigningOut(false)
    }
  }, [])

  const handleSettings = useCallback(() => {
    // Route to role-specific settings
    const settingsPath = session.user.role === UserRole.ADMIN
      ? '/dashboard/admin/settings'
      : '/dashboard/settings'
    router.push(settingsPath)
    if (isMobile) onClose()
  }, [router, isMobile, onClose, session.user.role])

  // Show vendor banner for USER and VENDOR roles (not ADMIN)
  // The VendorBanner component itself will handle showing different states
  const showVendorBanner = session.user.role === UserRole.USER || session.user.role === UserRole.VENDOR

  return (
    <>
      {/* Overlay for mobile */}
      {isMobile && isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 transition-transform duration-300 ease-in-out",
          isMobile && !isOpen && "-translate-x-full"
        )}
        aria-label="Sidebar"
      >
        <div className="flex flex-col h-full">
          <SidebarHeader
            role={session.user.role}
            userName={session.user.name}
            userEmail={session.user.email}
          />

          <ScrollArea className="flex-1 p-4">
            {showVendorBanner && <VendorBanner />}

            <NavigationItems
              items={filteredNavItems}
              currentPath={pathname}
              onNavigate={isMobile ? onClose : undefined}
            />

            <Separator className="my-4" />

            <QuickActions 
              role={session.user.role} 
              onNavigate={isMobile ? onClose : undefined}
            />
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
            showNotifications={session.user.role !== UserRole.ADMIN}
          />
        </div>
      </aside>
    </>
  )
}

// ============================================================================
// MAIN LAYOUT COMPONENT
// ============================================================================

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  children,
  className
}) => {
  const { data: session, status } = useSession()
  const pathname = usePathname()
  const { isOpen, isMobile, toggle, close } = useSidebar()

  const filteredNavItems = useMemo(() => {
    if (!session?.user?.role) return []

    return navigationItems.filter(item =>
      item.roles.includes(session.user.role as UserRole)
    )
  }, [session?.user?.role])

  // Loading state
  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando...</p>
        </div>
      </div>
    )
  }

  // Not authenticated
  if (!session?.user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md p-8">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Acceso Denegado
          </h2>
          <p className="text-gray-600 mb-6">
            Por favor, inicia sesión para acceder al dashboard.
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
      {/* Mobile menu button */}
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
        session={session}
        pathname={pathname}
        filteredNavItems={filteredNavItems}
        isOpen={isOpen}
        isMobile={isMobile}
        onClose={close}
      />

      {/* Main Content */}
      <div className={cn("lg:pl-64 transition-all duration-300")}>
        <main className={cn("min-h-screen", className)}>
          {children}
        </main>
      </div>
    </div>
  )
}

// ============================================================================
// HEADER COMPONENT
// ============================================================================

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  title,
  subtitle,
  actions,
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
          {subtitle && (
            <p className="text-sm sm:text-base text-gray-600 mt-1">{subtitle}</p>
          )}
        </div>
        {actions && (
          <div className="flex items-center gap-3 flex-shrink-0">
            {actions}
          </div>
        )}
      </div>
    </div>
  )
}