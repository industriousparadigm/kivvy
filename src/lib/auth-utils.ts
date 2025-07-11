import { auth } from './auth'
import { Role } from '@prisma/client'
import { redirect } from 'next/navigation'

export async function getCurrentUser() {
  const session = await auth()
  return session?.user
}

export async function requireAuth() {
  const user = await getCurrentUser()
  if (!user) {
    redirect('/auth/signin')
  }
  return user
}

export async function requireRole(allowedRoles: Role | Role[]) {
  const user = await requireAuth()
  const roles = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles]
  
  if (!roles.includes(user.role)) {
    redirect('/unauthorized')
  }
  
  return user
}

export async function requireProvider() {
  return requireRole(['PROVIDER', 'ADMIN'])
}

export async function requireAdmin() {
  return requireRole('ADMIN')
}

export function hasRole(userRole: Role, allowedRoles: Role | Role[]): boolean {
  const roles = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles]
  return roles.includes(userRole)
}

export function isProvider(userRole: Role): boolean {
  return hasRole(userRole, ['PROVIDER', 'ADMIN'])
}

export function isAdmin(userRole: Role): boolean {
  return hasRole(userRole, 'ADMIN')
}

export function isParent(userRole: Role): boolean {
  return hasRole(userRole, 'PARENT')
}