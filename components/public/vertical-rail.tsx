"use client"

import { ReactNode, useRef } from "react"
import { cn } from "@/lib/utils"
import { motion, useReducedMotion, useInView } from "motion/react"

/* ─────────────────────────────────────────────────────────────────────────────
   VerticalRail — animated draw line (2px, primary color, glows in)
───────────────────────────────────────────────────────────────────────────── */
export function VerticalRail({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  const ref = useRef<HTMLOListElement>(null)
  const isInView = useInView(ref, { once: true, amount: 0.02 })
  const shouldReduceMotion = useReducedMotion()

  return (
    <ol
      ref={ref}
      className={cn(
        "cargo-rail relative ml-2 py-4 sm:ml-4 border-l-2 border-border/30",
        className,
      )}
    >
      {/* Animated primary-color line draws downward */}
      <motion.span
        aria-hidden="true"
        className="pointer-events-none absolute -left-[2px] top-0 w-[2px] origin-top bg-primary/80"
        initial={{ scaleY: 0 }}
        animate={isInView ? { scaleY: 1 } : { scaleY: 0 }}
        transition={
          shouldReduceMotion
            ? { duration: 0 }
            : { duration: 2.4, ease: [0.16, 1, 0.3, 1], delay: 0.15 }
        }
        style={{ height: "100%" }}
      />
      {children}
    </ol>
  )
}

/* ─────────────────────────────────────────────────────────────────────────────
   VerticalRailStep
   - Inactive: dimmed (opacity 0.45), y-offset
   - Active:   full opacity, highlighted bg strip, pulsing marker ring
───────────────────────────────────────────────────────────────────────────── */
export function VerticalRailStep({
  number,
  title,
  text,
  className,
  isActive = false,
}: {
  number: string
  title: string
  text: string
  className?: string
  isActive?: boolean
}) {
  const shouldReduceMotion = useReducedMotion()
  const ref = useRef<HTMLLIElement>(null)
  const isInView = useInView(ref, { once: true, amount: 0.15 })

  const ease = [0.16, 1, 0.3, 1] as const

  return (
    <li
      ref={ref}
      className={cn(
        "cargo-rail-step relative pb-16 pl-10 last:pb-0 sm:pl-14 group",
        className,
      )}
    >
      {/* ── Active step background highlight strip ─────────────────────── */}
      <motion.span
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 -left-4 right-0 rounded-r-lg"
        animate={{
          backgroundColor: isActive
            ? "color-mix(in oklab, var(--color-primary) 6%, transparent)"
            : "transparent",
        }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      />

      {/* ── Marker ─────────────────────────────────────────────────────── */}
      <motion.span
        aria-hidden="true"
        className={cn(
          "absolute -left-[10px] top-1 flex h-5 w-5 items-center justify-center rounded-sm ring-background transition-colors duration-300",
          isActive
            ? "bg-primary border-primary border-2 ring-4"
            : "bg-muted dark:bg-card border-2 border-border ring-4",
        )}
        initial={shouldReduceMotion ? {} : { scale: 0, opacity: 0 }}
        animate={isInView ? { scale: 1, opacity: 1 } : {}}
        transition={
          shouldReduceMotion
            ? { duration: 0 }
            : { type: "spring", stiffness: 500, damping: 22, delay: 0.1 }
        }
      >
        {/* Inner dot */}
        <motion.span
          className="h-2 w-2 rounded-none"
          animate={{
            backgroundColor: isActive ? "#fff" : "var(--color-primary)",
            scale: isActive ? 1 : 0.7,
          }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        />

        {/* Pulsing ring — only on active */}
        {isActive && !shouldReduceMotion && (
          <motion.span
            className="absolute inset-0 rounded-sm border-2 border-primary"
            initial={{ scale: 1, opacity: 0.8 }}
            animate={{ scale: 2.2, opacity: 0 }}
            transition={{
              duration: 1.2,
              ease: "easeOut",
              repeat: Infinity,
              repeatDelay: 0.6,
            }}
          />
        )}
      </motion.span>

      {/* ── Content ────────────────────────────────────────────────────── */}
      <div className="flex flex-col gap-3 md:max-w-xl">
        {/* Step number */}
        <motion.span
          className={cn(
            "font-mono text-xs font-bold tracking-[0.15em] uppercase transition-colors duration-300",
            isActive ? "text-primary" : "text-muted-foreground/60",
          )}
          initial={shouldReduceMotion ? {} : { opacity: 0, y: 12 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={
            shouldReduceMotion
              ? { duration: 0 }
              : { duration: 0.45, ease, delay: 0.15 }
          }
        >
          {number}
        </motion.span>

        {/* Title */}
        <motion.h3
          className={cn(
            "text-2xl font-semibold tracking-tight transition-all duration-500",
            isActive
              ? "text-foreground"
              : "text-foreground/40",
          )}
          initial={shouldReduceMotion ? {} : { opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={
            shouldReduceMotion
              ? { duration: 0 }
              : { duration: 0.55, ease, delay: 0.22 }
          }
        >
          {title}
        </motion.h3>

        {/* Body */}
        <motion.p
          className={cn(
            "leading-relaxed text-sm sm:text-base transition-all duration-500",
            isActive ? "text-muted-foreground" : "text-muted-foreground/40",
          )}
          initial={shouldReduceMotion ? {} : { opacity: 0, y: 14 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={
            shouldReduceMotion
              ? { duration: 0 }
              : { duration: 0.6, ease, delay: 0.32 }
          }
        >
          {text}
        </motion.p>
      </div>
    </li>
  )
}
