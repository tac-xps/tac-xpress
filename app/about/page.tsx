import Link from "next/link"
import { MessageSquareText, SearchCode, ShieldCheck, ArrowUpRight } from "lucide-react"
import { PublicPage } from "@/components/public/public-page"
import { PageIntro } from "@/components/public/page-intro"
import { HomeStory } from "@/components/public/home-story"
import { Button } from "@/components/ui/button"

export const metadata = {
  title: "About TAC-XPRESS",
  description:
    "Cargo services connecting New Delhi and Northeast India, with attention to the people and details behind each shipment.",
}

const OPERATING_STANDARDS = [
  {
    step: "01 · Intake Verification",
    title: "A conversation before a commitment.",
    icon: MessageSquareText,
    lead: "Route and requirement assessment.",
    body: "We audit your origin, destination corridor, commodity profile, and handling constraints so service feasibility is confirmed before any booking is created.",
  },
  {
    step: "02 · Custody Visibility",
    title: "A reference you can follow.",
    icon: SearchCode,
    lead: "Statutory AWB milestone trail.",
    body: "Your 10-digit Air Waybill reference logs physical optical scan events at terminal gates, flight departures, and local station arrival for end-to-end accountability.",
  },
  {
    step: "03 · Handling Rigor",
    title: "Help with practical freight details.",
    icon: ShieldCheck,
    lead: "Packaging and compliance verification.",
    body: "Declare specialized handling, fragile contents, and statutory documentation like GST E-Way bills beforehand to ensure seamless terminal induction.",
  },
]

export default function AboutPage() {
  return (
    <PublicPage>
      <PageIntro
        eyebrow="About TAC-XPRESS"
        image="about"
        title="For the people on both ends of a shipment."
        description="Goods carry a purpose: stock for a business, supplies for a team, something needed at home. We approach cargo with that responsibility in mind."
      />
      <HomeStory ctaHref="/services" ctaText="Explore transit routes" />
      <section className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-8 md:grid-cols-12 md:gap-14 lg:py-24">
        <div className="md:col-span-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-primary">
              <span className="size-1.5 rounded-none bg-primary" aria-hidden="true" />
              Operating Principles
            </div>
            <h2 className="mt-4 text-section">
              What to expect
              <br />
              when you work with us.
            </h2>
            <p className="mt-5 text-lead max-w-[42ch]">
              Direct freight accountability from intake consultation to proof-of-delivery handover.
            </p>
          </div>
          <div className="mt-8">
            <Button asChild size="lg" className="rounded-none group">
              <Link href="/contact">
                <span>Start a conversation</span>
                <ArrowUpRight className="size-4 ml-1.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
            </Button>
          </div>
        </div>

        <div className="md:col-span-7">
          <div className="border border-border/80 bg-card/60 divide-y divide-border/80 shadow-xs">
            {OPERATING_STANDARDS.map((std) => {
              const Icon = std.icon
              return (
                <div
                  key={std.step}
                  className="p-5 sm:p-7 border-t-2 border-t-transparent hover:border-t-primary/70 hover:bg-muted/30 transition-all duration-200"
                >
                  <div className="flex items-center justify-between font-mono text-[11px] uppercase tracking-wider text-primary">
                    <span className="flex items-center gap-2">
                      <Icon className="size-3.5 text-primary" />
                      {std.step}
                    </span>
                    <span className="size-1 rounded-none bg-primary/60" aria-hidden="true" />
                  </div>
                  <h3 className="mt-3 font-heading font-semibold text-lg text-foreground tracking-tight">
                    {std.title}
                  </h3>
                  <p className="mt-2.5 text-body-editorial">
                    <strong className="font-semibold text-foreground">{std.lead} </strong>
                    {std.body}
                  </p>
                </div>
              )
            })}
          </div>
        </div>
      </section>
    </PublicPage>
  )
}
