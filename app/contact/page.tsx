import { PublicPage } from "@/components/public/public-page"
import { PageIntro } from "@/components/public/page-intro"
import { ContactSection } from "@/components/public/contact-section"
export const metadata = {
  title: "Contact & shipment enquiries | TAC-XPRESS",
  description:
    "Request a cargo quote or get help with a shipment. Share your route, package details or AWB with the TAC-XPRESS team.",
}
export default function ContactPage() {
  return (
    <PublicPage>
      <PageIntro
        eyebrow="Contact our team"
        image="warehouse"
        title="Let’s work through the details."
        description="Planning a shipment, checking a delivery or asking about an invoice? Tell us what you need. You do not need an account to get in touch."
      />
      <ContactSection />
    </PublicPage>
  )
}
