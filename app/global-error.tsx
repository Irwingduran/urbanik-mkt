"use client"

import { useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { RefreshCcw, Home } from 'lucide-react'

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }, reset: () => void }) {
  useEffect(() => {
    // eslint-disable-next-line no-console
    console.error('GlobalError:', error)
  }, [error])

  return (
    <html>
      <body>
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-10 px-4">
          <div className="max-w-lg w-full space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Ocurrió un error crítico</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Alert variant="destructive">
                  <AlertDescription>
                    Se produjo un problema crítico al cargar la aplicación.
                  </AlertDescription>
                </Alert>
                {error?.digest && (
                  <p className="text-xs text-gray-500">Referencia: {error.digest}</p>
                )}
                <div className="flex gap-2">
                  <Button onClick={() => reset()} className="flex-1">
                    <RefreshCcw className="w-4 h-4 mr-2" />
                    Reintentar
                  </Button>
                  <Button asChild variant="outline" className="flex-1">
                    <Link href="/">
                      <Home className="w-4 h-4 mr-2" />
                      Ir al inicio
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </body>
    </html>
  )
}
