"use client"

import React from "react"
import { MotionProvider } from "./landing/motion-provider"
import { LandingNav } from "./landing/landing-nav"
import { HeroSection } from "./landing/hero-section"
import { OperationalCapabilitiesSection } from "./landing/operational-capabilities-section"
import { BrandStatementSection } from "./landing/brand-statement-section"
import { FleetShowcaseSection } from "./landing/fleet-showcase-section"
import { ServiceComparison } from "./service-comparison"
import { CorridorCinemaSection } from "./landing/corridor-cinema-section"
import { HowItWorksSection } from "./landing/how-it-works-section"
import { TestimonialSection } from "./landing/testimonial-section"
import { CorridorTariffsSection } from "./landing/corridor-tariffs-section"
import { DispatchBulletinsSection } from "./landing/dispatch-bulletins-section"
import { ClosingStorySection } from "./landing/closing-story-section"
import { FaqSection } from "./landing/faq-section"
import { ClosingCtaSection } from "./landing/closing-cta-section"
import { ContactSection } from "./landing/contact-section"
import { LandingFooter } from "./landing/landing-footer"
import { SupportChat } from "./support-chat"
import { BackToTop } from "./landing/back-to-top"

export function LogisticsHome() {
  return (
    <MotionProvider>
      <div className="cargo-public min-h-svh w-full max-w-full overflow-x-clip bg-background text-foreground selection:bg-primary/20 selection:text-foreground">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[60] focus:bg-background focus:px-4 focus:py-2 focus:border focus:border-border focus:text-foreground focus:text-sm"
        >
          Skip to content
        </a>
        <LandingNav />

        <main id="main-content" className="relative">
          <HeroSection />
          <OperationalCapabilitiesSection />
          <BrandStatementSection />
          <FleetShowcaseSection />
          <ServiceComparison />
          <CorridorCinemaSection />
          <HowItWorksSection />
          <TestimonialSection />
          <CorridorTariffsSection />
          <DispatchBulletinsSection />
          <ClosingStorySection />
          <FaqSection />
          <ClosingCtaSection />
          <ContactSection />
        </main>
        <LandingFooter />
        <SupportChat />
        <BackToTop />
      </div>
    </MotionProvider>
  )
}
