'use client'

// Role-based dashboard layout with navigation

import React, { ReactNode } from 'react'
import { useSession } from 'next-auth/react'
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
  TrendingUp,
  FileText,
  Bell
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { ScrollArea } from '@/components/ui/scroll-area'
import { cn } from '@/lib/utils'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

interface DashboardLayoutProps {
  children: ReactNode
  className?: string
}

interface NavItem {
  label: string
  href: string
  icon: React.ComponentType<any>
  badge?: string | number
  roles: string[]
}

const navigationItems: NavItem[] = [
  // Customer Navigation
  {
    label: 'Overview',
    href: '/dashboard/user',
    icon: LayoutDashboard,
    roles: ['USER']
  },
  {
    label: 'Orders',
    href: '/dashboard/user/orders',
    icon: ShoppingCart,
    roles: ['USER']
  },
  {
    label: 'Wishlist',
    href: '/dashboard/user/wishlist',
    icon: Heart,
    roles: ['USER']
  },
  {
    label: 'Impact',
    href: '/dashboard/user/impact',
    icon: Leaf,
    roles: ['USER']
  },
  {
    label: 'Profile',
    href: '/dashboard/user/profile',
    icon: User,
    roles: ['USER']
  },

  // Vendor Navigation
  {
    label: 'Dashboard',
    href: '/dashboard/vendor',
    icon: LayoutDashboard,
    roles: ['VENDOR']
  },
  {
    label: 'Products',
    href: '/dashboard/vendor/inventory',
    icon: Package,
    roles: ['VENDOR']
  },
  {
    label: 'Orders',
    href: '/dashboard/vendor/orders',
    icon: ShoppingCart,
    badge: '3',
    roles: ['VENDOR']
  },
  {
    label: 'Analytics',
    href: '/dashboard/vendor/analytics',
    icon: BarChart3,
    roles: ['VENDOR']
  },
  {
    label: 'Store Profile',
    href: '/dashboard/vendor/profile',
    icon: Store,
    roles: ['VENDOR']
  },
  {
    label: 'Shipping',
    href: '/dashboard/vendor/shipping',
    icon: FileText,
    roles: ['VENDOR']
  },

  // Admin Navigation
  {
    label: 'Overview',
    href: '/dashboard/admin',
    icon: LayoutDashboard,
    roles: ['ADMIN']
  },
  {
    label: 'Users',
    href: '/dashboard/admin/users',
    icon: Users,
    roles: ['ADMIN']
  },
  {
    label: 'Vendors',
    href: '/dashboard/admin/vendors',
    icon: Store,
    badge: '12',
    roles: ['ADMIN']
  },
  {
    label: 'Products',
    href: '/dashboard/admin/products',
    icon: Package,
    roles: ['ADMIN']
  },
  {
    label: 'Orders',
    href: '/dashboard/admin/orders',
    icon: ShoppingCart,
    roles: ['ADMIN']
  },
  {
    label: 'Analytics',
    href: '/dashboard/admin/analytics',
    icon: TrendingUp,
    roles: ['ADMIN']
  },
  {
    label: 'Settings',
    href: '/dashboard/admin/settings',
    icon: Settings,
    roles: ['ADMIN']
  },
]

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  children,
  className
}) => {
  const { data: session } = useSession()
  const pathname = usePathname()

  if (!session?.user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Please sign in to access the dashboard.</p>
      </div>
    )
  }

  // Filter navigation items based on user role
  const filteredNavItems = navigationItems.filter(item =>
    item.roles.includes(session.user.role) || session.user.role === 'ADMIN'
  )

  const getRoleDisplayName = (role: string) => {
    switch (role) {
      case 'USER': return 'Customer Dashboard'
      case 'VENDOR': return 'Vendor Dashboard'
      case 'ADMIN': return 'Admin Dashboard'
      default: return 'Dashboard'
    }
  }

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'USER': return User
      case 'VENDOR': return Store
      case 'ADMIN': return Shield
      default: return LayoutDashboard
    }
  }

  const RoleIcon = getRoleIcon(session.user.role)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <RoleIcon className="w-5 h-5 text-green-600" />
              </div>
              <div className="min-w-0 flex-1">
                <h2 className="text-sm font-semibold text-gray-900 truncate">
                  {getRoleDisplayName(session.user.role)}
                </h2>
                <p className="text-xs text-gray-500 truncate">
                  {session.user.name || session.user.email}
                </p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <ScrollArea className="flex-1 p-4">
            <nav className="space-y-2">
              {filteredNavItems.map((item) => {
                const isActive = pathname === item.href
                const Icon = item.icon

                return (
                  <Link key={item.href} href={item.href}>
                    <Button
                      variant={isActive ? "secondary" : "ghost"}
                      className={cn(
                        "w-full justify-start",
                        isActive && "bg-green-100 text-green-700 border-green-200"
                      )}
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

            <Separator className="my-4" />

            {/* Quick Actions based on role */}
            <div className="space-y-2">
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                Quick Actions
              </p>

              {session.user.role === 'USER' && (
                <>
                  <Link href="/marketplace">
                    <Button variant="ghost" className="w-full justify-start">
                      <Store className="w-4 h-4 mr-3" />
                      Browse Products
                    </Button>
                  </Link>
                </>
              )}

              {session.user.role === 'VENDOR' && (
                <>
                  <Link href="/dashboard/vendor/inventory?action=create">
                    <Button variant="ghost" className="w-full justify-start">
                      <Package className="w-4 h-4 mr-3" />
                      Add Product
                    </Button>
                  </Link>
                </>
              )}

              {session.user.role === 'ADMIN' && (
                <>
                  <Link href="/dashboard/admin/vendors?status=pending">
                    <Button variant="ghost" className="w-full justify-start">
                      <Users className="w-4 h-4 mr-3" />
                      Pending Vendors
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </ScrollArea>

          {/* Footer */}
          <div className="p-4 border-t border-gray-200">
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" className="flex-1">
                <Bell className="w-4 h-4 mr-2" />
                Notifications
              </Button>
              <Button variant="ghost" size="sm">
                <Settings className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="pl-64">
        <main className={cn("min-h-screen", className)}>
          {children}
        </main>
      </div>
    </div>
  )
}

// Header component for dashboard pages
export const DashboardHeader: React.FC<{
  title: string
  subtitle?: string
  actions?: ReactNode
  breadcrumbs?: { label: string; href?: string }[]
}> = ({ title, subtitle, actions, breadcrumbs }) => {
  return (
    <div className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="min-w-0 flex-1">
          {breadcrumbs && (
            <nav className="flex mb-2" aria-label="Breadcrumb">
              <ol className="flex items-center space-x-2 text-sm text-gray-500">
                {breadcrumbs.map((crumb, index) => (
                  <li key={index} className="flex items-center">
                    {index > 0 && <span className="mr-2">/</span>}
                    {crumb.href ? (
                      <Link
                        href={crumb.href}
                        className="hover:text-gray-700 transition-colors"
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
          <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
          {subtitle && (
            <p className="text-gray-600 mt-1">{subtitle}</p>
          )}
        </div>
        {actions && (
          <div className="flex items-center gap-3">
            {actions}
          </div>
        )}
      </div>
    </div>
  )
}