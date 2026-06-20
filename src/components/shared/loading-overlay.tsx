import { Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

interface LoadingOverlayProps {
  label?: string
  /** Cover the whole viewport instead of the parent container. */
  fullscreen?: boolean
  className?: string
}

export function LoadingOverlay({
  label = 'Loading…',
  fullscreen = false,
  className,
}: LoadingOverlayProps) {
  return (
    <div
      role="status"
      aria-live="polite"
      className={cn(
        'bg-background/70 flex flex-col items-center justify-center gap-3 backdrop-blur-sm',
        fullscreen ? 'fixed inset-0 z-50' : 'absolute inset-0 z-10',
        className
      )}
    >
      <Loader2 className="text-primary size-6 animate-spin" />
      <p className="text-muted-foreground text-sm">{label}</p>
    </div>
  )
}
