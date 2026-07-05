import { env } from '@/config/env'
import { API_ENDPOINTS } from '@/constants/api'
import {
  clearTokens,
  getAccessToken,
  getRefreshToken,
  setTokens,
} from '@/lib/auth'

export type QueryValue = string | number | boolean | null | undefined

export interface RequestOptions {
  /** Query string parameters; nullish values are skipped. */
  params?: Record<string, QueryValue>
  /** Extra headers merged over the defaults. */
  headers?: Record<string, string>
  /** AbortSignal for request cancellation. */
  signal?: AbortSignal
  /** Attach the bearer token (default: true). */
  auth?: boolean
}

/** Normalized error thrown by the API client for every failed request. */
export class ApiError extends Error {
  readonly status: number
  readonly details?: unknown

  constructor(message: string, status: number, details?: unknown) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.details = details
  }
}

function buildUrl(path: string, params?: RequestOptions['params']): string {
  const base = env.apiBaseUrl.replace(/\/$/, '')
  const url = new URL(`${base}${path.startsWith('/') ? path : `/${path}`}`)
  if (params) {
    for (const [key, value] of Object.entries(params)) {
      if (value !== null && value !== undefined) {
        url.searchParams.append(key, String(value))
      }
    }
  }
  return url.toString()
}

async function parseBody(response: Response): Promise<unknown> {
  const contentType = response.headers.get('content-type') ?? ''
  if (contentType.includes('application/json')) {
    return response.json().catch(() => null)
  }
  return response.text().catch(() => null)
}

/** Pull a human-readable `message` field out of an unknown error payload. */
function extractMessage(payload: unknown): string | undefined {
  if (
    payload &&
    typeof payload === 'object' &&
    'message' in payload &&
    typeof (payload as { message: unknown }).message === 'string'
  ) {
    return (payload as { message: string }).message
  }
  return undefined
}

/**
 * Called when a 401 could not be recovered by a token refresh (session truly
 * expired). Registered from the app shell to clear client auth state and
 * redirect — kept as a callback so this module never imports feature code.
 */
type UnauthorizedHandler = () => void
let onUnauthorized: UnauthorizedHandler | null = null

export function registerUnauthorizedHandler(handler: UnauthorizedHandler) {
  onUnauthorized = handler
}

/**
 * Single-flight refresh: concurrent 401s all await the same refresh request.
 * Uses raw fetch (not `request`) to avoid recursion.
 */
let refreshPromise: Promise<boolean> | null = null

async function tryRefreshTokens(): Promise<boolean> {
  if (!refreshPromise) {
    refreshPromise = (async () => {
      const refreshToken = getRefreshToken()
      if (!refreshToken) return false
      try {
        const response = await fetch(buildUrl(API_ENDPOINTS.auth.refresh), {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
          body: JSON.stringify({ refreshToken }),
        })
        if (!response.ok) return false
        const tokens = (await response.json()) as {
          accessToken: string
          refreshToken: string
        }
        if (!tokens?.accessToken) return false
        setTokens(tokens)
        return true
      } catch {
        return false
      } finally {
        // Allow a future refresh cycle once this one settles.
        setTimeout(() => {
          refreshPromise = null
        }, 0)
      }
    })()
  }
  return refreshPromise
}

/** Auth endpoints where a 401 is a real answer, not an expired session. */
function isAuthPath(path: string): boolean {
  return (
    path === API_ENDPOINTS.auth.login || path === API_ENDPOINTS.auth.refresh
  )
}

async function request<T>(
  method: string,
  path: string,
  body?: unknown,
  options: RequestOptions = {},
  isRetry = false
): Promise<T> {
  const { params, headers, signal, auth = true } = options

  const finalHeaders: Record<string, string> = {
    Accept: 'application/json',
    ...headers,
  }

  if (body !== undefined && !(body instanceof FormData)) {
    finalHeaders['Content-Type'] = 'application/json'
  }

  if (auth) {
    const token = getAccessToken()
    if (token) finalHeaders.Authorization = `Bearer ${token}`
  }

  let response: Response
  try {
    response = await fetch(buildUrl(path, params), {
      method,
      headers: finalHeaders,
      signal,
      body:
        body === undefined
          ? undefined
          : body instanceof FormData
            ? body
            : JSON.stringify(body),
    })
  } catch (error) {
    if (error instanceof DOMException && error.name === 'AbortError') {
      throw new ApiError('Request was cancelled', 0)
    }
    throw new ApiError('Network request failed', 0, error)
  }

  // Expired access token: refresh once (single-flight) and retry the request.
  if (response.status === 401 && auth && !isRetry && !isAuthPath(path)) {
    const refreshed = await tryRefreshTokens()
    if (refreshed) {
      return request<T>(method, path, body, options, true)
    }
    clearTokens()
    onUnauthorized?.()
  }

  const payload = await parseBody(response)

  if (!response.ok) {
    const message =
      extractMessage(payload) || response.statusText || 'Request failed'
    throw new ApiError(message, response.status, payload)
  }

  return payload as T
}

export const apiClient = {
  get: <T>(path: string, options?: RequestOptions) =>
    request<T>('GET', path, undefined, options),
  post: <T>(path: string, body?: unknown, options?: RequestOptions) =>
    request<T>('POST', path, body, options),
  put: <T>(path: string, body?: unknown, options?: RequestOptions) =>
    request<T>('PUT', path, body, options),
  patch: <T>(path: string, body?: unknown, options?: RequestOptions) =>
    request<T>('PATCH', path, body, options),
  delete: <T>(path: string, options?: RequestOptions) =>
    request<T>('DELETE', path, undefined, options),
}
