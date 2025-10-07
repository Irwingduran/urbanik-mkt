import { DefaultSession, DefaultUser } from "next-auth"
import { Role } from "@prisma/client"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      role: Role // Deprecated - use roles instead
      roles: Role[] // New multi-role system
    } & DefaultSession["user"]
  }

  interface User extends DefaultUser {
    role: Role // Deprecated - use roles instead
    roles?: Role[] // New multi-role system
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string
    role: Role // Deprecated - use roles instead
    roles?: Role[] // New multi-role system
  }
}