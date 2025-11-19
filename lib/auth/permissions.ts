import type { Role } from '@prisma/client'

// Central capability matrix per role. Keep coarse-grained and expand as needed.
export const Permissions = {
  view: {
    marketplace: ['CUSTOMER', 'VENDOR', 'ADMIN'],
    dashboardUser: ['CUSTOMER', 'VENDOR', 'ADMIN'],
    dashboardVendor: ['VENDOR', 'ADMIN'],
    dashboardAdmin: ['ADMIN']
  },
  manage: {
    products: ['VENDOR', 'ADMIN'],
    orders: ['VENDOR', 'ADMIN'],
    users: ['ADMIN'],
    vendors: ['ADMIN']
  }
} as const

type Matrix = typeof Permissions

export function can(roleList: Role[] = [], action: keyof Matrix, resource: keyof Matrix[keyof Matrix]): boolean {
  const allowed = Permissions[action][resource] as Role[]
  return roleList.some(r => allowed.includes(r))
}

export function requirePermission(roleList: Role[], action: keyof Matrix, resource: keyof Matrix[keyof Matrix]) {
  if (!can(roleList, action, resource)) {
    throw new Error('FORBIDDEN')
  }
}
