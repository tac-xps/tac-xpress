// Adapted from @tailark-oss/veil-content-1.
import Link from "next/link"
import { ArrowUpRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { preparation } from "./shipping-content"
import { CargoImage } from "./cargo-image"
export function ShippingPreparation() {
  return (
    <section className="bg-card" aria-labelledby="preparation-title">
      <div className="cargo-container cargo-section">
        <div className="grid items-start gap-10 lg:grid-cols-2 lg:gap-20">
          <div>
            <p className="cargo-eyebrow mb-5 text-muted-foreground">
              03 / Before the first mile
            </p>
            <h2 id="preparation-title" className="cargo-heading">
              Care begins
              <br />
              with the details.
            </h2>
            <p className="mt-6 max-w-md leading-relaxed text-muted-foreground">
              Strong packaging. Clear labels. The right information. A little
              preparation helps your goods travel well.
            </p>
            <Button asChild variant="link" className="mt-5 px-0">
              <Link href="/shipping-guide">
                Read the shipping guide <ArrowUpRight data-icon="inline-end" />
              </Link>
            </Button>
          </div>
          <CargoImage asset="packing" className="aspect-[4/3]" />
        </div>
        <dl className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {preparation.map((item) => (
            <div key={item.title} className="border-t pt-6">
              <dt className="text-xl font-medium tracking-tight">
                {item.title}
              </dt>
              <dd className="mt-3 leading-relaxed text-muted-foreground">
                {item.text}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  )
}
