import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth-config'
import { prisma } from '@/lib/prisma'
import { Prisma, ApplicationStatus } from '@prisma/client'
import { VendorApplicationsTable } from '@/components/admin/VendorApplicationsTable'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Store, Clock, CheckCircle, XCircle } from 'lucide-react'

export default async function AdminVendorsPage({ searchParams }: { searchParams: { [key: string]: string | string[] | undefined } }) {
  const session = await getServerSession(authOptions)

  // Check if user is authenticated and is admin
  if (!session || session.user.role !== 'ADMIN') {
    redirect('/dashboard')
  }

  const statusParam = typeof searchParams?.status === 'string' ? searchParams.status.toUpperCase() : undefined
  const where: Prisma.VendorApplicationWhereInput = {}
  if (statusParam && ['PENDING', 'IN_REVIEW', 'APPROVED', 'REJECTED'].includes(statusParam)) {
    where.status = statusParam as ApplicationStatus
  }

  // Fetch initial data (respect searchParams.status when present)
  const [applications, totalCount, stats] = await Promise.all([
    prisma.vendorApplication.findMany({
      where,
      take: 20,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            createdAt: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    }),

    prisma.vendorApplication.count({ where }),

    // Get stats for each status
    prisma.$transaction([
      prisma.vendorApplication.count({ where: { status: 'PENDING' } }),
      prisma.vendorApplication.count({ where: { status: 'IN_REVIEW' } }),
      prisma.vendorApplication.count({ where: { status: 'APPROVED' } }),
      prisma.vendorApplication.count({ where: { status: 'REJECTED' } })
    ])
  ])

  const [pendingCount, inReviewCount, approvedCount, rejectedCount] = stats

  const initialMeta = {
    total: totalCount,
    page: 1,
    limit: 20,
    totalPages: Math.ceil(totalCount / 20),
    hasNext: totalCount > 20,
    hasPrev: false
  }

  return (
    <>
      <div className="p-6 space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2 text-gray-600">
                <Clock className="w-4 h-4 text-yellow-600" />
                Pendientes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-yellow-600">{pendingCount}</div>
              <p className="text-xs text-gray-500 mt-1">Esperando revisión</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2 text-gray-600">
                <Store className="w-4 h-4 text-blue-600" />
                En Revisión
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-600">{inReviewCount}</div>
              <p className="text-xs text-gray-500 mt-1">Siendo evaluadas</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2 text-gray-600">
                <CheckCircle className="w-4 h-4 text-green-600" />
                Aprobadas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">{approvedCount}</div>
              <p className="text-xs text-gray-500 mt-1">Vendedores activos</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2 text-gray-600">
                <XCircle className="w-4 h-4 text-red-600" />
                Rechazadas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-red-600">{rejectedCount}</div>
              <p className="text-xs text-gray-500 mt-1">No aprobadas</p>
            </CardContent>
          </Card>
        </div>

        {/* Applications Table */}
        <VendorApplicationsTable
          initialApplications={JSON.parse(JSON.stringify(applications))}
          initialMeta={initialMeta}
          initialStatusFilter={statusParam || 'all'}
        />
      </div>
    </>
  )
}
