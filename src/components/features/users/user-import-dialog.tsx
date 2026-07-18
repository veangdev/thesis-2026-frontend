'use client'

import * as React from 'react'
import { FileDown, FileSpreadsheet, Loader2, Upload } from 'lucide-react'

import { cn } from '@/lib/utils'
import { downloadTextFile, parseCsv } from '@/lib/csv'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { useCohorts } from '@/features/cohorts'
import { ROLE_LABELS, ROLES, type Role } from '@/constants/roles'
import { useBulkCreateUsers, type UserPayload } from '@/features/users'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'

<<<<<<< HEAD
/** Accepted spellings for the two importable roles. Coordinators are
 * deliberately excluded — they're created one at a time from the form. */
const ROLE_ALIASES: Record<string, Role> = {
  student: ROLES.SELF_ASSESSOR,
  'self-assessor': ROLES.SELF_ASSESSOR,
  'self assessor': ROLES.SELF_ASSESSOR,
  self_assessor: ROLES.SELF_ASSESSOR,
  mentor: ROLES.FACILITATOR,
  facilitator: ROLES.FACILITATOR,
=======
/** Accepted spellings for the two importable roles — the canonical values are
 * `facilitator` and `self-assessor`, with `mentor`/`student` still accepted as
 * aliases. Coordinators are deliberately excluded — they're created one at a
 * time from the form. */
const ROLE_ALIASES: Record<string, Role> = {
  'self-assessor': ROLES.SELF_ASSESSOR,
  'self assessor': ROLES.SELF_ASSESSOR,
  self_assessor: ROLES.SELF_ASSESSOR,
  student: ROLES.SELF_ASSESSOR,
  facilitator: ROLES.FACILITATOR,
  mentor: ROLES.FACILITATOR,
>>>>>>> origin/main
}

const TEMPLATE_CSV = [
  'name,email,role,cohort',
<<<<<<< HEAD
  'Dara Kim,dara@pnc.edu,student,Cohort 2026',
  'Sokha Chan,sokha@pnc.edu,mentor,',
=======
  'Dara Kim,dara@pnc.edu,self-assessor,Batch 2026 — Product Design',
  'Sokha Chan,sokha@pnc.edu,facilitator,',
>>>>>>> origin/main
].join('\n')

const EMAIL_PATTERN = /^\S+@\S+\.\S+$/

interface ImportRow {
  line: number
  name: string
  email: string
  roleInput: string
  cohortInput: string
  payload?: UserPayload
  errors: string[]
}

/** "Import CSV" toolbar button + dialog: parse, validate, preview, bulk create. */
export function UserImportDialog() {
  const [open, setOpen] = React.useState(false)
  const [fileName, setFileName] = React.useState<string | null>(null)
  const [fileError, setFileError] = React.useState<string | null>(null)
  const [rows, setRows] = React.useState<ImportRow[]>([])
  const fileInputRef = React.useRef<HTMLInputElement>(null)

  const cohorts = useCohorts()
  const bulkCreate = useBulkCreateUsers()

  const validRows = rows.filter((row) => row.payload)

  function reset() {
    setRows([])
    setFileName(null)
    setFileError(null)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  function validate(cells: string[][]): ImportRow[] | string {
    const header = cells[0]?.map((cell) => cell.trim().toLowerCase()) ?? []
    const columnIndex = {
      name: header.indexOf('name'),
      email: header.indexOf('email'),
      role: header.indexOf('role'),
      cohort: header.indexOf('cohort'),
    }
    if (
      columnIndex.name === -1 ||
      columnIndex.email === -1 ||
      columnIndex.role === -1
    ) {
      return 'Missing required columns. The header row must include: name, email, role (cohort is optional).'
    }
    if (cells.length < 2) return 'The file has a header row but no data rows.'

    const seenEmails = new Set<string>()
    return cells.slice(1).map((line, index) => {
      const row: ImportRow = {
        line: index + 2,
        name: (line[columnIndex.name] ?? '').trim(),
        email: (line[columnIndex.email] ?? '').trim(),
        roleInput: (line[columnIndex.role] ?? '').trim(),
        cohortInput:
          columnIndex.cohort === -1
            ? ''
            : (line[columnIndex.cohort] ?? '').trim(),
        errors: [],
      }

      if (row.name.length < 2) row.errors.push('Name is required')
      if (!EMAIL_PATTERN.test(row.email)) row.errors.push('Invalid email')
      else if (seenEmails.has(row.email.toLowerCase()))
        row.errors.push('Duplicate email in file')
      seenEmails.add(row.email.toLowerCase())

      const role = ROLE_ALIASES[row.roleInput.toLowerCase()]
<<<<<<< HEAD
      if (!role) row.errors.push('Role must be "student" or "mentor"')
=======
      if (!role)
        row.errors.push('Role must be "facilitator" or "self-assessor"')
>>>>>>> origin/main

      let cohortId: string | undefined
      if (row.cohortInput) {
        const cohort = (cohorts.data?.data ?? []).find(
          (candidate) =>
            candidate.id === row.cohortInput ||
            candidate.name.toLowerCase() === row.cohortInput.toLowerCase()
        )
        if (!cohort) row.errors.push(`Unknown cohort "${row.cohortInput}"`)
        else cohortId = cohort.id
      }

      if (row.errors.length === 0 && role) {
        row.payload = { name: row.name, email: row.email, role, cohortId }
      }
      return row
    })
  }

  async function handleFile(file: File) {
    setFileName(file.name)
    setFileError(null)
    setRows([])
    const text = await file.text()
    const result = validate(parseCsv(text))
    if (typeof result === 'string') setFileError(result)
    else setRows(result)
  }

  async function handleImport() {
    await bulkCreate.mutateAsync(validRows.map((row) => row.payload!))
    reset()
    setOpen(false)
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        setOpen(next)
        if (!next) reset()
      }}
    >
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Upload className="size-4" /> Import
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
<<<<<<< HEAD
          <DialogTitle>Import students & mentors</DialogTitle>
          <DialogDescription>
            Upload a CSV list (Excel can save as CSV). Columns: name, email,
            role (student or mentor), cohort (optional — name or ID).
=======
          <DialogTitle>Import users</DialogTitle>
          <DialogDescription>
            Upload a CSV list (Excel can save as CSV). Columns: name, email,
            role (facilitator or self-assessor), cohort (optional — name or ID).
>>>>>>> origin/main
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-wrap items-center gap-2">
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv,text/csv"
            className="hidden"
            onChange={(event) => {
              const file = event.target.files?.[0]
              if (file) void handleFile(file)
            }}
          />
          <Button
            variant="secondary"
            size="sm"
            onClick={() => fileInputRef.current?.click()}
          >
            <FileSpreadsheet className="size-4" />
            {fileName ?? 'Choose CSV file…'}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => downloadTextFile('users-template.csv', TEMPLATE_CSV)}
          >
            <FileDown className="size-4" /> Download template
          </Button>
        </div>

        {fileError && <p className="text-destructive text-sm">{fileError}</p>}

        {rows.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <Badge variant="secondary">{validRows.length} ready</Badge>
              {rows.length - validRows.length > 0 && (
                <Badge variant="destructive">
                  {rows.length - validRows.length} with errors (skipped)
                </Badge>
              )}
            </div>
            <div className="max-h-64 overflow-y-auto rounded-lg border">
              <table className="w-full text-sm">
                <thead className="bg-muted/50 sticky top-0">
                  <tr className="text-left">
                    <th className="text-muted-foreground px-3 py-2 text-xs font-medium">
                      Line
                    </th>
                    <th className="text-muted-foreground px-3 py-2 text-xs font-medium">
                      Name
                    </th>
                    <th className="text-muted-foreground px-3 py-2 text-xs font-medium">
                      Email
                    </th>
                    <th className="text-muted-foreground px-3 py-2 text-xs font-medium">
                      Role
                    </th>
                    <th className="text-muted-foreground px-3 py-2 text-xs font-medium">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row) => (
                    <tr
                      key={row.line}
                      className={cn(
                        'border-t',
                        row.errors.length > 0 && 'bg-destructive/5'
                      )}
                    >
                      <td className="text-muted-foreground px-3 py-1.5 text-xs">
                        {row.line}
                      </td>
                      <td className="px-3 py-1.5">{row.name || '—'}</td>
                      <td className="px-3 py-1.5">{row.email || '—'}</td>
                      <td className="px-3 py-1.5">
                        {row.payload
                          ? ROLE_LABELS[row.payload.role]
                          : row.roleInput || '—'}
                      </td>
                      <td className="px-3 py-1.5">
                        {row.errors.length === 0 ? (
                          <span className="text-brand-emerald text-xs">
                            Ready
                          </span>
                        ) : (
                          <span className="text-destructive text-xs">
                            {row.errors.join('; ')}
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        <DialogFooter>
          <Button
            onClick={handleImport}
            disabled={validRows.length === 0 || bulkCreate.isPending}
          >
            {bulkCreate.isPending && (
              <Loader2 className="size-4 animate-spin" />
            )}
            Import {validRows.length > 0 ? validRows.length : ''} user
            {validRows.length === 1 ? '' : 's'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
