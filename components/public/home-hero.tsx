// Tailark Veil hero composition, art directed around the Cargo Home 4 reference.
import Link from "next/link"
import { ArrowDown, ArrowUpRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { CargoImage } from "./cargo-image"

export function HomeHero() {
  return (
    <section className="cargo-hero cargo-inverse" aria-labelledby="home-title">
      <CargoImage
        asset="hero"
        className="cargo-hero-media"
        sizes="(max-width: 1024px) 1500px, 100vw"
        preload
      />
      <div className="cargo-hero-shade" aria-hidden="true" />
      <div className="cargo-hero-dissolve" aria-hidden="true" />
      <div className="cargo-container relative flex flex-1 flex-col justify-center py-32">
        <p className="cargo-eyebrow mb-7">
          New Delhi <span aria-hidden="true">↔</span> Northeast India
        </p>
        <h1 id="home-title" className="cargo-display max-w-3xl">
          Your world.
          <br />
          On the move.
        </h1>
        <p className="mt-7 max-w-md text-lg leading-relaxed text-muted-foreground">
          Air and surface cargo for the goods that keep your business, your home
          and your everyday moving.
        </p>
        <div className="mt-9 flex flex-wrap gap-4">
          <Button asChild size="lg" className="px-4 transition-colors hover:bg-primary/90">
            <Link href="/contact">
              Plan a shipment <ArrowUpRight data-icon="inline-end" />
            </Link>
          </Button>
          <Button
            asChild
            variant="outline"
            size="lg"
            className="border-current bg-transparent px-4 transition-colors hover:bg-white/5"
          >
            <a href="#shipment-desk">
              Track your cargo <ArrowDown data-icon="inline-end" />
            </a>
          </Button>
        </div>
      </div>
      <div className="cargo-container relative">
        <div className="flex flex-wrap items-center justify-between gap-5 border-t py-6 text-sm">
          <p>Thoughtful handling. Clear next steps.</p>
          <a
            href="#services"
            className="inline-flex items-center gap-3 hover:underline hover:underline-offset-4"
          >
            Explore how we move{" "}
            <ArrowDown className="size-4" aria-hidden="true" />
          </a>
        </div>
      </div>
    </section>
  )
}
