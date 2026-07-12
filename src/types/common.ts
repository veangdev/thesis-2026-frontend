/** Shared, domain-agnostic types. */

export interface ApiResponse<T> {
  data: T
  message: string
  success: boolean
}

/** List envelope returned by every collection endpoint (spec §3). */
export interface PaginatedResponse<T> {
  data: T[]
  meta: PaginationMeta
}

export interface PaginationMeta {
  page: number
  pageSize: number
  total: number
}

export interface PaginationParams {
  page?: number
  pageSize?: number
  search?: string
}

/** Discriminated async state for client-side data. */
export type AsyncState<T> =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; data: T }
  | { status: 'error'; error: string }

export type Nullable<T> = T | null
