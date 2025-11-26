import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth-config"
import { prisma } from "@/lib/prisma"
import { Prisma, ApplicationStatus } from '@prisma/client'

// GET /api/admin/vendors - List all vendor applications with pagination
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get("page") || "1")
    const limit = parseInt(searchParams.get("limit") || "20")
    const status = searchParams.get("status") // PENDING, IN_REVIEW, APPROVED, REJECTED
    const search = searchParams.get("search")

    const skip = (page - 1) * limit

    // Build where clause
    const where: Prisma.VendorApplicationWhereInput = {}

    if (status) {
      where.status = status.toUpperCase() as ApplicationStatus
    }

    if (search) {
      where.OR = [
        { companyName: { contains: search, mode: "insensitive" } },
        { user: { name: { contains: search, mode: "insensitive" } } },
        { user: { email: { contains: search, mode: "insensitive" } } }
      ]
    }

    const [applications, totalCount] = await Promise.all([
      prisma.vendorApplication.findMany({
        where,
        skip,
        take: limit,
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
        orderBy: { createdAt: "desc" }
      }),

      prisma.vendorApplication.count({ where })
    ])

    const totalPages = Math.ceil(totalCount / limit)

    return NextResponse.json({
      success: true,
      data: applications,
      meta: {
        total: totalCount,
        page,
        limit,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1
      }
    })

  } catch (error) {
    console.error("Admin vendors list error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

// POST /api/admin/vendors - Approve/Reject vendor application
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    const body = await request.json()
    const { applicationId, action, rejectionReason, internalNotes } = body
    // action: approve, reject, review

    if (!applicationId || !action) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    // Get the application
    const application = await prisma.vendorApplication.findUnique({
      where: { id: applicationId },
      include: { user: true }
    })

    if (!application) {
      return NextResponse.json({ error: "Application not found" }, { status: 404 })
    }

    const adminUser = await prisma.user.findUnique({
      where: { email: session.user.email }
    })

    if (!adminUser) {
      return NextResponse.json({ error: "Admin user not found" }, { status: 404 })
    }

    let updatedApplication
    let vendorProfile

    switch (action) {
      case "approve":
        // Update application status
        updatedApplication = await prisma.vendorApplication.update({
          where: { id: applicationId },
          data: {
            status: "APPROVED",
            reviewedBy: adminUser.id,
            reviewedAt: new Date(),
            internalNotes: internalNotes || null
          }
        })

        // Grant VENDOR role to user
        await prisma.userRole.upsert({
          where: {
            userId_role: {
              userId: application.userId,
              role: "VENDOR"
            }
          },
          create: {
            userId: application.userId,
            role: "VENDOR",
            grantedBy: adminUser.id,
            active: true
          },
          update: {
            active: true,
            grantedBy: adminUser.id
          }
        })

        // Create VendorProfile
        vendorProfile = await prisma.vendorProfile.upsert({
          where: { userId: application.userId },
          create: {
            userId: application.userId,
            companyName: application.companyName,
            businessType: application.businessType,
            description: application.description,
            website: application.website,
            businessPhone: application.businessPhone,
            businessAddress: application.businessAddress,
            taxId: application.taxId,
            verificationStatus: "VERIFIED",
            verifiedAt: new Date(),
            verifiedBy: adminUser.id,
            onboardingStatus: "APPROVED",
            active: true,
            certifications: ((application.documents as Record<string, unknown>)?.certifications as string[]) || []
          },
          update: {
            companyName: application.companyName,
            businessType: application.businessType,
            description: application.description,
            website: application.website,
            businessPhone: application.businessPhone,
            businessAddress: application.businessAddress,
            verificationStatus: "VERIFIED",
            verifiedAt: new Date(),
            verifiedBy: adminUser.id,
            active: true
          }
        })

        // Create notification for vendor approval
        await prisma.notification.create({
          data: {
            userId: application.userId,
            type: "VENDOR_APPROVED",
            title: "¡Solicitud Aprobada! 🎉",
            message: `¡Felicitaciones! Tu solicitud para vender en Urbanika ha sido aprobada. Ya puedes comenzar a agregar productos y gestionar tu tienda.`,
            actionUrl: "/dashboard/vendor",
            read: false
          }
        })
        break

      case "reject":
        updatedApplication = await prisma.vendorApplication.update({
          where: { id: applicationId },
          data: {
            status: "REJECTED",
            reviewedBy: adminUser.id,
            reviewedAt: new Date(),
            rejectionReason: rejectionReason || "No especificado",
            internalNotes: internalNotes || null
          }
        })

        // Create notification for vendor rejection
        await prisma.notification.create({
          data: {
            userId: application.userId,
            type: "VENDOR_REJECTED",
            title: "Solicitud No Aprobada",
            message: `Lamentablemente tu solicitud para ser vendedor no fue aprobada. Razón: ${rejectionReason || "No especificada"}. Puedes volver a aplicar después de revisar los requisitos.`,
            actionUrl: "/onboarding",
            read: false
          }
        })
        break

      case "review":
        updatedApplication = await prisma.vendorApplication.update({
          where: { id: applicationId },
          data: {
            status: "IN_REVIEW",
            internalNotes: internalNotes || null
          }
        })

        // Create notification for in review status
        await prisma.notification.create({
          data: {
            userId: application.userId,
            type: "VENDOR_IN_REVIEW",
            title: "Solicitud en Revisión",
            message: `Tu solicitud para ser vendedor está siendo revisada por nuestro equipo. Te notificaremos pronto con una decisión.`,
            actionUrl: "/dashboard",
            read: false
          }
        })
        break

      default:
        return NextResponse.json({ error: "Invalid action" }, { status: 400 })
    }

    return NextResponse.json({
      success: true,
      data: updatedApplication,
      vendorProfile: vendorProfile || null,
      message: action === "approve"
        ? "Solicitud aprobada exitosamente"
        : action === "reject"
        ? "Solicitud rechazada"
        : "Solicitud marcada como en revisión"
    })

  } catch (error) {
    console.error("Admin vendor action error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}