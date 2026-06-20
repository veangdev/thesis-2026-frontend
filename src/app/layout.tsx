import type { Metadata } from 'next'
import { Toaster } from '@/components/ui/sonner'
import { siteConfig } from '@/config/site'
import { Providers } from './providers'
import './globals.css'

export const metadata: Metadata = {
  title: {
    default: `${siteConfig.name} — ${siteConfig.tagline}`,
    template: `%s · ${siteConfig.name}`,
  },
  description: siteConfig.description,
  applicationName: siteConfig.name,
  metadataBase: new URL(siteConfig.url),
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="font-sans antialiased">
        <Providers>{children}</Providers>
        <Toaster richColors position="top-right" />
      </body>
    </html>
  )
}
