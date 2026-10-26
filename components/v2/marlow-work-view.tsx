"use client"

import * as React from "react"
import { MarlowHeader } from "./marlow-header"
import { MarlowFooter } from "./marlow-footer"
import { ArrowUpRight, Grid, List, Sparkles } from "lucide-react"

interface Project {
  index: string
  id: string
  title: string
  category: "product" | "systems" | "brand"
  categoryLabel: string
  year: string
  summary: string
  problem: string
  outcome: string
  bg: string
  textColor?: string
}

export function MarlowWorkView() {
  const [filter, setFilter] = React.useState<"all" | "product" | "systems" | "brand">("all")
  const [viewMode, setViewMode] = React.useState<"index" | "grid">("index")
  const [selectedProject, setSelectedProject] = React.useState<Project | null>(null)

  const projects: Project[] = [
    {
      index: "01",
      id: "tidewater",
      title: "Tidewater",
      category: "product",
      categoryLabel: "Product design, Research",
      year: "2024",
      summary: "Mobile banking for 1.2M members who check their money on the way to work.",
      problem: "Traditional banking apps were cluttered with 40+ navigation tabs and hidden transaction fees.",
      outcome: "Streamlined into 3 primary flows. Support calls fell 34% within the first month.",
      bg: "bg-[#173322]",
      textColor: "text-[#FAFAF8]",
    },
    {
      index: "02",
      id: "fieldnotes",
      title: "Fieldnotes",
      category: "product",
      categoryLabel: "Design engineering, Desktop app",
      year: "2025",
      summary: "A markdown editor for researchers that never touches the network without permission.",
      problem: "Cloud-locked note taking apps leak sensitive research data and create sync conflicts.",
      outcome: "Built an offline-first desktop environment with native local audio annotation and instantaneous search.",
      bg: "bg-[#EFECE4]",
    },
    {
      index: "03",
      id: "linea",
      title: "Linea",
      category: "brand",
      categoryLabel: "Wayfinding, Information design",
      year: "2021",
      summary: "Wayfinding and passenger information systems across metropolitan transit hubs in Europe.",
      problem: "Complex multi-modal interchanges caused navigation bottlenecks for international travelers.",
      outcome: "Redesigned bilingual typographic signage and high-contrast digital departure timetables.",
      bg: "bg-[#C9D8E4]",
    },
    {
      index: "04",
      id: "ridgeline",
      title: "Ridgeline",
      category: "product",
      categoryLabel: "Product design, Maps",
      year: "2020",
      summary: "Offline topographic routing and route calculation for backcountry navigation.",
      problem: "Cellular dropouts left hikers stranded without altitude profile and terrain difficulty updates.",
      outcome: "Designed vector-tile offline storage with low-power screen rendering.",
      bg: "bg-[#EED9B0]",
    },
    {
      index: "05",
      id: "kiln",
      title: "Kiln & Co",
      category: "brand",
      categoryLabel: "Identity, E-commerce",
      year: "2023",
      summary: "Artisanal ceramic studio branding and high-touch bespoke online storefront.",
      problem: "Generic Shopify templates failed to communicate the tactile texture of handcrafted ceramics.",
      outcome: "Created a tactile typographic identity and single-batch checkout experience.",
      bg: "bg-[#E9E4D8]",
    },
    {
      index: "06",
      id: "cargo",
      title: "Cargo UI",
      category: "systems",
      categoryLabel: "Design systems, Data tables",
      year: "2023",
      summary: "High-density enterprise data table primitives and design tokens for logistics.",
      problem: "Inconsistent table implementations caused performance lag on 10,000-row freight manifests.",
      outcome: "Engineered headless virtualized data-grids with keyboard navigation and zero layout shift.",
      bg: "bg-[#FAFAF8]",
    },
  ]

  const filteredProjects = projects.filter((p) => {
    if (filter === "all") return true
    return p.category === filter
  })

  return (
    <div className="marlow-theme">
      <MarlowHeader />

      <main className="pt-16 pb-24 px-6 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start mb-16 pb-12 border-b border-[rgba(20,20,19,0.08)]">
          <h1 className="font-serif text-6xl sm:text-7xl md:text-8xl font-normal text-[#141413] tracking-tight leading-none">
            Work
          </h1>
          <p className="text-sm sm:text-base text-[#141413]/70 leading-relaxed font-normal md:pt-4">
            Products, systems and identities from the last eight years. Each one has the problem, what we tried, and what changed after it shipped.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-10 pb-4 border-b border-[rgba(20,20,19,0.06)]">
          <div className="flex flex-wrap items-center gap-2">
            {[
              { id: "all", label: "All 6" },
              { id: "product", label: "Product 3" },
              { id: "systems", label: "Systems 1" },
              { id: "brand", label: "Brand 2" },
            ].map((f) => (
              <button
                key={f.id}
                type="button"
                onClick={() => setFilter(f.id as typeof filter)}
                className={`px-3 py-1 rounded-none text-xs font-medium transition-all ${
                  filter === f.id
                    ? "bg-[#141413] text-[#FAFAF8]"
                    : "bg-white border border-[rgba(20,20,19,0.08)] text-[#141413]/70 hover:text-[#141413]"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-1 p-0.5 rounded-none bg-white border border-[rgba(20,20,19,0.08)] text-xs">
            <button
              type="button"
              onClick={() => setViewMode("index")}
              className={`px-3 py-1 rounded-none flex items-center gap-1.5 transition-colors ${
                viewMode === "index"
                  ? "bg-[#141413] text-[#FAFAF8] font-medium"
                  : "text-[#141413]/60 hover:text-[#141413]"
              }`}
            >
              <List className="w-3 h-3" />
              <span>Index</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode("grid")}
              className={`px-3 py-1 rounded-none flex items-center gap-1.5 transition-colors ${
                viewMode === "grid"
                  ? "bg-[#141413] text-[#FAFAF8] font-medium"
                  : "text-[#141413]/60 hover:text-[#141413]"
              }`}
            >
              <Grid className="w-3 h-3" />
              <span>Grid</span>
            </button>
          </div>
        </div>

        {viewMode === "index" ? (
          <div className="divide-y divide-[rgba(20,20,19,0.08)] mb-20">
            {filteredProjects.map((proj) => (
              <div
                key={proj.id}
                onClick={() => setSelectedProject(proj)}
                className="group py-6 flex flex-col md:flex-row md:items-center justify-between gap-4 cursor-pointer hover:bg-white/40 px-4 -mx-4 rounded-none transition-all"
              >
                <div className="flex items-baseline gap-6 sm:gap-12">
                  <span className="font-mono text-xs text-[#141413]/40 tracking-wider">
                    {proj.index}
                  </span>
                  <h3 className="font-serif text-3xl sm:text-4xl md:text-5xl font-normal text-[#141413] group-hover:text-[#2F6FE4] transition-colors">
                    {proj.title}
                  </h3>
                </div>

                <div className="flex items-center justify-between md:justify-end gap-6 sm:gap-12 pl-10 md:pl-0">
                  <span className="text-xs text-[#141413]/60 font-medium">
                    {proj.categoryLabel}
                  </span>
                  <span className="font-mono text-xs text-[#141413]/40">
                    {proj.year}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-20">
            {filteredProjects.map((proj) => (
              <div
                key={proj.id}
                onClick={() => setSelectedProject(proj)}
                className="group cursor-pointer rounded-none p-6 bg-white border border-[rgba(20,20,19,0.08)] hover:shadow-lg transition-all flex flex-col justify-between h-[360px]"
              >
                <div>
                  <div className="flex items-center justify-between text-xs font-mono text-[#141413]/40 mb-4">
                    <span>{proj.index}</span>
                    <span>{proj.year}</span>
                  </div>
                  <h3 className="font-serif text-2xl font-normal text-[#141413] group-hover:text-[#2F6FE4] transition-colors mb-2">
                    {proj.title}
                  </h3>
                  <p className="text-[11px] font-medium text-[#141413]/50 mb-4">
                    {proj.categoryLabel}
                  </p>
                  <p className="text-xs text-[#141413]/70 leading-relaxed">
                    {proj.summary}
                  </p>
                </div>

                <div className="pt-4 border-t border-[rgba(20,20,19,0.06)] flex items-center justify-between text-xs font-medium text-[#141413]">
                  <span>Explore case study</span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-[#141413]/40 group-hover:text-[#141413] transition-colors" />
                </div>
              </div>
            ))}
          </div>
        )}

        {selectedProject && (
          <div
            role="dialog"
            aria-modal="true"
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
            onClick={() => setSelectedProject(null)}
          >
            <div
              className="w-full max-w-2xl bg-[#FAFAF8] rounded-none shadow-2xl border border-[rgba(20,20,19,0.12)] p-8 text-[#141413] animate-in fade-in zoom-in-95"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-baseline justify-between mb-4 border-b border-[rgba(20,20,19,0.08)] pb-4">
                <div>
                  <span className="font-mono text-xs text-[#141413]/40 mr-3">
                    {selectedProject.index}
                  </span>
                  <h2 className="font-serif text-3xl font-normal inline text-[#141413]">
                    {selectedProject.title}
                  </h2>
                </div>
                <span className="font-mono text-xs text-[#141413]/50">
                  {selectedProject.year}
                </span>
              </div>

              <p className="text-xs font-medium text-[#141413]/60 mb-6 font-mono">
                {selectedProject.categoryLabel}
              </p>

              <div className="space-y-6 text-xs text-[#141413]/80 leading-relaxed mb-8">
                <div>
                  <h4 className="font-mono text-[11px] uppercase tracking-wider text-[#141413]/40 mb-1">
                    The Problem
                  </h4>
                  <p>{selectedProject.problem}</p>
                </div>
                <div>
                  <h4 className="font-mono text-[11px] uppercase tracking-wider text-[#141413]/40 mb-1">
                    The Outcome
                  </h4>
                  <p>{selectedProject.outcome}</p>
                </div>
                <div>
                  <h4 className="font-mono text-[11px] uppercase tracking-wider text-[#141413]/40 mb-1">
                    Design System Discipline
                  </h4>
                  <p>{selectedProject.summary}</p>
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setSelectedProject(null)}
                  className="px-5 py-2 rounded-none bg-[#141413] text-[#FAFAF8] text-xs font-medium hover:bg-[#141413]/85 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      <MarlowFooter />
    </div>
  )
}
