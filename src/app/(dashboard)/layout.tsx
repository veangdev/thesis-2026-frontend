import { DashboardSidebar } from '@/components/layouts/dashboard-sidebar'

/**
 * Dashboard shell. NOTE: this area is publicly accessible for now — route
 * protection lives in `src/proxy.ts` and the auth guards but is intentionally
 * not enforced until the backend auth API is ready.
 */
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="bg-muted/30 flex min-h-screen">
      <DashboardSidebar />
      <div className="flex min-w-0 flex-1 flex-col">{children}</div>
    </div>
  )
}
