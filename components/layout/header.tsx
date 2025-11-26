"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { signOut } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useAuth } from "@/lib/hooks/useAuth"
import { CartCounter } from "@/components/cart/CartCounter"
import { CartSidebar } from "@/components/cart/cart-sidebar"
import { Search, User, Menu, X, Leaf, Store, BarChart3, Package, Truck, FileText, LogOut, Settings, Shield, Crown, ShoppingCart, Flag } from "lucide-react"

// Types para mejor TypeScript support
interface User {
  id: string
  name?: string | null
  email?: string | null
  image?: string | null
}

type UserRoleType = 'ADMIN' | 'VENDOR' | 'USER' | 'CUSTOMER' | null

// Navegación: tipado consistente para evitar uniones incompatibles
interface NavItem {
  name: string
  href: string
  roles: (UserRoleType | 'GUEST')[]
  icon?: React.ComponentType<{ className?: string }>
  className?: string
}

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const pathname = usePathname()

  // Usar SOLO el custom auth hook que ya maneja la sesión correctamente
  const { user, isAuthenticated, isLoading, role } = useAuth()

  // Simplificar el estado local
  const authState = {
    isAuthenticated,
    user,
    role,
    isLoading
  }

  const getRoleIcon = (role: UserRoleType) => {
    switch (role) {
      case 'ADMIN':
        return <Crown className="w-4 h-4 text-yellow-600" />
      case 'VENDOR':
        return <Store className="w-4 h-4 text-blue-600" />
      case 'USER':
      case 'CUSTOMER': // CUSTOMER is treated as USER
        return <User className="w-4 h-4 text-green-600" />
      default:
        return <User className="w-4 h-4 text-gray-600" />
    }
  }

  const getRoleLabel = (role: UserRoleType) => {
    switch (role) {
      case 'ADMIN':
        return 'Administrador'
      case 'VENDOR':
        return 'Vendedor'
      case 'USER':
      case 'CUSTOMER': // CUSTOMER is treated as USER
        return 'Usuario'
      default:
        return 'Invitado'
    }
  }

  const getUserInitials = (user: User | null | undefined) => {
    if (!user?.name) return 'U'
    return user.name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  const handleLogout = async () => {
    await signOut({ callbackUrl: '/' })
    setIsMenuOpen(false)
  }

  // Cerrar menú móvil al cambiar de ruta
  useEffect(() => {
    setIsMenuOpen(false)
  }, [pathname])

  // Determine vendor button state based on application status
  // Navigation items con validación de roles
  const navigation: NavItem[] = [
    { name: "Promociones", href: "/promotions", roles: ['GUEST', 'USER', 'VENDOR', 'ADMIN'] },
    { name: "Lo más vendido", href: "/best-sellers", roles: ['GUEST', 'USER', 'VENDOR', 'ADMIN'] },
  ]

  const vendorNavigation = [
    { name: "Dashboard", href: "/dashboard/vendor", icon: BarChart3 },
    { name: "Perfil", href: "/dashboard/vendor/profile", icon: User },
    { name: "Inventario", href: "/dashboard/vendor/inventory", icon: Package },
    { name: "Pedidos", href: "/dashboard/vendor/orders", icon: FileText },
    { name: "Envíos", href: "/dashboard/vendor/shipping", icon: Truck },
    { name: "Analíticas", href: "/dashboard/vendor/analytics", icon: BarChart3 },
  ]

  // Filtrar navegación basada en roles
  const filteredNavigation = navigation.filter(item => 
    item.roles.includes(authState.role || 'GUEST')
  )

  // Loading state optimizado
  if (authState.isLoading) {
    return (
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo skeleton */}
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gray-200 rounded-lg animate-pulse" />
              <div className="w-32 h-6 bg-gray-200 rounded animate-pulse" />
            </div>
            
            {/* Search bar skeleton */}
            <div className="hidden md:flex flex-1 max-w-lg mx-8">
              <div className="w-full h-10 bg-gray-200 rounded animate-pulse" />
            </div>
            
            {/* User menu skeleton */}
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gray-200 rounded-full animate-pulse" />
            </div>
          </div>
        </div>
      </header>
    )
  }

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 flex-shrink-0">
            <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
              <Leaf className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900 hidden sm:block">
              Urbanika Marketplace
            </span>
          </Link>

          {/* Search Bar - Desktop */}
          <div className="hidden md:flex flex-1 max-w-lg mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input 
                type="text" 
                placeholder="Buscar productos sostenibles..." 
                className="pl-10 pr-4 w-full" 
              />
            </div>
          </div>

          {/* Navigation - Desktop */}
          <nav className="hidden lg:flex items-center space-x-6">
            {filteredNavigation.map((item) => {
              const ItemIcon = item.icon
              const isActive = pathname === item.href

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center gap-1.5 font-medium transition-colors ${
                    item.className || (isActive ? "text-green-600" : "text-gray-700 hover:text-green-600")
                  }`}
                >
                  {ItemIcon && <ItemIcon className="w-4 h-4" />}
                  {item.name}
                </Link>
              )
            })}
          </nav>

          {/* Actions */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            {/* Cart */}
            <CartCounter />

            {/* User Menu */}
            {authState.isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="ghost" 
                    className="relative h-8 w-8 rounded-full p-0"
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarImage 
                        src={authState.user?.image || ""} 
                        alt={authState.user?.name || "Usuario"} 
                      />
                      <AvatarFallback className="bg-green-100 text-green-700 text-sm font-medium">
                        {getUserInitials(authState.user)}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {authState.user?.name || 'Usuario'}
                      </p>
                      <p className="text-xs leading-none text-muted-foreground truncate">
                        {authState.user?.email}
                      </p>
                      <div className="flex items-center gap-1 mt-1">
                        {getRoleIcon(authState.role ?? 'USER')}
                        <span className="text-xs text-muted-foreground">
                          {getRoleLabel(authState.role ?? 'USER')}
                        </span>
                      </div>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />

                  {/* Dashboards Section */}
                  <div className="px-2 py-1.5">
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      Mis Dashboards
                    </p>
                  </div>

                  {/* Dashboard Comprador - Solo para USUARIOS (no admin) */}
                  {authState.role !== 'ADMIN' && (
                    <DropdownMenuItem asChild>
                      <Link href="/dashboard" className="flex items-start gap-3 cursor-pointer py-3">
                        <ShoppingCart className="w-4 h-4 mt-0.5 text-green-600" />
                        <div className="flex-1">
                          <p className="text-sm font-medium">Dashboard Comprador</p>
                          <p className="text-xs text-muted-foreground">Mis compras y órdenes</p>
                        </div>
                      </Link>
                    </DropdownMenuItem>
                  )}

                  {/* Dashboard Vendedor - Solo si es VENDOR (no admin) */}
                  {authState.role === 'VENDOR' && (
                    <DropdownMenuItem asChild>
                      <Link href="/dashboard/vendor" className="flex items-start gap-3 cursor-pointer py-3">
                        <Store className="w-4 h-4 mt-0.5 text-blue-600" />
                        <div className="flex-1">
                          <p className="text-sm font-medium text-blue-600">Dashboard Vendedor</p>
                          <p className="text-xs text-muted-foreground">Mis productos y ventas</p>
                        </div>
                      </Link>
                    </DropdownMenuItem>
                  )}

                  {/* Dashboard Admin - Solo si es ADMIN */}
                  {authState.role === 'ADMIN' && (
                    <>
                      <DropdownMenuItem asChild>
                        <Link href="/dashboard/admin" className="flex items-start gap-3 cursor-pointer py-3">
                          <Shield className="w-4 h-4 mt-0.5 text-purple-600" />
                          <div className="flex-1">
                            <p className="text-sm font-medium text-purple-600">Panel Admin</p>
                            <p className="text-xs text-muted-foreground">Gestión del sistema</p>
                          </div>
                        </Link>
                      </DropdownMenuItem>

                      <DropdownMenuItem asChild>
                        <Link href="/dashboard/admin/moderation" className="flex items-start gap-3 cursor-pointer py-3">
                          <Flag className="w-4 h-4 mt-0.5 text-red-600" />
                          <div className="flex-1">
                            <p className="text-sm font-medium text-red-600">Moderación</p>
                            <p className="text-xs text-muted-foreground">Gestionar reportes</p>
                          </div>
                        </Link>
                      </DropdownMenuItem>
                    </>
                  )}

                  <DropdownMenuSeparator />

                  <DropdownMenuItem asChild>
                    <Link href="/profile" className="flex items-center cursor-pointer">
                      <User className="mr-2 h-4 w-4" />
                      <span>Mi Perfil</span>
                    </Link>
                  </DropdownMenuItem>

                  <DropdownMenuItem asChild>
                    <Link href="/settings" className="flex items-center cursor-pointer">
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Configuración</span>
                    </Link>
                  </DropdownMenuItem>

                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="flex items-center cursor-pointer text-red-600 focus:text-red-600"
                    onClick={handleLogout}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Cerrar Sesión</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="hidden sm:flex items-center space-x-2">
                <Link href="/auth/signin">
                  <Button variant="ghost" size="sm">
                    Iniciar Sesión
                  </Button>
                </Link>
                <Link href="/auth/signup">
                  <Button size="sm" className="bg-green-600 hover:bg-green-700">
                    Registrarse
                  </Button>
                </Link>
              </div>
            )}

            {/* Mobile Menu Toggle */}
            <Button 
              variant="ghost" 
              size="icon" 
              className="lg:hidden" 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label={isMenuOpen ? "Cerrar menú" : "Abrir menú"}
            >
              {isMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden border-t border-gray-200 py-4">
            {/* Mobile Search */}
            <div className="mb-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input 
                  type="text" 
                  placeholder="Buscar productos sostenibles..." 
                  className="pl-10 pr-4 w-full" 
                />
              </div>
            </div>

            {/* Mobile Navigation */}
            <nav className="space-y-2 mb-4">
              {filteredNavigation.map((item) => {
                const ItemIcon = item.icon
                const isActive = pathname === item.href

                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`flex items-center gap-2 px-3 py-2 rounded-md transition-colors ${
                      item.className || (isActive ? "text-green-600 bg-green-50" : "text-gray-700 hover:text-green-600 hover:bg-gray-50")
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {ItemIcon && <ItemIcon className="w-4 h-4" />}
                    {item.name}
                  </Link>
                )
              })}
            </nav>

            {/* Mobile User Section */}
            <div className="border-t border-gray-200 pt-4">
              {authState.isAuthenticated ? (
                <>
                  <div className="px-3 mb-3">
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage 
                          src={authState.user?.image || ""} 
                          alt={authState.user?.name || "Usuario"} 
                        />
                        <AvatarFallback className="bg-green-100 text-green-700">
                          {getUserInitials(authState.user)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {authState.user?.name || 'Usuario'}
                        </p>
                        <div className="flex items-center gap-1">
                          {getRoleIcon(authState.role ?? 'USER')}
                          <span className="text-xs text-gray-500 truncate">
                            {getRoleLabel(authState.role ?? 'USER')}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Role-based Mobile Navigation */}
                  {authState.role === 'ADMIN' && (
                    <div className="mb-4">
                      <h3 className="text-sm font-medium text-gray-500 mb-2 px-3">
                        Panel Administrador
                      </h3>
                      <Link
                        href="/dashboard/admin"
                        className="flex items-center px-3 py-2 text-gray-700 hover:text-green-600 hover:bg-gray-50 rounded-md transition-colors"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <Shield className="w-4 h-4 mr-3" />
                        Panel Admin
                      </Link>
                      <Link
                        href="/dashboard/admin/moderation"
                        className="flex items-center px-3 py-2 text-gray-700 hover:text-green-600 hover:bg-gray-50 rounded-md transition-colors"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <Flag className="w-4 h-4 mr-3" />
                        Moderación
                      </Link>
                    </div>
                  )}

                  {authState.role === 'VENDOR' && (
                    <div className="mb-4">
                      <h3 className="text-sm font-medium text-gray-500 mb-2 px-3">
                        Panel Vendedor
                      </h3>
                      <nav className="space-y-1">
                        {vendorNavigation.map((item) => {
                          const Icon = item.icon
                          return (
                            <Link
                              key={item.name}
                              href={item.href}
                              className="flex items-center px-3 py-2 text-gray-700 hover:text-green-600 hover:bg-gray-50 rounded-md transition-colors"
                              onClick={() => setIsMenuOpen(false)}
                            >
                              <Icon className="w-4 h-4 mr-3" />
                              {item.name}
                            </Link>
                          )
                        })}
                      </nav>
                    </div>
                  )}

                  <div className="border-t border-gray-200 pt-4 space-y-1">
                    <Link
                      href="/profile"
                      className="flex items-center px-3 py-2 text-gray-700 hover:text-green-600 hover:bg-gray-50 rounded-md transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <User className="w-4 h-4 mr-3" />
                      Mi Perfil
                    </Link>
                    <Link
                      href="/settings"
                      className="flex items-center px-3 py-2 text-gray-700 hover:text-green-600 hover:bg-gray-50 rounded-md transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <Settings className="w-4 h-4 mr-3" />
                      Configuración
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center px-3 py-2 text-red-600 hover:bg-red-50 rounded-md transition-colors text-left"
                    >
                      <LogOut className="w-4 h-4 mr-3" />
                      Cerrar Sesión
                    </button>
                  </div>
                </>
              ) : (
                <div className="space-y-2 px-3">
                  <Link
                    href="/auth/signin"
                    className="block w-full text-center py-2 px-4 bg-transparent border border-green-600 text-green-600 rounded-md hover:bg-green-50 transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Iniciar Sesión
                  </Link>
                  <Link
                    href="/auth/signup"
                    className="block w-full text-center py-2 px-4 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Registrarse
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Cart Sidebar */}
      <CartSidebar />
    </header>
  )
}