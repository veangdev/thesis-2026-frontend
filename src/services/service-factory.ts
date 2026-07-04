import { env } from '@/config/env'

/**
 * Picks the real or mock implementation of a service based on
 * `NEXT_PUBLIC_USE_MOCKS`. Real and mock implementations share one interface
 * (each feature's `*.contract.ts`), so no component code changes between
 * modes (spec §4).
 */
export function pickService<T>(real: T, mock: T): T {
  return env.useMocks ? mock : real
}
