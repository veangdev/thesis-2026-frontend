import { DIMENSIONS } from '@/constants/app'
import type {
  Cohort,
  Dimension,
  Period,
} from '@/features/cohorts/cohorts.types'

export interface SeedCohorts {
  cohorts: Cohort[]
  dimensions: Dimension[]
  periods: Period[]
}

/**
 * 3 cohorts — two on the default 5-point scale and one on 10 so scale
 * switching is demonstrable (spec §4/§7). Each has the 8 dimensions and
 * 4 periods (3 completed + 1 active).
 */
export function seedCohorts(): SeedCohorts {
  const cohorts: Cohort[] = [
    {
      id: 'cohort-1',
      name: 'Batch 2024 — Web Development',
      scoringScaleMax: 5,
      status: 'active',
      startDate: '2024-10-01',
      studentCount: 12,
      description: 'Two-year web development track, class of 2026.',
      createdAt: '2024-09-15T08:00:00.000Z',
    },
    {
      id: 'cohort-2',
      name: 'Batch 2025 — Software Engineering',
      scoringScaleMax: 5,
      status: 'active',
      startDate: '2025-10-01',
      studentCount: 10,
      description: 'Software engineering track, class of 2027.',
      createdAt: '2025-09-15T08:00:00.000Z',
    },
    {
      id: 'cohort-3',
      name: 'Batch 2025 — Data & AI (10-point pilot)',
      scoringScaleMax: 10,
      status: 'active',
      startDate: '2025-10-01',
      studentCount: 8,
      description: 'Pilot cohort using the extended 10-point scoring scale.',
      createdAt: '2025-09-15T08:00:00.000Z',
    },
  ]

  const dimensions: Dimension[] = cohorts.flatMap((cohort) =>
    DIMENSIONS.map((dimension, index) => ({
      id: `dim-${cohort.id}-${index + 1}`,
      cohortId: cohort.id,
      name: dimension.name,
      description: dimension.description,
      order: index + 1,
    }))
  )

  // 4 assessment periods per cohort: 3 completed cycles + 1 currently active.
  const periodTemplates = [
    {
      name: 'Cycle 1 — Foundation',
      start: '2025-10-06',
      end: '2025-11-28',
      status: 'completed' as const,
    },
    {
      name: 'Cycle 2 — Growth',
      start: '2026-01-05',
      end: '2026-02-27',
      status: 'completed' as const,
    },
    {
      name: 'Cycle 3 — Consolidation',
      start: '2026-03-09',
      end: '2026-04-30',
      status: 'completed' as const,
    },
    {
      name: 'Cycle 4 — Mastery',
      start: '2026-06-01',
      end: '2026-07-31',
      status: 'active' as const,
    },
  ]

  const periods: Period[] = cohorts.flatMap((cohort) =>
    periodTemplates.map((template, index) => ({
      id: `period-${cohort.id}-${index + 1}`,
      cohortId: cohort.id,
      name: template.name,
      startDate: template.start,
      endDate: template.end,
      status: template.status,
    }))
  )

  return { cohorts, dimensions, periods }
}
