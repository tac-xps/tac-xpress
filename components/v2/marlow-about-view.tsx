"use client"

import * as React from "react"
import { MarlowHeader } from "./marlow-header"
import { MarlowFooter } from "./marlow-footer"

export function MarlowAboutView() {
  const howIWork = [
    {
      num: "01",
      title: "Answer it in the medium",
      desc: "If the question is about timing, data or touch, I build it. A picture of a drag interaction settles nothing.",
    },
    {
      num: "02",
      title: "Undo beats asking",
      desc: "People have already decided by the time a dialog asks them. Act at once, then make it easy to take back.",
    },
    {
      num: "03",
      title: "Write the edge cases down",
      desc: "Empty, loading, error and the 4,000-row case ship with every screen, so engineering never has to guess.",
    },
  ]

  const capabilities = [
    {
      title: "Product design",
      desc: "Research, flows and high-fidelity screens for web and mobile products, handed off with the edge cases written down.",
    },
    {
      title: "Design engineering",
      desc: "Production React components, motion and prototypes that answer the question a static mock cannot.",
    },
    {
      title: "Design systems",
      desc: "Tokens, components and documentation owed to the team that has to maintain them.",
    },
  ]

  const experienceList = [
    {
      period: "2024 — now",
      title: "Helyard, design engineer",
      detail: "Design system and the scheduling product.",
    },
    {
      period: "2021 — 2024",
      title: "Tidewater, lead product designer",
      detail: "Mobile banking for 1.2M members.",
    },
    {
      period: "2019 — 2021",
      title: "Linea Transit, designer",
      detail: "Wayfinding and passenger information.",
    },
    {
      period: "2016 — 2019",
      title: "Freelance, brand and web",
      detail: "Small studios, shops and restaurants.",
    },
  ]

  const tools = [
    "Figma",
    "React",
    "TypeScript",
    "Tailwind CSS",
    "Motion",
    "Origami",
    "Linear",
    "Notion",
  ]

  return (
    <div className="marlow-theme">
      <MarlowHeader />

      <main className="pt-16 pb-24 px-6 max-w-6xl mx-auto">
        <div className="mb-16">
          <h1 className="font-serif text-6xl sm:text-7xl md:text-8xl font-normal text-[#141413] tracking-tight leading-none mb-12">
            About
          </h1>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            <div className="lg:col-span-8 space-y-6 text-sm sm:text-base text-[#141413]/80 leading-relaxed font-normal">
              <p className="font-serif text-xl sm:text-2xl text-[#141413] leading-snug">
                I&apos;m Ines, a product designer and design engineer in Lisbon. I&apos;ve spent ten years on interfaces people use under some kind of pressure: paying rent, catching a tram, <span className="italic">handing over a hospital ward at 7am.</span>
              </p>

              <p>
                I work across the whole stretch from research to production code. I sketch in Figma, but I usually answer the hard questions in React, because that&apos;s where timing, data and real fingers show up.
              </p>

              <p>
                Outside work I throw pots badly, swim in cold water and keep a list of every good sign I&apos;ve seen on a train platform.
              </p>
            </div>

            <div className="lg:col-span-4 border-t lg:border-t-0 lg:border-l border-[rgba(20,20,19,0.08)] pt-6 lg:pt-0 lg:pl-8 space-y-6 text-xs">
              <div>
                <span className="font-mono text-[10px] uppercase text-[#141413]/40 tracking-wider block mb-1">
                  Now
                </span>
                <span className="font-medium text-[#141413]">Design engineer at Helyard</span>
              </div>

              <div>
                <span className="font-mono text-[10px] uppercase text-[#141413]/40 tracking-wider block mb-1">
                  Availability
                </span>
                <span className="font-medium text-[#141413]">Booking two projects for early 2027</span>
              </div>

              <div>
                <span className="font-mono text-[10px] uppercase text-[#141413]/40 tracking-wider block mb-1">
                  Email
                </span>
                <a
                  href="mailto:hello@inescalder.com"
                  className="font-mono text-[11px] text-[#2F6FE4] hover:underline"
                >
                  hello@inescalder.com
                </a>
              </div>
            </div>
          </div>
        </div>

        <section className="mb-20 pt-12 border-t border-[rgba(20,20,19,0.08)]">
          <p className="text-[11px] font-mono uppercase tracking-widest text-[#141413]/50 mb-8">
            How I work
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {howIWork.map((card) => (
              <div
                key={card.num}
                className="rounded-none p-7 bg-white border border-[rgba(20,20,19,0.08)] shadow-2xs flex flex-col justify-between"
              >
                <div>
                  <span className="font-mono text-xs text-[#141413]/40 block mb-4 italic">
                    {card.num}
                  </span>
                  <h3 className="font-serif text-xl font-normal text-[#141413] mb-3">
                    {card.title}
                  </h3>
                  <p className="text-xs text-[#141413]/70 leading-relaxed">{card.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-20 pt-12 border-t border-[rgba(20,20,19,0.08)]">
          <p className="text-[11px] font-mono uppercase tracking-widest text-[#141413]/50 mb-8">
            What I can help with
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-xs text-[#141413]/70 leading-relaxed">
            {capabilities.map((cap) => (
              <div key={cap.title} className="space-y-2">
                <h3 className="font-serif text-lg font-medium text-[#141413]">{cap.title}</h3>
                <p>{cap.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-24 pt-12 border-t border-[rgba(20,20,19,0.08)]">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            <div className="lg:col-span-8">
              <p className="text-[11px] font-mono uppercase tracking-widest text-[#141413]/50 mb-8">
                Experience
              </p>

              <div className="space-y-6">
                {experienceList.map((exp) => (
                  <div
                    key={exp.title}
                    className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1 sm:gap-6 pb-4 border-b border-[rgba(20,20,19,0.06)]"
                  >
                    <span className="font-mono text-xs text-[#141413]/40 shrink-0 w-28">
                      {exp.period}
                    </span>
                    <div className="flex-1">
                      <p className="text-xs font-semibold text-[#141413]">{exp.title}</p>
                      <p className="text-xs text-[#141413]/60">{exp.detail}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:col-span-4 lg:border-l border-[rgba(20,20,19,0.08)] lg:pl-8">
              <p className="text-[11px] font-mono uppercase tracking-widest text-[#141413]/50 mb-8">
                Tools
              </p>

              <div className="flex flex-wrap gap-2">
                {tools.map((tool) => (
                  <span
                    key={tool}
                    className="px-3 py-1 rounded-none bg-white border border-[rgba(20,20,19,0.1)] text-xs font-mono text-[#141413]/80"
                  >
                    {tool}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>

      <MarlowFooter />
    </div>
  )
}
