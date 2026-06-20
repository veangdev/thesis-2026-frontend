import { Inbox, type LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

interface EmptyStateProps {
  title: string
  description?: string
  icon?: LucideIcon
  action?: React.ReactNode
  className?: string
}

export function EmptyState({
  title,
  description,
  icon: Icon = Inbox,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed px-6 py-12 text-center',
        className
      )}
    >
      <span className="bg-muted text-muted-foreground flex size-12 items-center justify-center rounded-full">
        <Icon className="size-6" />
      </span>
      <div className="space-y-1">
        <h3 className="text-sm font-semibold">{title}</h3>
        {description && (
          <p className="text-muted-foreground mx-auto max-w-sm text-sm">
            {description}
          </p>
        )}
      </div>
      {action}
    </div>
  )
}
