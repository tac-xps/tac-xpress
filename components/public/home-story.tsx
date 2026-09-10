// Adapted from @tailark-oss/veil-content-1.
import Link from "next/link"
import { ArrowUpRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { CargoImage } from "./cargo-image"
export function HomeStory() {
  return (
    <section
      className="cargo-inverse bg-background"
      aria-labelledby="about-title"
    >
      <div className="cargo-container cargo-section grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
        <div className="cargo-story-frame relative">
          <CargoImage asset="warehouse" className="cargo-story-media" />
          <p className="mt-4 font-mono text-xs text-muted-foreground">
            A perspective on the journey / Conceptual cargo render
          </p>
        </div>
        <div>
          <p className="cargo-eyebrow mb-5 text-muted-foreground">
            Our route. Our reason.
          </p>
          <h2 id="about-title" className="cargo-heading">
            Connected by more than a destination.
          </h2>
          <p className="mt-7 text-lg leading-relaxed text-muted-foreground">
            A shop waiting for stock. A family sending a little piece of home.
            Every consignment connects people as well as places.
          </p>
          <p className="mt-5 leading-relaxed text-muted-foreground">
            TAC-XPRESS supports the movement of goods between New Delhi and
            Northeast India, with Imphal at the heart of our story. We start
            with the details that matter: what you are sending, the route, the
            handling and the handover.
          </p>
          <Button
            asChild
            variant="outline"
            size="lg"
            className="mt-8 border-current bg-transparent"
          >
            <Link href="/about">
              Meet TAC-XPRESS <ArrowUpRight data-icon="inline-end" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
