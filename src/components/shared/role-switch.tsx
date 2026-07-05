'use client'

import { PageSkeleton } from '@/components/shared/page-skeleton'
import { ROLES } from '@/constants/roles'
import { useAuthStore } from '@/features/auth'

interface RoleSwitchProps {
  coordinator?: React.ReactNode
  facilitator?: React.ReactNode
  student?: React.ReactNode
  /** Rendered when the signed-in role has no branch (defaults to nothing). */
  fallback?: React.ReactNode
}

/**
 * Renders the branch matching the signed-in user's role. Pages that share a
 * URL across portals (dashboard, reports, …) use this instead of per-role
 * routes.
 */
export function RoleSwitch({
  coordinator,
  facilitator,
  student,
  fallback = null,
}: RoleSwitchProps) {
  const user = useAuthStore((state) => state.user)
  const status = useAuthStore((state) => state.status)

  if (!user) {
    // RequireAuth redirects when signed out; this covers the hydration gap.
    return status === 'loading' ? <PageSkeleton /> : null
  }

  switch (user.role) {
    case ROLES.PROGRAM_COORDINATOR:
      return <>{coordinator ?? fallback}</>
    case ROLES.FACILITATOR:
      return <>{facilitator ?? fallback}</>
    case ROLES.SELF_ASSESSOR:
      return <>{student ?? fallback}</>
    default:
      return <>{fallback}</>
  }
}
