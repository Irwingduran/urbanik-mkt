import type { Role } from '@prisma/client'

export interface AppUser {
  id: string
  name?: string | null
  email?: string | null
  image?: string | null
  roles: Role[]
}

export interface AddressDTO {
  id: string
  userId: string
  type: string
  name: string
  street: string
  city: string
  state: string
  zipCode: string
  country: string
  isDefault: boolean
}

export type UserRole = Role
