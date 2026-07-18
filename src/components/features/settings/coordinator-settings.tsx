'use client'

import * as React from 'react'
import Image from 'next/image'
import { Bell, Palette, ScrollText, ShieldCheck } from 'lucide-react'
<<<<<<< HEAD
import { DataTable, type DataTableColumn } from '@/components/shared/data-table'
import { Badge } from '@/components/ui/badge'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Label } from '@/components/ui/label'
=======

import { formatDate } from '@/lib/utils'
import { siteConfig } from '@/config/site'
import { Badge } from '@/components/ui/badge'
import { Label } from '@/components/ui/label'
import type { AuditLog } from '@/features/audit'
import { useAuditLogs } from '@/features/audit'
import { useCohorts } from '@/features/cohorts'
import { Switch } from '@/components/ui/switch'
import { PeriodsSettings } from './periods-settings'
import { DimensionsSettings } from './dimensions-settings'
import { CohortScaleSettings } from './cohort-scale-settings'
import { TabPanels } from '@/components/shared/tab-panels'
import { DataTable, type DataTableColumn } from '@/components/shared/data-table'
>>>>>>> origin/main
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
<<<<<<< HEAD
import { Switch } from '@/components/ui/switch'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
=======
>>>>>>> origin/main
import {
  PERMISSIONS,
  ROLE_LABELS,
  ROLE_PERMISSIONS,
  ROLES,
  type Role,
} from '@/constants/roles'
<<<<<<< HEAD
import { siteConfig } from '@/config/site'
import type { AuditLog } from '@/features/audit'
import { useAuditLogs } from '@/features/audit'
import { useCohorts } from '@/features/cohorts'
import { formatDate } from '@/lib/utils'
import { CohortScaleSettings } from './cohort-scale-settings'
import { DimensionsSettings } from './dimensions-settings'
import { PeriodsSettings } from './periods-settings'
=======
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
>>>>>>> origin/main

const NOTIFICATION_RULES = [
  {
    id: 'assessment-open',
    label: 'Cycle opened',
<<<<<<< HEAD
    description: 'Notify students when a new assessment period starts.',
=======
    description: 'Notify self-assessors when a new assessment period starts.',
>>>>>>> origin/main
  },
  {
    id: 'submission',
    label: 'Self-assessment submitted',
<<<<<<< HEAD
    description: 'Notify the assigned mentor immediately.',
=======
    description: 'Notify the assigned facilitator immediately.',
>>>>>>> origin/main
  },
  {
    id: 'review-complete',
    label: 'Review completed',
<<<<<<< HEAD
    description: 'Notify the student when scores are agreed.',
=======
    description: 'Notify the self-assessor when scores are agreed.',
>>>>>>> origin/main
  },
  {
    id: 'weekly-digest',
    label: 'Weekly completion digest',
    description: 'Email coordinators a completion summary every Monday.',
  },
]

/** Coordinator settings: periods · dimensions · scale · rules · audit · brand. */
export function CoordinatorSettings() {
  const cohorts = useCohorts()
  const [cohortId, setCohortId] = React.useState<string | undefined>()
  const activeCohortId = cohortId ?? cohorts.data?.data[0]?.id

  const [rules, setRules] = React.useState<Record<string, boolean>>({
    'assessment-open': true,
    submission: true,
    'review-complete': true,
    'weekly-digest': false,
  })

  const [auditSearch, setAuditSearch] = React.useState('')
  const audit = useAuditLogs({ pageSize: 20 })

  const auditColumns: DataTableColumn<AuditLog>[] = [
    {
      key: 'when',
      header: 'When',
      className: 'w-32',
      render: (row) => (
        <span className="text-muted-foreground text-xs">
          {formatDate(row.timestamp)}
        </span>
      ),
    },
    { key: 'actorName', header: 'Actor', render: (row) => row.actorName },
    {
      key: 'action',
      header: 'Action',
      render: (row) => (
        <Badge variant="secondary" className="font-mono text-[11px]">
          {row.action}
        </Badge>
      ),
    },
    {
      key: 'details',
      header: 'Details',
      render: (row) => <span className="text-sm">{row.details ?? '—'}</span>,
    },
  ]

  const filteredAudit = (audit.data?.data ?? []).filter((row) =>
    auditSearch
      ? `${row.actorName} ${row.action} ${row.details ?? ''}`
          .toLowerCase()
          .includes(auditSearch.toLowerCase())
      : true
  )

  return (
<<<<<<< HEAD
    <Tabs defaultValue="periods" className="space-y-4">
      <TabsList className="flex-wrap">
        <TabsTrigger value="periods">Periods</TabsTrigger>
        <TabsTrigger value="dimensions">Dimensions</TabsTrigger>
        <TabsTrigger value="scale">Scoring scale</TabsTrigger>
        <TabsTrigger value="notifications">Notifications</TabsTrigger>
        <TabsTrigger value="permissions">Permissions</TabsTrigger>
        <TabsTrigger value="audit">Audit log</TabsTrigger>
        <TabsTrigger value="branding">Branding</TabsTrigger>
      </TabsList>

=======
    <TabPanels
      className="space-y-4"
      tabs={[
        {
          value: 'periods',
          label: 'Periods',
          content: activeCohortId ? (
            <PeriodsSettings cohortId={activeCohortId} />
          ) : null,
        },
        {
          value: 'dimensions',
          label: 'Dimensions',
          content: activeCohortId ? (
            <DimensionsSettings cohortId={activeCohortId} />
          ) : null,
        },
        {
          value: 'scale',
          label: 'Scoring scale',
          content: activeCohortId ? (
            <CohortScaleSettings cohortId={activeCohortId} />
          ) : null,
        },
        {
          value: 'notifications',
          label: 'Notifications',
          content: (
            <Card>
              <CardHeader>
                <CardTitle className="font-heading flex items-center gap-2 text-base">
                  <Bell className="size-4" /> Notification rules
                </CardTitle>
                <CardDescription>
                  What the system sends, and to whom.
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-4">
                {NOTIFICATION_RULES.map((rule) => (
                  <div
                    key={rule.id}
                    className="flex items-center justify-between gap-4"
                  >
                    <div>
                      <Label
                        htmlFor={`rule-${rule.id}`}
                        className="font-medium"
                      >
                        {rule.label}
                      </Label>
                      <p className="text-muted-foreground text-sm">
                        {rule.description}
                      </p>
                    </div>
                    <Switch
                      id={`rule-${rule.id}`}
                      checked={rules[rule.id] ?? false}
                      onCheckedChange={(checked) =>
                        setRules((current) => ({
                          ...current,
                          [rule.id]: checked,
                        }))
                      }
                    />
                  </div>
                ))}
              </CardContent>
            </Card>
          ),
        },
        {
          value: 'permissions',
          label: 'Permissions',
          content: (
            <Card>
              <CardHeader>
                <CardTitle className="font-heading flex items-center gap-2 text-base">
                  <ShieldCheck className="size-4" /> Role permissions
                </CardTitle>
                <CardDescription>
                  The default permission matrix per role.
                </CardDescription>
              </CardHeader>
              <CardContent className="overflow-x-auto">
                <table className="w-full min-w-140 text-sm">
                  <thead>
                    <tr className="border-b text-left">
                      <th className="text-muted-foreground py-2 pr-4 text-xs font-medium">
                        Permission
                      </th>
                      {(Object.values(ROLES) as Role[]).map((role) => (
                        <th
                          key={role}
                          className="text-muted-foreground px-3 py-2 text-center text-xs font-medium"
                        >
                          {ROLE_LABELS[role]}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {Object.values(PERMISSIONS).map((permission) => (
                      <tr key={permission} className="border-b last:border-b-0">
                        <td className="py-2 pr-4 font-mono text-xs">
                          {permission}
                        </td>
                        {(Object.values(ROLES) as Role[]).map((role) => (
                          <td key={role} className="px-3 py-2 text-center">
                            {ROLE_PERMISSIONS[role].includes(permission) ? (
                              <span className="text-brand-emerald">✓</span>
                            ) : (
                              <span className="text-muted-foreground/40">
                                —
                              </span>
                            )}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </CardContent>
            </Card>
          ),
        },
        {
          value: 'audit',
          label: 'Audit log',
          content: (
            <Card>
              <CardHeader>
                <CardTitle className="font-heading flex items-center gap-2 text-base">
                  <ScrollText className="size-4" /> Audit log
                </CardTitle>
                <CardDescription>Who changed what, and when.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <input
                  value={auditSearch}
                  onChange={(event) => setAuditSearch(event.target.value)}
                  placeholder="Filter by actor, action, or detail…"
                  className="border-input focus-visible:ring-ring/50 w-72 rounded-lg border bg-transparent px-3 py-1.5 text-sm outline-none focus-visible:ring-[3px]"
                />
                <DataTable
                  columns={auditColumns}
                  data={filteredAudit}
                  getRowId={(row) => row.id}
                  loading={audit.isLoading}
                  emptyTitle="No audit entries"
                />
              </CardContent>
            </Card>
          ),
        },
        {
          value: 'branding',
          label: 'Branding',
          content: (
            <Card>
              <CardHeader>
                <CardTitle className="font-heading flex items-center gap-2 text-base">
                  <Palette className="size-4" /> Branding
                </CardTitle>
                <CardDescription>
                  Identity used across the app and exported reports.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-4">
                  <Image
                    src="/logo.png"
                    alt={`${siteConfig.shortName} logo`}
                    width={56}
                    height={56}
                    className="ring-border rounded-full ring-1"
                  />
                  <div>
                    <p className="font-medium">{siteConfig.name}</p>
                    <p className="text-muted-foreground text-sm">
                      {siteConfig.tagline}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  {[
                    { label: 'Navy', className: 'bg-brand-navy' },
                    { label: 'Gold', className: 'bg-brand-gold' },
                    { label: 'Emerald', className: 'bg-brand-emerald' },
                  ].map((swatch) => (
                    <div key={swatch.label} className="text-center">
                      <span
                        className={`block size-10 rounded-lg ${swatch.className}`}
                      />
                      <span className="text-muted-foreground text-xs">
                        {swatch.label}
                      </span>
                    </div>
                  ))}
                </div>
                <p className="text-muted-foreground text-xs">
                  Logo and palette changes ship with a future release — managed
                  in code today.
                </p>
              </CardContent>
            </Card>
          ),
        },
      ]}
    >
>>>>>>> origin/main
      {/* Cohort scope for the three cohort-bound tabs */}
      <div className="flex items-center gap-2">
        <Label className="text-muted-foreground text-xs">Cohort</Label>
        <Select
          value={activeCohortId ?? ''}
          onValueChange={(value) => setCohortId(value)}
        >
<<<<<<< HEAD
          <SelectTrigger size="sm" className="w-72">
=======
          <SelectTrigger size="sm" className="w-auto">
>>>>>>> origin/main
            <SelectValue placeholder="Pick a cohort" />
          </SelectTrigger>
          <SelectContent>
            {(cohorts.data?.data ?? []).map((cohort) => (
              <SelectItem key={cohort.id} value={cohort.id}>
                {cohort.name} · {cohort.scoringScaleMax}-point
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
<<<<<<< HEAD

      <TabsContent value="periods">
        {activeCohortId && <PeriodsSettings cohortId={activeCohortId} />}
      </TabsContent>

      <TabsContent value="dimensions">
        {activeCohortId && <DimensionsSettings cohortId={activeCohortId} />}
      </TabsContent>

      <TabsContent value="scale">
        {activeCohortId && <CohortScaleSettings cohortId={activeCohortId} />}
      </TabsContent>

      <TabsContent value="notifications">
        <Card>
          <CardHeader>
            <CardTitle className="font-heading flex items-center gap-2 text-base">
              <Bell className="size-4" /> Notification rules
            </CardTitle>
            <CardDescription>
              What the system sends, and to whom.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {NOTIFICATION_RULES.map((rule) => (
              <div
                key={rule.id}
                className="flex items-center justify-between gap-4"
              >
                <div>
                  <Label htmlFor={`rule-${rule.id}`} className="font-medium">
                    {rule.label}
                  </Label>
                  <p className="text-muted-foreground text-sm">
                    {rule.description}
                  </p>
                </div>
                <Switch
                  id={`rule-${rule.id}`}
                  checked={rules[rule.id] ?? false}
                  onCheckedChange={(checked) =>
                    setRules((current) => ({ ...current, [rule.id]: checked }))
                  }
                />
              </div>
            ))}
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="permissions">
        <Card>
          <CardHeader>
            <CardTitle className="font-heading flex items-center gap-2 text-base">
              <ShieldCheck className="size-4" /> Role permissions
            </CardTitle>
            <CardDescription>
              The default permission matrix per role.
            </CardDescription>
          </CardHeader>
          <CardContent className="overflow-x-auto">
            <table className="w-full min-w-[560px] text-sm">
              <thead>
                <tr className="border-b text-left">
                  <th className="text-muted-foreground py-2 pr-4 text-xs font-medium">
                    Permission
                  </th>
                  {(Object.values(ROLES) as Role[]).map((role) => (
                    <th
                      key={role}
                      className="text-muted-foreground px-3 py-2 text-center text-xs font-medium"
                    >
                      {ROLE_LABELS[role]}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {Object.values(PERMISSIONS).map((permission) => (
                  <tr key={permission} className="border-b last:border-b-0">
                    <td className="py-2 pr-4 font-mono text-xs">
                      {permission}
                    </td>
                    {(Object.values(ROLES) as Role[]).map((role) => (
                      <td key={role} className="px-3 py-2 text-center">
                        {ROLE_PERMISSIONS[role].includes(permission) ? (
                          <span className="text-brand-emerald">✓</span>
                        ) : (
                          <span className="text-muted-foreground/40">—</span>
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="audit">
        <Card>
          <CardHeader>
            <CardTitle className="font-heading flex items-center gap-2 text-base">
              <ScrollText className="size-4" /> Audit log
            </CardTitle>
            <CardDescription>Who changed what, and when.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <input
              value={auditSearch}
              onChange={(event) => setAuditSearch(event.target.value)}
              placeholder="Filter by actor, action, or detail…"
              className="border-input focus-visible:ring-ring/50 w-72 rounded-lg border bg-transparent px-3 py-1.5 text-sm outline-none focus-visible:ring-[3px]"
            />
            <DataTable
              columns={auditColumns}
              data={filteredAudit}
              getRowId={(row) => row.id}
              loading={audit.isLoading}
              emptyTitle="No audit entries"
            />
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="branding">
        <Card>
          <CardHeader>
            <CardTitle className="font-heading flex items-center gap-2 text-base">
              <Palette className="size-4" /> Branding
            </CardTitle>
            <CardDescription>
              Identity used across the app and exported reports.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4">
              <Image
                src="/logo.png"
                alt={`${siteConfig.shortName} logo`}
                width={56}
                height={56}
                className="ring-border rounded-full ring-1"
              />
              <div>
                <p className="font-medium">{siteConfig.name}</p>
                <p className="text-muted-foreground text-sm">
                  {siteConfig.tagline}
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              {[
                { label: 'Navy', className: 'bg-brand-navy' },
                { label: 'Gold', className: 'bg-brand-gold' },
                { label: 'Emerald', className: 'bg-brand-emerald' },
              ].map((swatch) => (
                <div key={swatch.label} className="text-center">
                  <span
                    className={`block size-10 rounded-lg ${swatch.className}`}
                  />
                  <span className="text-muted-foreground text-xs">
                    {swatch.label}
                  </span>
                </div>
              ))}
            </div>
            <p className="text-muted-foreground text-xs">
              Logo and palette changes ship with a future release — managed in
              code today.
            </p>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
=======
    </TabPanels>
>>>>>>> origin/main
  )
}
