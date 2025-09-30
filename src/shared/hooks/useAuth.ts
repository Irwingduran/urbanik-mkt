import { useSession } from "next-auth/react"
import { UserRole } from "@/src/shared/types/api.types"

export function useAuth() {
  const { data: session, status } = useSession()

  return {
    user: session?.user,
    isLoading: status === "loading",
    isAuthenticated: !!session,
    role: session?.user?.role as UserRole,
  }
}

export function useRequireAuth() {
  const { user, isLoading, isAuthenticated } = useAuth()

  if (isLoading) return { user: null, isLoading: true }
  if (!isAuthenticated) throw new Error("Authentication required")

  return { user, isLoading: false }
}

export function useRequireRole(allowedRoles: UserRole[]) {
  const { user, isLoading } = useRequireAuth()

  if (isLoading) return { user: null, isLoading: true }
  if (!user || !allowedRoles.includes(user.role)) {
    throw new Error("Insufficient permissions")
  }

  return { user, isLoading: false }
}

export function useIsVendor() {
  const { role } = useAuth()
  return role === "VENDOR" || role === "ADMIN"
}

export function useIsAdmin() {
  const { role } = useAuth()
  return role === "ADMIN"
}

export function useIsUser() {
  const { role } = useAuth()
  return role === "USER" || role === "ADMIN"
}