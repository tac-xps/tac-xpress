import Link from "next/link"
import { PublicPage } from "@/components/public/public-page"
import { PageIntro } from "@/components/public/page-intro"
import { HomeStory } from "@/components/public/home-story"
import { Button } from "@/components/ui/button"
export const metadata = {
  title: "About TAC-XPRESS",
  description:
    "Cargo services connecting New Delhi and Northeast India, with attention to the people and details behind each shipment.",
}
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
      <section className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-8 md:grid-cols-2 md:gap-20 lg:py-24">
        <h2 className="max-w-md text-3xl font-medium tracking-tight">
          What to expect
          <br />
          when you work with us.
        </h2>
        <div className="flex flex-col items-start gap-6 text-muted-foreground">
          <p className="leading-relaxed">
            <strong className="font-medium text-foreground">
              A conversation before a commitment.
            </strong>{" "}
            We ask about the route, contents and handling requirements so that
            the service can be reviewed against your needs.
          </p>
          <p className="leading-relaxed">
            <strong className="font-medium text-foreground">
              A reference you can follow.
            </strong>{" "}
            Keep your AWB number for recorded tracking updates and for
            conversations about delivery or support.
          </p>
          <p className="leading-relaxed">
            <strong className="font-medium text-foreground">
              Help with the practical details.
            </strong>{" "}
            Tell us about access constraints, fragile items or documents you are
            unsure about before handover.
          </p>
          <Button asChild variant="outline">
            <Link href="/contact">Start a conversation</Link>
          </Button>
        </div>
      </section>
    </PublicPage>
  )
}
