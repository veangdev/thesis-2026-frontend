import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { ModeToggle } from '@/components/shared/mode-toggle'
import { UserMenu } from './user-menu'
import { Button } from '@/components/ui/button'
import { ROUTES } from '@/constants/routes'

interface DashboardTopbarProps {
  title: string
  subtitle?: string
}

export function DashboardTopbar({ title, subtitle }: DashboardTopbarProps) {
  return (
    <header className="bg-background flex h-16 items-center justify-between border-b px-4 sm:px-6">
      <div className="flex items-center gap-3">
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
        <div>
          <h1 className="text-base leading-tight font-semibold">{title}</h1>
          {subtitle && (
            <p className="text-muted-foreground text-xs">{subtitle}</p>
          )}
        </div>
      </div>
      <div className="flex items-center gap-1 sm:gap-2">
        <ModeToggle />
        <UserMenu variant="topbar" />
      </div>
    </header>
  )
}
