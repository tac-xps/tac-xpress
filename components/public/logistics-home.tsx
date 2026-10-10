import React from "react"
import { MotionProvider } from "./landing/motion-provider"
import { LandingNav } from "./landing/landing-nav"
import { HeroSection } from "./landing/hero-section"
import { ServicesSection } from "./landing/services-section"
import { TrackingSection } from "./landing/tracking-section"
import { ProcessSection } from "./landing/process-section"
import { NetworkSection } from "./landing/network-section"
import { CareSection } from "./landing/care-section"
import { BrandStatementSection } from "./landing/brand-statement-section"
import { FAQSection } from "./landing/faq-section"
import { ContactSection } from "./landing/contact-section"
import { LandingFooter } from "./landing/landing-footer"
import { SupportChat } from "./support-chat"

/**
 * TAC Express — Master Landing Page (Motion System 2.0: Living Logistics)
 *
 * Implements "Quiet Infrastructure" with clear editorial hierarchy:
 * Cargo, Visibility, Journey, Delivery, FAQ, and Operations Desk.
 *
 * Motion Engine: Exclusively `motion/react` v14.0.0 with zero GSAP.
 */
export function LogisticsHome() {
  return (
    <MotionProvider>
      <div className="cargo-public min-h-svh w-full max-w-full overflow-x-clip bg-background text-foreground antialiased selection:bg-primary/20 selection:text-foreground">
        {/* Accessible Skip-to-Content Link */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[60] focus:bg-background focus:px-4 focus:py-2 focus:border focus:border-border focus:text-foreground focus:text-sm"
        >
          Skip to content
        </a>

        {/* Direction-Aware Header */}
        <LandingNav />

        <main id="main-content" className="relative">
          {/* Chapter 01: Cargo */}
          <HeroSection />
          <ServicesSection />

          {/* Chapter 02: Visibility */}
          <TrackingSection />

          {/* Chapter 03: Journey */}
          <ProcessSection />
          <NetworkSection />

          {/* Chapter 04: Delivery */}
          <CareSection />
          <BrandStatementSection />
          <ContactSection />

          {/* Utility: Operational Clarity */}
          <FAQSection />
        </main>

        {/* Utility: Editorial Closing Directory */}
        <LandingFooter />

        {/* On-Demand Support Assistant */}
        <SupportChat />
      </div>
    </MotionProvider>
  )
}
