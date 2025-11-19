'use client'

import { ReactNode } from 'react'
import { AdminSidebar } from '@/components/admin/AdminSidebar'
import { useSession } from 'next-auth/react'
import { redirect } from 'next/navigation'

interface AdminLayoutProps {
  children: ReactNode
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const { data: session, status } = useSession()

  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin">
          <div className="h-12 w-12 border-4 border-gray-300 border-t-green-600 rounded-full"></div>
        </div>
      </div>
    )
  }

  if (!session || session.user.role !== 'ADMIN') {
    redirect('/signin')
  }

  return (
    <div className="flex">
      <AdminSidebar />
      <main className="ml-64 flex-1 min-h-screen bg-gray-50">
        {children}
      </main>
    </div>
  )
}
