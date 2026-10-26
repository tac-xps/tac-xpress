"use client"

import * as React from "react"
import { Star } from "lucide-react"

type FilterCategory = "all" | "engineering" | "founders" | "design"

interface TestimonialItem {
  id: string
  company: string
  category: "engineering" | "founders" | "design"
  iconColor: string
  iconBg: string
  iconSvg: React.ReactNode
  platformTag?: string
  quote?: string
  highlightText?: string
  metricValue?: string
  metricSubtext?: string
  chartType?: "lumen" | "fieldnote"
  author: {
    name: string
    role: string
    avatarInitials: string
    avatarBg: string
  }
  colSpan?: string
}

const TESTIMONIALS: TestimonialItem[] = [
  {
    id: "northwind",
    company: "Northwind",
    category: "engineering",
    iconColor: "#2F6BFF",
    iconBg: "rgba(47, 107, 255, 0.1)",
    iconSvg: (
      <svg viewBox="0 0 16 16" className="size-3.5 fill-[#2F6BFF]">
        <path d="M8 2 L14 13 L8 10 L2 13 Z" />
      </svg>
    ),
    platformTag: "G2 · Sep 2026",
    quote:
      "We deleted four thousand lines of homegrown UI in a week. What replaced it is code our team actually reads, changes and owns.",
    highlightText: "code our team actually reads, changes and owns.",
    author: {
      name: "Maya Okafor",
      role: "Staff Engineer, Northwind",
      avatarInitials: "MO",
      avatarBg: "bg-blue-100 text-blue-800 dark:bg-blue-900/60 dark:text-blue-200",
    },
    colSpan: "md:col-span-2",
  },
  {
    id: "lumen",
    company: "Lumen",
    category: "founders",
    iconColor: "#DC2626",
    iconBg: "rgba(220, 38, 38, 0.1)",
    iconSvg: (
      <svg viewBox="0 0 16 16" className="size-3.5 stroke-[#DC2626] fill-none stroke-2">
        <circle cx="8" cy="8" r="6" />
        <circle cx="8" cy="8" r="2" fill="#DC2626" />
      </svg>
    ),
    metricValue: "4 days",
    metricSubtext: "from first commit to a public launch",
    chartType: "lumen",
    author: {
      name: "Theo Laurent",
      role: "Founder, Lumen",
      avatarInitials: "TL",
      avatarBg: "bg-red-100 text-red-800 dark:bg-red-900/60 dark:text-red-200",
    },
    colSpan: "md:col-span-1",
  },
  {
    id: "halcyon",
    company: "Halcyon",
    category: "design",
    iconColor: "#16A34A",
    iconBg: "rgba(22, 163, 74, 0.1)",
    iconSvg: (
      <svg viewBox="0 0 16 16" className="size-3.5 fill-[#16A34A]">
        <circle cx="8" cy="8" r="5.5" />
      </svg>
    ),
    platformTag: "Product Hunt · Oct 2026",
    quote:
      "Spacing, motion and focus states finally match the design file, so review is about the product again instead of pixels.",
    highlightText: "review is about the product again",
    author: {
      name: "Iris Novak",
      role: "Design Lead, Halcyon",
      avatarInitials: "IN",
      avatarBg: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-200",
    },
    colSpan: "md:col-span-1",
  },
  {
    id: "parcel",
    company: "Parcel",
    category: "engineering",
    iconColor: "#EA580C",
    iconBg: "rgba(234, 88, 12, 0.1)",
    iconSvg: (
      <svg viewBox="0 0 16 16" className="size-3.5 fill-[#EA580C]">
        <rect x="3" y="3" width="10" height="10" rx="2" />
      </svg>
    ),
    platformTag: "G2 · Aug 2026",
    quote:
      "Our accessibility audit came back with two notes. The year before it was forty.",
    highlightText: "two notes.",
    author: {
      name: "Sam Whitfield",
      role: "Frontend Lead, Parcel",
      avatarInitials: "SW",
      avatarBg: "bg-orange-100 text-orange-800 dark:bg-orange-900/60 dark:text-orange-200",
    },
    colSpan: "md:col-span-1",
  },
  {
    id: "fieldnote",
    company: "Fieldnote",
    category: "engineering",
    iconColor: "#7C5CFF",
    iconBg: "rgba(124, 92, 255, 0.1)",
    iconSvg: (
      <svg viewBox="0 0 16 16" className="size-3.5 fill-[#7C5CFF]">
        <rect x="2.5" y="2.5" width="11" height="11" rx="1.5" />
      </svg>
    ),
    metricValue: "-38%",
    metricSubtext: "JavaScript shipped on the marketing site",
    chartType: "fieldnote",
    author: {
      name: "Priya Raman",
      role: "Performance Engineer, Fieldnote",
      avatarInitials: "PR",
      avatarBg: "bg-purple-100 text-purple-800 dark:bg-purple-900/60 dark:text-purple-200",
    },
    colSpan: "md:col-span-1",
  },
  {
    id: "arcadia",
    company: "Arcadia",
    category: "founders",
    iconColor: "#0D9488",
    iconBg: "rgba(13, 148, 136, 0.1)",
    iconSvg: (
      <svg viewBox="0 0 16 16" className="size-3.5 stroke-[#0D9488] fill-none stroke-2">
        <path d="M3 13 C3 7 13 7 13 13" />
      </svg>
    ),
    platformTag: "Capterra · Sep 2026",
    quote:
      "It paid for itself in the first sprint. We hired one fewer contractor this quarter.",
    highlightText: "in the first sprint.",
    author: {
      name: "Jonas Berg",
      role: "CEO, Arcadia",
      avatarInitials: "JB",
      avatarBg: "bg-teal-100 text-teal-800 dark:bg-teal-900/60 dark:text-teal-200",
    },
    colSpan: "md:col-span-1",
  },
  {
    id: "mosaic",
    company: "Mosaic",
    category: "design",
    iconColor: "#DB2777",
    iconBg: "rgba(219, 39, 119, 0.1)",
    iconSvg: (
      <svg viewBox="0 0 16 16" className="size-3.5 fill-[#DB2777]">
        <rect x="3" y="3" width="4" height="4" />
        <rect x="9" y="3" width="4" height="4" />
        <rect x="3" y="9" width="4" height="4" />
        <rect x="9" y="9" width="4" height="4" />
      </svg>
    ),
    platformTag: "G2 · Oct 2026",
    quote:
      "Every component handles reduced motion and dark mode, which used to be the last week of every project.",
    highlightText: "used to be the last week of every project.",
    author: {
      name: "Léa Fontaine",
      role: "Product Designer, Mosaic",
      avatarInitials: "LF",
      avatarBg: "bg-pink-100 text-pink-800 dark:bg-pink-900/60 dark:text-pink-200",
    },
    colSpan: "md:col-span-1",
  },
  {
    id: "tandem",
    company: "Tandem",
    category: "engineering",
    iconColor: "#0284C7",
    iconBg: "rgba(2, 132, 199, 0.1)",
    iconSvg: (
      <svg viewBox="0 0 16 16" className="size-3.5 stroke-[#0284C7] fill-none stroke-2">
        <circle cx="5" cy="8" r="3" />
        <circle cx="11" cy="8" r="3" />
      </svg>
    ),
    platformTag: "Product Hunt · Sep 2026",
    quote:
      "The source is plain React and Tailwind. When we needed a variant, we just wrote it.",
    highlightText: "we just wrote it.",
    author: {
      name: "Ravi Shah",
      role: "Engineer, Tandem",
      avatarInitials: "RS",
      avatarBg: "bg-sky-100 text-sky-800 dark:bg-sky-900/60 dark:text-sky-200",
    },
    colSpan: "md:col-span-1",
  },
]

export function MarlowFieldnotes() {
  const [activeFilter, setActiveFilter] = React.useState<FilterCategory>("all")

  const filteredTestimonials = React.useMemo(() => {
    if (activeFilter === "all") return TESTIMONIALS
    return TESTIMONIALS.filter((t) => t.category === activeFilter)
  }, [activeFilter])

  return (
    <section
      aria-label="Fieldnotes Testimonials"
      className="relative isolate w-full bg-white text-neutral-950 dark:bg-neutral-950 dark:text-neutral-50 py-20 sm:py-28 px-6 sm:px-10 overflow-hidden"
    >
      <div className="mx-auto max-w-5xl">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-10 sm:pb-14">
          <div>
            <h2 className="text-3xl sm:text-4xl lg:text-[44px] font-medium tracking-tight text-neutral-950 dark:text-neutral-50 leading-[1.1]">
              Teams that switched,
              <br />
              in their own words
            </h2>

            <div className="mt-4 flex flex-wrap items-center gap-3">
              <div className="flex -space-x-1.5 overflow-hidden">
                <span className="inline-block size-6 rounded-none bg-neutral-200 dark:bg-neutral-700 text-[10px] font-medium text-neutral-700 dark:text-neutral-200 ring-2 ring-white dark:ring-neutral-950 flex items-center justify-center font-mono">
                  MO
                </span>
                <span className="inline-block size-6 rounded-none bg-neutral-300 dark:bg-neutral-600 text-[10px] font-medium text-neutral-700 dark:text-neutral-200 ring-2 ring-white dark:ring-neutral-950 flex items-center justify-center font-mono">
                  TL
                </span>
                <span className="inline-block size-6 rounded-none bg-neutral-200 dark:bg-neutral-700 text-[10px] font-medium text-neutral-700 dark:text-neutral-200 ring-2 ring-white dark:ring-neutral-950 flex items-center justify-center font-mono">
                  IN
                </span>
                <span className="inline-block size-6 rounded-none bg-neutral-300 dark:bg-neutral-600 text-[10px] font-medium text-neutral-700 dark:text-neutral-200 ring-2 ring-white dark:ring-neutral-950 flex items-center justify-center font-mono">
                  SW
                </span>
                <span className="inline-block size-6 rounded-none bg-neutral-200 dark:bg-neutral-700 text-[10px] font-medium text-neutral-700 dark:text-neutral-200 ring-2 ring-white dark:ring-neutral-950 flex items-center justify-center font-mono">
                  PR
                </span>
              </div>

              <div className="flex items-center gap-1.5">
                <div className="flex items-center text-amber-500">
                  <Star className="size-3.5 fill-current" />
                  <Star className="size-3.5 fill-current" />
                  <Star className="size-3.5 fill-current" />
                  <Star className="size-3.5 fill-current" />
                  <Star className="size-3.5 fill-current" />
                </div>
                <span className="font-semibold text-xs text-neutral-950 dark:text-white tabular-nums">
                  4.9
                </span>
                <span className="text-xs text-neutral-500 dark:text-neutral-400">
                  from 1,204 reviews
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
            <button
              type="button"
              onClick={() => setActiveFilter("all")}
              className={`rounded-none px-3 py-1.5 text-xs font-medium transition-colors cursor-pointer ${
                activeFilter === "all"
                  ? "bg-neutral-950 text-white dark:bg-white dark:text-neutral-950 shadow-xs"
                  : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-700"
              }`}
            >
              All 8
            </button>
            <button
              type="button"
              onClick={() => setActiveFilter("engineering")}
              className={`rounded-none px-3 py-1.5 text-xs font-medium transition-colors cursor-pointer ${
                activeFilter === "engineering"
                  ? "bg-neutral-950 text-white dark:bg-white dark:text-neutral-950 shadow-xs"
                  : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-700"
              }`}
            >
              Engineering 4
            </button>
            <button
              type="button"
              onClick={() => setActiveFilter("founders")}
              className={`rounded-none px-3 py-1.5 text-xs font-medium transition-colors cursor-pointer ${
                activeFilter === "founders"
                  ? "bg-neutral-950 text-white dark:bg-white dark:text-neutral-950 shadow-xs"
                  : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-700"
              }`}
            >
              Founders 2
            </button>
            <button
              type="button"
              onClick={() => setActiveFilter("design")}
              className={`rounded-none px-3 py-1.5 text-xs font-medium transition-colors cursor-pointer ${
                activeFilter === "design"
                  ? "bg-neutral-950 text-white dark:bg-white dark:text-neutral-950 shadow-xs"
                  : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-700"
              }`}
            >
              Design 2
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5">
          {filteredTestimonials.map((item) => {
            const isSpanned = activeFilter === "all" && item.colSpan === "md:col-span-2"

            return (
              <div
                key={item.id}
                className={`group flex flex-col justify-between rounded-none border border-black/10 dark:border-white/10 bg-neutral-50/70 dark:bg-neutral-900/60 p-5 sm:p-6 shadow-xs hover:border-black/20 dark:hover:border-white/20 transition-all ${
                  isSpanned ? "md:col-span-2" : "md:col-span-1"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-4">
                    <div className="flex items-center gap-2">
                      <div
                        className="size-5 rounded-none flex items-center justify-center"
                        style={{ backgroundColor: item.iconBg }}
                      >
                        {item.iconSvg}
                      </div>
                      <span className="text-xs font-medium text-neutral-900 dark:text-neutral-100">
                        {item.company}
                      </span>
                    </div>

                    {item.platformTag && (
                      <span className="font-mono text-[10px] text-neutral-400 dark:text-neutral-500">
                        {item.platformTag}
                      </span>
                    )}
                  </div>

                  {item.quote && (
                    <p
                      className={`text-neutral-800 dark:text-neutral-200 leading-relaxed ${
                        isSpanned
                          ? "text-base sm:text-lg font-normal tracking-tight"
                          : "text-xs sm:text-[13px] font-normal"
                      }`}
                    >
                      {item.highlightText ? (
                        <>
                          {item.quote.split(item.highlightText)[0]}
                          <span
                           className="rounded-none px-1 py-0.5 font-medium transition-colors"
                            style={{
                              backgroundColor: item.iconBg,
                              color: item.iconColor,
                            }}
                          >
                            {item.highlightText}
                          </span>
                          {item.quote.split(item.highlightText)[1]}
                        </>
                      ) : (
                        item.quote
                      )}
                    </p>
                  )}

                  {item.chartType === "lumen" && (
                    <div className="py-2">
                      <div className="text-3xl sm:text-4xl font-semibold tracking-tight text-neutral-950 dark:text-white tabular-nums">
                        {item.metricValue}
                      </div>
                      <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
                        {item.metricSubtext}
                      </p>

                      <div className="mt-5 flex items-end gap-1.5 h-12">
                        <div className="w-1/5 h-3/6 rounded-none bg-neutral-200 dark:bg-neutral-800" />
                        <div className="w-1/5 h-4/6 rounded-none bg-neutral-200 dark:bg-neutral-800" />
                        <div className="w-1/5 h-5/6 rounded-none bg-neutral-200 dark:bg-neutral-800" />
                        <div className="w-1/5 h-3/6 rounded-none bg-neutral-200 dark:bg-neutral-800" />
                        <div className="w-1/5 h-full rounded-none bg-[#DC2626]" />
                      </div>
                      <div className="mt-1.5 flex justify-between font-mono text-[9px] text-neutral-400">
                        <span>First site</span>
                        <span>Latest</span>
                      </div>
                    </div>
                  )}

                  {item.chartType === "fieldnote" && (
                    <div className="py-2">
                      <div className="text-3xl sm:text-4xl font-semibold tracking-tight text-neutral-950 dark:text-white tabular-nums">
                        {item.metricValue}
                      </div>
                      <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
                        {item.metricSubtext}
                      </p>

                      <div className="mt-5 flex items-end gap-1.5 h-12">
                        <div className="w-1/5 h-5/6 rounded-none bg-neutral-200 dark:bg-neutral-800" />
                        <div className="w-1/5 h-4/6 rounded-none bg-neutral-200 dark:bg-neutral-800" />
                        <div className="w-1/5 h-3/6 rounded-none bg-[#7C5CFF]/80" />
                        <div className="w-1/5 h-2/6 rounded-none bg-[#7C5CFF]" />
                        <div className="w-1/5 h-2/6 rounded-none bg-[#7C5CFF]" />
                      </div>
                      <div className="mt-1.5 flex justify-between font-mono text-[9px] text-neutral-400">
                        <span>Mar</span>
                        <span>Sep</span>
                      </div>
                    </div>
                  )}
                </div>

                <div className="mt-6 flex items-center gap-2.5 pt-3 border-t border-black/5 dark:border-white/5">
                  <div
                    className={`size-7 rounded-none flex items-center justify-center text-[10px] font-mono font-medium ${item.author.avatarBg}`}
                  >
                    {item.author.avatarInitials}
                  </div>
                  <div>
                    <p className="text-xs font-medium text-neutral-900 dark:text-neutral-100">
                      {item.author.name}
                    </p>
                    <p className="text-[11px] text-neutral-500 dark:text-neutral-400">
                      {item.author.role}
                    </p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
