"use client"

import React from "react"
import { MotionProvider } from "./landing/motion-provider"
import { LandingNav } from "./landing/landing-nav"
import { HeroSection } from "./landing/hero-section"
import { OperationalCapabilitiesSection } from "./landing/operational-capabilities-section"
import { CarrierTrustBand } from "./landing/carrier-trust-band"
import { BrandStatementSection } from "./landing/brand-statement-section"
import { TelemetryStatsBand } from "./landing/telemetry-stats-band"
import { FleetShowcaseSection } from "./landing/fleet-showcase-section"
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

/**
 * TAC-XPRESS: Master Landing Page (1:1 Exact Atomist Architecture)
 *
 * Enforces the visual system from the Atomist reference:
 * 1. Top Announcement Bar & Navbar
 * 2. Hero Section (Centered headline with amber accent, 4 tabs, central console with ambient glow)
 * 3. "We trusted with" Gateway Partners Strip
 * 4. Mission Statement Pullquote Card
 * 5. "Tracked linehaul" Metrics & Rising Trajectory Wave
 * 6. "We provide best linehaul" Interactive Mode Accordion & Fleet Equipment
 * 7. "We build the corridor connection" 16:9 Cinema Banner with Telemetry Modal
 * 8. "How does it work?" 3-Step Visual Process Grid
 * 9. "Customers see the direct result" 2-Column Testimonial Card
 * 10. "Flexible pricing for any scale" Interactive Tariffs Selector with Visual Mode Thumbnails
 * 11. "Read our latest articles & updates" 3-Card Dispatch Bulletins
 * 12. "Every shipment moves something forward" Corridor Linehaul Convoy Narrative
 * 13. "FAQs" 2-Column Accordion Layout
 * 14. Dark Glowing Closing Action Banner with Corridor Panorama
 * 15. "Get in touch" Operations Desk & Consignment Booking Console
 * 16. Directory Footer with Giant TAC-XPRESS Watermark
 */
export function LogisticsHome() {
  return (
    <MotionProvider>
      <div className="cargo-public min-h-svh w-full max-w-full overflow-x-clip bg-background text-foreground selection:bg-primary/20 selection:text-foreground">
        {/* Accessible Skip-to-Content Link */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[60] focus:bg-background focus:px-4 focus:py-2 focus:border focus:border-border focus:text-foreground focus:text-sm"
        >
          Skip to content
        </a>

        {/* 1. Announcement Bar & Navbar */}
        <LandingNav />

        <main id="main-content" className="relative">
          {/* 2. Hero Section */}
          <HeroSection />

          {/* 3. Verified Operational Capabilities */}
          <OperationalCapabilitiesSection />

          {/* 4. We trusted with */}
          <CarrierTrustBand />

          {/* 4. Mission Statement */}
          <BrandStatementSection />

          {/* 5. Tracked linehaul */}
          <TelemetryStatsBand />

          {/* 6. We provide best linehaul & Fleet Commercial Equipment */}
          <FleetShowcaseSection />

          {/* 7. Corridor Cinema Banner */}
          <CorridorCinemaSection />

          {/* 8. How does it work? */}
          <HowItWorksSection />

          {/* 9. Customers see the direct result */}
          <TestimonialSection />

          {/* 10. Flexible pricing for any scale */}
          <CorridorTariffsSection />

          {/* 11. Read our latest articles & updates */}
          <DispatchBulletinsSection />

          {/* 12. Corridor Linehaul Convoy Narrative */}
          <ClosingStorySection />

          {/* 13. FAQs */}
          <FaqSection />

          {/* 14. Closing CTA Banner */}
          <ClosingCtaSection />

          {/* 15. Get in touch */}
          <ContactSection />
        </main>

        {/* 16. Directory Footer with Giant Watermark */}
        <LandingFooter />

        {/* On-Demand Support Assistant */}
        <SupportChat />

        {/* Global Scroll-to-Top Floating Trigger */}
        <BackToTop />
      </div>
    </MotionProvider>
  )
}
