"use client"

import { useEffect, useState, useCallback } from "react"
import { completeTour } from "@/app/actions/user"
import { toast } from "sonner"

interface TourStep {
  selector?: string
  title: string
  description: string
}

const TOUR_STEPS: TourStep[] = [
  {
    title: "Welcome to Tac-Xpress! 🚀",
    description:
      "This is your central command center for logistics operations. Let us give you a quick tour.",
  },
  {
    selector: "[data-slot='sidebar-container']",
    title: "Global Navigation",
    description:
      "Use the sidebar to navigate between Operations, Accounting, and Configuration modules. Collapse it for more screen space.",
  },
  {
    selector: "#tour-search",
    title: "Universal Search",
    description:
      "Quickly find AWBs, active routes, customers, or dispatchers from anywhere in the app.",
  },
  {
    selector: "#tour-user-menu",
    title: "Your Account",
    description:
      "Access your profile settings, manage billing, or log out securely from this menu.",
  },
  {
    selector: "#tour-main-content",
    title: "Command Area",
    description:
      "This is where the magic happens. Interactive data tables, active shipments, and kanban boards will appear here.",
  },
]

const POPOVER_W = 340
const POPOVER_H_EST = 200
const GAP = 12
const EDGE_PAD = 12
const HIGHLIGHT_PAD = 6

function calcPopoverPosition(
  rect: DOMRect | null,
  vw: number,
  vh: number
): React.CSSProperties {
  // No target → center on screen
  if (!rect) {
    return {
      position: "fixed",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
    }
  }

  const w = Math.min(POPOVER_W, vw - EDGE_PAD * 2)

  // Available space on each side
  const spaceRight = vw - rect.right - GAP
  const spaceLeft = rect.left - GAP
  const spaceBelow = vh - rect.bottom - GAP
  const spaceAbove = rect.top - GAP

  let top: number
  let left: number

  // 1. Try RIGHT of element
  if (spaceRight >= w + EDGE_PAD) {
    left = rect.right + GAP
    top = Math.max(EDGE_PAD, Math.min(rect.top, vh - POPOVER_H_EST - EDGE_PAD))
  }
  // 2. Try LEFT of element
  else if (spaceLeft >= w + EDGE_PAD) {
    left = rect.left - GAP - w
    top = Math.max(EDGE_PAD, Math.min(rect.top, vh - POPOVER_H_EST - EDGE_PAD))
  }
  // 3. Try BELOW element
  else if (spaceBelow >= POPOVER_H_EST + EDGE_PAD) {
    top = rect.bottom + GAP
    left = Math.max(EDGE_PAD, Math.min(rect.left, vw - w - EDGE_PAD))
  }
  // 4. Try ABOVE element
  else if (spaceAbove >= POPOVER_H_EST + EDGE_PAD) {
    top = rect.top - GAP - POPOVER_H_EST
    left = Math.max(EDGE_PAD, Math.min(rect.left, vw - w - EDGE_PAD))
  }
  // 5. Fallback: center horizontally, position below
  else {
    left = Math.max(EDGE_PAD, (vw - w) / 2)
    top = Math.max(EDGE_PAD, rect.bottom + GAP)
  }

  // Final clamp to keep fully in viewport
  left = Math.max(EDGE_PAD, Math.min(left, vw - w - EDGE_PAD))
  top = Math.max(EDGE_PAD, Math.min(top, vh - POPOVER_H_EST - EDGE_PAD))

  return { position: "fixed", top, left, width: w }
}

export function OnboardingTourProvider({
  isOnboarded,
}: {
  isOnboarded: boolean
}) {
  const [active, setActive] = useState(!isOnboarded)
  const [step, setStep] = useState(0)
  const [rect, setRect] = useState<DOMRect | null>(null)
  const [viewport, setViewport] = useState({ w: 1024, h: 768 })

  // Track viewport size
  useEffect(() => {
    const update = () =>
      setViewport({ w: window.innerWidth, h: window.innerHeight })
    update()
    window.addEventListener("resize", update)
    return () => window.removeEventListener("resize", update)
  }, [])

  // Measure the target element
  useEffect(() => {
    if (!active) return
    const sel = TOUR_STEPS[step]?.selector
    if (!sel) {
      setRect(null)
      return
    }
    // Small delay so layout is settled
    const t = setTimeout(() => {
      const el = document.querySelector(sel)
      if (el) {
        setRect(el.getBoundingClientRect())
        // Scroll into view if needed
        el.scrollIntoView({ behavior: "smooth", block: "nearest" })
      } else {
        setRect(null)
      }
    }, 80)
    return () => clearTimeout(t)
  }, [active, step])

  const finish = useCallback(async () => {
    setActive(false)
    try {
      await completeTour()
      toast.success("Welcome to Tac-Xpress!")
    } catch (e) {
      console.error("[Tour] Failed to complete:", e)
    }
  }, [])

  const next = () => {
    if (step < TOUR_STEPS.length - 1) setStep((s) => s + 1)
    else finish()
  }

  const prev = () => {
    if (step > 0) setStep((s) => s - 1)
  }

  const skip = () => {
    if (confirm("Are you sure you want to skip the tour?")) finish()
  }

  if (!active) return null

  const current = TOUR_STEPS[step]
  const isFirst = step === 0
  const isLast = step === TOUR_STEPS.length - 1
  const hasTarget = !!current.selector && !!rect
  const popoverPos = calcPopoverPosition(
    hasTarget ? rect : null,
    viewport.w,
    viewport.h
  )

  return (
    <div id="onboarding-tour-root">
      {/* ── Overlay with spotlight ── */}
      <div style={{ position: "fixed", inset: 0, zIndex: 99998 }}>
        <svg
          width="100%"
          height="100%"
          style={{ position: "absolute", inset: 0 }}
        >
          <defs>
            <mask id="tour-mask">
              <rect width="100%" height="100%" fill="white" />
              {hasTarget && rect && (
                <rect
                  x={rect.left - HIGHLIGHT_PAD}
                  y={rect.top - HIGHLIGHT_PAD}
                  width={rect.width + HIGHLIGHT_PAD * 2}
                  height={rect.height + HIGHLIGHT_PAD * 2}
                  rx={8}
                  fill="black"
                />
              )}
            </mask>
          </defs>
          <rect
            width="100%"
            height="100%"
            fill="rgba(0,0,0,0.65)"
            mask="url(#tour-mask)"
          />
        </svg>

        {/* Highlight ring */}
        {hasTarget && rect && (
          <div
            style={{
              position: "fixed",
              top: rect.top - HIGHLIGHT_PAD,
              left: rect.left - HIGHLIGHT_PAD,
              width: rect.width + HIGHLIGHT_PAD * 2,
              height: rect.height + HIGHLIGHT_PAD * 2,
              border: "2px solid #3b82f6",
              borderRadius: 8,
              boxShadow: "0 0 0 4px rgba(59,130,246,0.2)",
              pointerEvents: "none",
              zIndex: 99999,
            }}
          />
        )}
      </div>

      {/* ── Popover Card ── */}
      <div
        style={{
          ...popoverPos,
          zIndex: 100000,
          maxWidth: "calc(100vw - 24px)",
          backgroundColor: "#fff",
          color: "#111",
          borderRadius: 14,
          boxShadow:
            "0 20px 60px -15px rgba(0,0,0,0.3), 0 0 0 1px rgba(0,0,0,0.06)",
          overflow: "hidden",
          animation: "tourSlideIn .3s cubic-bezier(.22,1,.36,1)",
        }}
        key={step} // re-trigger animation on step change
      >
        {/* Progress bar */}
        <div style={{ height: 3, background: "#f1f5f9" }}>
          <div
            style={{
              height: "100%",
              width: `${((step + 1) / TOUR_STEPS.length) * 100}%`,
              background: "linear-gradient(90deg, #3b82f6, #6366f1)",
              transition: "width 0.4s ease",
              borderRadius: "0 2px 2px 0",
            }}
          />
        </div>

        <div style={{ padding: "18px 20px 16px" }}>
          {/* Step badge + Close */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 10,
            }}
          >
            <span
              style={{
                fontSize: 11,
                fontWeight: 600,
                letterSpacing: "0.05em",
                textTransform: "uppercase",
                color: "#6366f1",
                background: "#eef2ff",
                padding: "3px 8px",
                borderRadius: 4,
              }}
            >
              Step {step + 1} of {TOUR_STEPS.length}
            </span>
            <button
              onClick={skip}
              aria-label="Skip tour"
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: "2px 6px",
                color: "#94a3b8",
                fontSize: 16,
                lineHeight: 1,
                borderRadius: 4,
                transition: "color .15s, background .15s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = "#475569"
                e.currentTarget.style.background = "#f1f5f9"
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = "#94a3b8"
                e.currentTarget.style.background = "none"
              }}
            >
              ✕
            </button>
          </div>

          {/* Title */}
          <h3
            style={{
              margin: "0 0 6px",
              fontSize: 15,
              fontWeight: 700,
              lineHeight: 1.3,
              color: "#0f172a",
            }}
          >
            {current.title}
          </h3>

          {/* Description */}
          <p
            style={{
              margin: "0 0 16px",
              fontSize: 13,
              lineHeight: 1.65,
              color: "#64748b",
            }}
          >
            {current.description}
          </p>

          {/* Navigation buttons */}
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              gap: 8,
            }}
          >
            {!isFirst && (
              <button
                onClick={prev}
                style={{
                  padding: "7px 14px",
                  fontSize: 13,
                  fontWeight: 500,
                  border: "1px solid #e2e8f0",
                  borderRadius: 7,
                  background: "#fff",
                  color: "#334155",
                  cursor: "pointer",
                  transition: "all .15s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "#f8fafc"
                  e.currentTarget.style.borderColor = "#cbd5e1"
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "#fff"
                  e.currentTarget.style.borderColor = "#e2e8f0"
                }}
              >
                ← Back
              </button>
            )}
            <button
              onClick={next}
              style={{
                padding: "7px 18px",
                fontSize: 13,
                fontWeight: 600,
                border: "none",
                borderRadius: 7,
                background: "linear-gradient(135deg, #3b82f6, #6366f1)",
                color: "#fff",
                cursor: "pointer",
                boxShadow: "0 2px 8px rgba(59,130,246,0.35)",
                transition: "all .15s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow =
                  "0 4px 14px rgba(59,130,246,0.45)"
                e.currentTarget.style.transform = "translateY(-1px)"
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow =
                  "0 2px 8px rgba(59,130,246,0.35)"
                e.currentTarget.style.transform = "translateY(0)"
              }}
            >
              {isLast ? "🚀 Get Started" : "Next →"}
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes tourSlideIn {
          from { opacity: 0; transform: translateY(10px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0)   scale(1); }
        }
      `}</style>
    </div>
  )
}
