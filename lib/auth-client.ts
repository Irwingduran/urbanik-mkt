import { Role } from "@prisma/client"

/**
 * Client-side auth helper functions
 * These functions work with the roles array from the session
 */

/**
 * Check if user has a specific role
 */
export function hasRole(userRoles: Role[], role: Role): boolean {
  return userRoles.includes(role)
}

/**
 * Check if user has any of the specified roles
 */
export function hasAnyRole(userRoles: Role[], roles: Role[]): boolean {
  return userRoles.some(role => roles.includes(role))
}

/**
 * Check if user has all specified roles
 */
export function hasAllRoles(userRoles: Role[], roles: Role[]): boolean {
  return roles.every(role => userRoles.includes(role))
}

/**
 * Check if user is a vendor
 */
export function isVendor(userRoles: Role[]): boolean {
  return hasRole(userRoles, 'VENDOR')
}

/**
 * Check if user is an admin
 */
export function isAdmin(userRoles: Role[]): boolean {
  return hasRole(userRoles, 'ADMIN')
}

/**
 * Check if user is a customer (or USER - treated as equivalent)
 */
export function isCustomer(userRoles: Role[]): boolean {
  return hasAnyRole(userRoles, ['CUSTOMER', 'USER'])
}

/**
 * Get the primary role for display purposes
 * Priority: ADMIN > VENDOR > USER/CUSTOMER
 */
export function getPrimaryRole(userRoles: Role[]): Role {
  if (userRoles.includes('ADMIN')) return 'ADMIN'
  if (userRoles.includes('VENDOR')) return 'VENDOR'
  if (userRoles.includes('CUSTOMER')) return 'CUSTOMER'
  if (userRoles.includes('USER')) return 'USER'
  return 'USER' // Default fallback
}
