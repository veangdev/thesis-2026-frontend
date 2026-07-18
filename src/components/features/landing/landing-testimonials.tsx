const TESTIMONIALS = [
  {
    quote:
      'For the first time I could show my growth, not just talk about it. My star from Cycle 1 to Cycle 4 tells the whole story.',
    name: 'Sophea',
    role: 'Self-Assessor, Web Development',
  },
  {
    quote:
      'The gap analysis changed our coaching conversations. We stopped guessing and started talking about the same evidence.',
    name: 'Sokha',
    role: 'Facilitator',
  },
  {
    quote:
      'Completion tracking across three cohorts in one view — what used to take a week of spreadsheets now takes a minute.',
    name: 'Sovanna',
    role: 'Program Coordinator',
  },
] as const

export function LandingTestimonials() {
  return (
    <section className="bg-muted/40 border-y">
      <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-heading text-3xl font-semibold tracking-tight">
            Loved across the journey
          </h2>
          <p className="text-muted-foreground mt-3">
            Self-assessors, facilitators, and coordinators — one shared picture
            of growth.
          </p>
        </div>
        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          {TESTIMONIALS.map(({ quote, name, role }) => (
            <figure
              key={name}
              className="bg-card flex flex-col justify-between rounded-2xl border p-6 shadow-sm"
            >
              <blockquote className="text-sm leading-relaxed">
                “{quote}”
              </blockquote>
              <figcaption className="mt-4">
                <p className="text-sm font-semibold">{name}</p>
                <p className="text-muted-foreground text-xs">{role}</p>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  )
}
