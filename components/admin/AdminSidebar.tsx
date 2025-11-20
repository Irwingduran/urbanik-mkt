'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut } from 'next-auth/react'
import { cn } from '@/lib/utils'
import {
  BarChart3,
  Settings,
  Users,
  User,
  Store,
  Package,
  TrendingUp,
  Shield,
  FileText,
  LogOut
} from 'lucide-react'

const adminNavItems = [
  {
    label: 'Dashboard',
    href: '/dashboard/admin',
    icon: BarChart3,
    category: 'main'
  },
  {
    label: 'Vendedores',
    href: '/dashboard/admin/vendors',
    icon: Store,
    category: 'management'
  },
  {
    label: 'Usuarios',
    href: '/dashboard/admin/users',
    icon: Users,
    category: 'management'
  },
  {
    label: 'Productos',
    href: '/dashboard/admin/products',
    icon: Package,
    category: 'management'
  },
  {
    label: 'Órdenes',
    href: '/dashboard/admin/orders',
    icon: TrendingUp,
    category: 'management'
  },
  {
    label: 'REGEN Marks',
    href: '/dashboard/admin/regenmarks',
    icon: Shield,
    category: 'system'
  },
  {
    label: 'Analytics',
    href: '/dashboard/admin/analytics',
    icon: FileText,
    category: 'system'
  },
  {
    label: 'Configuración',
    href: '/dashboard/admin/settings',
    icon: Settings,
    category: 'system'
  },
  {
    label: 'Perfil',
    href: '/dashboard/admin/profile',
    icon: User,
    category: 'system'
  }
]

export function AdminSidebar() {
  const pathname = usePathname()

  const groupedItems = {
    main: adminNavItems.filter(item => item.category === 'main'),
    management: adminNavItems.filter(item => item.category === 'management'),
    system: adminNavItems.filter(item => item.category === 'system')
  }

  const NavSection = ({ items, title }: { items: typeof adminNavItems; title?: string }) => (
    <div>
      {title && <p className="px-4 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wide">{title}</p>}
      <div className="space-y-1">
        {items.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`)

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors text-sm font-medium mx-2',
                isActive
                  ? 'bg-green-600 text-white shadow-lg'
                  : 'text-gray-300 hover:bg-gray-800 hover:text-white'
              )}
              title={item.label}
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              <span className="truncate">{item.label}</span>
            </Link>
          )
        })}
      </div>
    </div>
  )

  return (
    <aside className="w-64 bg-gradient-to-b from-gray-900 to-gray-950 text-white min-h-screen p-4 space-y-6 fixed left-0 top-0 overflow-y-auto border-r border-gray-800">
      {/* Header */}
      <div className="pt-2 pb-4 border-b border-gray-800">
        <Link href="/dashboard/admin" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <div className="p-2 bg-green-600 rounded-lg">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">Admin</h2>
            <p className="text-xs text-gray-400">Panel de Control</p>
          </div>
        </Link>
      </div>

      {/* Main Navigation */}
      <NavSection items={groupedItems.main} />

      {/* Management Section */}
      <NavSection items={groupedItems.management} title="Gestión" />

      {/* System Section */}
      <NavSection items={groupedItems.system} title="Sistema" />

      {/* Footer */}
      <div className="absolute bottom-4 left-4 right-4 border-t border-gray-800 pt-4">
        <button
          onClick={() => signOut({ redirect: true, callbackUrl: '/auth/signin' })}
          className="w-full flex items-center gap-2 px-4 py-2 text-xs text-gray-400 hover:text-white hover:bg-red-600 rounded-lg transition-colors font-medium"
        >
          <LogOut className="w-4 h-4" />
          <span>Cerrar sesión</span>
        </button>
      </div>
    </aside>
  )
}
