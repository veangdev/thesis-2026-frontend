'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  ChevronDown,
  ChevronsUpDown,
  LogIn,
  LogOut,
  Settings,
  User,
} from 'lucide-react'
import { toast } from 'sonner'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { ROLE_BADGE_CLASSES, ROLE_LABELS } from '@/constants/roles'
import { ROUTES } from '@/constants/routes'
import { authService, useAuthStore } from '@/features/auth'
import { cn } from '@/lib/utils'

/** Build up-to-two-letter initials from a display name. */
function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) return '?'
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}

interface UserMenuProps {
  /**
   * `topbar` = compact trigger for the header; `sidebar` = full-width user
   * card pinned to the bottom of the sidebar. The dropdown itself is shared.
   */
  variant?: 'topbar' | 'sidebar'
}

export function UserMenu({ variant = 'topbar' }: UserMenuProps) {
  const user = useAuthStore((s) => s.user)
  const clear = useAuthStore((s) => s.clear)
  const router = useRouter()

  const displayName = user?.name ?? 'Guest'
  const email = user?.email ?? 'Not signed in'
  const roleLabel = user ? ROLE_LABELS[user.role] : undefined
  const initials = getInitials(displayName)

  async function handleLogout() {
    try {
      await authService.logout()
    } catch {
      // Backend may be unreachable (or not built yet) — clear locally regardless.
    }
    clear()
    toast.success('Signed out')
    router.push(ROUTES.login)
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        {variant === 'sidebar' ? (
          <Button
            variant="ghost"
            className="h-auto w-full justify-start gap-3 px-2 py-2"
            aria-label="Open account menu"
          >
            <Avatar className="size-9">
              {user?.avatar && (
                <AvatarImage src={user.avatar} alt={displayName} />
              )}
              <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>
            <span className="flex min-w-0 flex-1 flex-col text-left">
              <span className="truncate text-sm leading-tight font-medium">
                {displayName}
              </span>
              <span className="text-muted-foreground truncate text-xs leading-tight">
                {roleLabel ?? email}
              </span>
            </span>
            <ChevronsUpDown className="text-muted-foreground size-4 shrink-0" />
          </Button>
        ) : (
          <Button
            variant="ghost"
            className="h-auto gap-2 px-1.5 sm:px-2"
            aria-label="Open account menu"
          >
            <Avatar className="size-8">
              {user?.avatar && (
                <AvatarImage src={user.avatar} alt={displayName} />
              )}
              <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>
            <span className="hidden text-left sm:flex sm:flex-col">
              <span className="max-w-[10rem] truncate text-sm leading-tight font-medium">
                {displayName}
              </span>
              {roleLabel && (
                <span className="text-muted-foreground text-xs leading-tight">
                  {roleLabel}
                </span>
              )}
            </span>
            <ChevronDown className="text-muted-foreground hidden size-4 sm:block" />
          </Button>
        )}
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align={variant === 'sidebar' ? 'start' : 'end'}
        side={variant === 'sidebar' ? 'top' : 'bottom'}
        sideOffset={8}
        className="w-56"
      >
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col gap-1.5">
            <span className="truncate text-sm font-medium">{displayName}</span>
            <span className="text-muted-foreground truncate text-xs">
              {email}
            </span>
            {roleLabel && user && (
              <Badge
                variant="secondary"
                className={cn('w-fit', ROLE_BADGE_CLASSES[user.role])}
              >
                {roleLabel}
              </Badge>
            )}
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem asChild>
            <Link href={ROUTES.profile}>
              <User className="mr-2 size-4" /> Profile
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href={ROUTES.settings}>
              <Settings className="mr-2 size-4" /> Settings
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        {user ? (
          <DropdownMenuItem
            onClick={handleLogout}
            className="text-destructive focus:text-destructive"
          >
            <LogOut className="mr-2 size-4" /> Log out
          </DropdownMenuItem>
        ) : (
          <DropdownMenuItem asChild>
            <Link href={ROUTES.login}>
              <LogIn className="mr-2 size-4" /> Log in
            </Link>
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
