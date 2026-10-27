"use client"

import * as React from "react"
import Link from "next/link"
import { ArrowRight, Check } from "lucide-react"

export function MarlowPricing() {
  const models = [
    {
      name: "Sprint",
      price: "From €8,000",
      featured: true,
      description:
        "Two weeks of focused design or engineering to unblock a team, design a key flow, or prototype a risky interaction.",
      features: [
        "Single high-priority feature or flow",
        "Working React prototype or Figma source",
        "Two iterations with video walkthroughs",
        "Async communication in Slack",
      ],
      ctaText: "Book a sprint",
      ctaHref: "/v2/contact?plan=sprint",
    },
    {
      name: "Build",
      price: "From €18,000",
      featured: false,
      description:
        "End-to-end design and front-end build for a new product, major feature, or complete design system overhaul.",
      features: [
        "Complete UX flows and UI architecture",
        "Production-ready React / Tailwind code",
        "Full edge cases and empty states",
        "Weekly syncs and embedded Slack access",
      ],
      ctaText: "Start a project",
      ctaHref: "/v2/contact?plan=build",
    },
    {
      name: "Retainer",
      price: "From €6,500 / mo",
      featured: false,
      description:
        "Ongoing design engineering partnership for growing products that need senior design execution without full-time headcount.",
      features: [
        "20 hours / week dedicated design engineering",
        "Direct access for founders and engineers",
        "Zero ramp-up time",
        "Pause or cancel with 30 days notice",
      ],
      ctaText: "Apply for retainer",
      ctaHref: "/v2/contact?plan=retainer",
    },
  ]

  return (
    <section className="px-6 max-w-6xl mx-auto mb-28">
      <div className="max-w-2xl mb-12">
        <h2 className="font-serif text-3xl sm:text-4xl text-[#141413] tracking-tight">
          Three ways to <span className="italic">work together</span>
        </h2>
        <p className="text-xs sm:text-sm text-[#141413]/60 mt-2 leading-relaxed">
          Choose the engagement model that fits where your product is right now. Every project is led and built by me.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {models.map((model) => (
          <div
            key={model.name}
            className={`p-7 flex flex-col justify-between transition-all duration-300 ${
              model.featured
                ? "bg-[#141413] text-[#FAFAF8] shadow-xl border border-[#141413]"
                : "bg-white text-[#141413] border border-[rgba(20,20,19,0.08)] shadow-2xs hover:border-[rgba(20,20,19,0.18)]"
            }`}
          >
            <div>
              <div className="flex items-baseline justify-between mb-4">
                <span className="font-serif text-xl font-medium">{model.name}</span>
                <span className="font-mono text-xs opacity-75">{model.price}</span>
              </div>

              <p
                className={`text-xs leading-relaxed mb-6 ${
                  model.featured ? "text-[#FAFAF8]/75" : "text-[#141413]/70"
                }`}
              >
                {model.description}
              </p>

              <div className="space-y-2.5 mb-8 border-t pt-5 border-current/10">
                {model.features.map((feat) => (
                  <div key={feat} className="flex items-start gap-2 text-xs">
                    <Check
                      className={`w-3.5 h-3.5 shrink-0 mt-0.5 ${
                        model.featured ? "text-[#7FD49B]" : "text-[#1F9A55]"
                      }`}
                    />
                    <span className="leading-snug opacity-90">{feat}</span>
                  </div>
                ))}
              </div>
            </div>

            <Link
              href={model.ctaHref}
              className={`w-full py-2.5 px-4 text-xs font-medium flex items-center justify-center gap-2 transition-all ${
                model.featured
                  ? "bg-[#FAFAF8] text-[#141413] hover:bg-[#FAFAF8]/90"
                  : "bg-[#141413] text-[#FAFAF8] hover:bg-[#141413]/85"
              }`}
            >
              <span>{model.ctaText}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        ))}
      </div>

      <div className="bg-white border border-[rgba(20,20,19,0.08)] p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-2">
          <span className="font-mono text-[10px] uppercase text-[#141413]/40 tracking-wider">
            Current Status
          </span>
          <span className="w-1.5 h-1.5 bg-[#1F9A55] animate-pulse" />
        </div>
        <div className="flex flex-wrap gap-x-6 gap-y-2 font-mono text-[11px] text-[#141413]/70">
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 bg-[#1F9A55]" />
            Sprint: 1 slot in Nov
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 bg-[#F2C230]" />
            Build: Open for Jan 2027
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 bg-[#C8553D]" />
            Retainer: Fully booked
          </span>
        </div>
      </div>
    </section>
  )
}
