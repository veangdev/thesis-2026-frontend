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
      {/* Fixed-viewport shell: sidebar and topbar never move — each page's
          content area is the only scroll container. */}
      <div className="bg-muted/30 flex h-dvh overflow-hidden">
        <DashboardSidebar />
        <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
          {children}
        </div>
      </div>
    </RequireAuth>
  )
}
