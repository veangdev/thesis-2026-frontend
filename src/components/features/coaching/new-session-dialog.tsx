'use client'

import * as React from 'react'
import { Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { DatePicker } from '@/components/ui/date-picker'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { ROLES } from '@/constants/roles'
import { useAuthStore } from '@/features/auth'
import {
  COACHING_SCOPE_LABELS,
  useCreateCoachingSession,
  type CoachingScope,
} from '@/features/coaching'
import { useFacilitatorStudents, useUsers } from '@/features/users'

interface NewSessionDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

/**
 * Session scheduling: title, scope, participants, date, duration.
 * Facilitators pick from their own roster; coordinators from all students.
 */
export function NewSessionDialog({
  open,
  onOpenChange,
}: NewSessionDialogProps) {
  const user = useAuthStore((state) => state.user)
  const isCoordinator = user?.role === ROLES.PROGRAM_COORDINATOR
  const roster = useFacilitatorStudents(isCoordinator ? undefined : user?.id)
  const allStudents = useUsers(
    { role: ROLES.SELF_ASSESSOR, pageSize: 100 },
    { enabled: isCoordinator }
  )
  const createSession = useCreateCoachingSession()

  const [title, setTitle] = React.useState('')
  const [scope, setScope] = React.useState<CoachingScope>('individual')
  const [participantIds, setParticipantIds] = React.useState<string[]>([])
  const [date, setDate] = React.useState<Date | undefined>()
  const [time, setTime] = React.useState('09:00')
  const [duration, setDuration] = React.useState('45')
  const [followUp, setFollowUp] = React.useState<Date | undefined>()

  const students = isCoordinator
    ? (allStudents.data?.data ?? [])
    : (roster.data ?? [])
  // Class/batch sessions automatically include the whole roster.
  const wholeRoster = scope === 'class' || scope === 'batch'
  const effectiveParticipants = wholeRoster
    ? students.map((student) => student.id)
    : participantIds

  const valid =
    title.trim().length >= 3 && date && effectiveParticipants.length > 0

  function toggleParticipant(id: string, checked: boolean) {
    setParticipantIds((current) => {
      if (scope === 'individual') return checked ? [id] : []
      return checked
        ? [...current, id]
        : current.filter((candidate) => candidate !== id)
    })
  }

  function submit() {
    if (!date) return
    const [hours, minutes] = time.split(':').map(Number)
    const scheduledAt = new Date(date)
    scheduledAt.setHours(hours ?? 9, minutes ?? 0, 0, 0)
    createSession.mutate(
      {
        title: title.trim(),
        scope,
        participantIds: effectiveParticipants,
        scheduledAt: scheduledAt.toISOString(),
        durationMinutes: Number(duration),
        followUpAt: followUp ? followUp.toISOString() : undefined,
      },
      {
        onSuccess: () => {
          onOpenChange(false)
          setTitle('')
          setParticipantIds([])
          setDate(undefined)
          setFollowUp(undefined)
        },
      }
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Schedule a coaching session</DialogTitle>
          <DialogDescription>
            {isCoordinator
              ? 'Pick a scope — class and batch sessions include every student.'
              : 'Pick a scope — class and batch sessions include your whole roster.'}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="session-title">Title</Label>
            <Input
              id="session-title"
              placeholder="Interview practice — STAR answers"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Scope</Label>
              <Select
                value={scope}
                onValueChange={(value) => {
                  setScope(value as CoachingScope)
                  setParticipantIds([])
                }}
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {(
                    Object.entries(COACHING_SCOPE_LABELS) as [
                      CoachingScope,
                      string,
                    ][]
                  ).map(([value, label]) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Duration</Label>
              <Select value={duration} onValueChange={setDuration}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {['30', '45', '60', '90'].map((minutes) => (
                    <SelectItem key={minutes} value={minutes}>
                      {minutes} min
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Date</Label>
              <DatePicker value={date} onChange={setDate} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="session-time">Time</Label>
              <Input
                id="session-time"
                type="time"
                value={time}
                onChange={(event) => setTime(event.target.value)}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label>
              Follow-up date{' '}
              <span className="text-muted-foreground font-normal">
                (optional)
              </span>
            </Label>
            <DatePicker value={followUp} onChange={setFollowUp} />
          </div>

          {!wholeRoster && (
            <div className="space-y-2">
              <Label>
                Participants{' '}
                <span className="text-muted-foreground font-normal">
                  {scope === 'individual' ? '(pick one)' : '(pick several)'}
                </span>
              </Label>
              <div className="grid max-h-44 gap-1.5 overflow-y-auto rounded-lg border p-2 sm:grid-cols-2">
                {students.map((student) => (
                  <div key={student.id} className="flex items-center gap-2">
                    <Checkbox
                      id={`participant-${student.id}`}
                      checked={effectiveParticipants.includes(student.id)}
                      onCheckedChange={(checked) =>
                        toggleParticipant(student.id, checked === true)
                      }
                    />
                    <Label
                      htmlFor={`participant-${student.id}`}
                      className="text-sm font-normal"
                    >
                      {student.name}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          )}
          {wholeRoster && (
            <p className="text-muted-foreground text-sm">
              {isCoordinator
                ? `Includes all ${students.length} students in the program.`
                : `Includes all ${students.length} students on your roster.`}
            </p>
          )}
        </div>

        <DialogFooter>
          <Button disabled={!valid || createSession.isPending} onClick={submit}>
            {createSession.isPending && (
              <Loader2 className="size-4 animate-spin" />
            )}
            Schedule session
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
