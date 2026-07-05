export const analyticsKeys = {
  all: ['analytics'] as const,
  student: (studentId: string) =>
    [...analyticsKeys.all, 'student', studentId] as const,
  cohort: (cohortId: string) =>
    [...analyticsKeys.all, 'cohort', cohortId] as const,
  overview: () => [...analyticsKeys.all, 'overview'] as const,
  gap: (assessmentId: string) =>
    [...analyticsKeys.all, 'gap', assessmentId] as const,
}
