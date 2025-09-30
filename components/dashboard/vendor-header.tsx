"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Leaf, Settings, Bell, LogOut, Star, Calendar, Mail } from "lucide-react"
import Link from "next/link"

interface VendorHeaderProps {
  vendorData: {
    name: string
    contactName: string
    email: string
    memberSince: string
    regenScore: number
    nftLevel: string
  }
}

export default function VendorHeader({ vendorData }: VendorHeaderProps) {
  return (
    <header className="bg-white border-b border-gray-200">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          {/* Logo & Navigation */}
          <div className="flex items-center space-x-8">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-green-600 to-green-700 rounded-full flex items-center justify-center">
                <Leaf className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-green-800">EcoTech</span>
            </Link>

            <nav className="hidden md:flex items-center space-x-6">
              <Link href="/dashboard/vendor" className="text-green-600 font-medium">
                Dashboard
              </Link>
              <Link href="/dashboard/vendor/profile" className="text-gray-600 hover:text-green-600">
                Perfil
              </Link>
              <Link href="/dashboard/vendor/inventory" className="text-gray-600 hover:text-green-600">
                Inventario
              </Link>
              <Link href="/dashboard/vendor/orders" className="text-gray-600 hover:text-green-600">
                Pedidos
              </Link>
              <Link href="/dashboard/vendor/analytics" className="text-gray-600 hover:text-green-600">
                Analíticas
              </Link>
            </nav>
          </div>

          {/* User Info & Actions */}
          <div className="flex items-center space-x-4">
            <div className="hidden md:flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">{vendorData.name}</p>
                <div className="flex items-center space-x-2">
                  <Badge className="bg-green-100 text-green-800 text-xs">
                    <Star className="w-3 h-3 mr-1" />
                    REGEN {vendorData.regenScore}
                  </Badge>
                  <Badge className="bg-blue-100 text-blue-800 text-xs">{vendorData.nftLevel}</Badge>
                </div>
              </div>

              <Avatar>
                <AvatarFallback className="bg-green-100 text-green-700">
                  {vendorData.contactName
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
            </div>

            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="icon">
                <Bell className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="icon">
                <Settings className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="icon">
                <LogOut className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>

        {/* Vendor Info Bar */}
        <div className="mt-4 p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <Mail className="w-4 h-4 text-gray-500" />
                <span className="text-sm text-gray-600">{vendorData.email}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Calendar className="w-4 h-4 text-gray-500" />
                <span className="text-sm text-gray-600">
                  Miembro desde {new Date(vendorData.memberSince).toLocaleDateString()}
                </span>
              </div>
            </div>

            <Badge className="bg-yellow-100 text-yellow-800">Proveedor Verificado ✓</Badge>
          </div>
        </div>
      </div>
    </header>
  )
}
