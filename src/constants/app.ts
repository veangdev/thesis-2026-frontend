/**
 * Static, environment-independent application constants.
 * (Environment-dependent values live in `src/config/env.ts`.)
 */

export const APP_NAME = 'PNC Journey Star'
export const APP_DESCRIPTION =
  'Student transformation tracking — from learning to employment.'
export const APP_VERSION = '0.1.0'

/** The eight soft-skill dimensions assessed each cycle. */
export const DIMENSIONS = [
  {
    id: '1',
    name: 'Communication',
    description: 'How well you express ideas and listen to others',
  },
  {
    id: '2',
    name: 'Resilience',
    description: 'How well you recover from setbacks',
  },
  {
    id: '3',
    name: 'Professionalism',
    description: 'Punctuality, work ethic and conduct',
  },
  {
    id: '4',
    name: 'Self-Awareness',
    description: 'Understanding your strengths and weaknesses',
  },
  {
    id: '5',
    name: 'Teamwork',
    description: 'Collaborating and contributing to group goals',
  },
  {
    id: '6',
    name: 'Initiative',
    description: 'Taking action without being prompted',
  },
  {
    id: '7',
    name: 'Critical Thinking',
    description: 'Analysing problems and forming reasoned opinions',
  },
  {
    id: '8',
    name: 'Adaptability',
    description: 'Adjusting to new environments and challenges',
  },
] as const

/**
 * Growth-zone display metadata. Numeric thresholds are NEVER stored here —
 * they depend on each cohort's `scoringScaleMax` and must always be derived
 * via `getZoneThresholds()` in `src/lib/scoring.ts`.
 */
export const SCORE_ZONES = {
  struggling: { label: 'Struggling', token: 'zone-struggling' },
  developing: { label: 'Developing', token: 'zone-developing' },
  thriving: { label: 'Thriving', token: 'zone-thriving' },
} as const

export type ScoreZone = keyof typeof SCORE_ZONES
