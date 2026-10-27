"use client"

import * as React from "react"

export function MarlowQuote() {
  const tags = [
    "Product Redesign",
    "Fintech",
    "1.2M Users",
    "Mobile",
    "Web",
    "Figma",
  ]

  return (
    <section className="px-6 max-w-6xl mx-auto mb-28">
      <div className="border-t border-b border-[rgba(20,20,19,0.08)] py-16">
        <div className="max-w-3xl">
          <blockquote className="font-serif text-2xl sm:text-3xl md:text-4xl text-[#141413] font-normal leading-[1.25] tracking-tight mb-8">
            &ldquo;Ines found the three things our members actually needed and had the courage to hide the other thirty-eight. Support calls fell in the first month.&rdquo;
          </blockquote>

          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-[#141413] text-[#FAFAF8] flex items-center justify-center font-mono text-xs font-semibold shadow-2xs">
              BM
            </div>
            <div>
              <p className="text-xs font-semibold text-[#141413] leading-snug">Ben Miller</p>
              <p className="text-[11px] text-[#141413]/55">Head of Product, Tidewater</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {tags.map((tag, idx) => (
              <span
                key={tag}
                className={`px-3 py-1 text-[11px] font-medium transition-colors ${
                  idx === 0
                    ? "bg-[#141413] text-[#FAFAF8]"
                    : "bg-white border border-[rgba(20,20,19,0.1)] text-[#141413]/70 hover:text-[#141413]"
                }`}
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
