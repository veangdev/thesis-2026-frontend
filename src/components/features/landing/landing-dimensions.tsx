import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { DIMENSIONS } from '@/constants/app'

export function LandingDimensions() {
  return (
    <section id="dimensions" className="bg-muted/40 border-y">
      <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-semibold tracking-tight">
            Eight dimensions of growth
          </h2>
          <p className="text-muted-foreground mt-3">
            The skills that turn capable graduates into thriving professionals.
          </p>
        </div>
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {DIMENSIONS.map((dimension, index) => (
            <Card key={dimension.id} className="h-full">
              <CardHeader className="pb-2">
                <span className="text-primary text-xs font-semibold">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <CardTitle className="text-base">{dimension.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm">
                  {dimension.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
