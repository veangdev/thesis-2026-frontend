/** Shared, domain-agnostic types. */

export interface ApiResponse<T> {
  data: T
  message: string
  success: boolean
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
}

export interface PaginationParams {
  page?: number
  limit?: number
  search?: string
}

/** Discriminated async state for client-side data. */
export type AsyncState<T> =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; data: T }
  | { status: 'error'; error: string }

export type Nullable<T> = T | null
