'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { AppLogo } from '@/components/shared/app-logo'
import { getNavItems } from '@/config/navigation'
import { useAuthStore } from '@/features/auth'
import { cn } from '@/lib/utils'
import { UserMenu } from './user-menu'

export function DashboardSidebar() {
  const pathname = usePathname()
  const user = useAuthStore((state) => state.user)
  const items = getNavItems(user?.role)

  return (
    <aside className="bg-sidebar hidden w-60 shrink-0 flex-col border-r md:flex">
      <div className="flex h-16 items-center border-b px-5">
        <AppLogo />
      </div>
      <nav className="flex-1 space-y-1 overflow-y-auto p-3">
        {items.map((item) => {
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
