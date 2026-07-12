// Illustrative figures for the marketing page until live analytics are wired in.
const STATS = [
  { value: '8', label: 'Skill dimensions' },
  { value: '3', label: 'Roles supported' },
  { value: '1–10', label: 'Clear scoring scale' },
  { value: '100%', label: 'Journey visibility' },
] as const

export function LandingStats() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <div className="grid grid-cols-2 gap-6 lg:grid-cols-4">
        {STATS.map(({ value, label }) => (
          <div key={label} className="text-center">
            <div className="text-primary text-4xl font-bold tracking-tight">
              {value}
            </div>
            <div className="text-muted-foreground mt-1 text-sm">{label}</div>
          </div>
        ))}
      </div>
    </section>
  )
}
