import { getServerSession } from "next-auth/next"
import { redirect } from "next/navigation"
import { UserRole } from "@/src/shared/types/api.types"

export async function getCurrentUser() {
  const session = await getServerSession()
  return session?.user
}

export async function requireAuth() {
  const session = await getServerSession()
  if (!session) {
    redirect("/auth/signin")
  }
  return session.user
}

export async function requireRole(allowedRoles: UserRole[]) {
  const user = await requireAuth()

  if (!allowedRoles.includes(user.role)) {
    redirect("/dashboard")
  }

  return user
}

export async function requireVendor() {
  return requireRole(["VENDOR", "ADMIN"])
}

export async function requireAdmin() {
  return requireRole(["ADMIN"])
}

export function hasRole(userRole: UserRole, requiredRoles: UserRole[]): boolean {
  return requiredRoles.includes(userRole)
}

export function isVendor(userRole: UserRole): boolean {
  return hasRole(userRole, ["VENDOR", "ADMIN"])
}

export function isAdmin(userRole: UserRole): boolean {
  return hasRole(userRole, ["ADMIN"])
}

export function isUser(userRole: UserRole): boolean {
  return hasRole(userRole, ["USER", "ADMIN"])
}