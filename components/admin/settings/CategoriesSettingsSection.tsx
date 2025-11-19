"use client"
import { useEffect, useState } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Loader2 } from 'lucide-react'
import Link from 'next/link'

interface CategoryItem { id: string; name: string; slug: string; children: CategoryItem[] }

export default function CategoriesSettingsSection() {
  const [loading, setLoading] = useState(true)
  const [categories, setCategories] = useState<CategoryItem[]>([])
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch('/api/categories')
        const json = await res.json()
        if (json.success) setCategories(json.data)
        else setError('Error obteniendo categorías')
      } catch (e) {
        setError('Error de red')
      } finally {
        setLoading(false)
      }
    }
    fetchCategories()
  }, [])

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Categorías</CardTitle>
        <Link href="/dashboard/admin/categories" className="text-sm text-blue-600 hover:underline">Gestionar</Link>
      </CardHeader>
      <CardContent>
        {loading && (
          <div className="flex items-center gap-2 text-sm text-gray-500"><Loader2 className="w-4 h-4 animate-spin" />Cargando...</div>
        )}
        {error && <p className="text-sm text-red-600">{error}</p>}
        {!loading && !error && (
          <div className="space-y-3">
            <p className="text-xs text-gray-500">Total categorías raíz: {categories.length}</p>
            <Separator />
            <div className="flex flex-wrap gap-2">
              {categories.map(cat => (
                <div key={cat.id} className="border rounded px-3 py-1 bg-gray-50">
                  <p className="text-sm font-medium">{cat.name}</p>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {cat.children.map(ch => <Badge key={ch.id} className="bg-green-100 text-green-700">{ch.name}</Badge>)}
                    {cat.children.length === 0 && <span className="text-[10px] text-gray-400">Sin subcategorías</span>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        <div className="mt-6 text-xs text-gray-400">Futuro: CRUD completo con drag & drop y selección de íconos.</div>
      </CardContent>
    </Card>
  )
}
