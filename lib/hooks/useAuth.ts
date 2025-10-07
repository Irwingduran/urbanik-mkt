import { useSession } from "next-auth/react"
import { Role } from "@prisma/client"
import { hasRole, hasAnyRole, isVendor, isAdmin, isCustomer, getPrimaryRole } from "@/lib/auth-client"

export function useAuth() {
  const { data: session, status } = useSession()

  return {
    user: session?.user,
    isLoading: status === "loading",
    isAuthenticated: !!session,
    role: session?.user?.role, // Deprecated - use roles or primaryRole
    roles: session?.user?.roles || [],
    primaryRole: session?.user?.roles ? getPrimaryRole(session.user.roles) : 'USER',
  }
}

export function useRequireAuth() {
  const { user, isLoading, isAuthenticated } = useAuth()

  if (isLoading) return { user: null, isLoading: true }
  if (!isAuthenticated) throw new Error("Authentication required")

  return { user, isLoading: false }
}

export function useRequireRole(allowedRoles: Role[]) {
  const { user, isLoading, roles } = useAuth()

  if (isLoading) return { user: null, isLoading: true }
  if (!user || !hasAnyRole(roles, allowedRoles)) {
    throw new Error("Insufficient permissions")
  }

  return { user, isLoading: false }
}

export function useHasRole(role: Role): boolean {
  const { roles } = useAuth()
  return hasRole(roles, role)
}

export function useHasAnyRole(checkRoles: Role[]): boolean {
  const { roles } = useAuth()
  return hasAnyRole(roles, checkRoles)
}

export function useIsVendor(): boolean {
  const { roles } = useAuth()
  return isVendor(roles)
}

export function useIsAdmin(): boolean {
  const { roles } = useAuth()
  return isAdmin(roles)
}

export function useIsCustomer(): boolean {
  const { roles } = useAuth()
  return isCustomer(roles)
}

// Legacy compatibility hooks (deprecated)
export function useIsUser(): boolean {
  const { roles } = useAuth()
  // Check for both USER and CUSTOMER (treated as equivalent)
  return hasAnyRole(roles, ['USER', 'CUSTOMER'])
}