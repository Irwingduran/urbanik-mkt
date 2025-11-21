import Link from 'next/link'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Home } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-10 px-4">
      <div className="max-w-lg w-full space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Página no encontrada</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-600">La página que buscas no existe o fue movida.</p>
            <Button asChild>
              <Link href="/">
                <Home className="w-4 h-4 mr-2" /> Volver al inicio
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
