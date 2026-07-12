import Link from 'next/link'
import { Star } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ROUTES } from '@/constants/routes'

export default function NotFound() {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center gap-4 overflow-hidden p-6 text-center">
      {/* Faint star-field motif */}
      <div className="pointer-events-none absolute inset-0 opacity-10">
        {[
          'top-[15%] left-[20%] size-2',
          'top-[25%] left-[75%] size-1.5',
          'top-[55%] left-[10%] size-1',
          'top-[70%] left-[85%] size-2',
          'top-[85%] left-[40%] size-1.5',
          'top-[10%] left-[55%] size-1',
        ].map((position) => (
          <span
            key={position}
            className={`bg-foreground absolute rounded-full ${position}`}
          />
        ))}
      </div>

      <span className="bg-brand-gold/15 flex size-16 items-center justify-center rounded-2xl">
        <Star className="text-brand-gold size-8" />
      </span>
      <p className="text-primary font-mono text-sm font-semibold">404</p>
      <h1 className="font-heading text-3xl font-semibold tracking-tight">
        This star isn&apos;t on the map
      </h1>
      <p className="text-muted-foreground max-w-md text-sm">
        The page you&apos;re looking for doesn&apos;t exist or has moved. Your
        journey continues from the dashboard.
      </p>
      <div className="flex gap-2">
        <Button asChild>
          <Link href={ROUTES.dashboard}>Go to dashboard</Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href={ROUTES.home}>Back to home</Link>
        </Button>
      </div>
    </div>
  )
}
