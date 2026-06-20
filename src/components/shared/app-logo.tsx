import Link from 'next/link'
import { Star } from 'lucide-react'
import { siteConfig } from '@/config/site'
import { ROUTES } from '@/constants/routes'
import { cn } from '@/lib/utils'

interface AppLogoProps {
  href?: string
  className?: string
  /** Hide the wordmark and show only the mark. */
  iconOnly?: boolean
}

export function AppLogo({
  href = ROUTES.home,
  className,
  iconOnly = false,
}: AppLogoProps) {
  return (
    <Link
      href={href}
      className={cn('flex items-center gap-2.5 font-semibold', className)}
    >
      <span className="bg-primary text-primary-foreground flex size-8 shrink-0 items-center justify-center rounded-lg">
        <Star className="size-4" />
      </span>
      {!iconOnly && (
        <span className="text-foreground text-sm leading-tight">
          {siteConfig.shortName}
        </span>
      )}
    </Link>
  )
}
