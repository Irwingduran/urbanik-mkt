// Runtime enum para garantizar valores disponibles en componentes cliente
// Usamos valores en mayúsculas para alinearnos con tipos legacy y facilitar normalización.
export enum NotificationType {
  SUCCESS = 'SUCCESS',
  INFO = 'INFO',
  WARNING = 'WARNING',
  ERROR = 'ERROR'
}

export interface NotificationBase {
  id: string
  // Puede venir un string legacy (e.g. "DELIVERED"), se normaliza a uno del enum en la UI.
  type: string
  title: string
  message?: string
  createdAt: string // ISO
  read: boolean
  // Opcionales para acciones rápidas (se incluyen aquí para evitar uniones complejas en el UI)
  actionLabel?: string
  actionHref?: string
}

// Se mantiene por compatibilidad si en el futuro se desea discriminar.
export type ActionableNotification = NotificationBase

export type Notification = NotificationBase