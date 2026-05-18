import { useEffect } from 'react'
import { colors, fonts } from '../components/landing/tokens'
import { HeroSection } from '../components/landing/HeroSection'
import { TimelineSection } from '../components/landing/TimelineSection'
import { TracksSection } from '../components/landing/TracksSection'
import { PrizesSection } from '../components/landing/PrizesSection'
import { QuickStartSection } from '../components/landing/QuickStartSection'
import { ResourcesSection } from '../components/landing/ResourcesSection'
import { FaqSection } from '../components/landing/FaqSection'
import { FinalCtaSection } from '../components/landing/FinalCtaSection'

export function LandingPage() {
  // Wire IntersectionObserver for .scroll-animate sections (fade-in on enter)
  useEffect(() => {
    const elements = document.querySelectorAll('.scroll-animate')
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible')
            observer.unobserve(entry.target)
          }
        }
      },
      { threshold: 0.12, rootMargin: '0px 0px -60px 0px' },
    )
    elements.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [])

  return (
    <main
      style={{
        background: colors.bg,
        color: colors.textBody,
        minHeight: '100vh',
        fontFamily: fonts.sans,
      }}
    >
      <HeroSection />
      <TimelineSection />
      <TracksSection />
      <PrizesSection />
      <QuickStartSection />
      <ResourcesSection />
      <FaqSection />
      <FinalCtaSection />
    </main>
  )
}
