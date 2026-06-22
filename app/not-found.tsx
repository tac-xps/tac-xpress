import Link from "next/link"
import { Button } from "@/components/ui/button"
import { AmbientBackground } from "@/app/(landing)/components/ambient-background"

export default function NotFound() {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-premium-mesh text-foreground supports-[overflow:clip]:overflow-clip">
      <div className="pointer-events-none fixed inset-0 z-0 h-full w-full bg-[url('/noise.svg')] opacity-[0.03] mix-blend-overlay" />
      <AmbientBackground />

      <div className="relative z-10 mx-auto flex w-full max-w-2xl flex-col items-center px-6 text-center">
        {/* Glassmorphic Container */}
        <div className="relative flex w-full flex-col items-center justify-center border border-border/60 bg-card/40 p-12 shadow-2xl shadow-black/20 backdrop-blur-xl before:absolute before:inset-x-0 before:top-0 before:h-px before:bg-gradient-to-r before:from-transparent before:via-card-accent/50 before:to-transparent">
          <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-2xl bg-primary/10 shadow-inner ring-1 ring-primary/20">
            <span className="font-mono text-4xl font-bold tracking-tighter text-primary">
              404
            </span>
          </div>

          <h1 className="font-heading text-4xl font-light tracking-tight text-foreground uppercase sm:text-5xl">
            Signal Lost
          </h1>
          <p className="mt-4 max-w-[400px] text-lg leading-relaxed text-muted-foreground">
            The shipment or page you are looking for has been rerouted or does
            not exist in our manifest.
          </p>

          <div className="mt-10 flex flex-col gap-4 sm:flex-row">
            <Button
              asChild
              size="lg"
              className="min-w-[160px] rounded-none border border-primary bg-primary text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:bg-primary/90 hover:shadow-primary/30"
            >
              <Link href="/">Return to Base</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="min-w-[160px] rounded-none border-border/60 bg-background/50 backdrop-blur-sm hover:bg-muted/50"
            >
              <Link href="/dashboard">Open Dashboard</Link>
            </Button>
          </div>

          {/* Decorative Corner Accents */}
          <div className="absolute top-0 left-0 h-4 w-4 border-t-2 border-l-2 border-primary/40" />
          <div className="absolute top-0 right-0 h-4 w-4 border-t-2 border-r-2 border-primary/40" />
          <div className="absolute bottom-0 left-0 h-4 w-4 border-b-2 border-l-2 border-primary/40" />
          <div className="absolute right-0 bottom-0 h-4 w-4 border-r-2 border-b-2 border-primary/40" />
        </div>
      </div>
    </div>
  )
}
