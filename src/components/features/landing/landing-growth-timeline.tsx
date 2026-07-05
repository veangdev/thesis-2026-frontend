import { Briefcase, GraduationCap, Star } from 'lucide-react'

const MILESTONES = [
  { icon: GraduationCap, label: 'First day at PNC', detail: 'Baseline star' },
  { icon: Star, label: 'Cycle 1–2', detail: 'Foundations take shape' },
  { icon: Star, label: 'Cycle 3–4', detail: 'Strengths become visible' },
  { icon: Star, label: 'Final cycles', detail: 'Job-ready confidence' },
  {
    icon: Briefcase,
    label: 'First day of employment',
    detail: 'The star tells the story',
  },
] as const

export function LandingGrowthTimeline() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="font-heading text-3xl font-semibold tracking-tight">
          From learning to employment
        </h2>
        <p className="text-muted-foreground mt-3">
          The whole journey on one timeline — every cycle a measured step.
        </p>
      </div>
      <ol className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
        {MILESTONES.map(({ icon: Icon, label, detail }, index) => (
          <li
            key={label}
            className="relative flex flex-col items-center text-center"
          >
            {index < MILESTONES.length - 1 && (
              <span
                aria-hidden
                className="bg-border absolute top-6 left-[calc(50%+2rem)] hidden h-px w-[calc(100%-4rem)] lg:block"
              />
            )}
            <span
              className={`flex size-12 items-center justify-center rounded-full ${
                index === MILESTONES.length - 1
                  ? 'bg-brand-gold/15 text-brand-gold'
                  : 'bg-primary/10 text-primary'
              }`}
            >
              <Icon className="size-5" />
            </span>
            <p className="mt-3 text-sm font-semibold">{label}</p>
            <p className="text-muted-foreground mt-1 text-xs">{detail}</p>
          </li>
        ))}
      </ol>
    </section>
  )
}
