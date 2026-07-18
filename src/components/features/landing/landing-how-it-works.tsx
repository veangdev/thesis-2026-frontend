import { ClipboardCheck, Handshake, Star, TrendingUp } from 'lucide-react'

const STEPS = [
  {
    icon: Star,
    title: 'Self-assess',
    description:
<<<<<<< HEAD
      'Each cycle, students score themselves across every dimension and reflect on real moments behind each score.',
  },
  {
    icon: ClipboardCheck,
    title: 'Mentor review',
=======
      'Each cycle, self-assessors score themselves across every dimension and reflect on real moments behind each score.',
  },
  {
    icon: ClipboardCheck,
    title: 'Facilitator review',
>>>>>>> origin/main
    description:
      'Facilitators review submissions side-by-side, add their own scores, and flag where perceptions differ.',
  },
  {
    icon: Handshake,
    title: 'Discuss & agree',
    description:
<<<<<<< HEAD
      'A coaching conversation closes each gap — mentor and student agree the final scores together.',
=======
      'A coaching conversation closes each gap — facilitator and self-assessor agree the final scores together.',
>>>>>>> origin/main
  },
  {
    icon: TrendingUp,
    title: 'Grow visibly',
    description:
      'Every agreed cycle adds a ring to the Journey Star — progress everyone can see, from enrollment to employment.',
  },
] as const

export function LandingHowItWorks() {
  return (
    <section id="how-it-works" className="bg-muted/40 border-y">
      <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-heading text-3xl font-semibold tracking-tight">
            How it works
          </h2>
          <p className="text-muted-foreground mt-3">
            One honest conversation per cycle — repeated until graduation day.
          </p>
        </div>
        <ol className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map(({ icon: Icon, title, description }, index) => (
            <li key={title} className="relative">
              <div className="bg-primary/10 text-primary flex size-11 items-center justify-center rounded-xl">
                <Icon className="size-5" />
              </div>
              <p className="text-muted-foreground mt-4 font-mono text-xs">
                Step {index + 1}
              </p>
              <h3 className="mt-1 font-semibold">{title}</h3>
              <p className="text-muted-foreground mt-2 text-sm">
                {description}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
