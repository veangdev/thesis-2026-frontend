'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command'
import { getNavItems } from '@/config/navigation'
import { ROLES } from '@/constants/roles'
import { ROUTES } from '@/constants/routes'
import { useQuery } from '@tanstack/react-query'
import { useAuthStore } from '@/features/auth'
import { userKeys, usersService } from '@/features/users'
import { useDebounce } from '@/hooks/use-debounce'

/**
 * Global command palette (⌘K / Ctrl+K): jump to any page and — for staff —
 * find students/users by name or email.
 */
export function GlobalSearch() {
  const router = useRouter()
  const user = useAuthStore((state) => state.user)
  const [open, setOpen] = React.useState(false)
  const [query, setQuery] = React.useState('')
  const debouncedQuery = useDebounce(query, 250)

  const isStaff =
    user?.role === ROLES.PROGRAM_COORDINATOR || user?.role === ROLES.FACILITATOR

  const searchEnabled = isStaff && open && debouncedQuery.length >= 2
  const peopleQuery = useQuery({
    queryKey: userKeys.list({ search: debouncedQuery, pageSize: 6 }),
    queryFn: () => usersService.list({ search: debouncedQuery, pageSize: 6 }),
    enabled: searchEnabled,
  })
  const people = searchEnabled ? (peopleQuery.data?.data ?? []) : []

  React.useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault()
        setOpen((current) => !current)
      }
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [])

  function go(href: string) {
    setOpen(false)
    setQuery('')
    router.push(href)
  }

  const navItems = getNavItems(user?.role)

  return (
    <>
      <Button
        variant="outline"
        onClick={() => setOpen(true)}
        className="text-muted-foreground hidden h-9 w-56 justify-between gap-2 font-normal lg:flex"
      >
        <span className="flex items-center gap-2">
          <Search className="size-4" />
          Search…
        </span>
        <kbd className="bg-muted pointer-events-none rounded px-1.5 font-mono text-[10px] font-medium">
          ⌘K
        </kbd>
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setOpen(true)}
        className="lg:hidden"
        aria-label="Search"
      >
        <Search className="size-5" />
      </Button>

      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput
          placeholder="Search pages or people…"
          value={query}
          onValueChange={setQuery}
        />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Go to">
            {navItems.map((item) => {
              const Icon = item.icon
              return (
                <CommandItem
                  key={item.href}
                  value={`page ${item.label}`}
                  onSelect={() => go(item.href)}
                >
                  <Icon className="size-4" />
                  {item.label}
                </CommandItem>
              )
            })}
          </CommandGroup>
          {people.length > 0 && (
            <>
              <CommandSeparator />
              <CommandGroup heading="People">
                {people.map((person) => (
                  <CommandItem
                    key={person.id}
                    value={`person ${person.name} ${person.email}`}
                    onSelect={() =>
                      go(
                        person.role === ROLES.SELF_ASSESSOR
                          ? `${ROUTES.journeyStar}?studentId=${person.id}`
                          : ROUTES.users
                      )
                    }
                  >
                    <span className="flex min-w-0 flex-col">
                      <span className="truncate">{person.name}</span>
                      <span className="text-muted-foreground truncate text-xs">
                        {person.email}
                      </span>
                    </span>
                  </CommandItem>
                ))}
              </CommandGroup>
            </>
          )}
        </CommandList>
      </CommandDialog>
    </>
  )
}
