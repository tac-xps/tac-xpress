import Link from "next/link"
import { ArrowUpRight, Plane, ShieldCheck, Activity, MapPin } from "lucide-react"

export function HeroTelemetryCards() {
  return (
    <div className="flex flex-col sm:grid sm:grid-cols-2 lg:flex lg:flex-col gap-4 max-w-full lg:max-w-sm lg:ml-auto select-none pointer-events-auto">
      {/* Telemetry Card 1: Express Air Transit */}
      <div className="relative border border-white/20 bg-black/65 p-5 backdrop-blur-md transition-colors hover:border-white/35">
        <div className="flex items-center justify-between gap-3 border-b border-white/10 pb-3">
          <div className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-wider text-zinc-300">
            <Plane className="size-3.5 text-primary" aria-hidden="true" />
            <span>Air Transit / Tier 01</span>
          </div>
          <div className="flex items-center gap-1.5 font-mono text-[10px] text-emerald-400 bg-emerald-950/80 border border-emerald-500/40 px-2 py-0.5">
            <span className="size-1.5 bg-emerald-400" aria-hidden="true" />
            <span>Active Corridor</span>
          </div>
        </div>

        <div className="mt-3.5 space-y-2.5">
          <div className="flex items-baseline justify-between">
            <span className="font-mono text-lg font-bold tracking-tight text-white">
              DEL <span className="text-zinc-400 font-normal">→</span> IMF
            </span>
            <span className="font-mono text-xs text-primary font-semibold">24–48h SLA</span>
          </div>

          <p className="text-xs leading-relaxed text-zinc-300">
            Daily direct belly-hold and freighter linehauls from New Delhi to Bir Tikendrajit Airport, Imphal.
          </p>

          <div className="flex items-center justify-between border-t border-white/10 pt-2.5 font-mono text-[11px] text-zinc-400">
            <span>Next departure: 06:15 IST</span>
            <Link
              href="/services"
              className="inline-flex items-center gap-1 text-primary hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary"
            >
              Details <ArrowUpRight className="size-3" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </div>

      {/* Telemetry Card 2: Mountain Pass & Zero-Damage Handling */}
      <div className="relative border border-white/20 bg-black/65 p-5 backdrop-blur-md transition-colors hover:border-white/35">
        <div className="flex items-center justify-between gap-3 border-b border-white/10 pb-3">
          <div className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-wider text-zinc-300">
            <ShieldCheck className="size-3.5 text-primary" aria-hidden="true" />
            <span>Protection Protocol</span>
          </div>
          <div className="flex items-center gap-1.5 font-mono text-[10px] text-zinc-200 bg-white/10 border border-white/20 px-2 py-0.5">
            <Activity className="size-3 text-primary" aria-hidden="true" />
            <span>Telemetry Live</span>
          </div>
        </div>

        <div className="mt-3.5 space-y-2.5">
          <div className="flex items-baseline justify-between">
            <span className="font-mono text-sm font-semibold tracking-tight text-white">
              Zero-Damage Linehaul
            </span>
            <span className="font-mono text-xs text-emerald-400 font-medium">99.8% Claim-Free</span>
          </div>

          <div className="grid grid-cols-2 gap-2 font-mono text-[11px] text-zinc-200 bg-white/[0.04] p-2.5 border border-white/10">
            <div>
              <span className="block text-[9px] uppercase text-zinc-400">Seal Status</span>
              <span className="font-bold text-white">Digital Intact</span>
            </div>
            <div>
              <span className="block text-[9px] uppercase text-zinc-400">Transit Grade</span>
              <span className="font-bold text-white">All-Weather EV</span>
            </div>
          </div>

          <div className="flex items-center justify-between border-t border-white/10 pt-2.5 font-mono text-[11px] text-zinc-400">
            <span className="flex items-center gap-1">
              <MapPin className="size-3 text-primary" aria-hidden="true" />
              Barak Valley Pass
            </span>
            <Link
              href="/about"
              className="inline-flex items-center gap-1 text-primary hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary"
            >
              Protocol <ArrowUpRight className="size-3" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
