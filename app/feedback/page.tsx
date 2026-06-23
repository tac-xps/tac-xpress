import { Metadata } from "next"
import { FeedbackForm } from "@/components/feedback-form"

export const metadata: Metadata = {
  title: "Contact Us | Tac-Xpress",
  description: "Send us your feedback or contact support.",
}

export default function FeedbackPage() {
  return (
    <div className="container mx-auto max-w-2xl px-4 py-10 md:py-20">
      <div className="space-y-6">
        <div>
          <h1 className="mb-2 text-3xl font-bold tracking-tight text-foreground">
            Get in Touch
          </h1>
          <p className="text-lg text-muted-foreground">
            We value your feedback. Let us know how we can improve your
            Tac-Xpress experience.
          </p>
        </div>
        <div className="rounded-xl border bg-card p-6 text-card-foreground shadow-sm md:p-8">
          <FeedbackForm />
        </div>
      </div>
    </div>
  )
}
