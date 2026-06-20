import type { Metadata } from 'next'
import { GraduationCap, LineChart, Target, Users } from 'lucide-react'
import { DashboardTopbar } from '@/components/layouts/dashboard-topbar'
import { ComingSoon } from '@/components/shared/coming-soon'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export const metadata: Metadata = { title: 'Dashboard' }

const STATS = [
  { label: 'Students', value: '—', icon: GraduationCap },
  { label: 'Active mentors', value: '—', icon: Users },
  { label: 'Avg. score', value: '—', icon: LineChart },
  { label: 'Open goals', value: '—', icon: Target },
] as const

export default function DashboardPage() {
  return (
    <>
      <DashboardTopbar
        title="Dashboard"
        subtitle="Temporary preview — live data arrives with the backend"
      />
      <div className="space-y-6 p-4 sm:p-6">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {STATS.map(({ label, value, icon: Icon }) => (
            <Card key={label}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-muted-foreground text-sm font-medium">
                  {label}
                </CardTitle>
                <Icon className="text-muted-foreground size-4" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-semibold">{value}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        <ComingSoon
          title="Your Journey Star dashboard is on the way"
          description="Assessments, gap analysis, coaching and reports will appear here once the API is connected. The layout, components and data flow are already in place."
        />
      </div>
    </>
  )
}
