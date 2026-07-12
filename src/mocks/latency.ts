import type { PaginatedResponse } from '@/types/common'

/** Simulated network latency so loading skeletons are visible in mock mode. */
export function delay(ms?: number): Promise<void> {
  const wait = ms ?? 200 + Math.random() * 250
  return new Promise((resolve) => setTimeout(resolve, wait))
}

/** Wrap rows in the standard list envelope (spec §3). */
export function paginate<T>(
  rows: T[],
  params?: { page?: number; pageSize?: number }
): PaginatedResponse<T> {
  const page = Math.max(1, params?.page ?? 1)
  const pageSize = Math.max(1, params?.pageSize ?? 10)
  const start = (page - 1) * pageSize
  return {
    data: rows.slice(start, start + pageSize),
    meta: { page, pageSize, total: rows.length },
  }
}

/** Deep-clone helper so callers can never mutate the db by reference. */
export function clone<T>(value: T): T {
  return structuredClone(value)
}
