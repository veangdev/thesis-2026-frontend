import Link from 'next/link'
import { ArrowRight, Sparkles } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { siteConfig } from '@/config/site'

export function LandingHero() {
  return (
    <section id="overview" className="relative overflow-hidden border-b">
      <div
        aria-hidden
        className="from-primary/10 pointer-events-none absolute inset-0 bg-gradient-to-b to-transparent"
      />
      <div className="relative mx-auto flex max-w-3xl flex-col items-center px-4 py-20 text-center sm:px-6 sm:py-28">
        <Badge variant="secondary" className="gap-1.5">
          <Sparkles className="size-3.5" />
          {siteConfig.name}
        </Badge>
        <h1 className="mt-6 text-4xl font-bold tracking-tight text-balance sm:text-5xl">
          Track self-assessor growth from learning to employment
        </h1>
        <p className="text-muted-foreground mt-5 max-w-xl text-lg text-pretty">
          A shared view of every learner’s journey across eight skill dimensions
          — for self-assessors, facilitators and managers alike.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Button asChild size="lg">
            <Link href={siteConfig.cta.primary.href}>
              {siteConfig.cta.primary.title}
              <ArrowRight className="size-4" />
            </Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link href={siteConfig.cta.secondary.href}>
              {siteConfig.cta.secondary.title}
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
