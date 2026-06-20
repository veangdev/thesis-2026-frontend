import { env } from '@/config/env'
import { getAccessToken } from '@/lib/auth'

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

async function request<T>(
  method: string,
  path: string,
  body?: unknown,
  options: RequestOptions = {}
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
