import { PublicPage } from "@/components/public/public-page"
import { PageIntro } from "@/components/public/page-intro"
import { ShippingSteps } from "@/components/public/shipping-steps"
import { ShippingPreparation } from "@/components/public/shipping-preparation"
import { TrackingExplainer } from "@/components/public/tracking-explainer"
import { ShippingFaq } from "@/components/public/shipping-faq"
export const metadata = {
  title: "Shipping guide | TAC-XPRESS",
  description:
    "How to book, pack, document and track cargo with TAC-XPRESS. Practical preparation and answers to common shipping questions.",
}
export default function ShippingGuidePage() {
  return (
    <PublicPage>
      <PageIntro
        eyebrow="Shipping guide"
        image="packing"
        title="Everything starts with the right details."
        description="A practical guide to preparing your cargo, arranging a booking and understanding the updates along the way. Keep it handy before you hand over your goods."
      />
      <ShippingSteps />
      <ShippingPreparation />
      <TrackingExplainer />
      <ShippingFaq />
    </PublicPage>
  )
}
