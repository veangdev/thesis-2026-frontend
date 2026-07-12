import { Badge } from '@/components/ui/badge'
import {
  ASSESSMENT_STATUS_LABELS,
  type AssessmentStatus,
} from '@/features/assessments'
import { cn } from '@/lib/utils'

const STATUS_CLASSES: Record<AssessmentStatus, string> = {
  draft: 'bg-muted text-muted-foreground',
  self_submitted: 'bg-brand-gold/15 text-brand-gold',
  mentor_review: 'bg-brand-navy/15 text-brand-navy dark:bg-brand-navy/25',
  agreed: 'bg-brand-emerald/15 text-brand-emerald',
  completed: 'bg-brand-emerald/20 text-brand-emerald',
}

export function AssessmentStatusBadge({
  status,
  className,
}: {
  status: AssessmentStatus
  className?: string
}) {
  return (
    <Badge
      variant="secondary"
      className={cn(STATUS_CLASSES[status], className)}
    >
      {ASSESSMENT_STATUS_LABELS[status]}
    </Badge>
  )
}
