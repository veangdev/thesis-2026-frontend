'use client'

import { AlertTriangle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface ErrorStateProps {
  title?: string
  description?: string
  onRetry?: () => void
  retryLabel?: string
  className?: string
}

export function ErrorState({
  title = 'Something went wrong',
  description = 'An unexpected error occurred. Please try again.',
  onRetry,
  retryLabel = 'Try again',
  className,
}: ErrorStateProps) {
  return (
    <div
      role="alert"
      className={cn(
        'flex flex-col items-center justify-center gap-3 rounded-xl border px-6 py-12 text-center',
        className
      )}
    >
      <span className="bg-destructive/10 text-destructive flex size-12 items-center justify-center rounded-full">
        <AlertTriangle className="size-6" />
      </span>
      <div className="space-y-1">
        <h3 className="text-sm font-semibold">{title}</h3>
        <p className="text-muted-foreground mx-auto max-w-sm text-sm">
          {description}
        </p>
      </div>
      {onRetry && (
        <Button variant="outline" size="sm" onClick={onRetry}>
          {retryLabel}
        </Button>
      )}
    </div>
  )
}
