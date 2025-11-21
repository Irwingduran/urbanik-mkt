"use client"

import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Leaf } from 'lucide-react'

const errorMap: Record<string, string> = {
  CredentialsSignin: 'Invalid email or password. Please verify and try again.',
  AccessDenied: 'You do not have permission to access this resource.',
  Configuration: 'Authentication configuration error. Contact support.',
  Verification: 'This sign in link is no longer valid. Request a new one.',
  Default: 'An unexpected authentication error occurred. Please retry.'
}

export default function AuthErrorPage() {
  const params = useSearchParams()
  const error = params.get('error') || 'Default'
  const callbackUrl = params.get('callbackUrl') || '/'
  const message = errorMap[error] || errorMap['Default']

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-10 px-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <Link href="/" className="flex items-center justify-center space-x-2 mb-6">
            <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
              <Leaf className="w-6 h-6 text-white" />
            </div>
            <span className="font-bold text-2xl text-gray-900">Urbanika Marketplace</span>
          </Link>
          <h2 className="text-3xl font-bold text-gray-900">Authentication Error</h2>
          <p className="mt-2 text-gray-600">We couldn't complete your sign in.</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Sign In Issue</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert variant="destructive">
              <AlertDescription>{message}</AlertDescription>
            </Alert>
            <div className="space-y-2 text-xs text-gray-500">
              <div>Error code: <span className="font-mono">{error}</span></div>
              {callbackUrl && callbackUrl !== '/' && (
                <div>Original destination: <span className="font-mono">{callbackUrl}</span></div>
              )}
            </div>
            <div className="flex gap-2">
              <Button asChild variant="secondary" className="flex-1">
                <Link href="/auth/signin">Try Again</Link>
              </Button>
              <Button asChild className="flex-1">
                <Link href="/">Go Home</Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="border-green-200">
          <CardContent className="pt-4 text-xs text-green-700 space-y-1">
            <p className="font-medium">Troubleshooting:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>Verify email & password spelling (no extra spaces).</li>
              <li>Ensure your account was seeded (run <code>npm run db:seed</code>).</li>
              <li>Check environment variable <code>NEXTAUTH_SECRET</code> is set.</li>
              <li>If Google OAuth, confirm client ID & secret exist.</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
