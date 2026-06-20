import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { siteConfig } from '@/config/site'

export function LandingCta() {
  return (
    <section id="for-teams" className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
      <div className="bg-primary text-primary-foreground flex flex-col items-center gap-6 rounded-2xl px-6 py-14 text-center">
        <h2 className="max-w-2xl text-3xl font-semibold tracking-tight text-balance">
          Ready to see the journey?
        </h2>
        <p className="text-primary-foreground/80 max-w-xl">
          Explore the dashboard preview. Sign-in and live data arrive as soon as
          the backend is connected.
        </p>
        <Button asChild size="lg" variant="secondary">
          <Link href={siteConfig.cta.primary.href}>
            {siteConfig.cta.primary.title}
            <ArrowRight className="size-4" />
          </Link>
        </Button>
      </div>
    </section>
  )
}
