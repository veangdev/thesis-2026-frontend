'use client'

import { useEffect } from 'react'

export default function GlobalError({
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
    <html lang="en">
      <body className="font-sans antialiased">
        <div className="flex min-h-screen flex-col items-center justify-center gap-4 p-6 text-center">
          <h1 className="text-2xl font-semibold">Something went wrong</h1>
          <p className="text-muted-foreground max-w-md text-sm">
            A critical error occurred. Please reload the page.
          </p>
          <button
            onClick={reset}
            className="bg-primary text-primary-foreground rounded-md px-4 py-2 text-sm font-medium"
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  )
}
