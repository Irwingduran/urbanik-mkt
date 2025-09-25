"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Search, ShoppingCart, User, Menu, X, Leaf, Store, BarChart3, Package, Truck, FileText } from "lucide-react"

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [cartItems] = useState(3) // Mock cart items

  const navigation = [
    { name: "Inicio", href: "/" },
    { name: "Marketplace", href: "/marketplace" },
    { name: "Categorías", href: "/categories" },
    { name: "Vendedores", href: "/vendors" },
    { name: "Sostenibilidad", href: "/sustainability" },
  ]

  const vendorNavigation = [
    { name: "Dashboard", href: "/dashboard/vendor", icon: BarChart3 },
    { name: "Perfil", href: "/dashboard/vendor/profile", icon: User },
    { name: "Inventario", href: "/dashboard/vendor/inventory", icon: Package },
    { name: "Pedidos", href: "/dashboard/vendor/orders", icon: FileText },
    { name: "Envíos", href: "/dashboard/vendor/shipping", icon: Truck },
    { name: "Analíticas", href: "/dashboard/vendor/analytics", icon: BarChart3 },
  ]

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
              <Leaf className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">EcoMarket</span>
          </Link>

          {/* Search Bar - Desktop */}
          <div className="hidden md:flex flex-1 max-w-lg mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input type="text" placeholder="Buscar productos sostenibles..." className="pl-10 pr-4 w-full" />
            </div>
          </div>

          {/* Navigation - Desktop */}
          <nav className="hidden lg:flex items-center space-x-6">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-gray-700 hover:text-green-600 font-medium transition-colors"
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center space-x-4">
            {/* Cart */}
            <Link href="/cart" className="relative">
              <Button variant="ghost" size="icon">
                <ShoppingCart className="w-5 h-5" />
                {cartItems > 0 && (
                  <Badge className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-green-600 text-white text-xs flex items-center justify-center">
                    {cartItems}
                  </Badge>
                )}
              </Button>
            </Link>

            {/* User Menu */}
            <div className="relative">
              <Button variant="ghost" size="icon">
                <User className="w-5 h-5" />
              </Button>
            </div>

            {/* Vendor Dashboard Link */}
            <Link href="/dashboard/vendor">
              <Button variant="outline" size="sm" className="hidden md:flex bg-transparent">
                <Store className="w-4 h-4 mr-2" />
                Panel Vendedor
              </Button>
            </Link>

            {/* Mobile Menu Toggle */}
            <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
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
                <Input type="text" placeholder="Buscar productos sostenibles..." className="pl-10 pr-4 w-full" />
              </div>
            </div>

            {/* Mobile Navigation */}
            <nav className="space-y-2 mb-4">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="block px-3 py-2 text-gray-700 hover:text-green-600 hover:bg-gray-50 rounded-md transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
            </nav>

            {/* Mobile Vendor Navigation */}
            <div className="border-t border-gray-200 pt-4">
              <h3 className="text-sm font-medium text-gray-500 mb-2 px-3">Panel Vendedor</h3>
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
          </div>
        )}
      </div>
    </header>
  )
}
