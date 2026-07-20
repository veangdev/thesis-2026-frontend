import { STUDENT_CLASSES, type StudentClass } from '@/constants/classes'
import { GENDERS, type Gender } from '@/constants/genders'
import { ROLES } from '@/constants/roles'
import type { User } from '@/types/auth'

/**
 * Demo accounts (spec §8): fixed emails so the README credentials always work.
 * All mock passwords are `Password123!` (checked in auth.mock).
 */
export const DEMO_PASSWORD = 'Password123!'

const FACILITATOR_NAMES = [
  'Sokha Meas', // facilitator@pnc.edu — demo account
  'Dara Kim',
  'Chanthou Sok',
  'Vichea Pen',
  'Sreymom Chea',
  'Rithy Noun',
]

const STUDENT_NAMES = [
  'Sophea Lim', // student@pnc.edu — demo account
  'Piseth Heng',
  'Srey Neang',
  'Kosal Var',
  'Channary Ouk',
  'Visal Chhim',
  'Bopha San',
  'Makara Yin',
  'Sokchea Prak',
  'Leakhena Mao',
  'Phirun Keo',
  'Sreypov Tan',
  'Vibol Hun',
  'Thida Chum',
  'Samnang Ros',
  'Kunthea Pich',
  'Veasna Long',
  'Mealea Sun',
  'Rotha Em',
  'Sokunthea Nhem',
  'Panha Say',
  'Chenda Kong',
  'Narith Duong',
  'Socheata Ith',
  'Pisey Hang',
  'Kimheng Chap',
  'Davi Sao',
  'Sovann Teng',
  'Malis Nop',
  'Ratanak Sim',
]

function slugEmail(name: string): string {
  return `${name.toLowerCase().replace(/[^a-z]+/g, '.')}@student.pnc.edu.kh`
}

/** Deterministic gender cycle so seed data (and e2e assertions) stay stable. */
const GENDER_CYCLE: Gender[] = [GENDERS.FEMALE, GENDERS.MALE]
function genderAt(index: number): Gender {
  return GENDER_CYCLE[index % GENDER_CYCLE.length]
}

/** Deterministic class (A/B/C) cycle for students within a batch. */
function classAt(index: number): StudentClass {
  return STUDENT_CLASSES[index % STUDENT_CLASSES.length]
}

export interface SeedUsers {
  coordinator: User
  facilitators: User[]
  students: User[]
  all: User[]
}

/**
 * 1 coordinator + 6 facilitators + 30 students. Cohort/facilitator links are
 * filled in by the db orchestrator after cohorts and assignments are seeded.
 */
export function seedUsers(): SeedUsers {
  const createdAt = '2025-09-01T08:00:00.000Z'

  const coordinator: User = {
    id: 'user-coordinator-1',
    name: 'Sovanna Rath',
    email: 'coordinator@pnc.edu',
    role: ROLES.PROGRAM_COORDINATOR,
    gender: GENDERS.FEMALE,
    createdAt,
  }

  const facilitators: User[] = FACILITATOR_NAMES.map((name, index) => ({
    id: `user-facilitator-${index + 1}`,
    name,
    email:
      index === 0
        ? 'facilitator@pnc.edu'
        : slugEmail(name).replace('@student.', '@'),
    role: ROLES.FACILITATOR,
    gender: genderAt(index),
    createdAt,
  }))

  const students: User[] = STUDENT_NAMES.map((name, index) => ({
    id: `user-student-${index + 1}`,
    name,
    email: index === 0 ? 'student@pnc.edu' : slugEmail(name),
    role: ROLES.SELF_ASSESSOR,
    gender: genderAt(index),
    studentClass: classAt(index),
    createdAt,
  }))

  return {
    coordinator,
    facilitators,
    students,
    all: [coordinator, ...facilitators, ...students],
  }
}
