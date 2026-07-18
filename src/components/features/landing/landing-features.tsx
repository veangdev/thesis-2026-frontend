import { ClipboardCheck, MessagesSquare, Radar, TrendingUp } from 'lucide-react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

const FEATURES = [
  {
    icon: ClipboardCheck,
<<<<<<< HEAD
    title: 'Self & mentor assessments',
=======
    title: 'Self & facilitator assessments',
>>>>>>> origin/main
    description:
      'Structured evaluations each cycle, scored on a clear 1–10 scale across every dimension.',
  },
  {
    icon: Radar,
    title: 'The Journey Star',
    description:
      'A radar view that turns scores into a shape you can read at a glance — and watch evolve.',
  },
  {
    icon: TrendingUp,
    title: 'Gap analysis',
    description:
<<<<<<< HEAD
      'Compare self vs. mentor perception to surface blind spots and celebrate real strengths.',
=======
      'Compare self vs. facilitator perception to surface blind spots and celebrate real strengths.',
>>>>>>> origin/main
  },
  {
    icon: MessagesSquare,
    title: 'Coaching & goals',
    description:
      'Turn insight into action with coaching sessions and growth goals tied to each dimension.',
  },
] as const

export function LandingFeatures() {
  return (
    <section id="features" className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-3xl font-semibold tracking-tight">
          Everything in one journey
        </h2>
        <p className="text-muted-foreground mt-3">
          From the first assessment to employment-readiness — a single, shared
          source of truth.
        </p>
      </div>
      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {FEATURES.map(({ icon: Icon, title, description }) => (
          <Card key={title} className="h-full">
            <CardHeader>
              <span className="bg-primary/10 text-primary mb-2 flex size-10 items-center justify-center rounded-lg">
                <Icon className="size-5" />
              </span>
              <CardTitle className="text-base">{title}</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>{description}</CardDescription>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  )
}
