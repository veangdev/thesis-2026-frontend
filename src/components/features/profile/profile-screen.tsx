'use client'

import { RoleSwitch } from '@/components/shared/role-switch'
import { Skeleton } from '@/components/ui/skeleton'
import { useAuthStore } from '@/features/auth'
import { ChangePasswordCard } from './change-password-card'
import { FacilitatorProfileExtras } from './facilitator-profile-extras'
import { ProfileHeader } from './profile-header'

/**
 * Profile layout: a single centred column — identity and account facts, then
 * whatever this role can act on. Names and emails are managed from the Users
 * screen, not here.
 */
export function ProfileScreen() {
  const user = useAuthStore((state) => state.user)

  if (!user) {
    return (
      <div className="mx-auto max-w-3xl space-y-4">
        <Skeleton className="h-52 w-full" />
        <Skeleton className="h-72 w-full" />
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-3xl space-y-4">
      <ProfileHeader user={user} />
      <RoleSwitch facilitator={<FacilitatorProfileExtras user={user} />} />
      <ChangePasswordCard />
    </div>
  )
}
