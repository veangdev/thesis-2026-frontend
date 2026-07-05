import { z } from 'zod'

/**
 * Central, type-safe access to environment variables.
 *
 * Only `NEXT_PUBLIC_*` variables are referenced here because they are the ones
 * that must be available in the browser. They are listed explicitly (not via a
 * dynamic key) so Next.js can statically inline them at build time.
 */
const clientEnvSchema = z.object({
  NEXT_PUBLIC_API_BASE_URL: z
    .string()
    .url()
    .default('http://localhost:3000/api/v1'),
  NEXT_PUBLIC_APP_NAME: z.string().default('PNC Journey Star'),
  NEXT_PUBLIC_USE_MOCKS: z.enum(['true', 'false']).default('false'),
})

// `|| undefined` folds empty strings into "unset" so the schema defaults apply
// (Docker's `ENV X=$ARG` yields "" when the build arg is omitted).
const parsed = clientEnvSchema.safeParse({
  NEXT_PUBLIC_API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL || undefined,
  NEXT_PUBLIC_APP_NAME: process.env.NEXT_PUBLIC_APP_NAME || undefined,
  NEXT_PUBLIC_USE_MOCKS: process.env.NEXT_PUBLIC_USE_MOCKS || undefined,
})

if (!parsed.success) {
  // Fail fast and loud during development/build if the environment is invalid.
  console.error(
    '❌ Invalid environment variables:',
    z.treeifyError(parsed.error)
  )
  throw new Error('Invalid environment variables. See logs above.')
}

export const env = {
  apiBaseUrl: parsed.data.NEXT_PUBLIC_API_BASE_URL,
  appName: parsed.data.NEXT_PUBLIC_APP_NAME,
  /** When true, all services resolve to the in-memory mock implementations. */
  useMocks: parsed.data.NEXT_PUBLIC_USE_MOCKS === 'true',
  isProduction: process.env.NODE_ENV === 'production',
  isDevelopment: process.env.NODE_ENV === 'development',
} as const
