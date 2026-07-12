import { Star } from 'lucide-react'
import { AppLogo } from '@/components/shared/app-logo'
import { DIMENSIONS } from '@/constants/app'
import { siteConfig } from '@/config/site'

/**
 * Auth shell (spec §6): split screen — branding panel with the Journey Star
 * identity on the left, the form on the right. Single column on mobile.
 */
export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <aside className="from-brand-navy relative hidden flex-col justify-between overflow-hidden bg-gradient-to-br via-[oklch(0.32_0.12_280)] to-[oklch(0.45_0.13_75)] p-10 text-white lg:flex">
        <div className="pointer-events-none absolute inset-0 opacity-20">
          {/* Star-field motif */}
          {[
            'top-[12%] left-[18%] size-2',
            'top-[28%] left-[70%] size-1.5',
            'top-[45%] left-[35%] size-1',
            'top-[60%] left-[80%] size-2',
            'top-[75%] left-[15%] size-1.5',
            'top-[85%] left-[55%] size-1',
            'top-[20%] left-[45%] size-1',
            'top-[55%] left-[60%] size-1.5',
          ].map((position) => (
            <span
              key={position}
              className={`absolute rounded-full bg-white ${position}`}
            />
          ))}
        </div>

        <AppLogo className="relative text-white [&_span]:text-white" />

        <div className="relative max-w-md space-y-6">
          <div className="border-brand-gold/60 flex size-20 items-center justify-center rounded-2xl border bg-white/10 backdrop-blur-sm">
            <Star className="text-brand-gold size-10 fill-current" />
          </div>
          <h1 className="font-heading text-4xl leading-tight font-semibold">
            Your growth journey starts here.
          </h1>
          <p className="text-white/80">
            {siteConfig.name} tracks your transformation across{' '}
            {DIMENSIONS.length} dimensions — from your first day at PNC to your
            first day of employment.
          </p>
        </div>

        <p className="relative text-sm text-white/60">{siteConfig.tagline}</p>
      </aside>

      <main className="flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm">{children}</div>
      </main>
    </div>
  )
}
