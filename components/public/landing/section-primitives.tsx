"use client"

import React from "react"
import { motion, useReducedMotion } from "motion/react"
import { cn } from "@/lib/utils"

interface SectionEyebrowProps {
  children: React.ReactNode
  className?: string
  id?: string
}

export function SectionEyebrow({ children, className, id }: SectionEyebrowProps) {
  return (
    <div
      id={id}
      className={cn(
        "inline-flex items-center gap-2 font-mono text-[11px] font-medium uppercase tracking-[0.22em] text-muted-foreground select-none",
        className
      )}
    >
      <span className="inline-block size-1.5 rounded-none bg-primary" aria-hidden="true" />
      {children}
    </div>
  )
}

interface EditorialHeadingProps {
  children: React.ReactNode
  className?: string
  level?: "display" | "section" | "sub"
  as?: "h1" | "h2" | "h3" | "h4" | "p"
}

export function EditorialHeading({
  children,
  className,
  level = "section",
  as: Component = "h2",
}: EditorialHeadingProps) {
  const config = {
    display: {
      sizeVar: "var(--type-display)",
      className: "font-heading font-medium tracking-tight leading-[1.04] text-balance text-foreground",
    },
    section: {
      sizeVar: "var(--type-section)",
      className: "font-heading font-medium tracking-tight leading-[1.08] text-balance text-foreground",
    },
    sub: {
      sizeVar: "var(--type-sub)",
      className: "font-heading font-medium tracking-tight leading-snug text-balance text-foreground",
    },
  }

  const { sizeVar, className: levelClass } = config[level]

  return (
    <Component
      style={{ fontSize: sizeVar }}
      className={cn(levelClass, className)}
    >
      {children}
    </Component>
  )
}

interface EditorialContainerProps {
  children: React.ReactNode
  className?: string
  as?: "section" | "div" | "footer" | "nav"
  id?: string
  "aria-labelledby"?: string
}

export const EditorialContainer = React.forwardRef<
  HTMLDivElement,
  EditorialContainerProps
>(function EditorialContainer(
  {
    children,
    className,
    as: Component = "section",
    id,
    "aria-labelledby": ariaLabelledBy,
  },
  ref
) {
  const Comp = Component as React.ElementType
  return (
    <Comp
      ref={ref}
      id={id}
      aria-labelledby={ariaLabelledBy}
      className={cn(
        "relative w-full border-b border-border/80 bg-background text-foreground transition-colors",
        className
      )}
    >
      <div className="mx-auto w-full max-w-[1360px] px-4 sm:px-6 lg:px-12">{children}</div>
    </Comp>
  )
})
EditorialContainer.displayName = "EditorialContainer"

interface TheCargoLineProps {
  className?: string
  variant?: "hero" | "connector" | "wire" | "progress" | "statement"
  activeStep?: number
}

/**
 * The Cargo Line — TAC-XPRESS Signature Interaction & Structural Primitive
 * A 1px geometric rule in Quiet Indigo representing movement:
 * Hero (Movement Origin) -> Services (Connector) -> Tracking (Live Wire) -> Process (Progress Rail) -> Brand (Statement Resolution)
 */
export function TheCargoLine({ className, variant = "hero" }: TheCargoLineProps) {
  const shouldReduceMotion = useReducedMotion()

  return (
    <motion.div
      aria-hidden="true"
      initial={shouldReduceMotion ? false : { scaleX: 0 }}
      whileInView={{ scaleX: 1 }}
      viewport={{ once: true, margin: "-10px" }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      className={cn(
        "h-px origin-left bg-primary/30",
        variant === "hero" && "w-16 bg-primary",
        variant === "connector" && "w-full bg-border/80",
        variant === "wire" && "w-full bg-primary/50",
        variant === "statement" && "w-24 bg-primary/40",
        className
      )}
    />
  )
}

/**
 * Proof Strip — Immediate Trust Reinforcement beneath Hero
 * Verifiable service capabilities only; zero fabricated numerical metrics.
 */
export function ProofStrip() {
  const claims = [
    { label: "Clear Tracking", detail: "Real milestone events" },
    { label: "Human Support", detail: "Direct controller desk" },
    { label: "Arterial Transport", detail: "Air & surface linehaul" },
    { label: "Secure Handling", detail: "Verified custodial chain" },
  ]

  return (
    <div className="w-full border-b border-border/80 bg-card/60 backdrop-blur-xs">
      <div className="mx-auto grid w-full max-w-[1360px] grid-cols-2 divide-y divide-border/80 border-x border-border/80 md:grid-cols-4 md:divide-x md:divide-y-0">
        {claims.map((claim) => (
          <motion.div
            key={claim.label}
            whileHover={{ y: -1 }}
            transition={{ duration: 0.2 }}
            className="group flex flex-col justify-center px-3.5 py-3 transition-colors hover:bg-muted/40 sm:px-6 sm:py-4"
          >
            <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-foreground transition-colors group-hover:text-primary">
              {claim.label}
            </span>
            <span className="mt-0.5 font-sans text-xs text-muted-foreground">
              {claim.detail}
            </span>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

interface RevealProps {
  children: React.ReactNode
  className?: string
  delay?: number
}

export function Reveal({ children, className, delay = 0 }: RevealProps) {
  const shouldReduceMotion = useReducedMotion()

  if (shouldReduceMotion) {
    return <div className={className}>{children}</div>
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, delay, ease: [0.16, 1, 0.3, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

