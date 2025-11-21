import { getServerSession } from "next-auth/next"
import { redirect } from "next/navigation"
import { Role } from "@prisma/client"
import { prisma } from "@/lib/prisma"
import { authOptions } from "@/lib/auth-config"

/**
 * Get the current authenticated user from server-side
 */
export async function getCurrentUser() {
  const session = await getServerSession(authOptions)
  return session?.user
}

/**
 * Get user roles from database
 */
export async function getUserRoles(userId: string): Promise<Role[]> {
  const userRoles = await prisma.userRole.findMany({
    where: {
      userId,
      active: true
    },
    select: { role: true }
  })

  return userRoles.map(ur => ur.role)
}

/**
 * Require authentication, redirect to login if not authenticated
 */
export async function requireAuth() {
  const session = await getServerSession(authOptions)
  if (!session) {
    redirect("/auth/signin")
  }
  return session.user
}

/**
 * Require user to have at least one of the allowed roles
 */
export async function requireRole(allowedRoles: Role[]) {
  const user = await requireAuth()

  // Check if user has any of the allowed roles
  const hasAllowedRole = user.roles.some(role => allowedRoles.includes(role))

  if (!hasAllowedRole) {
    redirect("/dashboard")
  }

  return user
}

/**
 * Require user to have all specified roles
 */
export async function requireAllRoles(requiredRoles: Role[]) {
  const user = await requireAuth()

  // Check if user has all required roles
  const hasAllRoles = requiredRoles.every(role => user.roles.includes(role))

  if (!hasAllRoles) {
    redirect("/dashboard")
  }

  return user
}

/**
 * Require vendor role (VENDOR or ADMIN)
 */
export async function requireVendor() {
  return requireRole(["VENDOR", "ADMIN"])
}

/**
 * Require admin role
 */
export async function requireAdmin() {
  return requireRole(["ADMIN"])
}

/**
 * Require customer role (CUSTOMER or ADMIN)
 */
export async function requireCustomer() {
  return requireRole(["CUSTOMER", "ADMIN"])
}

// ============================================
// CLIENT-SIDE HELPER FUNCTIONS
// ============================================

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
  return roles.some(role => userRoles.includes(role))
}

/**
 * Check if user has all of the specified roles
 */
export function hasAllRoles(userRoles: Role[], roles: Role[]): boolean {
  return roles.every(role => userRoles.includes(role))
}

/**
 * Check if user is a vendor (has VENDOR or ADMIN role)
 */
export function isVendor(userRoles: Role[]): boolean {
  return hasAnyRole(userRoles, ["VENDOR", "ADMIN"])
}

/**
 * Check if user is an admin
 */
export function isAdmin(userRoles: Role[]): boolean {
  return hasRole(userRoles, "ADMIN")
}

/**
 * Check if user is a customer (has CUSTOMER role)
 */
export function isCustomer(userRoles: Role[]): boolean {
  return hasAnyRole(userRoles, ["CUSTOMER", "ADMIN"])
}

/**
 * Get primary role for display purposes
 * Priority: ADMIN > VENDOR > CUSTOMER > USER (deprecated)
 */
export function getPrimaryRole(userRoles: Role[]): Role {
  if (userRoles.includes("ADMIN")) return "ADMIN"
  if (userRoles.includes("VENDOR")) return "VENDOR"
  if (userRoles.includes("CUSTOMER")) return "CUSTOMER"
  return "USER" // Fallback for legacy users
}