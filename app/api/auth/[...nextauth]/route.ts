import NextAuth from "next-auth"
import { authOptions } from "@/lib/auth-config"

// Usa una sola fuente de verdad para NextAuth
const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
