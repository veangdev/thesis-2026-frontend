'use client'

import * as React from 'react'
import { format } from 'date-fns'
import { CalendarClock, Plus, Trash2 } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
<<<<<<< HEAD
=======
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
>>>>>>> origin/main
import { Separator } from '@/components/ui/separator'
import {
  COACHING_SCOPE_LABELS,
  useCreateActionItem,
  useDeleteActionItem,
  useUpdateActionItem,
  useUpdateCoachingSession,
  type CoachingSession,
} from '@/features/coaching'
import { formatDate } from '@/lib/utils'

interface CoachingSessionDialogProps {
  session: CoachingSession | null
  onOpenChange: (open: boolean) => void
  /** Facilitators/coordinators can complete sessions and manage actions. */
  canEdit: boolean
}

/** Session detail: participants, notes, follow-up, action-item checklist. */
export function CoachingSessionDialog({
  session,
  onOpenChange,
  canEdit,
}: CoachingSessionDialogProps) {
  const updateSession = useUpdateCoachingSession()
  const createActionItem = useCreateActionItem()
  const updateActionItem = useUpdateActionItem()
  const deleteActionItem = useDeleteActionItem()
  const [newAction, setNewAction] = React.useState('')
<<<<<<< HEAD
=======
  const [newAssignee, setNewAssignee] = React.useState('unassigned')
>>>>>>> origin/main

  // Keep the dialog in sync when a different session opens — render-time
  // derived-state adjustment (no effect needed).
  const [local, setLocal] = React.useState<CoachingSession | null>(session)
  const [prevSession, setPrevSession] = React.useState(session)
  if (session !== prevSession) {
    setPrevSession(session)
    setLocal(session)
  }

  if (!local) return null

  const toggleItem = (itemId: string, done: boolean) => {
    setLocal((current) =>
      current
        ? {
            ...current,
            actionItems: current.actionItems.map((item) =>
              item.id === itemId ? { ...item, done } : item
            ),
          }
        : current
    )
    updateActionItem.mutate({ id: itemId, payload: { done } })
  }

  return (
    <Dialog open={!!session} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="font-heading flex items-center gap-2">
            <CalendarClock className="size-5" /> {local.title}
          </DialogTitle>
          <DialogDescription>
            {format(new Date(local.scheduledAt), 'EEEE d MMMM yyyy, HH:mm')} ·{' '}
            {local.durationMinutes} min
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="secondary">
              {COACHING_SCOPE_LABELS[local.scope]}
            </Badge>
            <Badge
              variant="secondary"
              className={
                local.status === 'completed'
                  ? 'bg-brand-emerald/15 text-brand-emerald'
                  : local.status === 'cancelled'
                    ? 'bg-destructive/15 text-destructive'
                    : 'bg-brand-gold/15 text-brand-gold'
              }
            >
              {local.status}
            </Badge>
            {local.followUpAt && (
              <span className="text-muted-foreground text-xs">
                Follow-up {formatDate(local.followUpAt)}
              </span>
            )}
          </div>

          <div>
            <p className="text-muted-foreground mb-1 text-xs font-medium">
              With {local.facilitatorName} · {local.participantNames.length}{' '}
              participant
              {local.participantNames.length > 1 ? 's' : ''}
            </p>
            <p className="text-sm">{local.participantNames.join(', ')}</p>
          </div>

          {local.notes && (
            <p className="bg-muted/50 rounded-lg p-3 text-sm">{local.notes}</p>
          )}

          <Separator />

          <div className="space-y-2">
            <p className="text-sm font-medium">
              Action items (
              {local.actionItems.filter((item) => item.done).length}/
              {local.actionItems.length})
            </p>
            {local.actionItems.length === 0 && (
              <p className="text-muted-foreground text-sm">
                No action items yet.
              </p>
            )}
            {local.actionItems.map((item) => (
              <div key={item.id} className="flex items-start gap-2">
                <Checkbox
                  id={`action-${item.id}`}
                  checked={item.done}
                  onCheckedChange={(checked) =>
                    toggleItem(item.id, checked === true)
                  }
                  className="mt-0.5"
                />
                <label
                  htmlFor={`action-${item.id}`}
                  className={`flex-1 text-sm ${item.done ? 'text-muted-foreground line-through' : ''}`}
                >
                  {item.title}
<<<<<<< HEAD
=======
                  {item.assigneeName && (
                    <span className="text-muted-foreground ml-1 text-xs">
                      · {item.assigneeName}
                    </span>
                  )}
>>>>>>> origin/main
                  {item.dueDate && (
                    <span className="text-muted-foreground ml-1 text-xs">
                      · due {formatDate(item.dueDate)}
                    </span>
                  )}
                </label>
                {canEdit && (
                  <button
                    type="button"
                    aria-label={`Delete ${item.title}`}
                    onClick={() => {
                      setLocal((current) =>
                        current
                          ? {
                              ...current,
                              actionItems: current.actionItems.filter(
                                (candidate) => candidate.id !== item.id
                              ),
                            }
                          : current
                      )
                      deleteActionItem.mutate(item.id)
                    }}
                    className="text-muted-foreground hover:text-destructive"
                  >
                    <Trash2 className="size-3.5" />
                  </button>
                )}
              </div>
            ))}

            {canEdit && (
              <form
<<<<<<< HEAD
                className="flex gap-2 pt-1"
=======
                className="flex flex-wrap gap-2 pt-1"
>>>>>>> origin/main
                onSubmit={(event) => {
                  event.preventDefault()
                  const title = newAction.trim()
                  if (!title) return
                  createActionItem.mutate(
<<<<<<< HEAD
                    { sessionId: local.id, payload: { title } },
=======
                    {
                      sessionId: local.id,
                      payload: {
                        title,
                        assigneeId:
                          newAssignee === 'unassigned'
                            ? undefined
                            : newAssignee,
                      },
                    },
>>>>>>> origin/main
                    {
                      onSuccess: (item) => {
                        setLocal((current) =>
                          current
                            ? {
                                ...current,
                                actionItems: [...current.actionItems, item],
                              }
                            : current
                        )
                      },
                    }
                  )
                  setNewAction('')
<<<<<<< HEAD
=======
                  setNewAssignee('unassigned')
>>>>>>> origin/main
                }}
              >
                <Input
                  value={newAction}
                  onChange={(event) => setNewAction(event.target.value)}
                  placeholder="Add an action item…"
<<<<<<< HEAD
                  className="h-8"
                />
=======
                  className="h-8 min-w-40 flex-1"
                />
                <Select value={newAssignee} onValueChange={setNewAssignee}>
                  <SelectTrigger size="sm" className="w-40">
                    <SelectValue placeholder="Assign to…" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="unassigned">Unassigned</SelectItem>
                    {local.participantIds.map((id, index) => (
                      <SelectItem key={id} value={id}>
                        {local.participantNames[index] ?? id}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
>>>>>>> origin/main
                <Button type="submit" size="sm" variant="outline">
                  <Plus className="size-4" /> Add
                </Button>
              </form>
            )}
          </div>

          {canEdit && local.status === 'scheduled' && (
            <>
              <Separator />
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    updateSession.mutate({
                      id: local.id,
                      payload: { status: 'cancelled' },
                    })
                    onOpenChange(false)
                  }}
                >
                  Cancel session
                </Button>
                <Button
                  size="sm"
                  onClick={() => {
                    updateSession.mutate({
                      id: local.id,
                      payload: { status: 'completed' },
                    })
                    onOpenChange(false)
                  }}
                >
                  Mark completed
                </Button>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
