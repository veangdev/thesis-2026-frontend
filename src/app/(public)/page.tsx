import {
  LandingCta,
  LandingDimensions,
  LandingFeatures,
  LandingHero,
  LandingStats,
} from '@/components/features/landing'

export default function HomePage() {
  return (
    <>
      <LandingHero />
      <LandingFeatures />
      <LandingDimensions />
      <LandingStats />
      <LandingCta />
    </>
  )
}
