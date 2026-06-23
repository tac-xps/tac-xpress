import { cn } from "@/lib/utils"
import { Header } from "@/components/header"
import HeroSection from "@/components/hero-section"
import { LogosSection } from "@/components/logos-section"
import { FeatureSection } from "@/components/feature-section"
import { BentoSection } from "@/components/bento-section"
import { TrackingSection } from "@/components/tracking-section"
import { RouteNetworkSection } from "@/components/route-network"
import IntegrationsSection from "@/components/integrations-section"
import TestimonialsSection from "@/components/testimonials-section"
import FAQSection from "@/components/faq-section"
import CTASection from "@/components/cta-section"
import { SupportSection } from "@/components/support-section"
import { Footer } from "@/layout/footer"
import { AmbientBackground } from "@/app/(landing)/components/ambient-background"
import { FloatingChatWidget } from "@/components/ui-components/floating-chat-widget"

export default function LandingPage() {
  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden bg-premium-mesh text-foreground supports-[overflow:clip]:overflow-clip">
      {/* Subtle Noise Layer */}
      <div className="pointer-events-none fixed inset-0 z-50 h-full w-full bg-[url('/noise.svg')] opacity-[0.03] mix-blend-overlay" />
      <AmbientBackground />
      <Header />
      <main
        className={cn(
          "relative mx-auto w-full max-w-7xl grow",
          // X Borders (from exact snippet)
          "before:absolute before:-inset-y-14 before:-left-px before:w-px before:bg-border/50",
          "after:absolute after:-inset-y-14 after:-right-px after:w-px after:bg-border/50"
        )}
      >
        <HeroSection />
        <LogosSection />

        <FeatureSection />
        <BentoSection />
        <TrackingSection />
        <RouteNetworkSection />
        <IntegrationsSection />
        <TestimonialsSection />
        <SupportSection />
        <FAQSection />
        <CTASection />
      </main>
      <Footer />
      <FloatingChatWidget />
    </div>
  )
}
