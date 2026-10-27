"use client"

import * as React from "react"
import Link from "next/link"
import { ArrowRight, RotateCcw, Check, Wifi, AlertCircle, BarChart3, Search, Sliders } from "lucide-react"

export function MarlowExperiments() {
  const [latency, setLatency] = React.useState(45)

  const [itemArchived, setItemArchived] = React.useState(false)
  const [undoCountdown, setUndoCountdown] = React.useState(5)

  React.useEffect(() => {
    let timer: NodeJS.Timeout
    if (itemArchived && undoCountdown > 0) {
      timer = setInterval(() => {
        setUndoCountdown((c) => c - 1)
      }, 1000)
    } else if (undoCountdown === 0) {
    }
    return () => clearInterval(timer)
  }, [itemArchived, undoCountdown])

  const triggerArchive = () => {
    setItemArchived(true)
    setUndoCountdown(5)
  }

  const cancelArchive = () => {
    setItemArchived(false)
    setUndoCountdown(5)
  }

  const [searchQuery, setSearchQuery] = React.useState("")
  const componentTags = ["dialog", "data-grid", "stepper", "popover", "kanban", "toast"]
  const filteredTags = componentTags.filter((t) => t.includes(searchQuery.toLowerCase()))

  const [hoveredBar, setHoveredBar] = React.useState<number | null>(null)
  const weeklyData = [
    { day: "Mon", amount: 18, height: 35 },
    { day: "Tue", amount: 42, height: 75 },
    { day: "Wed", amount: 28, height: 50 },
    { day: "Thu", amount: 64, height: 95 },
    { day: "Fri", amount: 32, height: 60 },
    { day: "Sat", amount: 12, height: 25 },
    { day: "Sun", amount: 8, height: 15 },
  ]

  const [tasks, setTasks] = React.useState([
    { id: 1, text: "Write the 4,000-row case down", completed: true },
    { id: 2, text: "APCA contrast verification", completed: true },
    { id: 3, text: "Zero layout shift on font swap", completed: false },
    { id: 4, text: "Keyboard navigation without mouse", completed: true },
  ])

  const toggleTask = (id: number) => {
    setTasks(tasks.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)))
  }

  const [activeTabPresence, setActiveTabPresence] = React.useState<"all" | "online">("online")

  return (
    <section className="px-6 max-w-6xl mx-auto mb-28">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
        <div>
          <h2 className="font-serif text-3xl sm:text-4xl text-[#141413] tracking-tight">
            Small things, <span className="italic">built properly</span>
          </h2>
          <p className="text-xs sm:text-sm text-[#141413]/60 max-w-xl mt-2 leading-relaxed">
            A selection of components, micro-interactions and design engineering experiments built in React and Tailwind.
          </p>
        </div>
        <Link
          href="/v2/work"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-[#141413] hover:opacity-75 transition-opacity"
        >
          <span>View all components</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white p-5 border border-[rgba(20,20,19,0.08)] shadow-2xs flex flex-col justify-between h-[230px]">
          <div>
            <div className="flex items-center justify-between text-[11px] font-mono text-[#141413]/50 mb-3">
              <span className="flex items-center gap-1.5">
                <Wifi className="w-3.5 h-3.5 text-[#2F6FE4]" />
                Latency Simulator
              </span>
              <span className={`font-medium ${latency > 400 ? "text-[#C8553D]" : "text-[#1F9A55]"}`}>
                {latency}ms RTT
              </span>
            </div>
            <p className="text-xs text-[#141413]/80 leading-relaxed mb-4">
              Everything is pressure tested across real network conditions, slow hardware, and awkward screen dimensions.
            </p>
          </div>

          <div className="space-y-2">
            <input
              type="range"
              min="20"
              max="1200"
              value={latency}
              onChange={(e) => setLatency(Number(e.target.value))}
              className="w-full h-1.5 bg-[#F4F1E9] appearance-none cursor-pointer accent-[#141413]"
            />
            <div className="flex justify-between text-[10px] font-mono text-[#141413]/40">
              <span>Fast 4G (20ms)</span>
              <span>Subway 3G (1200ms)</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-5 border border-[rgba(20,20,19,0.08)] shadow-2xs flex flex-col justify-between h-[230px]">
          <div>
            <div className="flex items-center justify-between text-[11px] font-mono text-[#141413]/50 mb-3">
              <span className="flex items-center gap-1.5">
                <RotateCcw className="w-3.5 h-3.5 text-[#1F9A55]" />
                Optimistic Action
              </span>
              <span className="text-[10px] uppercase">R-02 / No Modals</span>
            </div>
            <p className="text-xs text-[#141413]/80 leading-relaxed mb-3">
              People have already decided by the time a dialog asks them. Act at once, then make it easy to take back.
            </p>
          </div>

          <div>
            {itemArchived ? (
              <div className="flex items-center justify-between p-2.5 bg-[#141413] text-[#FAFAF8] text-xs">
                {undoCountdown > 0 ? (
                  <>
                    <span className="text-[11px]">Item archived ({undoCountdown}s)</span>
                    <button
                      type="button"
                      onClick={cancelArchive}
                      className="px-2.5 py-1 bg-[#FAFAF8] text-[#141413] text-[11px] font-semibold hover:bg-[#FAFAF8]/90 transition-colors"
                    >
                      Undo
                    </button>
                  </>
                ) : (
                  <>
                    <span className="text-[11px] flex items-center gap-1.5 text-[#1F9A55]">
                      <Check className="w-3.5 h-3.5" /> Permanently archived
                    </span>
                    <button
                      type="button"
                      onClick={() => setItemArchived(false)}
                      className="text-[11px] text-[#FAFAF8]/60 hover:text-[#FAFAF8] transition-colors"
                    >
                      Reset
                    </button>
                  </>
                )}
              </div>
            ) : (
              <button
                type="button"
                onClick={triggerArchive}
                className="w-full py-2.5 px-3 border border-[rgba(20,20,19,0.12)] hover:bg-[#F4F1E9] text-xs font-medium text-[#141413] transition-colors flex items-center justify-center gap-2"
              >
                <span>Archive document</span>
              </button>
            )}
          </div>
        </div>

        <div className="bg-white p-5 border border-[rgba(20,20,19,0.08)] shadow-2xs flex flex-col justify-between h-[230px]">
          <div>
            <div className="flex items-center justify-between text-[11px] font-mono text-[#141413]/50 mb-3">
              <span className="flex items-center gap-1.5">
                <Search className="w-3.5 h-3.5 text-[#F2C230]" />
                Instant Filter
              </span>
              <span className="font-mono text-[10px]">{filteredTags.length} matches</span>
            </div>
            <div className="relative mb-3">
              <input
                type="text"
                placeholder="Type to filter..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-3 py-1.5 bg-[#F4F1E9] text-xs text-[#141413] placeholder-[#141413]/40 outline-none border border-transparent focus:border-[rgba(20,20,19,0.2)]"
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-1.5 max-h-16 overflow-hidden">
            {filteredTags.map((tag) => (
              <span
                key={tag}
                className="px-2 py-0.5 bg-[#F4F1E9] text-[11px] font-mono text-[#141413] border border-[rgba(20,20,19,0.06)]"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        <div className="bg-white p-5 border border-[rgba(20,20,19,0.08)] shadow-2xs flex flex-col justify-between h-[230px]">
          <div>
            <div className="flex items-center justify-between text-[11px] font-mono text-[#141413]/50 mb-1">
              <span className="flex items-center gap-1.5">
                <BarChart3 className="w-3.5 h-3.5 text-[#C8553D]" />
                Weekly Trend
              </span>
              <span className="text-[10px]">Oct 17–23</span>
            </div>
            <div className="flex items-baseline gap-2 mb-2">
              <span className="font-serif text-2xl font-normal text-[#141413]">€184</span>
              <span className="text-[10px] text-[#141413]/50 font-mono">
                {hoveredBar !== null ? `${weeklyData[hoveredBar].day}: €${weeklyData[hoveredBar].amount}` : "Hover bar"}
              </span>
            </div>
          </div>

          <div className="flex items-end justify-between gap-1.5 h-20 pt-2 border-t border-[rgba(20,20,19,0.06)]">
            {weeklyData.map((d, i) => (
              <div
                key={d.day}
                onMouseEnter={() => setHoveredBar(i)}
                onMouseLeave={() => setHoveredBar(null)}
                className="flex-1 flex flex-col items-center gap-1 cursor-pointer group"
              >
                <div
                  style={{ height: `${d.height}%` }}
                  className={`w-full rounded-none transition-all ${
                    hoveredBar === i ? "bg-[#141413]" : "bg-[#141413]/25 group-hover:bg-[#141413]/60"
                  }`}
                />
                <span className="text-[9px] font-mono text-[#141413]/50">{d.day}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-5 border border-[rgba(20,20,19,0.08)] shadow-2xs flex flex-col justify-between h-[230px]">
          <div>
            <div className="flex items-center justify-between text-[11px] font-mono text-[#141413]/50 mb-2">
              <span>Design Quality Checklist</span>
              <span className="font-medium text-[#1F9A55]">
                {tasks.filter((t) => t.completed).length}/{tasks.length} done
              </span>
            </div>
          </div>

          <div className="space-y-1.5 overflow-y-auto max-h-36 pr-1">
            {tasks.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => toggleTask(t.id)}
                className="w-full flex items-center gap-2 p-1.5 hover:bg-[#F4F1E9] text-left transition-colors"
              >
                <div
                  className={`w-3.5 h-3.5 flex items-center justify-center shrink-0 text-white ${
                    t.completed ? "bg-[#141413]" : "border border-[rgba(20,20,19,0.3)] bg-white"
                  }`}
                >
                  {t.completed && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                </div>
                <span
                  className={`text-[11px] leading-tight ${
                    t.completed ? "line-through text-[#141413]/40" : "text-[#141413]"
                  }`}
                >
                  {t.text}
                </span>
              </button>
            ))}
          </div>
        </div>

        <div className="bg-white p-5 border border-[rgba(20,20,19,0.08)] shadow-2xs flex flex-col justify-between h-[230px]">
          <div>
            <div className="flex items-center justify-between text-[11px] font-mono text-[#141413]/50 mb-3">
              <span>Collaborative Presence</span>
              <span className="inline-flex items-center gap-1 text-[10px] text-[#1F9A55]">
                <span className="w-1.5 h-1.5 bg-[#1F9A55]" />
                Live
              </span>
            </div>
            <p className="text-xs text-[#141413]/80 leading-relaxed mb-4">
              Real-time cursor presence and room state calibrated for remote pair programming and design critique.
            </p>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-[rgba(20,20,19,0.06)]">
            <div className="flex -space-x-2">
              <div
                className="w-7 h-7 bg-[#141413] text-[#FAFAF8] text-[10px] font-medium flex items-center justify-center border-2 border-white ring-1 ring-black/5"
                title="Ines Calder"
              >
                IC
              </div>
              <div
                className="w-7 h-7 bg-[#C9D8E4] text-[#141413] text-[10px] font-medium flex items-center justify-center border-2 border-white ring-1 ring-black/5"
                title="Ben Miller (Tidewater)"
              >
                BM
              </div>
              <div
                className="w-7 h-7 bg-[#EED9B0] text-[#141413] text-[10px] font-medium flex items-center justify-center border-2 border-white ring-1 ring-black/5"
                title="Sara Chen (Helyard)"
              >
                SC
              </div>
            </div>
            <span className="text-[10px] font-mono text-[#141413]/50">3 engineers in session</span>
          </div>
        </div>
      </div>
    </section>
  )
}
