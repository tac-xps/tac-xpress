"use client"

import { ReactNode, useRef } from "react"
import { cn } from "@/lib/utils"
import { motion, useReducedMotion } from "motion/react"
import { Check } from "lucide-react"

/* ─────────────────────────────────────────────────────────────────────────────
   VerticalRail — track line (2px, border blend)
───────────────────────────────────────────────────────────────────────────── */
/* ─────────────────────────────────────────────────────────────────────────────
   VerticalRail — track line (2px, border blend) with animated active beam
───────────────────────────────────────────────────────────────────────────── */
export function VerticalRail({
  children,
  className,
  activeStep = 0,
  totalSteps = 4,
}: {
  children: ReactNode
  className?: string
  activeStep?: number
  totalSteps?: number
}) {
  const ref = useRef<HTMLOListElement>(null)
  const shouldReduceMotion = useReducedMotion()

  // Dynamic progress percentage along the rail track
  const progressRatio = totalSteps > 1 ? (activeStep + 0.5) / totalSteps : 1

  return (
    <ol
      ref={ref}
      className={cn(
        "cargo-rail relative ml-2 py-2 sm:ml-4 border-l-2 border-border/40",
        className,
      )}
    >
      {/* ── Illuminated active rail progress runner ── */}
      <motion.div
        aria-hidden="true"
        className="absolute -left-[2px] top-0 w-[2px] bg-gradient-to-b from-primary via-primary to-primary/60 rounded-none"
        initial={false}
        animate={{
          height: `${Math.min(100, Math.max(0, progressRatio * 100))}%`,
        }}
        transition={
          shouldReduceMotion
            ? { duration: 0 }
            : { type: "spring", stiffness: 280, damping: 30 }
        }
      />
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
  lead,
  text,
  className,
  isActive = false,
  isCompleted = false,
}: {
  number: string
  title: string
  lead?: string
  text: string
  className?: string
  isActive?: boolean
  isCompleted?: boolean
}) {
  const shouldReduceMotion = useReducedMotion()

  return (
    <li
      className={cn(
        "group/step relative mb-6 last:mb-0 rounded-none transition-colors duration-300",
        className,
      )}
    >
      {/* ── Active step background highlight card with Motion layoutId ─────────────────────── */}
      {isActive && (
        <motion.div
          layoutId="active-step-highlight"
          className="pointer-events-none absolute inset-0 -left-3.5 sm:-left-4 rounded-none bg-primary/[0.08] dark:bg-primary/[0.08] border-l-[3px] border-primary shadow-sm dark:shadow-md"
          transition={
            shouldReduceMotion
              ? { duration: 0 }
              : { type: "spring", stiffness: 320, damping: 32 }
          }
        />
      )}

      {/* ── Marker positioned symmetrically with header line ───────────────────────────────── */}
      <span
        aria-hidden="true"
        className={cn(
          "absolute -left-[13px] top-6 flex h-6 w-6 items-center justify-center rounded-none transition-all duration-300 ring-4 ring-background z-10",
          isActive
            ? "bg-primary text-primary-foreground border-2 border-primary shadow-sm scale-105"
            : isCompleted
              ? "bg-primary/20 text-primary border-2 border-primary/50"
              : "bg-surface text-muted-foreground border-2 border-border/80",
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
            className="absolute inset-0 rounded-none border-2 border-primary pointer-events-none"
            initial={{ scale: 1, opacity: 0.8 }}
            animate={{ scale: 2.1, opacity: 0 }}
            transition={{
              duration: 1.5,
              ease: "easeOut",
              repeat: Infinity,
              repeatDelay: 0.5,
            }}
          />
        )}
      </span>

      {/* ── Content Container with Generous, Balanced Vertical Padding (24px top & bottom) ──── */}
      <div className="relative z-10 flex flex-col gap-3 py-6 pl-10 pr-4 sm:pl-14 sm:pr-6 md:max-w-xl">
        {/* Step number */}
        <span
          className={cn(
            "font-mono text-xs font-bold tracking-[0.15em] uppercase transition-colors duration-300 leading-normal",
            isActive ? "text-primary" : "text-muted-foreground",
          )}
        >
          {number}
        </span>

        {/* Title */}
        <h3
          className={cn(
            "text-2xl font-semibold tracking-tight transition-colors duration-300",
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
            "leading-relaxed text-sm sm:text-base transition-colors duration-300",
            isActive ? "text-foreground/90 font-normal" : "text-muted-foreground",
          )}
        >
          {lead && <strong className="font-semibold text-foreground">{lead} </strong>}
          {text}
        </p>
      </div>
    </li>
  )
}
