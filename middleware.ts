import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token
    const { pathname } = req.nextUrl

    // Role-based route protection
    if (pathname.startsWith("/dashboard")) {
      // Admin routes - only ADMIN role
      if (pathname.startsWith("/dashboard/admin")) {
        if (token?.role !== "ADMIN") {
          return NextResponse.redirect(new URL("/dashboard", req.url))
        }
      }

      // Vendor routes - VENDOR or ADMIN roles
      if (pathname.startsWith("/dashboard/vendor")) {
        if (token?.role !== "VENDOR" && token?.role !== "ADMIN") {
          return NextResponse.redirect(new URL("/dashboard", req.url))
        }
      }

      // User/Customer routes - USER or ADMIN roles
      if (pathname.startsWith("/dashboard/user")) {
        if (token?.role !== "USER" && token?.role !== "ADMIN") {
          return NextResponse.redirect(new URL("/dashboard", req.url))
        }
      }
    }

    // API route protection
    if (pathname.startsWith("/api")) {
      // Admin API routes
      if (pathname.startsWith("/api/admin")) {
        if (token?.role !== "ADMIN") {
          return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
        }
      }

      // Vendor API routes
      if (pathname.startsWith("/api/vendor")) {
        if (token?.role !== "VENDOR" && token?.role !== "ADMIN") {
          return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
        }
      }

      // User API routes
      if (pathname.startsWith("/api/user")) {
        if (token?.role !== "USER" && token?.role !== "ADMIN") {
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
            pathname.startsWith("/api/auth") ||
            pathname.startsWith("/api/public")) {
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
    "/api/user/:path*"
  ],
}
