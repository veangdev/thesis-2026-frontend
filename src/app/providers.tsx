'use client'

import { useState } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ThemeProvider } from '@/components/shared/theme-provider'
import { TooltipProvider } from '@/components/ui/tooltip'

/** App-wide client providers: theme, server-state, and tooltips. */
export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: { staleTime: 60_000, retry: 1, refetchOnWindowFocus: false },
        },
      })
  )

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>{children}</TooltipProvider>
      </QueryClientProvider>
    </ThemeProvider>
  )
}
