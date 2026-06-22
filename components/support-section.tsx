import { TicketForm } from "@/app/(landing)/components/ticket-form"
import { DecorIcon } from "@/components/decor-icon"
import { SupportLifebuoyIcon } from "@/components/icons/landing-icons"

export function SupportSection() {
  return (
    <section
      id="support"
      className="relative w-full overflow-hidden py-16 sm:py-20"
    >
      <div className="bg-grid-white/[0.02] absolute inset-0 bg-[size:32px_32px]" />

      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-8">
          {/* Left Text / Info */}
          <div className="flex flex-col gap-6">
            <div className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <SupportLifebuoyIcon className="h-5 w-5 text-primary" />
            </div>
            <h2 className="font-heading text-4xl font-light tracking-tight text-foreground uppercase sm:text-5xl">
              Need Assistance?
              <br />
              <span className="text-primary italic">We're Here 24/7.</span>
            </h2>
            <p className="max-w-lg text-lg text-muted-foreground">
              Have a question about a shipment or need help with billing? Send
              us a message and our support team will respond within 2 hours.
            </p>

            <div className="mt-4 flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <div className="h-px w-8 bg-primary/30" />
                <span className="text-sm tracking-widest text-foreground uppercase">
                  General Support
                </span>
              </div>
              <div className="flex items-center gap-3">
                <div className="h-px w-8 bg-primary/30" />
                <span className="text-sm tracking-widest text-foreground uppercase">
                  Shipment Issues
                </span>
              </div>
              <div className="flex items-center gap-3">
                <div className="h-px w-8 bg-primary/30" />
                <span className="text-sm tracking-widest text-foreground uppercase">
                  Partnerships
                </span>
              </div>
            </div>
          </div>

          {/* Right Form */}
          <div className="relative flex justify-center lg:justify-end">
            <div className="relative w-full max-w-lg border border-border/60 bg-card p-1 shadow-xl shadow-black/8 backdrop-blur-sm before:absolute before:inset-x-0 before:top-0 before:h-px before:bg-gradient-to-r before:from-transparent before:via-card-accent/50 before:to-transparent">
              <DecorIcon className="size-4" position="top-left" />
              <DecorIcon className="size-4" position="top-right" />
              <DecorIcon className="size-4" position="bottom-left" />
              <DecorIcon className="size-4" position="bottom-right" />
              <TicketForm />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
