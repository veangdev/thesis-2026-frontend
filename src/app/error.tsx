'use client'

import { useEffect } from 'react'
import { ErrorState } from '@/components/shared/error-state'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="flex min-h-[60vh] items-center justify-center p-6">
      <ErrorState
        title="Something went wrong"
        description="We hit an unexpected error. You can try again."
        onRetry={reset}
        className="max-w-md"
      />
    </div>
  )
}
