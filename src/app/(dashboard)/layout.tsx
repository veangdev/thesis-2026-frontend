import { DashboardSidebar } from '@/components/layouts/dashboard-sidebar'
import { RequireAuth } from '@/features/auth'

/**
 * Dashboard shell. The proxy performs the optimistic cookie check; RequireAuth
 * is the client-side guard that reacts to real auth state (store hydration,
 * logout, session expiry).
 */
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <RequireAuth>
      <div className="bg-muted/30 flex min-h-screen">
        <DashboardSidebar />
        <div className="flex min-w-0 flex-1 flex-col">{children}</div>
      </div>
    </RequireAuth>
  )
}
