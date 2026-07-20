/**
 * A Batch (cohort) is subdivided into Classes A/B/C. Optional on every
 * student — used for the Assessments roster filter/sort.
 */

export const STUDENT_CLASSES = ['A', 'B', 'C'] as const

export type StudentClass = (typeof STUDENT_CLASSES)[number]

export const STUDENT_CLASS_LABELS: Record<StudentClass, string> = {
  A: 'Class A',
  B: 'Class B',
  C: 'Class C',
}
