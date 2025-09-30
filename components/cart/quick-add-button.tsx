"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { ShoppingCart, Check, Loader2 } from 'lucide-react'
import { useAppDispatch } from '@/src/shared/store/hooks'
import { addItem } from '@/src/shared/store/slices/cartSlice'

interface Product {
  id: string
  name: string
  vendor: string
  price: number
  image: string
  stock: number
  maxOrderQuantity: number
  inStock: boolean
}

interface QuickAddButtonProps {
  product: Product
  className?: string
  size?: 'sm' | 'default' | 'lg'
  variant?: 'default' | 'outline' | 'ghost'
}

export function QuickAddButton({
  product,
  className = "",
  size = "sm",
  variant = "default"
}: QuickAddButtonProps) {
  const dispatch = useAppDispatch()
  const [isAdding, setIsAdding] = useState(false)
  const [justAdded, setJustAdded] = useState(false)

  const handleQuickAdd = async () => {
    if (!product.inStock || isAdding || justAdded) return

    setIsAdding(true)

    // Simulate a quick add animation
    setTimeout(() => {
      dispatch(addItem({
        productId: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        vendorId: product.vendor,
        vendorName: product.vendor,
        maxStock: Math.min(product.stock, product.maxOrderQuantity)
      }))

      setIsAdding(false)
      setJustAdded(true)

      // Reset the "just added" state after 2 seconds
      setTimeout(() => {
        setJustAdded(false)
      }, 2000)
    }, 500)
  }

  if (justAdded) {
    return (
      <Button
        size={size}
        variant="outline"
        className={`${className} border-green-500 text-green-600 bg-green-50`}
        disabled
      >
        <Check className="w-4 h-4 mr-2" />
        Añadido
      </Button>
    )
  }

  return (
    <Button
      size={size}
      variant={variant}
      className={`${className} ${variant === 'default' ? 'bg-green-600 hover:bg-green-700 text-white' : ''}`}
      onClick={handleQuickAdd}
      disabled={!product.inStock || isAdding}
    >
      {isAdding ? (
        <>
          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          Añadiendo...
        </>
      ) : (
        <>
          <ShoppingCart className="w-4 h-4 mr-2" />
          {product.inStock ? 'Añadir' : 'Sin Stock'}
        </>
      )}
    </Button>
  )
}