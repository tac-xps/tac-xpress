import { ArrowDown, CheckCircle2, Shield, Truck } from "lucide-react"

export function HeroMetricsBar() {
  return (
    <div className="w-full border-t border-border bg-card/95 backdrop-blur-md">
      <div className="cargo-container py-4 sm:py-6">
        <div className="grid grid-cols-1 gap-5 md:grid-cols-3 md:gap-8">
          {/* Metric 1: SLA Standard */}
          <div className="flex items-start gap-3.5 border-b border-border pb-4 md:border-b-0 md:border-r md:border-border md:pb-0 md:pr-6">
            <div className="mt-0.5 flex size-8 shrink-0 items-center justify-center border border-border bg-surface text-primary">
              <CheckCircle2 className="size-4" aria-hidden="true" />
            </div>
            <div>
              <div className="flex items-baseline gap-2">
                <span className="font-mono text-xl font-bold tracking-tight text-foreground sm:text-2xl">
                  99.4%
                </span>
                <span className="font-mono text-xs text-primary font-medium">SLA Standard</span>
              </div>
              <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                Documented on-time linehaul arrival across 25,000+ Northeast commercial consignments.
              </p>
            </div>
          </div>

          {/* Metric 2: Capital to Valley */}
          <div className="flex items-start gap-3.5 border-b border-border pb-4 md:border-b-0 md:border-r md:border-border md:pb-0 md:pr-6">
            <div className="mt-0.5 flex size-8 shrink-0 items-center justify-center border border-border bg-surface text-primary">
              <Shield className="size-4" aria-hidden="true" />
            </div>
            <div>
              <div className="flex items-baseline gap-2">
                <span className="font-sans text-sm font-semibold uppercase tracking-wider text-foreground">
                  Capital to Valley
                </span>
                <span className="font-mono text-xs text-muted-foreground">Direct Linehaul</span>
              </div>
              <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                Sealed container runs with zero mid-route transshipment or unauthorized depot handling.
              </p>
            </div>
          </div>

          {/* Metric 3: Scheduled Runs */}
          <div className="flex items-start gap-3.5">
            <div className="mt-0.5 flex size-8 shrink-0 items-center justify-center border border-border bg-surface text-primary">
              <Truck className="size-4" aria-hidden="true" />
            </div>
            <div className="flex-1">
              <div className="flex items-baseline justify-between gap-2">
                <span className="font-sans text-sm font-semibold uppercase tracking-wider text-foreground">
                  Daily Scheduled Runs
                </span>
                <a
                  href="#services"
                  className="inline-flex items-center gap-1 font-mono text-[11px] text-primary hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary"
                >
                  Explore <ArrowDown className="size-3" aria-hidden="true" />
                </a>
              </div>
              <p className="mt-1 font-mono text-xs text-muted-foreground">
                DEL ↔ GAU, IMF, DMU, IXA & SHL
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
