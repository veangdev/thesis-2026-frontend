import { Construction } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

interface ComingSoonProps {
  title?: string
  description?: string
  className?: string
  children?: React.ReactNode
}

export function ComingSoon({
  title = 'Coming soon',
  description = 'This area is being built. Check back once the backend is connected.',
  className,
  children,
}: ComingSoonProps) {
  return (
    <div
      className={cn(
        'bg-card flex flex-col items-center justify-center gap-4 rounded-xl border px-6 py-16 text-center',
        className
      )}
    >
      <span className="bg-primary/10 text-primary flex size-14 items-center justify-center rounded-2xl">
        <Construction className="size-7" />
      </span>
      <div className="space-y-2">
        <Badge variant="secondary">In progress</Badge>
        <h2 className="text-xl font-semibold tracking-tight">{title}</h2>
        <p className="text-muted-foreground mx-auto max-w-md text-sm">
          {description}
        </p>
      </div>
      {children}
    </div>
  )
}
