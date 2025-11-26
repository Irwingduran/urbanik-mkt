import { prisma } from "@/lib/prisma"
import { sendEmail, emailTemplates } from "@/lib/email"
import { NotificationType } from "@prisma/client"

interface CreateNotificationParams {
  userId: string
  type: NotificationType
  title: string
  message: string
  actionUrl?: string
  productId?: string
  orderId?: string
  metadata?: Record<string, unknown> // For email context (e.g. order details)
}

export async function createNotification(params: CreateNotificationParams) {
  const { userId, type, title, message, actionUrl, productId, orderId, metadata } = params

  try {
    // 1. Create In-App Notification
    const notification = await prisma.notification.create({
      data: {
        userId,
        type,
        title,
        message,
        actionUrl,
        productId,
        orderId
      }
    })

    // 2. Send Email (Fire and forget, don't block)
    // We need to fetch user email first
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { email: true, name: true }
    })

    if (user?.email) {
      let emailSubject = title
      let emailHtml = `<p>${message}</p>`

      // Customize email content based on type
      switch (type) {
        case 'ORDER_CREATED':
        case 'PAYMENT_SUCCESS': // Treat payment success as order confirmation
          if (metadata?.recipientType === 'VENDOR') {
             emailSubject = `¡Nueva Orden Recibida! #${orderId?.slice(-8)}`
             emailHtml = emailTemplates.vendorNewOrder(orderId || 'N/A', (metadata.total as number) || 0)
          } else if (metadata?.total && metadata?.items) {
            emailSubject = `Confirmación de Pedido #${orderId?.slice(-8)}`
            emailHtml = emailTemplates.orderConfirmation(orderId || 'N/A', metadata.total as number, metadata.items as Array<{ product: { name: string }; quantity: number }>)
          }
          break
        
        case 'ORDER_SHIPPED':
          emailSubject = `Tu pedido #${orderId?.slice(-8)} ha sido enviado`
          emailHtml = emailTemplates.orderShipped(orderId || 'N/A', metadata?.trackingNumber as string | undefined)
          break

        case 'PRODUCT_REVIEW':
          const reviewer = (metadata?.userName || metadata?.reviewerName) as string
          if (metadata?.productName && reviewer) {
            emailSubject = `Nueva reseña para ${metadata.productName}`
            emailHtml = emailTemplates.productReview(
              metadata.productName as string, 
              reviewer, 
              metadata.rating as number, 
              metadata.comment as string
            )
          }
          break
      }

      // Wrap in basic template
      const fullHtml = `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background-color: #16a34a; padding: 20px; text-align: center;">
            <h2 style="color: white; margin: 0;">Regen Marketplace</h2>
          </div>
          <div style="padding: 20px; border: 1px solid #e5e7eb;">
            ${emailHtml}
            ${actionUrl ? `<div style="margin-top: 20px; text-align: center;">
              <a href="${process.env.NEXTAUTH_URL}${actionUrl}" style="background-color: #16a34a; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Ver Detalles</a>
            </div>` : ''}
          </div>
          <div style="text-align: center; padding: 20px; color: #6b7280; font-size: 12px;">
            <p>© ${new Date().getFullYear()} Regen Marketplace. Todos los derechos reservados.</p>
          </div>
        </div>
      `

      await sendEmail({
        to: user.email,
        subject: emailSubject,
        html: fullHtml
      })
    }

    return notification
  } catch (error) {
    console.error("Error creating notification:", error)
    // Don't throw, just return null or log, so main flow isn't interrupted
    return null
  }
}
