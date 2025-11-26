import { logger } from "@/lib/logger"

interface EmailOptions {
  to: string
  subject: string
  html: string
}

/**
 * Mock email sender.
 * In production, replace this with Resend, SendGrid, or AWS SES.
 * 
 * Example with Resend:
 * import { Resend } from 'resend';
 * const resend = new Resend(process.env.RESEND_API_KEY);
 * await resend.emails.send({ from: 'onboarding@resend.dev', to, subject, html });
 */
export async function sendEmail({ to, subject, html }: EmailOptions): Promise<boolean> {
  // In a real app, you would check for process.env.NODE_ENV === 'production'
  // For this demo, we'll just log it.
  
  console.log("📧 [MOCK EMAIL] ---------------------------------------------------")
  console.log(`To: ${to}`)
  console.log(`Subject: ${subject}`)
  console.log(`Body (HTML preview): ${html.substring(0, 100)}...`)
  console.log("------------------------------------------------------------------")

  logger.info("email.sent", { to, subject })
  
  return true
}

export const emailTemplates = {
  orderConfirmation: (orderId: string, total: number, items: Array<{ product: { name: string }; quantity: number }>) => `
    <h1>¡Gracias por tu compra!</h1>
    <p>Tu pedido #${orderId.slice(-8)} ha sido confirmado.</p>
    <p>Total: $${total.toFixed(2)}</p>
    <h3>Productos:</h3>
    <ul>
      ${items.map(item => `<li>${item.product.name} x${item.quantity}</li>`).join('')}
    </ul>
    <p>Gracias por contribuir a un futuro más sostenible.</p>
  `,
  
  orderShipped: (orderId: string, trackingNumber?: string) => `
    <h1>¡Tu pedido está en camino!</h1>
    <p>El pedido #${orderId.slice(-8)} ha sido enviado.</p>
    ${trackingNumber ? `<p>Número de rastreo: ${trackingNumber}</p>` : ''}
    <p>Pronto recibirás tus productos sostenibles.</p>
  `,

  productReview: (productName: string, userName: string, rating: number, comment: string) => `
    <h1>Nueva Reseña Recibida</h1>
    <p><strong>${userName}</strong> ha calificado <strong>${productName}</strong></p>
    <p>Calificación: ${rating}/5 estrellas</p>
    <blockquote>"${comment}"</blockquote>
    <p>Ingresa a tu dashboard para responder.</p>
  `,

  vendorNewOrder: (orderId: string, total: number) => `
    <h1>¡Nueva Orden Recibida!</h1>
    <p>Has recibido una nueva orden #${orderId.slice(-8)}.</p>
    <p>Total: $${total.toFixed(2)}</p>
    <p>Ingresa a tu panel de vendedor para gestionar el envío.</p>
  `
}
