// Enhanced authentication configuration with role-based access
import { NextAuthOptions } from "next-auth"
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import { prisma } from "./prisma"
import CredentialsProvider from "next-auth/providers/credentials"
import { logger } from "@/lib/logger"
import GoogleProvider from "next-auth/providers/google"
import { createTracer } from "@/lib/trace"
import bcrypt from "bcryptjs"
// Define Role type manually to avoid import issues
// CUSTOMER and USER are treated as equivalent
type Role = 'USER' | 'CUSTOMER' | 'VENDOR' | 'ADMIN'

// Extended user type with role
declare module "next-auth" {
  interface Session {
    user: {
      id: string
      email: string
      name?: string
      role: Role // Deprecated - use roles
      roles: Role[] // New multi-role system
      image?: string
    }
  }

  interface User {
    role: Role // Deprecated - use roles
    roles?: Role[] // New multi-role system
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role: Role // Deprecated - use roles
    roles?: Role[] // New multi-role system
    userId: string
  }
}

const baseProviders: NextAuthOptions["providers"] = []

baseProviders.push(
  CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          logger.debug("authorize.missing_fields", { emailPresent: !!credentials?.email, passwordPresent: !!credentials?.password })
          return null
        }
        logger.debug("authorize.start", { email: credentials.email.trim(), passwordLength: credentials.password.length })
        const tracer = createTracer("auth.credentials.authorize")
        const user = await tracer.span("fetchUser", async () => prisma.user.findUnique({
          where: { email: credentials.email },
          include: {
            profile: true,
            vendor: true,
            userRoles: {
              where: { active: true },
              select: { role: true }
            }
          }
        }))

        logger.debug("authorize.post_fetch", { email: credentials.email.trim(), userFound: !!user, hasPassword: !!user?.password })

        if (!user || !user.password) {
          logger.debug("authorize.user_not_found_or_no_password", { email: credentials.email })
          return null
        }

        const userPassword = user.password
        const inputPassword = credentials.password as string

        let isPasswordValid = false
        try {
          isPasswordValid = await tracer.span("bcrypt.compare", async () => bcrypt.compare(inputPassword, userPassword))
          logger.debug("authorize.password_compared", { email: credentials.email.trim(), result: isPasswordValid })
        } catch (err) {
          const message = err instanceof Error ? err.message : 'Unknown error'
          logger.error("authorize.bcrypt_error", { email: credentials.email, error: message })
          return null
        }

        if (!isPasswordValid) {
          logger.debug("authorize.invalid_password", { email: credentials.email })
          return null
        }

        // Build roles array: use userRoles if available, fallback to user.role
        const roles = user.userRoles.length > 0
          ? user.userRoles.map(ur => ur.role as Role)
          : [user.role as Role]

        tracer.start("authorize.success")({ email: credentials.email, roles })
        logger.info("authorize.success", { email: credentials.email.trim(), roles })
        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          roles: roles,
          image: user.image,
        }
      },
    })
)

// Only add Google provider if env vars are present to avoid runtime init errors
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  baseProviders.push(
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    })
  )
} else {
  logger.warn("google_provider.disabled", { reason: "Missing GOOGLE_CLIENT_ID/GOOGLE_CLIENT_SECRET" })
}

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: baseProviders,
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user, trigger }) {
      // Initial sign in - get roles from user object or fetch fresh from DB
      if (user) {
        token.userId = user.id
        token.role = user.role
        // Use roles from authorize() response if available, otherwise fallback to single role
        token.roles = (user as { roles?: Role[] }).roles || [user.role]
        token.lastRoleRefresh = Date.now()
        logger.debug("auth.jwt.initial_sign_in", { userId: token.userId, roles: token.roles })
      }

      // Refresh roles from database periodically
      // This ensures role changes are picked up automatically
      if (token.userId) {
        const lastRefresh = token.lastRoleRefresh as number || 0
        const now = Date.now()
        const fiveMinutes = 5 * 60 * 1000

        // Refresh if explicitly triggered or 5+ minutes have passed
        if (trigger === "update" || (now - lastRefresh) > fiveMinutes) {
          try {
            // Get all active roles for this user from userRoles table
            const userRoles = await prisma.userRole.findMany({
              where: { userId: token.userId as string, active: true },
              select: { role: true }
            })

            // Get fallback role from users table
            const dbUser = await prisma.user.findUnique({
              where: { id: token.userId as string },
              select: { role: true }
            })

            // Update token with fresh roles
            if (userRoles.length > 0) {
              token.roles = userRoles.map(ur => ur.role as Role)
              token.role = token.roles[0]
            } else if (dbUser?.role) {
              token.roles = [dbUser.role as Role]
              token.role = dbUser.role as Role
            } else {
              token.roles = ['USER']
              token.role = 'USER'
            }
            logger.debug("auth.jwt.roles_refreshed", { userId: token.userId, roles: token.roles, trigger, elapsedMs: now - lastRefresh })

            token.lastRoleRefresh = now
          } catch (error) {
            console.error('Error refreshing user roles:', error)
            const message = error instanceof Error ? error.message : 'Unknown error'
            logger.error("auth.jwt.roles_refresh_error", { userId: token.userId, error: message })
            // Fallback to existing roles if DB query fails
          }
        }
      }

      return token
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.userId as string
        session.user.role = (token.role || 'USER') as Role
        session.user.roles = (token.roles || ['USER']) as Role[]
        logger.debug("auth.session.built", { userId: session.user.id, roles: session.user.roles })
      }
      return session
    },
    async signIn({ user, account }) {
      if (account?.provider === "google") {
        // Handle Google OAuth user creation with default CUSTOMER role
        const existingUser = await prisma.user.findUnique({
          where: { email: user.email! }
        })

        if (!existingUser) {
          await prisma.user.create({
            data: {
              email: user.email!,
              name: user.name,
              image: user.image,
              role: "USER", // Default role for OAuth users
              profile: {
                create: {
                  firstName: user.name?.split(" ")[0] || "",
                  lastName: user.name?.split(" ").slice(1).join(" ") || "",
                }
              }
            }
          })
        }
      }
      return true
    },
  },
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
  },
}