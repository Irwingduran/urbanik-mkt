'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

interface ApiData {
  database: {
    email: string
    name: string
    role: string
    userRoles: Array<{ role: string }>
  }
  middleware_check: {
    hasVendorRole: boolean
    canAccessVendorDashboard: boolean
    canAccessAdminDashboard: boolean
  }
}

export default function DebugSessionPage() {
  const { data: session, status } = useSession()
  const [apiData, setApiData] = useState<ApiData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/debug/session')
        const data = await response.json()
        setApiData(data)
      } catch (error) {
        console.error('Error fetching debug data:', error)
      } finally {
        setLoading(false)
      }
    }

    if (status === 'authenticated') {
      fetchData()
    }
  }, [status])

  if (status === 'unauthenticated') {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold mb-4">🔍 Debug Session</h1>
          <p className="text-red-600">❌ No estás autenticado. Por favor inicia sesión.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">🔍 Debug Session Info</h1>

        {/* Session Data */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>📋 Session Data (NextAuth)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {session?.user && (
              <>
                <div>
                  <label className="font-semibold">Email:</label>
                  <p className="text-gray-600">{session.user.email}</p>
                </div>
                <div>
                  <label className="font-semibold">Name:</label>
                  <p className="text-gray-600">{session.user.name}</p>
                </div>
                <div>
                  <label className="font-semibold">ID:</label>
                  <p className="text-gray-600 font-mono text-sm">{session.user.id}</p>
                </div>
                <div>
                  <label className="font-semibold">Role (deprecated):</label>
                  <p className="text-gray-600">{session.user.role}</p>
                </div>
                <div>
                  <label className="font-semibold">Roles (Active):</label>
                  <div className="flex gap-2 flex-wrap">
                    {(session.user.roles as string[])?.map((role) => (
                      <Badge key={role} className="bg-blue-600">{role}</Badge>
                    ))}
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Database Data */}
        {!loading && apiData?.database && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>🗄️ Database Data</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="font-semibold">Email:</label>
                <p className="text-gray-600">{apiData.database.email}</p>
              </div>
              <div>
                <label className="font-semibold">Name:</label>
                <p className="text-gray-600">{apiData.database.name}</p>
              </div>
              <div>
                <label className="font-semibold">Role (main):</label>
                <Badge className="bg-green-600">{apiData.database.role}</Badge>
              </div>
              <div>
                <label className="font-semibold">Active Roles (userRoles table):</label>
                <div className="flex gap-2 flex-wrap">
                  {apiData.database.userRoles?.map((ur) => (
                    <Badge key={ur.role} className="bg-purple-600">{ur.role}</Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Middleware Check */}
        {!loading && apiData?.middleware_check && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>🛡️ Middleware Access Check</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-100 rounded-lg">
                <span>Has VENDOR role:</span>
                <Badge 
                  className={apiData.middleware_check.hasVendorRole ? "bg-green-600" : "bg-red-600"}
                >
                  {apiData.middleware_check.hasVendorRole ? "✅ YES" : "❌ NO"}
                </Badge>
              </div>
              <div className="flex items-center justify-between p-4 bg-gray-100 rounded-lg">
                <span>Can access /dashboard/vendor:</span>
                <Badge 
                  className={apiData.middleware_check.canAccessVendorDashboard ? "bg-green-600" : "bg-red-600"}
                >
                  {apiData.middleware_check.canAccessVendorDashboard ? "✅ YES" : "❌ NO"}
                </Badge>
              </div>
              <div className="flex items-center justify-between p-4 bg-gray-100 rounded-lg">
                <span>Can access /dashboard/admin:</span>
                <Badge 
                  className={apiData.middleware_check.canAccessAdminDashboard ? "bg-green-600" : "bg-red-600"}
                >
                  {apiData.middleware_check.canAccessAdminDashboard ? "✅ YES" : "❌ NO"}
                </Badge>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Troubleshooting */}
        <Card>
          <CardHeader>
            <CardTitle>🔧 Troubleshooting</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {apiData?.middleware_check?.canAccessVendorDashboard ? (
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-green-900 font-semibold">✅ You should be able to access /dashboard/vendor!</p>
                <p className="text-green-800 text-sm mt-2">Try going to: <a href="/dashboard/vendor" className="underline font-mono">/dashboard/vendor</a></p>
              </div>
            ) : (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg space-y-2">
                <p className="text-red-900 font-semibold">❌ You cannot access /dashboard/vendor</p>
                <p className="text-red-800 text-sm">Your roles are: <strong>{session?.user?.roles?.join(', ') || 'USER'}</strong></p>
                <p className="text-red-800 text-sm">You need role: <strong>VENDOR or ADMIN</strong></p>
              </div>
            )}

            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg space-y-2">
              <p className="font-semibold text-blue-900">💡 What to do:</p>
              <ol className="text-sm text-blue-800 list-decimal list-inside space-y-1">
                <li>Check if &quot;Can access /dashboard/vendor&quot; is ✅ YES</li>
                <li>If NO, your user doesn&apos;t have VENDOR role in the database</li>
                <li>Ask an admin to give you VENDOR role, or:</li>
                <li>Run: <code className="bg-white px-2 py-1 rounded font-mono">node scripts/make-vendor.js</code></li>
                <li>After changing role, <strong>close this tab completely</strong></li>
                <li>Open a new tab and try again</li>
              </ol>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
