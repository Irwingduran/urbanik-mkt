'use client'

// Shopping cart counter component using Redux

import Link from 'next/link'
import { ShoppingCart } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useAppSelector, useAppDispatch } from '@/src/shared/store/hooks'
import { selectCartCount, selectCartTotal, toggleCart } from '@/src/shared/store/slices/cartSlice'

export function CartCounter() {
  const dispatch = useAppDispatch()
  const cartCount = useAppSelector(selectCartCount)
  const cartTotal = useAppSelector(selectCartTotal)

  const handleClick = () => {
    dispatch(toggleCart())
  }

  return (
    <div className="flex items-center space-x-2">
      {/* Cart Sidebar Toggle */}
      <Button
        variant="outline"
        size="sm"
        className="relative"
        onClick={handleClick}
      >
        <ShoppingCart className="w-4 h-4" />
        {cartCount > 0 && (
          <Badge
            variant="destructive"
            className="absolute -top-2 -right-2 w-5 h-5 p-0 flex items-center justify-center text-xs"
          >
            {cartCount}
          </Badge>
        )}
        {cartTotal > 0 && (
          <span className="ml-2 text-sm font-medium hidden sm:inline">
            ${cartTotal.toFixed(2)}
          </span>
        )}
      </Button>

      {/* Link to full cart page (mobile friendly) */}
      {cartCount > 0 && (
        <Link href="/cart" className="hidden sm:block">
          <Button variant="ghost" size="sm" className="text-green-600 hover:text-green-700">
            Ver Carrito
          </Button>
        </Link>
      )}
    </div>
  )
}