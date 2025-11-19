import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth-config"
import { prisma } from "@/lib/prisma"
import { writeFile, mkdir } from "fs/promises"
import { join } from "path"
import { existsSync } from "fs"

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      )
    }

    // Get user and vendor profile
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: {
        vendorProfile: true,
      },
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    if (!user.vendorProfile) {
      return NextResponse.json(
        { error: "Vendor profile not found. Complete vendor onboarding first." },
        { status: 404 }
      )
    }

    // Parse form data
    const formData = await request.formData()
    const type = formData.get("type") as string

    if (!type) {
      return NextResponse.json(
        { error: "RegenMark type is required" },
        { status: 400 }
      )
    }

    // Validate type
    const validTypes = [
      "CARBON_SAVER",
      "WATER_GUARDIAN",
      "CIRCULAR_CHAMPION",
      "HUMAN_FIRST",
      "HUMANE_HERO",
    ]
    if (!validTypes.includes(type)) {
      return NextResponse.json(
        { error: "Invalid RegenMark type" },
        { status: 400 }
      )
    }

    // Check if there's already a pending evaluation for this type
    const existingEvaluation = await prisma.regenMarkEvaluation.findFirst({
      where: {
        vendorProfileId: user.vendorProfile.id,
        type: type as any,
        status: {
          in: ["PENDING", "SUBMITTED", "IN_REVIEW", "AI_PROCESSING"],
        },
      },
    })

    if (existingEvaluation) {
      return NextResponse.json(
        {
          error: `Ya tienes una evaluación pendiente para ${type}. Por favor espera a que se complete antes de solicitar otra.`,
        },
        { status: 400 }
      )
    }

    // Process uploaded files
    const uploadedFiles: {
      url: string
      fileName: string
      fileSize: number
      mimeType: string
    }[] = []

    // Get all form data entries
    const entries = Array.from(formData.entries())
    const documentEntries = entries.filter(([key]) =>
      key.startsWith("document_")
    )

    if (documentEntries.length === 0) {
      return NextResponse.json(
        { error: "At least one document is required" },
        { status: 400 }
      )
    }

    // Create upload directory if it doesn't exist
    const uploadDir = join(process.cwd(), "public", "uploads", "regenmarks")
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true })
    }

    // Process each document
    for (const [key, value] of documentEntries) {
      if (value instanceof File) {
        const file = value as File
        const bytes = await file.arrayBuffer()
        const buffer = Buffer.from(bytes)

        // Generate unique filename
        const timestamp = Date.now()
        const randomString = Math.random().toString(36).substring(2, 15)
        const extension = file.name.split(".").pop()
        const fileName = `${type}_${timestamp}_${randomString}.${extension}`

        // Save file
        const filePath = join(uploadDir, fileName)
        await writeFile(filePath, buffer)

        // Store file info
        uploadedFiles.push({
          url: `/uploads/regenmarks/${fileName}`,
          fileName: file.name,
          fileSize: file.size,
          mimeType: file.type,
        })
      }
    }

    // Create RegenMark evaluation
    const evaluation = await prisma.regenMarkEvaluation.create({
      data: {
        vendorProfileId: user.vendorProfile.id,
        type: type as any,
        status: "SUBMITTED", // Skip payment for now
        stage: "SUBMITTED",
        submittedAt: new Date(),
        paymentStatus: "PENDING", // Will be implemented later
      },
    })

    // Create Document records
    await prisma.document.createMany({
      data: uploadedFiles.map((file) => ({
        regenMarkEvaluationId: evaluation.id,
        type: "OTHER", // Generic type for now
        name: file.fileName,
        url: file.url,
        fileName: file.fileName,
        fileSize: file.fileSize,
        mimeType: file.mimeType,
        uploadedBy: user.id,
      })),
    })

    // Create notification for admin
    await prisma.notification.create({
      data: {
        userId: user.id,
        type: "REGENMARK_SUBMITTED",
        title: "Solicitud de RegenMark Enviada",
        message: `Tu solicitud de evaluación para ${type} ha sido enviada. Te notificaremos cuando esté en revisión.`,
        actionUrl: "/dashboard/vendor/regenmarks",
      },
    })

    return NextResponse.json({
      success: true,
      message: "Solicitud de evaluación enviada exitosamente",
      evaluation: {
        id: evaluation.id,
        type: evaluation.type,
        status: evaluation.status,
        stage: evaluation.stage,
        submittedAt: evaluation.submittedAt,
      },
      documentsUploaded: uploadedFiles.length,
    })
  } catch (error) {
    console.error("Error creating RegenMark evaluation:", error)
    return NextResponse.json(
      { error: "Failed to submit evaluation request" },
      { status: 500 }
    )
  }
}
