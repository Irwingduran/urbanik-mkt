// Enhanced authentication configuration with role-based access
import { NextAuthOptions } from "next-auth"
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import { prisma } from "./prisma"
import CredentialsProvider from "next-auth/providers/credentials"
import GoogleProvider from "next-auth/providers/google"
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

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
          include: {
            profile: true,
            vendor: true
          }
        })

        if (!user || !user.password) {
          return null
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.password
        )

        if (!isPasswordValid) {
          return null
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          image: user.image,
        }
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.userId = user.id
        token.role = user.role
        token.roles = user.roles || [user.role]
      }

      // Handle session update - refresh roles from database
      if (trigger === "update" && token.userId) {
        const userRoles = await prisma.userRole.findMany({
          where: { userId: token.userId as string, active: true },
          select: { role: true }
        })
        token.roles = userRoles.map(ur => ur.role as Role)
        token.role = token.roles[0] || 'USER'
      }

      return token
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.userId as string
        session.user.role = (token.role || 'USER') as any
        session.user.roles = (token.roles || ['USER']) as any
      }
      return session
    },
    async signIn({ user, account, profile }) {
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