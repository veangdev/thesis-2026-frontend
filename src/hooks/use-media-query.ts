'use client'

import { useEffect, useState } from 'react'

/** Subscribes to a CSS media query and returns whether it currently matches. */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false)

  useEffect(() => {
    const mql = window.matchMedia(query)
    const onChange = () => setMatches(mql.matches)
    onChange()
    mql.addEventListener('change', onChange)
    return () => mql.removeEventListener('change', onChange)
  }, [query])

  return matches
}

/** Convenience wrapper: true on viewports < 768px. */
export function useIsMobile(): boolean {
  return useMediaQuery('(max-width: 767px)')
}
