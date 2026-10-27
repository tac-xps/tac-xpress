"use client"

import * as React from "react"

export function MarlowClients() {
  const clients = [
    { name: "Helyard", role: "Design Systems & Scheduling", year: "2024" },
    { name: "Tidewater", role: "Mobile Banking (1.2M)", year: "2024" },
    { name: "Linea Transit", role: "Passenger Information", year: "2021" },
    { name: "Ridgeline", role: "Mapping Platform", year: "2020" },
    { name: "Kiln & Co", role: "E-Commerce Identity", year: "2023" },
    { name: "RoughNotion", role: "Desktop App", year: "2023" },
    { name: "Cargo UI", role: "Enterprise Table Primitives", year: "2023" },
    { name: "Site Crafts", role: "Creative Web Studio", year: "2022" },
  ]

  return (
    <section className="px-6 max-w-6xl mx-auto mb-28">
      <div className="border-t border-b border-[rgba(20,20,19,0.08)] py-8">
        <p className="text-[11px] font-mono uppercase tracking-widest text-[#141413]/50 mb-6">
          Recent teams and open source tools
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-y-6 gap-x-8 items-center">
          {clients.map((c) => (
            <div
              key={c.name}
              className="group flex flex-col cursor-default transition-all"
            >
              <span className="font-serif text-lg sm:text-xl text-[#141413]/85 group-hover:text-[#141413] transition-colors">
                {c.name}
              </span>
              <span className="text-[10px] text-[#141413]/40 font-mono tracking-tight mt-0.5">
                {c.role}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
