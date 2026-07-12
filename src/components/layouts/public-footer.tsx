import { AppLogo } from '@/components/shared/app-logo'
import { siteConfig } from '@/config/site'
import { APP_VERSION } from '@/constants/app'

export function PublicFooter() {
  return (
    <footer className="border-t">
      <div className="text-muted-foreground mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 py-8 text-sm sm:px-6 md:flex-row">
        <div className="flex flex-col items-center gap-2 md:items-start">
          <AppLogo />
          <p>{siteConfig.tagline}</p>
        </div>
        <p>
          © {siteConfig.name} · v{APP_VERSION}
        </p>
      </div>
    </footer>
  )
}
