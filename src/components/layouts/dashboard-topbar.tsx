import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { ModeToggle } from '@/components/shared/mode-toggle'
import { Button } from '@/components/ui/button'
import { ROUTES } from '@/constants/routes'
import { GlobalSearch } from './global-search'
import { NotificationsMenu } from './notifications-menu'
import { UserMenu } from './user-menu'

interface DashboardTopbarProps {
  title: string
  subtitle?: string
}

export function DashboardTopbar({ title, subtitle }: DashboardTopbarProps) {
  return (
    <header className="bg-background flex h-16 shrink-0 items-center justify-between gap-3 border-b px-4 sm:px-6">
      <div className="flex min-w-0 items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          asChild
          className="md:hidden"
          aria-label="Back to home"
        >
          <Link href={ROUTES.home}>
            <ArrowLeft className="size-5" />
          </Link>
        </Button>
        <div className="min-w-0">
          <h1 className="font-heading truncate text-base leading-tight font-semibold">
            {title}
          </h1>
          {subtitle && (
            <p className="text-muted-foreground truncate text-xs">{subtitle}</p>
          )}
        </div>
      </div>
      <div className="flex items-center gap-1 sm:gap-2">
        <GlobalSearch />
        <NotificationsMenu />
        <ModeToggle />
        <UserMenu variant="topbar" />
      </div>
    </header>
  )
}
