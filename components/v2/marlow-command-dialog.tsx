"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { Search, ArrowRight, FolderKanban, BookOpen, User, Mail, Sparkles } from "lucide-react"

interface CommandItem {
  id: string
  title: string
  category: "Pages" | "Projects" | "Writing" | "Actions"
  href?: string
  action?: () => void
  meta?: string
}

export function MarlowCommandDialog({
  open,
  onOpenChange,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const [query, setQuery] = React.useState("")
  const [selectedIndex, setSelectedIndex] = React.useState(0)
  const router = useRouter()

  const items: CommandItem[] = React.useMemo(
    () => [
      { id: "home", title: "Home — Landing page", category: "Pages", href: "/v2", meta: "Overview" },
      { id: "work", title: "Work — Projects & Systems", category: "Pages", href: "/v2/work", meta: "6 items" },
      { id: "about", title: "About — Principles & Background", category: "Pages", href: "/v2/about", meta: "Bio" },
      { id: "contact", title: "Contact — Send a brief", category: "Pages", href: "/v2/contact", meta: "Form" },
      { id: "tidewater", title: "Tidewater — Mobile Banking", category: "Projects", href: "/v2/work#tidewater", meta: "Fintech" },
      { id: "fieldnotes", title: "Fieldnotes — Desktop Markdown Editor", category: "Projects", href: "/v2/work#fieldnotes", meta: "App" },
      { id: "linea", title: "Linea — Transit Wayfinding", category: "Projects", href: "/v2/work#linea", meta: "Transit" },
      { id: "ridgeline", title: "Ridgeline — Mapping Product", category: "Projects", href: "/v2/work#ridgeline", meta: "Maps" },
      { id: "kiln", title: "Kiln & Co — Ceramic Studio E-Commerce", category: "Projects", href: "/v2/work#kiln", meta: "Brand" },
      { id: "cargo", title: "Cargo UI — Enterprise Design System", category: "Projects", href: "/v2/work#cargo", meta: "Systems" },
      { id: "essay-forms", title: "Forms that remember", category: "Writing", href: "/v2#writing", meta: "July 2025" },
      { id: "essay-undo", title: "Undo is a design decision", category: "Writing", href: "/v2#writing", meta: "March 2025" },
      { id: "essay-tokens", title: "Design tokens without the theatre", category: "Writing", href: "/v2#writing", meta: "Dec 2024" },
      {
        id: "copy-email",
        title: "Copy Email (hello@inescalder.com)",
        category: "Actions",
        meta: "Clipboard",
        action: () => {
          navigator.clipboard.writeText("hello@inescalder.com")
          onOpenChange(false)
        },
      },
    ],
    [onOpenChange]
  )

  const filtered = React.useMemo(() => {
    if (!query.trim()) return items
    const q = query.toLowerCase()
    return items.filter(
      (item) => item.title.toLowerCase().includes(q) || item.category.toLowerCase().includes(q)
    )
  }, [items, query])

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault()
        onOpenChange(!open)
      }
      if (!open) return

      if (e.key === "ArrowDown") {
        e.preventDefault()
        setSelectedIndex((i) => (i + 1) % (filtered.length || 1))
      } else if (e.key === "ArrowUp") {
        e.preventDefault()
        setSelectedIndex((i) => (i - 1 + (filtered.length || 1)) % (filtered.length || 1))
      } else if (e.key === "Enter") {
        e.preventDefault()
        const selected = filtered[selectedIndex]
        if (selected) {
          if (selected.action) {
            selected.action()
          } else if (selected.href) {
            router.push(selected.href)
            onOpenChange(false)
          }
        }
      } else if (e.key === "Escape") {
        onOpenChange(false)
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [open, filtered, selectedIndex, router, onOpenChange])

  if (!open) return null

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-start justify-center pt-24 px-4 bg-black/40 backdrop-blur-sm"
      onClick={() => onOpenChange(false)}
    >
      <div
        className="w-full max-w-xl overflow-hidden rounded-none bg-[#FAFAF8] shadow-2xl border border-[rgba(20,20,19,0.12)] text-[#141413] animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center px-4 py-3 border-b border-[rgba(20,20,19,0.08)] bg-[#F4F1E9]/50">
          <Search className="w-4 h-4 text-[#141413]/40 mr-2.5 shrink-0" />
          <input
            autoFocus
            type="text"
            placeholder="Search pages, projects, writing or actions..."
            value={query}
            onChange={(e) => {
              setQuery(e.target.value)
              setSelectedIndex(0)
            }}
            className="w-full bg-transparent text-sm text-[#141413] placeholder-[#141413]/40 outline-none"
          />
          <kbd className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded-none bg-[rgba(20,20,19,0.06)] text-[#141413]/50">
            Esc
          </kbd>
        </div>

        <div className="max-h-80 overflow-y-auto p-2">
          {filtered.length === 0 ? (
            <div className="py-8 text-center text-xs text-[#141413]/50">
              No results found for &ldquo;{query}&rdquo;
            </div>
          ) : (
            filtered.map((item, idx) => {
              const isSelected = idx === selectedIndex
              return (
                <button
                  key={item.id}
                  type="button"
                  onMouseEnter={() => setSelectedIndex(idx)}
                  onClick={() => {
                    if (item.action) {
                      item.action()
                    } else if (item.href) {
                      router.push(item.href)
                      onOpenChange(false)
                    }
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-none text-left text-xs transition-colors ${
                    isSelected ? "bg-[#141413] text-[#FAFAF8]" : "hover:bg-[rgba(20,20,19,0.04)] text-[#141413]"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    {item.category === "Pages" && <FolderKanban className="w-3.5 h-3.5 opacity-60" />}
                    {item.category === "Projects" && <Sparkles className="w-3.5 h-3.5 opacity-60" />}
                    {item.category === "Writing" && <BookOpen className="w-3.5 h-3.5 opacity-60" />}
                    {item.category === "Actions" && <Mail className="w-3.5 h-3.5 opacity-60" />}
                    <span className="font-medium">{item.title}</span>
                  </div>
                  {item.meta && (
                    <span
                      className={`text-[11px] font-mono ${
                        isSelected ? "text-[#FAFAF8]/60" : "text-[#141413]/40"
                      }`}
                    >
                      {item.meta}
                    </span>
                  )}
                </button>
              )
            })
          )}
        </div>

        <div className="flex items-center justify-between px-4 py-2 border-t border-[rgba(20,20,19,0.06)] bg-[#F4F1E9]/40 text-[11px] text-[#141413]/50">
          <span>Navigate with &uarr; &darr;</span>
          <span>Press Enter to select</span>
        </div>
      </div>
    </div>
  )
}
