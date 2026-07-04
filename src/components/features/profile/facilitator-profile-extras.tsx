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

const DEFAULT_TAGS = ['Communication', 'Interview prep', 'Teamwork']

/**
 * Facilitator-only profile sections (spec §6): availability calendar and
 * expertise tags. Held client-side until the backend exposes fields for them.
 */
export function FacilitatorProfileExtras() {
  const [availability, setAvailability] = React.useState<Date[]>([])
  const [tags, setTags] = React.useState<string[]>(DEFAULT_TAGS)
  const [draft, setDraft] = React.useState('')

  function addTag() {
    const value = draft.trim()
    if (!value) return
    if (tags.some((tag) => tag.toLowerCase() === value.toLowerCase())) {
      toast.info('That tag is already on your profile')
      return
    }
    setTags((current) => [...current, value])
    setDraft('')
  }

  return (
    <div className="mx-auto grid max-w-2xl gap-4 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle className="font-heading text-base">
            Coaching availability
          </CardTitle>
          <CardDescription>
            Mark the days you&apos;re available for sessions this month.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center">
          <Calendar
            mode="multiple"
            selected={availability}
            onSelect={(days) => setAvailability(days ?? [])}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="font-heading text-base">
            Expertise tags
          </CardTitle>
          <CardDescription>
            Help coordinators match you with the right students.
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
                  onClick={() =>
                    setTags((current) => current.filter((t) => t !== tag))
                  }
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
        </CardContent>
      </Card>
    </div>
  )
}
