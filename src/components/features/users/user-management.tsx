'use client'

import * as React from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2, Plus, Search, Trash2 } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { ConfirmDialog } from '@/components/shared/confirm-dialog'
import { DataTable, type DataTableColumn } from '@/components/shared/data-table'
import { PaginationControl } from '@/components/shared/pagination-control'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  ROLE_BADGE_CLASSES,
  ROLE_LABELS,
  ROLES,
  type Role,
} from '@/constants/roles'
import { useCohorts } from '@/features/cohorts'
import {
  useCreateUser,
  useDeleteUser,
  useUsers,
  type User,
} from '@/features/users'
import { useDebounce } from '@/hooks/use-debounce'
import { cn } from '@/lib/utils'
import { UserImportDialog } from './user-import-dialog'
import { UserProfileDrawer } from './user-profile-drawer'

const createUserSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Enter a valid email'),
  role: z.enum(['program_coordinator', 'facilitator', 'self_assessor']),
  cohortId: z.string().optional(),
})

const PAGE_SIZE = 10

/** Coordinator user management: search, filter, drawer, bulk remove, create. */
export function UserManagement() {
  const [search, setSearch] = React.useState('')
  const [roleFilter, setRoleFilter] = React.useState<Role | 'all'>('all')
  const [page, setPage] = React.useState(1)
  const [selected, setSelected] = React.useState<Set<string>>(new Set())
  const [drawerUser, setDrawerUser] = React.useState<User | null>(null)
  const [confirmBulk, setConfirmBulk] = React.useState(false)
  const [createOpen, setCreateOpen] = React.useState(false)

  const debouncedSearch = useDebounce(search, 250)
  const users = useUsers({
    search: debouncedSearch || undefined,
    role: roleFilter === 'all' ? undefined : roleFilter,
    page,
    pageSize: PAGE_SIZE,
  })
  const cohorts = useCohorts()
  const createUser = useCreateUser()
  const deleteUser = useDeleteUser()

  const rows = users.data?.data ?? []
  const total = users.data?.meta.total ?? 0
  const cohortName = (cohortId?: string) =>
    cohorts.data?.data.find((cohort) => cohort.id === cohortId)?.name ?? '—'

  const form = useForm<z.infer<typeof createUserSchema>>({
    resolver: zodResolver(createUserSchema),
    defaultValues: { name: '', email: '', role: ROLES.SELF_ASSESSOR },
  })

  function toggleSelected(id: string, checked: boolean) {
    setSelected((current) => {
      const next = new Set(current)
      if (checked) next.add(id)
      else next.delete(id)
      return next
    })
  }

  async function handleBulkDelete() {
    for (const id of selected) {
      // Sequential keeps mock + real modes simple; volumes are small.

      await deleteUser.mutateAsync(id).catch(() => undefined)
    }
    setSelected(new Set())
    setConfirmBulk(false)
  }

  const columns: DataTableColumn<User>[] = [
    {
      key: 'select',
      header: '',
      className: 'w-10',
      render: (row) => (
        <span onClick={(event) => event.stopPropagation()}>
          <Checkbox
            checked={selected.has(row.id)}
            onCheckedChange={(checked) =>
              toggleSelected(row.id, checked === true)
            }
            aria-label={`Select ${row.name}`}
          />
        </span>
      ),
    },
    {
      key: 'name',
      header: 'Name',
      render: (row) => (
        <div>
          <p className="font-medium">{row.name}</p>
          <p className="text-muted-foreground text-xs">{row.email}</p>
        </div>
      ),
    },
    {
      key: 'role',
      header: 'Role',
      render: (row) => (
        <Badge variant="secondary" className={cn(ROLE_BADGE_CLASSES[row.role])}>
          {ROLE_LABELS[row.role]}
        </Badge>
      ),
    },
    {
      key: 'cohort',
      header: 'Cohort',
      render: (row) => (
        <span className="text-sm">{cohortName(row.cohortId)}</span>
      ),
    },
  ]

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-2">
        <div className="relative">
          <Search className="text-muted-foreground absolute top-1/2 left-2.5 size-4 -translate-y-1/2" />
          <Input
            value={search}
            onChange={(event) => {
              setSearch(event.target.value)
              setPage(1)
            }}
            placeholder="Search name or email…"
            className="w-64 pl-8"
          />
        </div>
        <Select
          value={roleFilter}
          onValueChange={(value) => {
            setRoleFilter(value as Role | 'all')
            setPage(1)
          }}
        >
          <SelectTrigger className="w-44">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All roles</SelectItem>
            {(Object.values(ROLES) as Role[]).map((role) => (
              <SelectItem key={role} value={role}>
                {ROLE_LABELS[role]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="ml-auto flex items-center gap-2">
          {selected.size > 0 && (
            <Button
              variant="destructive"
              size="sm"
              onClick={() => setConfirmBulk(true)}
            >
              <Trash2 className="size-4" /> Remove {selected.size}
            </Button>
          )}
          <UserImportDialog />
          <Dialog open={createOpen} onOpenChange={setCreateOpen}>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="size-4" /> Add user
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add a user</DialogTitle>
                <DialogDescription>
                  They&apos;ll receive an invitation to set their password.
                </DialogDescription>
              </DialogHeader>
              <Form {...form}>
                <form
                  className="space-y-4"
                  onSubmit={form.handleSubmit(async (values) => {
                    await createUser.mutateAsync({
                      name: values.name,
                      email: values.email,
                      role: values.role,
                      cohortId: values.cohortId || undefined,
                    })
                    form.reset()
                    setCreateOpen(false)
                  })}
                >
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full name</FormLabel>
                        <FormControl>
                          <Input placeholder="Dara Kim" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input placeholder="dara@pnc.edu" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="grid grid-cols-2 gap-3">
                    <FormField
                      control={form.control}
                      name="role"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Role</FormLabel>
                          <Select
                            value={field.value}
                            onValueChange={field.onChange}
                          >
                            <FormControl>
                              <SelectTrigger className="w-full">
                                <SelectValue />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {(Object.values(ROLES) as Role[]).map((role) => (
                                <SelectItem key={role} value={role}>
                                  {ROLE_LABELS[role]}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="cohortId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Cohort</FormLabel>
                          <Select
                            value={field.value ?? ''}
                            onValueChange={field.onChange}
                          >
                            <FormControl>
                              <SelectTrigger className="w-full">
                                <SelectValue placeholder="Optional" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {(cohorts.data?.data ?? []).map((cohort) => (
                                <SelectItem key={cohort.id} value={cohort.id}>
                                  {cohort.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <DialogFooter>
                    <Button type="submit" disabled={createUser.isPending}>
                      {createUser.isPending && (
                        <Loader2 className="size-4 animate-spin" />
                      )}
                      Create user
                    </Button>
                  </DialogFooter>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={rows}
        getRowId={(row) => row.id}
        loading={users.isLoading}
        emptyTitle="No users match"
        emptyDescription="Adjust the search or filters."
        onRowClick={(row) => setDrawerUser(row)}
      />

      <PaginationControl
        page={page}
        totalPages={Math.max(1, Math.ceil(total / PAGE_SIZE))}
        onPageChange={setPage}
      />

      <UserProfileDrawer
        user={drawerUser}
        onOpenChange={(open) => !open && setDrawerUser(null)}
      />

      <ConfirmDialog
        open={confirmBulk}
        onOpenChange={setConfirmBulk}
        title={`Remove ${selected.size} user${selected.size > 1 ? 's' : ''}?`}
        description="They lose access immediately. Assessment history is kept."
        confirmLabel="Remove"
        destructive
        onConfirm={handleBulkDelete}
      />
    </div>
  )
}
