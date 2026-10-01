"use client"

import { ReactNode, useRef } from "react"
import { cn } from "@/lib/utils"
import { motion, useReducedMotion } from "motion/react"
import { Check } from "lucide-react"

/* ─────────────────────────────────────────────────────────────────────────────
   VerticalRail — track line (2px, border blend)
───────────────────────────────────────────────────────────────────────────── */
export function VerticalRail({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  const ref = useRef<HTMLOListElement>(null)

  return (
    <ol
      ref={ref}
      className={cn(
        "cargo-rail relative ml-2 py-4 sm:ml-4 border-l-2 border-border/50",
        className,
      )}
    >
      {children}
    </ol>
  )
}

/* ─────────────────────────────────────────────────────────────────────────────
   VerticalRailStep
   - Inactive:  clear, accessible text (text-foreground/80, text-muted-foreground), clean surface marker
   - Active:    vibrant Fjord Teal marker, primary active indicator border, high-contrast Spruce Ink text
   - Completed: marked with check indicator, readable muted tone
───────────────────────────────────────────────────────────────────────────── */
export function VerticalRailStep({
  number,
  title,
  text,
  className,
  isActive = false,
  isCompleted = false,
}: {
  number: string
  title: string
  text: string
  className?: string
  isActive?: boolean
  isCompleted?: boolean
}) {
  const shouldReduceMotion = useReducedMotion()

  return (
    <li
      className={cn(
        "relative pb-16 pl-10 last:pb-2 sm:pl-14 transition-colors duration-300",
        className,
      )}
    >
      {/* ── Active step background highlight strip with Nordic Fjord border ─────────────────────── */}
      <div
        aria-hidden="true"
        className={cn(
          "pointer-events-none absolute inset-y-0 -left-4 right-0 rounded-r-xl transition-all duration-300",
          isActive
            ? "bg-primary/[0.08] dark:bg-primary/[0.12] border-l-2 border-primary"
            : "bg-transparent border-l-2 border-transparent",
        )}
      />

      {/* ── Marker ─────────────────────────────────────────────────────── */}
      <span
        aria-hidden="true"
        className={cn(
          "absolute -left-[11px] top-1 flex h-6 w-6 items-center justify-center rounded-sm transition-all duration-300 ring-4 ring-background",
          isActive
            ? "bg-primary text-primary-foreground border-2 border-primary shadow-sm"
            : isCompleted
              ? "bg-primary/20 text-primary border-2 border-primary/50"
              : "bg-surface text-muted-foreground border-2 border-border",
        )}
      >
        {isCompleted ? (
          <Check className="size-3 stroke-[2.5]" aria-hidden="true" />
        ) : (
          <span
            className={cn(
              "size-2 transition-transform duration-300 rounded-none",
              isActive ? "bg-primary-foreground scale-100" : "bg-muted-foreground/60 scale-75",
            )}
          />
        )}

        {/* Pulsing ring — only on currently active step */}
        {isActive && !shouldReduceMotion && (
          <motion.span
            className="absolute inset-0 rounded-sm border-2 border-primary pointer-events-none"
            initial={{ scale: 1, opacity: 0.8 }}
            animate={{ scale: 2.1, opacity: 0 }}
            transition={{
              duration: 1.4,
              ease: "easeOut",
              repeat: Infinity,
              repeatDelay: 0.5,
            }}
          />
        )}
      </span>

      {/* ── Content ────────────────────────────────────────────────────── */}
      <div className="flex flex-col gap-3 md:max-w-xl">
        {/* Step number */}
        <span
          className={cn(
            "font-mono text-xs font-bold tracking-[0.15em] uppercase transition-colors duration-300",
            isActive ? "text-primary" : "text-muted-foreground",
          )}
        >
          {number}
        </span>

        {/* Title */}
        <h3
          className={cn(
            "text-2xl font-semibold tracking-tight transition-all duration-300",
            isActive
              ? "text-foreground font-bold"
              : "text-foreground/80",
          )}
        >
          {title}
        </h3>

        {/* Body */}
        <p
          className={cn(
            "leading-relaxed text-sm sm:text-base transition-all duration-300",
            isActive ? "text-foreground/90 font-normal" : "text-muted-foreground",
          )}
        >
          {text}
        </p>
      </div>
    </li>
  )
}
