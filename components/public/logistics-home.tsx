import { SiteNavigation } from "./site-navigation"
import { SiteFooter } from "./site-footer"
import { SupportChat } from "./support-chat"
import { HomeHero } from "./home-hero"
import { HomeServices } from "./home-services"
import { HomeStory } from "./home-story"
import { HomeSupport } from "./home-support"
import { ShippingSteps } from "./shipping-steps"
import { ShippingPreparation } from "./shipping-preparation"
import { TrackingExplainer } from "./tracking-explainer"
import { ShippingFaq } from "./shipping-faq"
import { ShipmentDesk } from "./shipment-desk"
import { CargoStatement } from "./cargo-statement"
export function LogisticsHome() {
  return (
    <div className="cargo-public min-h-svh bg-background text-foreground">
      <SiteNavigation overlay />
      <main id="main-content">
        <HomeHero />
        <HomeServices />
        <ShipmentDesk />
        <ShippingSteps />
        <HomeStory />
        <ShippingPreparation />
        <CargoStatement />
        <TrackingExplainer />
        <ShippingFaq />
        <HomeSupport />
      </main>
      <SiteFooter />
      <SupportChat />
    </div>
  )
}
