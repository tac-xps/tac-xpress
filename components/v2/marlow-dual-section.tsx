"use client"

import * as React from "react"
import Link from "next/link"
import { ArrowUpRight, ArrowRight } from "lucide-react"

export function MarlowDualSection() {
  const essays = [
    {
      title: "Forms that remember",
      date: "12 Jul 2025",
      description:
        "Why browser autofill fails on modern SPAs and how to fix it with semantic autocomplete tokens and deterministic focus traps.",
    },
    {
      title: "Undo is a design decision",
      date: "04 Mar 2025",
      description:
        "Why dialogs asking 'Are you sure?' are lazy design, and how optimistic UI with ephemeral undo makes safety effortless.",
    },
    {
      title: "Design tokens without the theatre",
      date: "19 Dec 2024",
      description:
        "Cut 80% of your multi-tiered token taxonomy. A tiny, reliable token system for fast shipping without Figma-to-code drift.",
    },
  ]

  const experiences = [
    {
      period: "2024 — now",
      role: "Design Engineer",
      company: "Helyard",
      details: "Design system and the scheduling product. Leading frontend architecture in React and Tailwind.",
    },
    {
      period: "2021 — 2024",
      role: "Lead Product Designer",
      company: "Tidewater",
      details: "Mobile banking for 1.2M members. Shipped core accounts, cards, and daily financial wellness tools.",
    },
    {
      period: "2019 — 2021",
      role: "Designer",
      company: "Linea Transit",
      details: "Wayfinding and passenger information systems across metropolitan transit hubs in Europe.",
    },
    {
      period: "2016 — 2019",
      role: "Freelance",
      company: "Brand & Web",
      details: "Identity, front-end code and typography systems for small studios, shops and early-stage tools.",
    },
  ]

  return (
    <section id="writing" className="px-6 max-w-6xl mx-auto mb-28">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
        <div>
          <div className="flex items-baseline justify-between mb-8 pb-3 border-b border-[rgba(20,20,19,0.08)]">
            <h2 className="font-serif text-2xl text-[#141413] tracking-tight">Writing</h2>
            <span className="text-[11px] font-mono text-[#141413]/50">All essays</span>
          </div>

          <div className="space-y-6">
            {essays.map((essay) => (
              <article
                key={essay.title}
                className="group cursor-pointer p-4 -mx-4 hover:bg-white hover:shadow-2xs transition-all border border-transparent hover:border-[rgba(20,20,19,0.06)]"
              >
                <div className="flex items-baseline justify-between mb-1.5">
                  <h3 className="font-serif text-lg font-medium text-[#141413] group-hover:text-[#2F6FE4] transition-colors flex items-center gap-1.5">
                    <span>{essay.title}</span>
                    <ArrowUpRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </h3>
                  <span className="font-mono text-[10px] text-[#141413]/40">{essay.date}</span>
                </div>
                <p className="text-xs text-[#141413]/65 leading-relaxed">{essay.description}</p>
              </article>
            ))}
          </div>
        </div>

        <div>
          <div className="flex items-baseline justify-between mb-8 pb-3 border-b border-[rgba(20,20,19,0.08)]">
            <h2 className="font-serif text-2xl text-[#141413] tracking-tight">Experience</h2>
            <Link
              href="/v2/about"
              className="text-[11px] font-mono text-[#141413]/50 hover:text-[#141413] transition-colors"
            >
              Full background &rarr;
            </Link>
          </div>

          <div className="space-y-6">
            {experiences.map((exp) => (
              <div
                key={exp.company}
                className="p-4 -mx-4 hover:bg-white hover:shadow-2xs transition-all border border-transparent hover:border-[rgba(20,20,19,0.06)]"
              >
                <div className="flex items-baseline justify-between mb-1">
                  <div className="flex items-baseline gap-2">
                    <h3 className="font-serif text-base font-medium text-[#141413]">{exp.company}</h3>
                    <span className="text-xs text-[#141413]/60 font-sans">{exp.role}</span>
                  </div>
                  <span className="font-mono text-[10px] text-[#141413]/40">{exp.period}</span>
                </div>
                <p className="text-xs text-[#141413]/65 leading-relaxed">{exp.details}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
