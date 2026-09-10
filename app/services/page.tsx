import { PublicPage } from "@/components/public/public-page"
import { PageIntro } from "@/components/public/page-intro"
import { HomeServices } from "@/components/public/home-services"
import { ShippingSteps } from "@/components/public/shipping-steps"
import { ShippingFaq } from "@/components/public/shipping-faq"
import { ServiceComparison } from "@/components/public/service-comparison"
export const metadata = {
  title: "Air & surface cargo services | TAC-XPRESS",
  description:
    "Compare air and surface cargo, understand the booking process and prepare a shipment between New Delhi and Northeast India.",
}
export default function ServicesPage() {
  return (
    <PublicPage>
      <PageIntro
        eyebrow="Our services"
        image="air"
        title="A service that fits what you send."
        description="Choose around your goods, delivery window and destination. We help you work through the practical details before confirming the journey."
      />
      <HomeServices />
      <ServiceComparison />
      <ShippingSteps />
      <ShippingFaq />
    </PublicPage>
  )
}
