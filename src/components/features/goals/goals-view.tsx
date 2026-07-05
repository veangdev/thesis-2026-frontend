'use client'

import * as React from 'react'
import { Loader2, Plus, Target, Trophy } from 'lucide-react'
import { EmptyState } from '@/components/shared/empty-state'
import { ErrorState } from '@/components/shared/error-state'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
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
import { Progress } from '@/components/ui/progress'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'
import { Slider } from '@/components/ui/slider'
import { ROLES } from '@/constants/roles'
import { useAuthStore } from '@/features/auth'
import { useCohortDimensions } from '@/features/cohorts'
import {
  useCreateGoal,
  useDeleteGoal,
  useGoals,
  useUpdateGoal,
  type Goal,
} from '@/features/goals'
import { useUsers } from '@/features/users'
import { formatDate } from '@/lib/utils'

function GoalCard({ goal, canEdit }: { goal: Goal; canEdit: boolean }) {
  const updateGoal = useUpdateGoal()
  const deleteGoal = useDeleteGoal()
  const [progress, setProgress] = React.useState(goal.progress)

  const achieved = goal.status === 'achieved'

  return (
    <Card className={achieved ? 'border-brand-emerald/40' : undefined}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-base leading-snug">
            {achieved && (
              <Trophy className="text-brand-gold mr-1.5 inline size-4" />
            )}
            {goal.title}
          </CardTitle>
          <Badge
            variant="secondary"
            className={
              achieved
                ? 'bg-brand-emerald/15 text-brand-emerald shrink-0'
                : 'shrink-0'
            }
          >
            {achieved ? 'Achieved' : 'Active'}
          </Badge>
        </div>
        <CardDescription>
          {goal.dimensionName ? `${goal.dimensionName} · ` : ''}
          {goal.dueDate ? `due ${formatDate(goal.dueDate)}` : 'no due date'}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {goal.description && (
          <p className="text-muted-foreground text-sm">{goal.description}</p>
        )}
        <div className="space-y-1.5">
          <div className="text-muted-foreground flex justify-between text-xs">
            <span>Progress</span>
            <span className="font-mono tabular-nums">{progress}%</span>
          </div>
          {canEdit && !achieved ? (
            <Slider
              value={[progress]}
              min={0}
              max={100}
              step={5}
              onValueChange={([value]) => setProgress(value)}
              onValueCommit={([value]) =>
                updateGoal.mutate({
                  id: goal.id,
                  payload: {
                    progress: value,
                    status: value >= 100 ? 'achieved' : 'active',
                  },
                })
              }
              aria-label={`Progress for ${goal.title}`}
            />
          ) : (
            <Progress value={progress} aria-label={goal.title} />
          )}
        </div>
        {canEdit && (
          <div className="flex justify-end gap-2">
            {!achieved && (
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  updateGoal.mutate({
                    id: goal.id,
                    payload: { progress: 100, status: 'achieved' },
                  })
                }
              >
                <Trophy className="size-3.5" /> Mark achieved
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              className="text-destructive hover:text-destructive"
              onClick={() => deleteGoal.mutate(goal.id)}
            >
              Remove
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

/**
 * Goals & Growth (spec §6). Students manage their own goals; staff pick a
 * student to review theirs.
 */
export function GoalsView() {
  const user = useAuthStore((state) => state.user)
  const isStudent = user?.role === ROLES.SELF_ASSESSOR

  const students = useUsers(
    !isStudent ? { role: ROLES.SELF_ASSESSOR, pageSize: 100 } : undefined
  )
  const [pickedStudentId, setPickedStudentId] = React.useState<string>()
  const studentId = isStudent ? user?.id : pickedStudentId

  const goals = useGoals(studentId ? { studentId, pageSize: 50 } : undefined)
  const student = isStudent
    ? user
    : students.data?.data.find((candidate) => candidate.id === studentId)
  const dimensions = useCohortDimensions(student?.cohortId)
  const createGoal = useCreateGoal()

  const [creating, setCreating] = React.useState(false)
  const [title, setTitle] = React.useState('')
  const [dimensionId, setDimensionId] = React.useState<string>()
  const [dueDate, setDueDate] = React.useState<Date | undefined>()

  if (goals.isError) {
    return (
      <ErrorState
        description={goals.error.message}
        onRetry={() => goals.refetch()}
      />
    )
  }

  const rows = goals.data?.data ?? []
  const active = rows.filter((goal) => goal.status === 'active')
  const achieved = rows.filter((goal) => goal.status === 'achieved')

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        {!isStudent ? (
          <Select
            value={studentId ?? ''}
            onValueChange={(value) => setPickedStudentId(value)}
          >
            <SelectTrigger size="sm" className="w-64">
              <SelectValue placeholder="Pick a student…" />
            </SelectTrigger>
            <SelectContent>
              {(students.data?.data ?? []).map((candidate) => (
                <SelectItem key={candidate.id} value={candidate.id}>
                  {candidate.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        ) : (
          <p className="text-muted-foreground text-sm">
            {active.length} active · {achieved.length} achieved — every step
            counts. 🌱
          </p>
        )}
        {isStudent && (
          <Button size="sm" onClick={() => setCreating(true)}>
            <Plus className="size-4" /> New goal
          </Button>
        )}
      </div>

      {goals.isLoading && studentId ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          <Skeleton className="h-48 w-full" />
          <Skeleton className="h-48 w-full" />
          <Skeleton className="h-48 w-full" />
        </div>
      ) : !studentId ? (
        <EmptyState
          icon={Target}
          title="Pick a student"
          description="Choose whose goals to review."
        />
      ) : rows.length === 0 ? (
        <EmptyState
          icon={Target}
          title="No goals yet"
          description={
            isStudent
              ? 'Set your first goal — small, specific, and tied to a dimension.'
              : 'This student has no goals yet.'
          }
          action={
            isStudent ? (
              <Button onClick={() => setCreating(true)}>
                <Plus className="size-4" /> Create the first goal
              </Button>
            ) : undefined
          }
        />
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {[...active, ...achieved].map((goal) => (
            <GoalCard key={goal.id} goal={goal} canEdit={isStudent} />
          ))}
        </div>
      )}

      <Dialog open={creating} onOpenChange={setCreating}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>New growth goal</DialogTitle>
            <DialogDescription>
              Small and specific beats big and vague.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="goal-title">Goal</Label>
              <Input
                id="goal-title"
                placeholder="Speak up once in every team meeting"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Dimension</Label>
                <Select
                  value={dimensionId ?? ''}
                  onValueChange={setDimensionId}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Optional" />
                  </SelectTrigger>
                  <SelectContent>
                    {(dimensions.data ?? []).map((dimension) => (
                      <SelectItem key={dimension.id} value={dimension.id}>
                        {dimension.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>Due date</Label>
                <DatePicker value={dueDate} onChange={setDueDate} />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              disabled={title.trim().length < 3 || createGoal.isPending}
              onClick={() =>
                createGoal.mutate(
                  {
                    title: title.trim(),
                    dimensionId,
                    dueDate: dueDate
                      ? dueDate.toISOString().slice(0, 10)
                      : undefined,
                  },
                  {
                    onSuccess: () => {
                      setCreating(false)
                      setTitle('')
                      setDimensionId(undefined)
                      setDueDate(undefined)
                    },
                  }
                )
              }
            >
              {createGoal.isPending && (
                <Loader2 className="size-4 animate-spin" />
              )}
              Create goal
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
