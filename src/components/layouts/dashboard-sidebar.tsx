'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  BarChart3,
  Calendar,
  LayoutDashboard,
  Star,
  Target,
  Users,
  type LucideIcon,
} from 'lucide-react'
import { AppLogo } from '@/components/shared/app-logo'
import { ROUTES } from '@/constants/routes'
import { cn } from '@/lib/utils'

interface NavItem {
  label: string
  href: string
  icon: LucideIcon
}

// Foundation navigation. These point at the dashboard for now; each will get its
// own route as the corresponding feature is built against the backend.
const NAV_ITEMS: NavItem[] = [
  { label: 'Dashboard', href: ROUTES.dashboard, icon: LayoutDashboard },
  { label: 'Journey Star', href: ROUTES.dashboard, icon: Star },
  { label: 'Goals', href: ROUTES.dashboard, icon: Target },
  { label: 'Coaching', href: ROUTES.dashboard, icon: Calendar },
  { label: 'Reports', href: ROUTES.dashboard, icon: BarChart3 },
  { label: 'Users', href: ROUTES.dashboard, icon: Users },
]

export function DashboardSidebar() {
  const pathname = usePathname()

  return (
    <aside className="bg-sidebar hidden w-60 shrink-0 flex-col border-r md:flex">
      <div className="flex h-16 items-center border-b px-5">
        <AppLogo />
      </div>
      <nav className="flex-1 space-y-1 p-3">
        {NAV_ITEMS.map((item, index) => {
          const Icon = item.icon
          const active = index === 0 && pathname === item.href
          return (
            <Link
              key={item.label}
              href={item.href}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                active
                  ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                  : 'text-muted-foreground hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground'
              )}
            >
              <Icon className="size-4 shrink-0" />
              {item.label}
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}
