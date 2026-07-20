'use client'

import * as React from 'react'
import { Plus, X } from 'lucide-react'
import { toast } from 'sonner'
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
import { Input } from '@/components/ui/input'
import { DIMENSIONS } from '@/constants/app'
import { useUpdateMe } from '@/features/users'
import type { User } from '@/types/auth'

/**
 * A calendar day is a date, not an instant. `toISOString()` would convert to
 * UTC first and shift the day backwards for anyone east of Greenwich, so read
 * the local parts directly and rebuild at local midnight on the way back.
 */
function toDateKey(date: Date): string {
  const month = `${date.getMonth() + 1}`.padStart(2, '0')
  const day = `${date.getDate()}`.padStart(2, '0')
  return `${date.getFullYear()}-${month}-${day}`
}

function fromDateKey(key: string): Date {
  const [year, month, day] = key.split('-').map(Number)
  return new Date(year, month - 1, day)
}

/**
 * Facilitator-only profile sections (spec §6). Both expertise tags and
 * coaching availability persist via `PATCH /users/me`.
 */
export function FacilitatorProfileExtras({ user }: { user: User }) {
  const updateMe = useUpdateMe()
  // Midnight today: the earliest day a facilitator can offer.
  const today = React.useMemo(() => {
    const now = new Date()
    return new Date(now.getFullYear(), now.getMonth(), now.getDate())
  }, [])
  const saved = React.useMemo(() => user.expertiseTags ?? [], [user])
  const savedDays = React.useMemo(
    () => [...(user.availability ?? [])].sort(),
    [user]
  )
  const [tags, setTags] = React.useState<string[]>(saved)
  const [draft, setDraft] = React.useState('')
  const [days, setDays] = React.useState<string[]>(savedDays)

  // Adopt server state when it arrives or is changed elsewhere. Adjusting
  // during render (rather than in an effect) avoids a cascading re-render.
  const [syncedFrom, setSyncedFrom] = React.useState(saved)
  if (syncedFrom !== saved) {
    setSyncedFrom(saved)
    setTags(saved)
  }
  const [syncedDaysFrom, setSyncedDaysFrom] = React.useState(savedDays)
  if (syncedDaysFrom !== savedDays) {
    setSyncedDaysFrom(savedDays)
    setDays(savedDays)
  }

  /** Same contract as tags: toggling a day commits it. */
  function commitDays(next: string[]) {
    setDays(next)
    updateMe.mutate({ availability: next }, { onError: () => setDays(days) })
  }

  /**
   * Tags persist the moment they change. A chip appearing on screen reads as
   * "saved", so anything that needs a second Save click silently loses work on
   * refresh — the removed `Save tags` button did exactly that.
   */
  function commitTags(next: string[]) {
    setTags(next)
    updateMe.mutate(
      { expertiseTags: next },
      { onError: () => setTags(tags) } // roll back to what the server still has
    )
  }

  // The programme is built on these eight dimensions, so offering them keeps
  // tags matchable against a self-assessor's weakest area. Free text still
  // works — these are a shortcut, not a whitelist.
  const suggestions = DIMENSIONS.filter(
    (dimension) =>
      !tags.some((tag) => tag.toLowerCase() === dimension.name.toLowerCase())
  )

  function addTag() {
    const value = draft.trim()
    if (!value) return
    if (tags.some((tag) => tag.toLowerCase() === value.toLowerCase())) {
      toast.info('That tag is already on your profile')
      return
    }
    commitTags([...tags, value])
    setDraft('')
  }

  return (
    <div className="grid items-start gap-4 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle className="font-heading text-base">
            Expertise tags
          </CardTitle>
          <CardDescription>
            Help coordinators match you with the right self-assessors.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="gap-1 pr-1">
                {tag}
                <button
                  type="button"
                  aria-label={`Remove ${tag}`}
                  onClick={() => commitTags(tags.filter((t) => t !== tag))}
                  className="hover:bg-muted rounded-full p-0.5"
                >
                  <X className="size-3" />
                </button>
              </Badge>
            ))}
            {tags.length === 0 && (
              <p className="text-muted-foreground text-sm">
                No tags yet — add your strengths below.
              </p>
            )}
          </div>
          <div className="flex gap-2">
            <Input
              value={draft}
              placeholder="e.g. Public speaking"
              onChange={(event) => setDraft(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === 'Enter') {
                  event.preventDefault()
                  addTag()
                }
              }}
            />
            <Button type="button" variant="outline" onClick={addTag}>
              <Plus className="size-4" /> Add
            </Button>
          </div>

          {suggestions.length > 0 && (
            <div className="space-y-2">
              <p className="text-muted-foreground text-xs font-medium">
                Suggested — the eight Journey Star dimensions
              </p>
              <div className="flex flex-wrap gap-2">
                {suggestions.map((dimension) => (
                  <button
                    key={dimension.id}
                    type="button"
                    onClick={() => commitTags([...tags, dimension.name])}
                    title={dimension.description}
                    className="border-input hover:bg-accent hover:text-accent-foreground text-muted-foreground focus-visible:ring-ring inline-flex items-center gap-1 rounded-full border border-dashed px-2.5 py-1 text-xs transition-colors focus-visible:ring-2 focus-visible:outline-none"
                  >
                    <Plus className="size-3" aria-hidden />
                    {dimension.name}
                  </button>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="font-heading text-base">
            Coaching availability
          </CardTitle>
          <CardDescription>
            Mark the days you&apos;re available for sessions.
          </CardDescription>
        </CardHeader>
        {/* The calendar sizes its cells with `flex-1`, so it must be given the
            full width — centring it as a flex item collapses the columns and
            crushes the dates together. */}
        <CardContent>
          <Calendar
            // Capped so cells stay roughly square: at full card width each
            // day becomes a wide rectangle, and adjacent selections merge into
            // one bar that reads as a date *range*. `p-0.5` on the cell insets
            // each button so selected days stay visually distinct.
            className="mx-auto w-full max-w-[17rem] p-0 [&_.rdp-day]:p-0.5"
            mode="multiple"
            selected={days.map(fromDateKey)}
            onSelect={(selected) =>
              commitDays((selected ?? []).map(toDateKey).sort())
            }
            // The server prunes past days, so without this a click on a past
            // date looks like it worked and then silently vanishes. Don't
            // offer the action at all.
            disabled={{ before: today }}
            startMonth={today}
          />
        </CardContent>
      </Card>
    </div>
  )
}
