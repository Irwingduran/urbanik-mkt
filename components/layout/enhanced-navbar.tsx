'use client'

// Enhanced Navbar with all suggested features

import { useState } from 'react'
import Link from 'next/link'
import { useSession } from 'next-auth/react'
import {
  Search,
  Bell,
  User,
  ChevronDown,
  Menu,
  X,
  Leaf,
  Droplets,
  Zap,
  Recycle,
  Home,
  Car,
  ShoppingCart,
  Heart,
  BarChart3,
  BookOpen,
  Award,
  Globe,
  Sun,
  Moon
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { CartCounter } from '@/src/features/cart/components/CartCounter'
import { useAppSelector, useAppDispatch } from '@/src/shared/store/hooks'
import { selectTheme, setTheme } from '@/src/shared/store/slices/uiSlice'

const categories = [
  {
    name: 'Energía Solar',
    icon: Zap,
    href: '/?category=Energía Solar',
    description: 'Paneles solares y tecnología de energía renovable'
  },
  {
    name: 'Gestión de Agua',
    icon: Droplets,
    href: '/?category=Gestión de Agua',
    description: 'Sistemas de filtración y conservación de agua'
  },
  {
    name: 'Movilidad Eléctrica',
    icon: Car,
    href: '/?category=Movilidad Eléctrica',
    description: 'Vehículos eléctricos y cargadores'
  },
  {
    name: 'Gestión de Residuos',
    icon: Recycle,
    href: '/?category=Gestión de Residuos',
    description: 'Soluciones de reciclaje y compostaje'
  },
  {
    name: 'Iluminación',
    icon: Sun,
    href: '/?category=Iluminación',
    description: 'Sistemas de iluminación LED y solar'
  },
  {
    name: 'Calidad del Aire',
    icon: Leaf,
    href: '/?category=Calidad del Aire',
    description: 'Filtros HEPA y purificadores de aire'
  }
]

const navigationItems = [
  { name: 'Sustainability Guide', href: '/guide' },
  { name: 'Certifications', href: '/certifications' }
]

export function EnhancedNavbar() {
  const { data: session } = useSession()
  const dispatch = useAppDispatch()
  const theme = useAppSelector(selectTheme)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      window.location.href = `/?search=${encodeURIComponent(searchQuery)}`
    }
  }

  const toggleTheme = () => {
    dispatch(setTheme(theme === 'light' ? 'dark' : 'light'))
  }

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      {/* Top Impact Bar */}
      <div className="bg-green-600 text-white py-2">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-center text-sm">
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2">
              <Leaf className="w-4 h-4" />
              <span>2,847 tons CO₂ saved this month</span>
            </div>
            <div className="flex items-center space-x-2">
              <Droplets className="w-4 h-4" />
              <span>1.2M liters water conserved</span>
            </div>
            <div className="flex items-center space-x-2">
              <Zap className="w-4 h-4" />
              <span>156 MW clean energy generated</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Left Section - Logo & Navigation */}
          <div className="flex items-center space-x-8">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
                <Leaf className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-xl text-gray-900">Urbanika Market</span>
            </Link>

            {/* Categories Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center space-x-1">
                  <span>Categories</span>
                  <ChevronDown className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-80 p-4">
                <div className="grid grid-cols-1 gap-3">
                  {categories.map((category) => {
                    const Icon = category.icon
                    return (
                      <Link key={category.name} href={category.href}>
                        <div className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                          <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                            <Icon className="w-5 h-5 text-green-600" />
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-900">{category.name}</h4>
                            <p className="text-sm text-gray-500">{category.description}</p>
                          </div>
                        </div>
                      </Link>
                    )
                  })}
                </div>
                <DropdownMenuSeparator />
                <Link href="/">
                  <Button variant="outline" className="w-full mt-2">
                    View All Products
                  </Button>
                </Link>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Main Navigation Links */}
            <div className="hidden md:flex items-center space-x-6">
              {navigationItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-gray-700 hover:text-green-600 font-medium transition-colors"
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Center Section - Search */}
          <div className="hidden md:block flex-1 max-w-md mx-8">
            <form onSubmit={handleSearch}>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  type="text"
                  placeholder="Search sustainable products..."
                  className="pl-10 pr-4"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </form>
          </div>

          {/* Right Section - Actions */}
          <div className="flex items-center space-x-4">
            {/* Theme Toggle */}
            <Button variant="ghost" size="sm" onClick={toggleTheme}>
              {theme === 'light' ? (
                <Moon className="w-4 h-4" />
              ) : (
                <Sun className="w-4 h-4" />
              )}
            </Button>

            {/* Notifications */}
            <Button variant="ghost" size="sm" className="relative">
              <Bell className="w-4 h-4" />
              <Badge className="absolute -top-1 -right-1 w-5 h-5 p-0 flex items-center justify-center text-xs bg-red-500">
                3
              </Badge>
            </Button>

            {/* Cart Counter */}
            <CartCounter />

            {/* User Menu */}
            {session?.user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <User className="w-4 h-4 text-green-600" />
                    </div>
                    <span className="hidden sm:inline font-medium">{session.user.name}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end">
                  <div className="p-2">
                    <p className="font-medium">{session.user.name}</p>
                    <p className="text-sm text-gray-500">{session.user.email}</p>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard">
                      <BarChart3 className="w-4 h-4 mr-2" />
                      Dashboard
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard/orders">
                      <ShoppingCart className="w-4 h-4 mr-2" />
                      My Orders
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard/wishlist">
                      <Heart className="w-4 h-4 mr-2" />
                      Wishlist
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard/impact">
                      <Leaf className="w-4 h-4 mr-2" />
                      My Impact
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/api/auth/signout">
                      Sign Out
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center space-x-2">
                <Link href="/auth/signin">
                  <Button variant="ghost" size="sm">Sign In</Button>
                </Link>
                <Link href="/auth/signup">
                  <Button size="sm">Sign Up</Button>
                </Link>
              </div>
            )}

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-200 py-4">
            {/* Mobile Search */}
            <div className="mb-4">
              <form onSubmit={handleSearch}>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    type="text"
                    placeholder="Search products..."
                    className="pl-10 pr-4"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </form>
            </div>

            {/* Mobile Navigation */}
            <div className="space-y-3">
              {navigationItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="block text-gray-700 hover:text-green-600 font-medium py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
            </div>

            {/* Mobile Categories */}
            <div className="mt-4 pt-4 border-t border-gray-200">
              <h3 className="font-medium text-gray-900 mb-3">Categories</h3>
              <div className="space-y-2">
                {categories.map((category) => {
                  const Icon = category.icon
                  return (
                    <Link
                      key={category.name}
                      href={category.href}
                      className="flex items-center space-x-3 py-2"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <Icon className="w-4 h-4 text-green-600" />
                      <span className="text-gray-700">{category.name}</span>
                    </Link>
                  )
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}