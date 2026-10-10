import Link from "next/link"
import { notFound } from "next/navigation"
import { PublicPage } from "@/components/public/public-page"
import { PageIntro } from "@/components/public/page-intro"
import { ShippingSteps } from "@/components/public/shipping-steps"
import { ShippingFaq } from "@/components/public/shipping-faq"
import { services } from "@/components/public/shipping-content"
import { Button } from "@/components/ui/button"
type Props = { params: Promise<{ service: string }> }
export function generateStaticParams() {
  return services.map(({ slug }) => ({ service: slug }))
}
export async function generateMetadata({ params }: Props) {
  const { service } = await params
  const item = services.find(({ slug }) => slug === service)
  return {
    title: item ? `${item.name} | TAC-XPRESS` : "Service not found",
    description: item?.description,
  }
}
export default async function ServicePage({ params }: Props) {
  const { service } = await params
  const item = services.find(({ slug }) => slug === service)
  if (!item) notFound()
  return (
    <PublicPage>
      <PageIntro
        eyebrow={item.name}
        image={service === "air-cargo" ? "air" : "surface"}
        title={item.summary}
        description={item.description}
      />
      <section className="border-y bg-card">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-8 md:grid-cols-2 md:gap-20">
          <div>
            <h2 className="text-section">
              Before we arrange
              <br />
              the journey.
            </h2>
            <p className="mt-6 max-w-md text-body-editorial">
              The right service starts with accurate information. Our team
              reviews the consignment before confirming acceptance, charges and
              the movement plan.
            </p>
            <Button asChild className="mt-8 rounded-none">
              <Link href="/contact">Discuss {item.name.toLowerCase()}</Link>
            </Button>
          </div>
          <dl className="flex flex-col gap-6">
            {[
              ["Cargo Profile & Suitability", item.suitable, "Operational profile"],
              ["Corridor & Routing Factors", item.planning, "Schedule management"],
              ["Intake Preparation & Packaging", item.preparation, "Mandatory compliance"],
            ].map(([label, text, lead]) => (
              <div
                key={label}
                className="border-t-2 border-t-transparent hover:border-t-primary/70 border-x border-b border-border/80 bg-background/50 p-5 sm:p-6 transition-all duration-200"
              >
                <dt className="text-subhead flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-primary">
                  <span className="size-1.5 rounded-none bg-primary" aria-hidden="true" />
                  {label}
                </dt>
                <dd className="mt-3 text-body-editorial">
                  <strong className="font-semibold text-foreground">{lead}. </strong>
                  {text}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>
      <ShippingSteps />
      <ShippingFaq />
    </PublicPage>
  )
}
