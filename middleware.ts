import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"
import { Role } from "@prisma/client"

// Helper function to check if user has any of the allowed roles
function hasAnyRole(userRoles: Role[] | undefined, allowedRoles: Role[]): boolean {
  if (!userRoles || userRoles.length === 0) return false
  return userRoles.some(role => allowedRoles.includes(role))
}

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token
    const { pathname } = req.nextUrl

    // Get user roles from token (new system) or fallback to single role
    const userRoles = (token?.roles as Role[]) || []

    // Role-based route protection
    if (pathname.startsWith("/dashboard")) {
      // Admin routes - only ADMIN role
      if (pathname.startsWith("/dashboard/admin")) {
        if (!hasAnyRole(userRoles, ["ADMIN"])) {
          return NextResponse.redirect(new URL("/dashboard", req.url))
        }
      }

      // Vendor routes - VENDOR or ADMIN roles
      if (pathname.startsWith("/dashboard/vendor")) {
        if (!hasAnyRole(userRoles, ["VENDOR", "ADMIN"])) {
          return NextResponse.redirect(new URL("/dashboard", req.url))
        }
      }

      // User/Customer routes - CUSTOMER or ADMIN roles
      if (pathname.startsWith("/dashboard/user")) {
        if (!hasAnyRole(userRoles, ["CUSTOMER", "USER", "ADMIN"])) {
          return NextResponse.redirect(new URL("/dashboard", req.url))
        }
      }
    }

    // API route protection
    if (pathname.startsWith("/api")) {
      // Admin API routes
      if (pathname.startsWith("/api/admin")) {
        if (!hasAnyRole(userRoles, ["ADMIN"])) {
          return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
        }
      }

      // Vendor API routes
      if (pathname.startsWith("/api/vendor")) {
        if (!hasAnyRole(userRoles, ["VENDOR", "ADMIN"])) {
          return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
        }
      }

      // User API routes (support both CUSTOMER and legacy USER)
      if (pathname.startsWith("/api/user")) {
        if (!hasAnyRole(userRoles, ["CUSTOMER", "USER", "ADMIN"])) {
          return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
        }
      }
    }

    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl

        // Allow access to public pages
        if (pathname === "/" ||
            pathname.startsWith("/auth") ||
            pathname.startsWith("/marketplace") ||
            pathname.startsWith("/products") ||
            pathname.startsWith("/become-vendor") ||
            pathname.startsWith("/onboarding") ||
            pathname.startsWith("/api/auth") ||
            pathname.startsWith("/api/public") ||
            pathname.startsWith("/api/products")) {
          return true
        }

        // Require authentication for protected routes
        return !!token
      },
    },
  },
)

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/api/protected/:path*",
    "/api/admin/:path*",
    "/api/vendor/:path*",
    "/api/user/:path*",
    "/become-vendor/:path*"
  ],
}
