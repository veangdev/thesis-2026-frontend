import type { Metadata } from 'next'
import { DashboardTopbar } from '@/components/layouts/dashboard-topbar'
import { ComingSoon } from '@/components/shared/coming-soon'
import { RoleSwitch } from '@/components/shared/role-switch'
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
          coordinator={
            <ComingSoon
              title="Assignment board arrives shortly"
              description="Drag-and-drop mentor↔student assignment with capacity indicators lands in an upcoming build step."
            />
          }
        />
      </div>
    </>
  )
}
