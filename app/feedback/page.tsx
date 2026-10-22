import { Metadata } from "next"
import { TicketForm } from "@/components/public/ticket-form"
import { PublicPage } from "@/components/public/public-page"
import { PageIntro } from "@/components/public/page-intro"

export const metadata: Metadata = {
  title: "Share feedback | TAC-XPRESS",
  description:
    "Send us your feedback, report a concern, or contact TAC-XPRESS support.",
}

export default function FeedbackPage() {
  return (
    <PublicPage>
      <PageIntro
        eyebrow="Share feedback"
        title="Help us move forward."
        description="We value your feedback. Let us know how we can improve your Tac-Xpress experience."
      />
      <section className="cargo-container pb-16 lg:pb-24">
        <div className="max-w-2xl">
          <TicketForm defaultMode="feedback" />
        </div>
      </section>
    </PublicPage>
  )
}

