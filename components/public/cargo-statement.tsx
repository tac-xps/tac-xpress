// Tailark content typography composition; product statement, not a testimonial.
import Link from "next/link"
import { ArrowUpRight } from "lucide-react"
import { Button } from "@/components/ui/button"
export function CargoStatement() {
  return (
    <section className="cargo-accent" aria-labelledby="statement-title">
      <div className="cargo-container cargo-section">
        <p className="cargo-eyebrow mb-8">More than what is in the box</p>
        <h2 id="statement-title" className="cargo-statement max-w-6xl">
          Behind every shipment,
          <br className="hidden md:block" /> something moves forward.
        </h2>
        <div className="mt-10 flex flex-col justify-between gap-8 border-t pt-8 md:flex-row md:items-center">
          <p className="max-w-xl text-lg leading-relaxed">
            A business gets ready. A home feels closer. Tell us what needs to
            move, and we’ll help you work through the next step.
          </p>
          <Button asChild size="lg" className="w-fit shrink-0 px-4">
            <Link href="/contact">
              Let’s talk cargo <ArrowUpRight data-icon="inline-end" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
