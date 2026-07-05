'use client'

import * as React from 'react'
import { Plus, Shapes, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { ConfirmDialog } from '@/components/shared/confirm-dialog'
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
import { Textarea } from '@/components/ui/textarea'
import {
  useCohortDimensions,
  useCreateDimension,
  useDeleteDimension,
} from '@/features/cohorts'

/** Dimension management (spec §6): the axes of the Journey Star. */
export function DimensionsSettings({ cohortId }: { cohortId: string }) {
  const dimensions = useCohortDimensions(cohortId)
  const createDimension = useCreateDimension()
  const deleteDimension = useDeleteDimension(cohortId)

  const [open, setOpen] = React.useState(false)
  const [name, setName] = React.useState('')
  const [description, setDescription] = React.useState('')
  const [deleteId, setDeleteId] = React.useState<string | null>(null)

  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between space-y-0">
        <div>
          <CardTitle className="font-heading flex items-center gap-2 text-base">
            <Shapes className="size-4" /> Dimensions
          </CardTitle>
          <CardDescription>
            The skills each assessment cycle measures — the points of the star.
          </CardDescription>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button size="sm">
              <Plus className="size-4" /> Add dimension
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add a dimension</DialogTitle>
              <DialogDescription>
                Applies to this cohort&apos;s upcoming assessments.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="dimension-name">Name</Label>
                <Input
                  id="dimension-name"
                  placeholder="Leadership"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="dimension-description">Description</Label>
                <Textarea
                  id="dimension-description"
                  placeholder="What does growth in this dimension look like?"
                  rows={2}
                  value={description}
                  onChange={(event) => setDescription(event.target.value)}
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                disabled={
                  name.trim().length < 2 ||
                  description.trim().length < 5 ||
                  createDimension.isPending
                }
                onClick={() =>
                  createDimension.mutate(
                    {
                      cohortId,
                      payload: {
                        name: name.trim(),
                        description: description.trim(),
                      },
                    },
                    {
                      onSuccess: () => {
                        setOpen(false)
                        setName('')
                        setDescription('')
                      },
                    }
                  )
                }
              >
                Add dimension
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent className="space-y-2">
        {dimensions.isLoading ? (
          <Skeleton className="h-48 w-full" />
        ) : (
          (dimensions.data ?? []).map((dimension) => (
            <div
              key={dimension.id}
              className="flex items-center justify-between gap-3 rounded-lg border p-3"
            >
              <div className="min-w-0">
                <p className="text-sm font-medium">
                  <span className="text-muted-foreground mr-2 font-mono text-xs">
                    {dimension.order}
                  </span>
                  {dimension.name}
                </p>
                <p className="text-muted-foreground truncate text-xs">
                  {dimension.description}
                </p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                aria-label={`Delete ${dimension.name}`}
                onClick={() => setDeleteId(dimension.id)}
              >
                <Trash2 className="text-destructive size-4" />
              </Button>
            </div>
          ))
        )}
      </CardContent>

      <ConfirmDialog
        open={deleteId !== null}
        onOpenChange={(dialogOpen) => !dialogOpen && setDeleteId(null)}
        title="Remove this dimension?"
        description="It disappears from upcoming assessments. Historical scores are kept."
        confirmLabel="Remove"
        destructive
        onConfirm={() => {
          if (deleteId) deleteDimension.mutate(deleteId)
          setDeleteId(null)
        }}
      />
    </Card>
  )
}
