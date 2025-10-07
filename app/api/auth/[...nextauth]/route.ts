import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import CredentialsProvider from "next-auth/providers/credentials"
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import { prisma } from "@/lib/prisma"
import { Role } from "@prisma/client"
import bcrypt from "bcryptjs"

const handler = NextAuth({
  secret: process.env.NEXTAUTH_SECRET,
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
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
            userRoles: {
              where: { active: true },
              select: { role: true }
            }
          }
        })

        if (!user || !user.password) {
          return null
        }

        const isPasswordValid = await bcrypt.compare(credentials.password, user.password)

        if (!isPasswordValid) {
          return null
        }

        // Get all active roles
        const roles = user.userRoles.map(ur => ur.role)

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role, // Deprecated single role
          roles: roles, // New multi-role array
        } as any
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    async jwt({ token, user, trigger }) {
      // On sign in, add user data to token
      if (user) {
        token.id = user.id
        token.role = user.role // Deprecated
        token.roles = user.roles || []
      }

      // Refresh roles on update (when user becomes vendor, etc.)
      if (trigger === 'update' && token.id) {
        const userRoles = await prisma.userRole.findMany({
          where: {
            userId: token.id as string,
            active: true
          },
          select: { role: true }
        })
        token.roles = userRoles.map(ur => ur.role)
      }

      return token
    },
    async session({ session, token }) {
      // Send properties to the client
      if (token && session.user) {
        ;(session.user as any).id = token.id as string
        ;(session.user as any).role = (token.role || 'USER') as any // Deprecated
        ;(session.user as any).roles = (token.roles || ['USER']) as any
      }
      return session
    },
    async signIn({ user, account, profile }) {
      // For OAuth sign-ins, ensure user has USER role
      if (account?.provider === 'google') {
        const existingRoles = await prisma.userRole.findMany({
          where: { userId: user.id }
        })

        // If no roles exist, assign USER role
        if (existingRoles.length === 0) {
          await prisma.$transaction(async (tx) => {
            // Assign USER role
            await tx.userRole.create({
              data: {
                userId: user.id,
                role: 'USER',
                active: true,
              }
            })

            // Create CustomerProfile if doesn't exist
            const hasCustomerProfile = await tx.customerProfile.findUnique({
              where: { userId: user.id }
            })

            if (!hasCustomerProfile) {
              await tx.customerProfile.create({
                data: {
                  userId: user.id,
                  loyaltyTier: 'BRONZE',
                }
              })
            }
          })
        }
      }

      return true
    },
  },
  pages: {
    signIn: "/auth/signin",
  },
})

export { handler as GET, handler as POST }
