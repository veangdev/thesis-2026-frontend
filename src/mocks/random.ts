/**
 * Deterministic seeded PRNG (mulberry32) so mock data is identical on every
 * load — charts, tables, and e2e assertions stay stable.
 */
export function createRandom(seed: number) {
  let state = seed >>> 0

  const next = () => {
    state |= 0
    state = (state + 0x6d2b79f5) | 0
    let t = Math.imul(state ^ (state >>> 15), 1 | state)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }

  return {
    /** Float in [0, 1). */
    next,
    /** Integer in [min, max] inclusive. */
    int(min: number, max: number): number {
      return Math.floor(next() * (max - min + 1)) + min
    },
    /** Pick one element. */
    pick<T>(items: readonly T[]): T {
      return items[Math.floor(next() * items.length)]
    },
    /** True with probability p. */
    chance(p: number): boolean {
      return next() < p
    },
  }
}

export type Random = ReturnType<typeof createRandom>
