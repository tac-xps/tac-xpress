"use client"

import * as React from "react"
import Link from "next/link"
import { Play, Pause, ArrowUpRight, ArrowDownLeft, RefreshCw, Mic, Volume2 } from "lucide-react"

export function MarlowShowcase() {
  const [isPlayingAudio, setIsPlayingAudio] = React.useState(false)
  const [activeTab, setActiveTab] = React.useState<"all" | "in" | "out">("all")

  return (
    <section className="px-6 max-w-5xl mx-auto mb-20">
      <div className="w-full">
        <div className="group flex flex-col">
          <div className="relative overflow-hidden rounded-none bg-[#EFECE4] border border-[rgba(20,20,19,0.08)] p-6 sm:p-10 flex items-center justify-center min-h-[460px] shadow-sm transition-transform duration-300 group-hover:scale-[1.005]">
            <div className="w-full max-w-md rounded-none bg-white shadow-xl border border-[rgba(20,20,19,0.08)] overflow-hidden text-xs">
              <div className="px-4 py-2.5 border-b border-[rgba(20,20,19,0.06)] bg-[#F4F1E9]/60 flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-none bg-[#E0412F]/80" />
                  <div className="w-2.5 h-2.5 rounded-none bg-[#F2C230]/80" />
                  <div className="w-2.5 h-2.5 rounded-none bg-[#2E9E63]/80" />
                </div>
                <span className="font-mono text-[10px] text-[#141413]/60 uppercase tracking-widest font-medium">
                  Fieldnotes 07 · Audio Memo
                </span>
                <span className="text-[10px] font-mono text-[#1F9A55] bg-[#1F9A55]/10 px-1.5 py-0.5 rounded">
                  Local
                </span>
              </div>

              <div className="p-5 flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-none bg-[#C9D8E4] text-[#141413] text-[10px] font-medium font-mono">
                      #research
                    </span>
                    <span className="px-2 py-0.5 rounded-none bg-[#EED9B0] text-[#141413] text-[10px] font-medium font-mono">
                      #interviews
                    </span>
                  </div>
                  <span className="font-mono text-[10px] text-[#141413]/40">14 Oct, 11:20</span>
                </div>

                <div className="p-3 rounded-none bg-[#F4F1E9] border border-[rgba(20,20,19,0.06)] flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setIsPlayingAudio(!isPlayingAudio)}
                    className="w-8 h-8 rounded-none bg-[#141413] text-white flex items-center justify-center shrink-0 hover:bg-[#141413]/85 transition-colors shadow-2xs"
                  >
                    {isPlayingAudio ? (
                      <Pause className="w-3.5 h-3.5 fill-current" />
                    ) : (
                      <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                    )}
                  </button>

                  <div className="flex-1 flex flex-col gap-1">
                    <div className="flex items-center justify-between text-[10px] font-mono text-[#141413]/60">
                      <span>{isPlayingAudio ? "01:42" : "00:00"}</span>
                      <span>04:15</span>
                    </div>
                    <div className="flex items-center gap-0.5 h-4">
                      {[30, 45, 70, 90, 60, 40, 80, 100, 65, 50, 85, 40, 95, 75, 55, 35, 70, 85, 60, 40, 65, 80, 50, 30].map(
                        (h, i) => (
                          <div
                            key={i}
                            style={{ height: `${h}%` }}
                            className={`flex-1 rounded-none transition-all duration-300 ${
                              isPlayingAudio && i < 12 ? "bg-[#141413]" : "bg-[#141413]/25"
                            }`}
                          />
                        )
                      )}
                    </div>
                  </div>

                  <Volume2 className="w-4 h-4 text-[#141413]/40 shrink-0" />
                </div>

                <div className="font-serif text-[13px] leading-relaxed text-[#141413]/85 space-y-2">
                  <p>
                    <span className="font-sans font-mono text-[10px] text-[#2F6FE4] bg-[#2F6FE4]/10 px-1 py-0.5 rounded mr-1">
                      01:14
                    </span>
                    &ldquo;Users reported feeling anxious whenever an app asked confirmation for trivial edits. The moment we replaced the confirmation modal with an immediate undo toast, task completion jumped 34%.&rdquo;
                  </p>
                  <p className="text-[11px] font-sans text-[#141413]/50 italic">
                    Annotated by Ines Calder · All notes stored strictly in plaintext Markdown.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4 flex flex-col gap-1">
            <div className="flex items-baseline justify-between">
              <h2 className="font-serif text-xl font-normal text-[#141413]">Fieldnotes</h2>
              <span className="text-xs text-[#141413]/50 font-mono">2025</span>
            </div>
            <p className="text-xs text-[#141413]/60 font-medium">Design engineering, Desktop app</p>
            <p className="text-xs text-[#141413]/80 leading-relaxed mt-0.5">
              A markdown editor for researchers that never touches the network without permission.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
