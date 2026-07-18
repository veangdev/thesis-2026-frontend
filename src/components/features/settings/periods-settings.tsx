'use client'

import * as React from 'react'
import { CalendarRange, Plus, Trash2 } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { ConfirmDialog } from '@/components/shared/confirm-dialog'
import { DatePicker } from '@/components/ui/date-picker'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Skeleton } from '@/components/ui/skeleton'
import {
  useCohortPeriods,
  useCreatePeriod,
  useDeletePeriod,
  type PeriodStatus,
} from '@/features/cohorts'
import { formatDate } from '@/lib/utils'

const STATUS_CLASSES: Record<PeriodStatus, string> = {
  upcoming: 'bg-muted text-muted-foreground',
  active: 'bg-brand-emerald/15 text-brand-emerald',
  completed: 'bg-brand-navy/15 text-brand-navy',
}

/** Dynamic assessment periods (spec §3): any number, any dates. */
export function PeriodsSettings({ cohortId }: { cohortId: string }) {
  const periods = useCohortPeriods(cohortId)
  const createPeriod = useCreatePeriod()
  const deletePeriod = useDeletePeriod(cohortId)

  const [open, setOpen] = React.useState(false)
  const [name, setName] = React.useState('')
  const [startDate, setStartDate] = React.useState<Date | undefined>()
  const [endDate, setEndDate] = React.useState<Date | undefined>()
  const [deleteId, setDeleteId] = React.useState<string | null>(null)

  const valid = name.trim().length >= 3 && startDate && endDate

  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between space-y-0">
        <div>
          <CardTitle className="font-heading flex items-center gap-2 text-base">
            <CalendarRange className="size-4" /> Assessment periods
          </CardTitle>
          <CardDescription>
            Cycles are fully dynamic — any number, any dates.
          </CardDescription>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button size="sm">
              <Plus className="size-4" /> New period
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create an assessment period</DialogTitle>
              <DialogDescription>
                Self-assessors self-assess and facilitators review within this
                window.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="period-name">Name</Label>
                <Input
                  id="period-name"
                  placeholder="Cycle 5 — Launch"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label>Starts</Label>
                  <DatePicker value={startDate} onChange={setStartDate} />
                </div>
                <div className="space-y-1.5">
                  <Label>Ends</Label>
                  <DatePicker value={endDate} onChange={setEndDate} />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button
                disabled={!valid || createPeriod.isPending}
                onClick={() => {
                  if (!startDate || !endDate) return
                  createPeriod.mutate(
                    {
                      cohortId,
                      payload: {
                        name: name.trim(),
                        startDate: startDate.toISOString().slice(0, 10),
                        endDate: endDate.toISOString().slice(0, 10),
                        status: 'upcoming',
                      },
                    },
                    {
                      onSuccess: () => {
                        setOpen(false)
                        setName('')
                        setStartDate(undefined)
                        setEndDate(undefined)
                      },
                    }
                  )
                }}
              >
                Create period
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent className="space-y-2">
        {periods.isLoading ? (
          <Skeleton className="h-40 w-full" />
        ) : (
          (periods.data ?? []).map((period) => (
            <div
              key={period.id}
              className="flex items-center justify-between gap-3 rounded-lg border p-3"
            >
              <div>
                <p className="flex items-center gap-2 text-sm font-medium">
                  {period.name}
                  <Badge
                    variant="secondary"
                    className={STATUS_CLASSES[period.status]}
                  >
                    {period.status}
                  </Badge>
                </p>
                <p className="text-muted-foreground text-xs">
                  {formatDate(period.startDate)} – {formatDate(period.endDate)}
                </p>
              </div>
              {period.status === 'upcoming' && (
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label={`Delete ${period.name}`}
                  onClick={() => setDeleteId(period.id)}
                >
                  <Trash2 className="text-destructive size-4" />
                </Button>
              )}
            </div>
          ))
        )}
      </CardContent>

      <ConfirmDialog
        open={deleteId !== null}
        onOpenChange={(dialogOpen) => !dialogOpen && setDeleteId(null)}
        title="Delete this period?"
        description="Only upcoming periods can be deleted. This cannot be undone."
        confirmLabel="Delete"
        destructive
        onConfirm={() => {
          if (deleteId) deletePeriod.mutate(deleteId)
          setDeleteId(null)
        }}
      />
    </Card>
  )
}
