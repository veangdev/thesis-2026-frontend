<<<<<<< HEAD
import type { Metadata } from 'next'
import { DashboardTopbar } from '@/components/layouts/dashboard-topbar'
import { EmptyState } from '@/components/shared/empty-state'
import { CoordinatorSettings } from '@/components/features/settings/coordinator-settings'
import { ROLES } from '@/constants/roles'
import { RequireRole } from '@/features/auth'
=======
import React from 'react'
import type { Metadata } from 'next'

import { ROLES } from '@/constants/roles'
import { RequireRole } from '@/features/auth'
import { EmptyState } from '@/components/shared/empty-state'
import { DashboardTopbar } from '@/components/layouts/dashboard-topbar'
import { CoordinatorSettings } from '@/components/features/settings/coordinator-settings'
>>>>>>> origin/main

export const metadata: Metadata = { title: 'Settings' }

export default function SettingsPage() {
  return (
<<<<<<< HEAD
    <>
=======
    <React.Fragment>
>>>>>>> origin/main
      <DashboardTopbar
        title="Settings"
        subtitle="Periods, dimensions, scoring scales, and rules"
      />
      <div className="flex-1 overflow-y-auto p-4 sm:p-6">
        <RequireRole
          allow={ROLES.PROGRAM_COORDINATOR}
          fallback={
            <EmptyState
              title="Coordinators only"
              description="Program configuration is restricted to coordinators. Your personal details live on the Profile page."
            />
          }
        >
          <CoordinatorSettings />
        </RequireRole>
      </div>
<<<<<<< HEAD
    </>
=======
    </React.Fragment>
>>>>>>> origin/main
  )
}
