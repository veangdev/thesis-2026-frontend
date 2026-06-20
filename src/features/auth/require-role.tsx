'use client'

import { roleHasPermission } from '@/lib/auth'
import { useAuthStore } from './auth.store'
import type { RoleGuardProps } from './auth.types'

/**
 * Role/permission guard. Renders children only when the current user's role is
 * allowed and holds every required permission; otherwise renders `fallback`.
 *
 * Part of the RBAC foundation — not enforced anywhere yet.
 */
export function RequireRole({
  allow,
  requirePermissions = [],
  children,
  fallback = null,
}: RoleGuardProps) {
  const user = useAuthStore((state) => state.user)
  const allowed = Array.isArray(allow) ? allow : [allow]

  if (!user || !allowed.includes(user.role)) {
    return <>{fallback}</>
  }

  const hasAllPermissions = requirePermissions.every((permission) =>
    roleHasPermission(user.role, permission)
  )

  if (!hasAllPermissions) {
    return <>{fallback}</>
  }

  return <>{children}</>
}
