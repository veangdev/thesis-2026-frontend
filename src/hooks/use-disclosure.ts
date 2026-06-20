'use client'

import { useCallback, useState } from 'react'

export interface Disclosure {
  isOpen: boolean
  open: () => void
  close: () => void
  toggle: () => void
  setOpen: (open: boolean) => void
}

/** Small open/close state helper for dialogs, sheets, popovers, etc. */
export function useDisclosure(initial = false): Disclosure {
  const [isOpen, setOpen] = useState(initial)
  const open = useCallback(() => setOpen(true), [])
  const close = useCallback(() => setOpen(false), [])
  const toggle = useCallback(() => setOpen((value) => !value), [])
  return { isOpen, open, close, toggle, setOpen }
}
