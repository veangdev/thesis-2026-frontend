'use client'

import Link from 'next/link'
import { Menu } from 'lucide-react'
import { AppLogo } from '@/components/shared/app-logo'
import { ModeToggle } from '@/components/shared/mode-toggle'
import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { siteConfig } from '@/config/site'

export function PublicNavbar() {
  return (
    <header className="bg-background/80 sticky top-0 z-40 w-full border-b backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <AppLogo />

        <nav className="hidden items-center gap-1 md:flex">
          {siteConfig.mainNav.map((item) => (
            <Button key={item.href} variant="ghost" size="sm" asChild>
              <Link href={item.href}>{item.title}</Link>
            </Button>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <ModeToggle />
          <Button asChild size="sm" className="hidden sm:inline-flex">
            <Link href={siteConfig.cta.primary.href}>
              {siteConfig.cta.primary.title}
            </Link>
          </Button>

          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
                aria-label="Open menu"
              >
                <Menu className="size-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72">
              <SheetHeader>
                <SheetTitle>
                  <AppLogo />
                </SheetTitle>
              </SheetHeader>
              <nav className="mt-2 flex flex-col gap-1 px-2">
                {siteConfig.mainNav.map((item) => (
                  <Button
                    key={item.href}
                    variant="ghost"
                    className="justify-start"
                    asChild
                  >
                    <Link href={item.href}>{item.title}</Link>
                  </Button>
                ))}
                <Button asChild className="mt-2">
                  <Link href={siteConfig.cta.primary.href}>
                    {siteConfig.cta.primary.title}
                  </Link>
                </Button>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
