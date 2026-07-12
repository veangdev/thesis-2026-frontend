'use client'

import * as React from 'react'
import { format, isSameDay } from 'date-fns'
import { CalendarDays, Plus } from 'lucide-react'
import { EmptyState } from '@/components/shared/empty-state'
import { ErrorState } from '@/components/shared/error-state'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ROLES } from '@/constants/roles'
import { useAuthStore } from '@/features/auth'
import {
  COACHING_SCOPE_LABELS,
  useCoachingSessions,
  type CoachingSession,
} from '@/features/coaching'
import { cn, formatDate } from '@/lib/utils'
import { CoachingSessionDialog } from './coaching-session-dialog'
import { NewSessionDialog } from './new-session-dialog'

const SCOPE_CLASSES: Record<CoachingSession['scope'], string> = {
  individual: 'bg-brand-navy/15 text-brand-navy dark:bg-brand-navy/25',
  group: 'bg-brand-emerald/15 text-brand-emerald',
  class: 'bg-brand-gold/15 text-brand-gold',
  batch: 'bg-muted text-muted-foreground',
}

function SessionRow({
  session,
  onOpen,
}: {
  session: CoachingSession
  onOpen: (session: CoachingSession) => void
}) {
  const done = session.actionItems.filter((item) => item.done).length
  return (
    <button
      type="button"
      onClick={() => onOpen(session)}
      className={cn(
        'hover:bg-accent/60 w-full rounded-lg border p-3 text-left',
        session.status === 'cancelled' && 'opacity-60'
      )}
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-sm font-medium">{session.title}</p>
        <Badge variant="secondary" className={SCOPE_CLASSES[session.scope]}>
          {COACHING_SCOPE_LABELS[session.scope]}
        </Badge>
      </div>
      <p className="text-muted-foreground mt-1 text-xs">
        {format(new Date(session.scheduledAt), 'EEE d MMM, HH:mm')} ·{' '}
        {session.durationMinutes} min · {session.facilitatorName}
        {session.actionItems.length > 0 &&
          ` · ${done}/${session.actionItems.length} actions done`}
      </p>
    </button>
  )
}

/**
 * Coaching sessions (spec §6): month calendar + upcoming/past timeline,
 * detail dialog with action items and follow-ups; facilitators schedule new
 * sessions with a scope (individual/group/class/batch).
 */
export function CoachingView() {
  const user = useAuthStore((state) => state.user)
  const isStudent = user?.role === ROLES.SELF_ASSESSOR
  const isFacilitator = user?.role === ROLES.FACILITATOR

  const sessions = useCoachingSessions(
    user
      ? isStudent
        ? { studentId: user.id, pageSize: 100 }
        : isFacilitator
          ? { facilitatorId: user.id, pageSize: 100 }
          : { pageSize: 100 }
      : undefined
  )

  const [selectedDay, setSelectedDay] = React.useState<Date | undefined>()
  const [openSession, setOpenSession] = React.useState<CoachingSession | null>(
    null
  )
  const [creating, setCreating] = React.useState(false)

  if (sessions.isError) {
    return (
      <ErrorState
        description={sessions.error.message}
        onRetry={() => sessions.refetch()}
      />
    )
  }
  if (sessions.isLoading) {
    return <Skeleton className="h-96 w-full" />
  }

  const rows = sessions.data?.data ?? []
  const sessionDays = rows.map((session) => new Date(session.scheduledAt))
  const dayRows = selectedDay
    ? rows.filter((session) =>
        isSameDay(new Date(session.scheduledAt), selectedDay)
      )
    : []
  const upcoming = rows.filter((session) => session.status === 'scheduled')
  const past = rows.filter((session) => session.status !== 'scheduled')

  return (
    <div className="grid gap-4 lg:grid-cols-3">
      <Card className="lg:col-span-1">
        <CardHeader className="flex-row items-center justify-between space-y-0">
          <div>
            <CardTitle className="font-heading flex items-center gap-2 text-base">
              <CalendarDays className="size-4" /> Calendar
            </CardTitle>
            <CardDescription>Days with sessions are marked.</CardDescription>
          </div>
          {isFacilitator && (
            <Button size="sm" onClick={() => setCreating(true)}>
              <Plus className="size-4" /> Schedule
            </Button>
          )}
        </CardHeader>
        <CardContent className="space-y-3">
          <Calendar
            mode="single"
            selected={selectedDay}
            onSelect={setSelectedDay}
            defaultMonth={new Date('2026-07-01')}
            modifiers={{ hasSession: sessionDays }}
            modifiersClassNames={{
              hasSession:
                'relative after:absolute after:bottom-1 after:left-1/2 after:-translate-x-1/2 after:size-1 after:rounded-full after:bg-brand-emerald',
            }}
            className="mx-auto"
          />
          {selectedDay && (
            <div className="space-y-2">
              <p className="text-muted-foreground text-xs font-medium">
                {formatDate(selectedDay)}
              </p>
              {dayRows.length === 0 ? (
                <p className="text-muted-foreground text-sm">
                  No sessions this day.
                </p>
              ) : (
                dayRows.map((session) => (
                  <SessionRow
                    key={session.id}
                    session={session}
                    onOpen={setOpenSession}
                  />
                ))
              )}
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle className="font-heading text-base">Sessions</CardTitle>
          <CardDescription>
            {isStudent
              ? 'Your coaching journey — prepared minds grow faster.'
              : 'Timeline across your students.'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="upcoming">
            <TabsList>
              <TabsTrigger value="upcoming">
                Upcoming ({upcoming.length})
              </TabsTrigger>
              <TabsTrigger value="past">Past ({past.length})</TabsTrigger>
            </TabsList>
            <TabsContent value="upcoming" className="space-y-2">
              {upcoming.length === 0 ? (
                <EmptyState
                  icon={CalendarDays}
                  title="Nothing scheduled"
                  description={
                    isFacilitator
                      ? 'Schedule a session to keep momentum going.'
                      : 'Your mentor will schedule the next session.'
                  }
                />
              ) : (
                upcoming.map((session) => (
                  <SessionRow
                    key={session.id}
                    session={session}
                    onOpen={setOpenSession}
                  />
                ))
              )}
            </TabsContent>
            <TabsContent value="past" className="space-y-2">
              {past.length === 0 ? (
                <EmptyState title="No past sessions yet" />
              ) : (
                past.map((session) => (
                  <SessionRow
                    key={session.id}
                    session={session}
                    onOpen={setOpenSession}
                  />
                ))
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <CoachingSessionDialog
        session={openSession}
        onOpenChange={(open) => !open && setOpenSession(null)}
        canEdit={!isStudent}
      />
      {isFacilitator && (
        <NewSessionDialog open={creating} onOpenChange={setCreating} />
      )}
    </div>
  )
}
