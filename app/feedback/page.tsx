import { Metadata } from "next"
import { FeedbackForm } from "@/components/feedback-form"
import { SiteNavigation } from "@/components/public/site-navigation"
import { SiteFooter } from "@/components/public/site-footer"

export const metadata: Metadata = {
  title: "Share feedback | TAC-XPRESS",
  description: "Send us your feedback or contact support.",
}

export default function FeedbackPage() {
  return (
    <div className="cargo-public bg-background text-foreground">
      <SiteNavigation />
      <main
        id="main-content"
        className="container mx-auto max-w-2xl px-4 py-10 md:py-20"
      >
        <div className="space-y-6">
          <div>
            <h1 className="cargo-heading mb-5">Help us move forward.</h1>
            <p className="text-lg text-muted-foreground">
              We value your feedback. Let us know how we can improve your
              Tac-Xpress experience.
            </p>
          </div>
          <div className="rounded-xl border bg-card p-6 text-card-foreground shadow-sm md:p-8">
            <FeedbackForm />
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}
