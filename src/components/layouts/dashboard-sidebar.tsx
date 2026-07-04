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
import { UserMenu } from './user-menu'
import { ROUTES } from '@/constants/routes'
import { cn } from '@/lib/utils'

interface NavItem {
  label: string
  href: string
  icon: LucideIcon
}

// Foundation navigation. Each item has its own route; pages currently render a
// "coming soon" state until the corresponding feature is built.
const NAV_ITEMS: NavItem[] = [
  { label: 'Dashboard', href: ROUTES.dashboard, icon: LayoutDashboard },
  { label: 'Journey Star', href: ROUTES.journeyStar, icon: Star },
  { label: 'Goals', href: ROUTES.goals, icon: Target },
  { label: 'Coaching', href: ROUTES.coaching, icon: Calendar },
  { label: 'Reports', href: ROUTES.reports, icon: BarChart3 },
  { label: 'Users', href: ROUTES.users, icon: Users },
]

export function DashboardSidebar() {
  const pathname = usePathname()

  return (
    <aside className="bg-sidebar hidden w-60 shrink-0 flex-col border-r md:flex">
      <div className="flex h-16 items-center border-b px-5">
        <AppLogo />
      </div>
      <nav className="flex-1 space-y-1 p-3">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon
          const active =
            pathname === item.href || pathname.startsWith(`${item.href}/`)
          return (
            <Link
              key={item.label}
              href={item.href}
              aria-current={active ? 'page' : undefined}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                active
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground'
              )}
            >
              <Icon className="size-4 shrink-0" />
              {item.label}
            </Link>
          )
        })}
      </nav>
      <div className="border-t p-3">
        <UserMenu variant="sidebar" />
      </div>
    </aside>
  )
}
