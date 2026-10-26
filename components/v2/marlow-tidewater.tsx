"use client"

import * as React from "react"
import { Check, ArrowRight } from "lucide-react"

type PlanTier = "hobby" | "pro" | "team"
type BillingCycle = "monthly" | "yearly"

interface PlanData {
  id: PlanTier
  layerNumber: string
  name: string
  tagline: string
  monthlyPrice: number
  yearlyPrice: number
  ctaText: string
  ctaHref: string
  metrics: {
    projects: string
    events: string
    history: string
    seats: string
  }
}

const PLANS: Record<PlanTier, PlanData> = {
  hobby: {
    id: "hobby",
    layerNumber: "01",
    name: "Hobby",
    tagline: "For side projects and trying things out.",
    monthlyPrice: 0,
    yearlyPrice: 0,
    ctaText: "Start for free",
    ctaHref: "/v2/contact?plan=hobby",
    metrics: {
      projects: "Unlimited",
      events: "1,000",
      history: "7 days",
      seats: "1",
    },
  },
  pro: {
    id: "pro",
    layerNumber: "02",
    name: "Pro",
    tagline: "For makers shipping something every week.",
    monthlyPrice: 36,
    yearlyPrice: 30,
    ctaText: "Start 14-day trial",
    ctaHref: "/v2/contact?plan=pro",
    metrics: {
      projects: "Unlimited",
      events: "50,000",
      history: "90 days",
      seats: "3",
    },
  },
  team: {
    id: "team",
    layerNumber: "03",
    name: "Team",
    tagline: "For teams that need roles, audit and scale.",
    monthlyPrice: 96,
    yearlyPrice: 80,
    ctaText: "Choose Team",
    ctaHref: "/v2/contact?plan=team",
    metrics: {
      projects: "Unlimited",
      events: "500,000",
      history: "1 year",
      seats: "10",
    },
  },
}

export function MarlowTidewater() {
  const [selectedPlan, setSelectedPlan] = React.useState<PlanTier>("pro")
  const [billingCycle, setBillingCycle] = React.useState<BillingCycle>("monthly")

  const plan = PLANS[selectedPlan]
  const currentPrice = billingCycle === "monthly" ? plan.monthlyPrice : plan.yearlyPrice

  // Tier level index (1 for Hobby, 2 for Pro, 3 for Team)
  const tierLevel = selectedPlan === "hobby" ? 1 : selectedPlan === "pro" ? 2 : 3

  return (
    <section
      aria-label="Tidewater Layer Stack Pricing"
      className="relative isolate w-full bg-white text-neutral-950 dark:bg-neutral-950 dark:text-neutral-50 py-20 sm:py-28 px-6 sm:px-10 overflow-hidden"
    >
      <div className="mx-auto max-w-5xl">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-12 sm:pb-16">
          <div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-medium tracking-tight text-neutral-950 dark:text-neutral-50 leading-[1.1]">
              Build up to the
              <br />
              plan you need.
            </h2>
            <p className="mt-3 text-sm sm:text-base text-neutral-500 dark:text-neutral-400 max-w-md leading-relaxed text-pretty">
              Each plan is a layer on the one below. Stop where it fits.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="inline-flex border border-black/10 bg-neutral-100/90 dark:border-white/10 dark:bg-neutral-900 p-0.5">
              <button
                type="button"
                onClick={() => setBillingCycle("monthly")}
                className={`px-3.5 py-1.5 text-xs font-medium transition-colors cursor-pointer ${
                  billingCycle === "monthly"
                    ? "bg-white text-neutral-950 shadow-xs dark:bg-neutral-800 dark:text-white"
                    : "text-neutral-600 hover:text-neutral-950 dark:text-neutral-400 dark:hover:text-white"
                }`}
              >
                Monthly
              </button>
              <button
                type="button"
                onClick={() => setBillingCycle("yearly")}
                className={`px-3.5 py-1.5 text-xs font-medium transition-colors cursor-pointer ${
                  billingCycle === "yearly"
                    ? "bg-white text-neutral-950 shadow-xs dark:bg-neutral-800 dark:text-white"
                    : "text-neutral-600 hover:text-neutral-950 dark:text-neutral-400 dark:hover:text-white"
                }`}
              >
                Yearly
              </button>
            </div>
            <span className="text-xs text-neutral-500 dark:text-neutral-400 font-normal">
              2 months free on yearly
            </span>
          </div>
        </div>

        <div className="border border-black/10 dark:border-white/10 bg-neutral-50/70 dark:bg-neutral-900/60 p-4 sm:p-8 shadow-xs grid grid-cols-1 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] gap-8 lg:gap-12 items-center">
          <div className="relative flex flex-col justify-between h-full min-h-[400px] sm:min-h-[460px] border border-black/5 dark:border-white/5 bg-white/60 dark:bg-neutral-950/40 p-6 sm:p-8 overflow-hidden select-none">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-72 bg-neutral-200/50 dark:bg-neutral-800/30 blur-3xl pointer-events-none" />

            <div className="relative my-auto flex items-center justify-center py-4">
              <svg
                viewBox="0 0 380 340"
                className="w-full max-w-[320px] sm:max-w-[350px] overflow-visible"
                aria-label="3D Layer Stack Illustration"
              >
                <defs>
                  <linearGradient id="topFaceActive" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#2A2B30" />
                    <stop offset="100%" stopColor="#18191D" />
                  </linearGradient>
                  <linearGradient id="leftFaceActive" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#1E1F24" />
                    <stop offset="100%" stopColor="#141518" />
                  </linearGradient>
                  <linearGradient id="rightFaceActive" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#141518" />
                    <stop offset="100%" stopColor="#0B0C0E" />
                  </linearGradient>

                  <filter id="layerShadow" x="-20%" y="-20%" width="140%" height="140%">
                    <feDropShadow dx="0" dy="8" stdDeviation="10" floodOpacity="0.25" floodColor="#000000" />
                  </filter>
                </defs>

                <g
                  transform="translate(0, 110)"
                  className="transition-all duration-300"
                  filter={tierLevel >= 1 ? "url(#layerShadow)" : undefined}
                >
                  {tierLevel >= 1 ? (
                    <>
                      <path d="M50 120 L190 190 L190 220 L50 150 Z" fill="url(#leftFaceActive)" />
                      <path d="M190 190 L330 120 L330 150 L190 220 Z" fill="url(#rightFaceActive)" />
                      <path
                        d="M190 50 L330 120 L190 190 L50 120 Z"
                        fill="url(#topFaceActive)"
                        stroke="#383A42"
                        strokeWidth="1"
                      />
                      <text
                        x="75"
                        y="142"
                        fill={selectedPlan === "hobby" ? "#EF4444" : "#8A8D98"}
                        fontSize="11"
                        fontFamily="monospace"
                        fontWeight={selectedPlan === "hobby" ? "600" : "500"}
                        transform="rotate(26, 75, 142) skewX(-30)"
                      >
                        01 Hobby
                      </text>
                    </>
                  ) : (
                    <path
                      d="M190 50 L330 120 L190 190 L50 120 Z M50 120 L50 150 L190 220 L330 150 L330 120 M190 190 L190 220"
                      fill="none"
                      stroke="#B0B4C0"
                      strokeWidth="1.2"
                      strokeDasharray="4 4"
                    />
                  )}
                </g>

                <g
                  transform="translate(0, 55)"
                  className="transition-all duration-300"
                  filter={tierLevel >= 2 ? "url(#layerShadow)" : undefined}
                >
                  {tierLevel >= 2 ? (
                    <>
                      <path d="M50 120 L190 190 L190 220 L50 150 Z" fill="url(#leftFaceActive)" />
                      <path d="M190 190 L330 120 L330 150 L190 220 Z" fill="url(#rightFaceActive)" />
                      <path
                        d="M190 50 L330 120 L190 190 L50 120 Z"
                        fill="url(#topFaceActive)"
                        stroke="#383A42"
                        strokeWidth="1"
                      />
                      <text
                        x="75"
                        y="142"
                        fill={selectedPlan === "pro" ? "#EF4444" : "#8A8D98"}
                        fontSize="11"
                        fontFamily="monospace"
                        fontWeight={selectedPlan === "pro" ? "600" : "500"}
                        transform="rotate(26, 75, 142) skewX(-30)"
                      >
                        02 Pro
                      </text>
                    </>
                  ) : (
                    <>
                      <path
                        d="M190 50 L330 120 L190 190 L50 120 Z M50 120 L50 150 L190 220 L330 150 L330 120 M190 190 L190 220"
                        fill="none"
                        stroke="#B0B4C0"
                        strokeWidth="1.2"
                        strokeDasharray="4 4"
                      />
                      <text
                        x="75"
                        y="142"
                        fill="#8A8D98"
                        fontSize="10"
                        fontFamily="monospace"
                        transform="rotate(26, 75, 142) skewX(-30)"
                      >
                        02 Pro
                      </text>
                    </>
                  )}
                </g>

                <g
                  transform="translate(0, 0)"
                  className="transition-all duration-300"
                  filter={tierLevel >= 3 ? "url(#layerShadow)" : undefined}
                >
                  {tierLevel >= 3 ? (
                    <>
                      <path d="M50 120 L190 190 L190 220 L50 150 Z" fill="url(#leftFaceActive)" />
                      <path d="M190 190 L330 120 L330 150 L190 220 Z" fill="url(#rightFaceActive)" />
                      <path
                        d="M190 50 L330 120 L190 190 L50 120 Z"
                        fill="url(#topFaceActive)"
                        stroke="#383A42"
                        strokeWidth="1"
                      />
                      <text
                        x="75"
                        y="142"
                        fill={selectedPlan === "team" ? "#EF4444" : "#8A8D98"}
                        fontSize="11"
                        fontFamily="monospace"
                        fontWeight={selectedPlan === "team" ? "600" : "500"}
                        transform="rotate(26, 75, 142) skewX(-30)"
                      >
                        03 Team
                      </text>
                    </>
                  ) : (
                    <>
                      <path
                        d="M190 50 L330 120 L190 190 L50 120 Z M50 120 L50 150 L190 220 L330 150 L330 120 M190 190 L190 220"
                        fill="none"
                        stroke="#B0B4C0"
                        strokeWidth="1.2"
                        strokeDasharray="4 4"
                      />
                      <text
                        x="75"
                        y="142"
                        fill="#8A8D98"
                        fontSize="10"
                        fontFamily="monospace"
                        transform="rotate(26, 75, 142) skewX(-30)"
                      >
                        03 Team
                      </text>
                    </>
                  )}
                </g>
              </svg>
            </div>

            <div className="flex items-center justify-between border-t border-black/5 dark:border-white/5 pt-3 font-mono text-xs text-neutral-400 dark:text-neutral-500">
              <span>Layer {plan.layerNumber} of 03</span>
              <span className="font-medium text-neutral-700 dark:text-neutral-300">{plan.name}</span>
            </div>
          </div>

          <div className="flex flex-col gap-6">
            <div className="divide-y divide-black/5 dark:divide-white/5 border-b border-black/5 dark:border-white/5 pb-2">
              <button
                type="button"
                onClick={() => setSelectedPlan("team")}
                className={`w-full flex items-center justify-between py-3.5 px-2 transition-colors cursor-pointer text-left ${
                  selectedPlan === "team"
                    ? "bg-black/[0.03] dark:bg-white/[0.04]"
                    : "hover:bg-black/[0.015] dark:hover:bg-white/[0.02]"
                }`}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`size-4.5 border mt-0.5 flex items-center justify-center transition-colors ${
                      selectedPlan === "team"
                        ? "border-neutral-950 dark:border-white bg-transparent"
                        : "border-black/20 dark:border-white/20"
                    }`}
                  >
                    {selectedPlan === "team" && (
                      <div className="size-2 bg-neutral-950 dark:bg-white" />
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono text-neutral-400">03</span>
                      <h4 className="text-sm font-medium text-neutral-950 dark:text-white">
                        Team
                      </h4>
                    </div>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                      For teams that need roles, audit and scale.
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="font-mono text-sm font-semibold text-neutral-950 dark:text-white">
                    ${billingCycle === "monthly" ? "96" : "80"}/mo
                  </span>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setSelectedPlan("pro")}
                className={`w-full flex items-center justify-between py-3.5 px-2 transition-colors cursor-pointer text-left ${
                  selectedPlan === "pro"
                    ? "bg-black/[0.03] dark:bg-white/[0.04]"
                    : "hover:bg-black/[0.015] dark:hover:bg-white/[0.02]"
                }`}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`size-4.5 border mt-0.5 flex items-center justify-center transition-colors ${
                      selectedPlan === "pro"
                        ? "border-neutral-950 dark:border-white bg-transparent"
                        : "border-black/20 dark:border-white/20"
                    }`}
                  >
                    {selectedPlan === "pro" && (
                      <div className="size-2 bg-neutral-950 dark:bg-white" />
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono text-neutral-400">02</span>
                      <h4 className="text-sm font-medium text-neutral-950 dark:text-white">
                        Pro
                      </h4>
                    </div>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                      For makers shipping something every week.
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="font-mono text-sm font-semibold text-neutral-950 dark:text-white">
                    ${billingCycle === "monthly" ? "36" : "30"}/mo
                  </span>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setSelectedPlan("hobby")}
                className={`w-full flex items-center justify-between py-3.5 px-2 transition-colors cursor-pointer text-left ${
                  selectedPlan === "hobby"
                    ? "bg-black/[0.03] dark:bg-white/[0.04]"
                    : "hover:bg-black/[0.015] dark:hover:bg-white/[0.02]"
                }`}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`size-4.5 border mt-0.5 flex items-center justify-center transition-colors ${
                      selectedPlan === "hobby"
                        ? "border-neutral-950 dark:border-white bg-transparent"
                        : "border-black/20 dark:border-white/20"
                    }`}
                  >
                    {selectedPlan === "hobby" && (
                      <div className="size-2 bg-neutral-950 dark:bg-white" />
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono text-neutral-400">01</span>
                      <h4 className="text-sm font-medium text-neutral-950 dark:text-white">
                        Hobby
                      </h4>
                    </div>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                      For side projects and trying things out.
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="font-mono text-sm font-semibold text-neutral-950 dark:text-white">
                    $0/mo
                  </span>
                </div>
              </button>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-1">
              <div>
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl sm:text-5xl font-semibold tracking-tight text-neutral-950 dark:text-white tabular-nums">
                    ${currentPrice}
                  </span>
                  <span className="text-sm text-neutral-500 dark:text-neutral-400 font-normal">
                    / month
                  </span>
                </div>
                <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
                  {selectedPlan === "hobby"
                    ? "Free forever, no card needed"
                    : billingCycle === "monthly"
                      ? `Billed monthly · $${plan.yearlyPrice}/mo on yearly`
                      : "Billed yearly · 2 months free included"}
                </p>
              </div>

              <a
                href={plan.ctaHref}
                className="inline-flex h-11 items-center justify-center bg-neutral-950 dark:bg-white px-6 text-xs font-medium text-white dark:text-neutral-950 shadow-xs hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-colors cursor-pointer"
              >
                <span>{plan.ctaText}</span>
              </a>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 border-t border-b border-black/5 dark:border-white/5 py-4">
              <div>
                <span className="block text-[11px] text-neutral-500 dark:text-neutral-400 font-mono">
                  Projects
                </span>
                <span className="mt-0.5 block text-xs font-semibold text-neutral-900 dark:text-neutral-100 tabular-nums">
                  {plan.metrics.projects}
                </span>
              </div>
              <div>
                <span className="block text-[11px] text-neutral-500 dark:text-neutral-400 font-mono">
                  Events / mo
                </span>
                <span className="mt-0.5 block text-xs font-semibold text-neutral-900 dark:text-neutral-100 tabular-nums">
                  {plan.metrics.events}
                </span>
              </div>
              <div>
                <span className="block text-[11px] text-neutral-500 dark:text-neutral-400 font-mono">
                  History
                </span>
                <span className="mt-0.5 block text-xs font-semibold text-neutral-900 dark:text-neutral-100 tabular-nums">
                  {plan.metrics.history}
                </span>
              </div>
              <div>
                <span className="block text-[11px] text-neutral-500 dark:text-neutral-400 font-mono">
                  Seats
                </span>
                <span className="mt-0.5 block text-xs font-semibold text-neutral-900 dark:text-neutral-100 tabular-nums">
                  {plan.metrics.seats}
                </span>
              </div>
            </div>

            <div className="space-y-3 pt-1">
              <div className="flex flex-col sm:flex-row sm:items-center gap-1.5 sm:gap-4 text-xs">
                <span className="shrink-0 font-mono text-[11px] text-neutral-400 w-24">
                  01 From Hobby
                </span>
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-neutral-700 dark:text-neutral-300">
                  <span>Unlimited viewers</span>
                  <span className="text-neutral-300 dark:text-neutral-700">·</span>
                  <span>Shareable dashboards</span>
                  <span className="text-neutral-300 dark:text-neutral-700">·</span>
                  <span>Community support</span>
                </div>
              </div>

              <div
                className={`flex flex-col sm:flex-row sm:items-center gap-1.5 sm:gap-4 text-xs transition-opacity ${
                  tierLevel >= 2 ? "opacity-100" : "opacity-40"
                }`}
              >
                <span className="shrink-0 font-mono text-[11px] text-neutral-400 w-24">
                  02 Added in Pro
                </span>
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-neutral-700 dark:text-neutral-300">
                  <span>Custom domains</span>
                  <span className="text-neutral-300 dark:text-neutral-700">·</span>
                  <span>API access</span>
                  <span className="text-neutral-300 dark:text-neutral-700">·</span>
                  <span>Email support</span>
                </div>
              </div>

              <div
                className={`flex flex-col sm:flex-row sm:items-center gap-1.5 sm:gap-4 text-xs transition-opacity ${
                  tierLevel >= 3 ? "opacity-100" : "opacity-40"
                }`}
              >
                <span className="shrink-0 font-mono text-[11px] text-neutral-400 w-24">
                  03 Added in Team
                </span>
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-neutral-700 dark:text-neutral-300">
                  <span>Role-based access</span>
                  <span className="text-neutral-300 dark:text-neutral-700">·</span>
                  <span>Audit logs</span>
                  <span className="text-neutral-300 dark:text-neutral-700">·</span>
                  <span>Priority 24/7 support</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
