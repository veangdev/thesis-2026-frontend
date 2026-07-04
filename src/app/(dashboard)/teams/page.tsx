import type { Metadata } from 'next'
import { DashboardTopbar } from '@/components/layouts/dashboard-topbar'
import { RoleSwitch } from '@/components/shared/role-switch'
import { CoordinatorTeams } from '@/components/features/teams/coordinator-teams'
import { FacilitatorTeams } from '@/components/features/teams/facilitator-teams'

export const metadata: Metadata = { title: 'Teams' }

export default function TeamsPage() {
  return (
    <>
      <DashboardTopbar
        title="Teams"
        subtitle="Mentor and student assignments"
      />
      <div className="p-4 sm:p-6">
        <RoleSwitch
          facilitator={<FacilitatorTeams />}
          coordinator={<CoordinatorTeams />}
        />
      </div>
    </>
  )
}
