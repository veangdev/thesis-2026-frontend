import {
  LandingCta,
  LandingDimensions,
  LandingFeatures,
  LandingGrowthTimeline,
  LandingHero,
  LandingHowItWorks,
  LandingStats,
  LandingTestimonials,
} from '@/components/features/landing'

export default function HomePage() {
  return (
    <>
      <LandingHero />
      <LandingFeatures />
      <LandingHowItWorks />
      <LandingDimensions />
      <LandingGrowthTimeline />
      <LandingStats />
      <LandingTestimonials />
      <LandingCta />
    </>
  )
}
