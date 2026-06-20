import { APP_DESCRIPTION, APP_NAME } from '@/constants/app'
import { ROUTES } from '@/constants/routes'

/** Site-wide metadata and navigation used by layouts and the landing page. */
export const siteConfig = {
  name: APP_NAME,
  shortName: 'Journey Star',
  description: APP_DESCRIPTION,
  url: 'https://journey-star.pnc.edu.kh',
  tagline: 'From learning to employment — one cycle at a time.',

  /** Primary marketing navigation (landing page). */
  mainNav: [
    { title: 'Overview', href: '#overview' },
    { title: 'How it works', href: '#how-it-works' },
    { title: 'Dimensions', href: '#dimensions' },
    { title: 'For teams', href: '#for-teams' },
  ],

  cta: {
    primary: { title: 'Open dashboard', href: ROUTES.dashboard },
    secondary: { title: 'Learn more', href: '#how-it-works' },
  },
} as const

export type SiteConfig = typeof siteConfig
