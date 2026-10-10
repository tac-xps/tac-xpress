"use client"

import React from "react"
import { motion, useReducedMotion } from "motion/react"
import { cn } from "@/lib/utils"
import { Marquee } from "@/components/ui/marquee"

import Link from "next/link"

export interface EditorialEyebrowProps {
  children: React.ReactNode
  className?: string
  id?: string
}

/**
 * Classifies the section with small, tracked uppercase monospace text.
 */
export function EditorialEyebrow({ children, className, id }: EditorialEyebrowProps) {
  return (
    <div
      id={id}
      className={cn(
        "inline-flex items-center gap-2 border border-border/80 bg-muted/50 px-3 py-1 font-mono text-xs uppercase tracking-[0.18em] font-medium text-foreground select-none",
        className
      )}
    >
      <span className="inline-block size-2 rounded-none bg-primary" aria-hidden="true" />
      {children}
    </div>
  )
}

/**
 * Backwards compatible alias for SectionEyebrow.
 */
export const SectionEyebrow = EditorialEyebrow

export interface EditorialTitleProps {
  children: React.ReactNode
  className?: string
  level?: "display" | "section" | "sub"
  as?: "h1" | "h2" | "h3" | "h4" | "p"
  id?: string
}

/**
 * Carries the primary message using Manrope display font and balanced rags.
 */
export function EditorialTitle({
  children,
  className,
  level = "section",
  as: Component = "h2",
  id,
}: EditorialTitleProps) {
  const levelClass =
    level === "display"
      ? "text-display"
      : level === "sub"
      ? "text-subhead"
      : "text-section"

  return (
    <Component
      id={id}
      className={cn(levelClass, "text-foreground", className)}
    >
      {children}
    </Component>
  )
}

export const EditorialHeading = EditorialTitle

export interface EditorialLeadProps {
  children: React.ReactNode
  className?: string
  as?: "p" | "div"
}

/**
 * Explains the promise with human tone and generous reading leading.
 */
export function EditorialLead({
  children,
  className,
  as: Component = "p",
}: EditorialLeadProps) {
  return (
    <Component
      className={cn(
        "text-lead max-w-[54ch]",
        className
      )}
    >
      {children}
    </Component>
  )
}

export interface EditorialBodyProps {
  children: React.ReactNode
  className?: string
  as?: "p" | "div"
}

/**
 * Provides supporting information with comfortable reading measure and rhythm.
 */
export function EditorialBody({
  children,
  className,
  as: Component = "p",
}: EditorialBodyProps) {
  return (
    <Component
      className={cn(
        "text-body-editorial max-w-[65ch]",
        className
      )}
    >
      {children}
    </Component>
  )
}

export interface EditorialMetaProps {
  children: React.ReactNode
  className?: string
  as?: "span" | "div" | "p"
}

/**
 * Supplies contextual labels, secondary timestamps, and quiet descriptors.
 */
export function EditorialMeta({
  children,
  className,
  as: Component = "span",
}: EditorialMetaProps) {
  return (
    <Component
      className={cn(
        "font-sans text-xs text-muted-foreground leading-normal",
        className
      )}
    >
      {children}
    </Component>
  )
}

export interface EditorialStatementProps {
  children: React.ReactNode
  className?: string
  as?: "h1" | "h2" | "p"
  id?: string
}

/**
 * Creates an emotional pause using large display typography.
 */
export function EditorialStatement({
  children,
  className,
  as: Component = "h2",
  id,
}: EditorialStatementProps) {
  return (
    <Component
      id={id}
      className={cn("text-display text-foreground text-center", className)}
    >
      {children}
    </Component>
  )
}

export interface EditorialLinkProps {
  children: React.ReactNode
  href: string
  className?: string
}

/**
 * Offers next actions with clear, restrained typographic emphasis.
 */
export function EditorialLink({
  children,
  href,
  className,
}: EditorialLinkProps) {
  return (
    <Link
      href={href}
      className={cn(
        "inline-flex items-center gap-1.5 font-sans text-sm font-medium text-foreground underline-offset-4 hover:underline transition-colors",
        className
      )}
    >
      {children}
    </Link>
  )
}



interface EditorialContainerProps {
  children: React.ReactNode
  className?: string
  as?: "section" | "div" | "footer" | "nav"
  id?: string
  "aria-labelledby"?: string
}

/**
 * Standardized responsive container wrapper enforcing 1360px max width
 * and consistent horizontal padding across viewports.
 */
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
 * A 1px geometric rule in Quiet Indigo representing movement.
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

/** Verifiable operational capabilities shown in the proof strip */
const PROOF_CLAIMS = [
  { label: "15+ Years Linehaul", detail: "Delhi ⇄ Northeast corridor", colorClass: "text-primary" },
  { label: "Optical Gate Audit", detail: "Physical barcode scan trails", colorClass: "text-info" },
  { label: "Statutory Carriage", detail: "Air Waybills & GST e-way bills", colorClass: "text-status-delivered" },
  { label: "Dedicated Dispatch", detail: "Direct operations desk routing", colorClass: "text-status-pending" },
]

/** Dedicated corridors requested: IMF to DEL, DEL to IMF, New Delhi – Northeast, Northeast to Imphal */
const CORRIDOR_MARQUEE_ITEMS = [
  {
    corridor: "IMF to DEL",
    tag: "Priority Air Express",
    color: "text-primary",
    dot: "bg-primary",
    badge: "border-primary/40 bg-primary/10 text-primary",
  },
  {
    corridor: "DEL to IMF",
    tag: "Belly-Hold Linehaul",
    color: "text-info",
    dot: "bg-info",
    badge: "border-info/40 bg-info/10 text-info",
  },
  {
    corridor: "New Delhi – Northeast",
    tag: "Arterial Highway Fleet",
    color: "text-status-delivered",
    dot: "bg-status-delivered",
    badge: "border-status-delivered/40 bg-status-delivered/10 text-status-delivered",
  },
  {
    corridor: "Northeast to Imphal",
    tag: "Regional Station Delivery",
    color: "text-status-pending",
    dot: "bg-status-pending",
    badge: "border-status-pending/40 bg-status-pending/10 text-status-pending",
  },
]

/** Repeated corridors for smooth, uninterrupted continuous marquee */
const REPEATED_CORRIDORS = [
  ...CORRIDOR_MARQUEE_ITEMS,
  ...CORRIDOR_MARQUEE_ITEMS,
  ...CORRIDOR_MARQUEE_ITEMS,
]

/**
 * Proof Strip — Immediate trust reinforcement beneath Hero,
 * plus a live route network marquee featuring the core corridors.
 */
export function ProofStrip({ className }: { className?: string } = {}) {
  return (
    <div className={cn("w-full border-t border-border/80 bg-card/60 backdrop-blur-xs", className)}>
      {/* Capability Row — Aligned with 1360px container */}
      <div className="mx-auto grid w-full max-w-[1360px] grid-cols-2 divide-y divide-border/80 border-b border-border/80 px-4 sm:px-6 lg:px-12 md:grid-cols-4 md:divide-x md:divide-y-0">
        {PROOF_CLAIMS.map((claim) => (
          <motion.div
            key={claim.label}
            whileHover={{ y: -1 }}
            transition={{ duration: 0.2 }}
            className="group flex flex-col justify-center py-3.5 sm:py-4 md:px-6 transition-colors hover:bg-muted/40"
          >
            <span className={cn("font-mono text-xs font-bold uppercase tracking-[0.16em] transition-colors", claim.colorClass)}>
              {claim.label}
            </span>
            <span className="mt-0.5 font-sans text-xs text-muted-foreground font-medium">
              {claim.detail}
            </span>
          </motion.div>
        ))}
      </div>

      {/* Live Corridor Marquee with Left & Right Gradient Fade Masks */}
      <div
        className="relative w-full max-w-full overflow-hidden bg-muted/20"
        aria-hidden="true"
      >
        {/* Soft edge gradient masks */}
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 sm:w-24 bg-gradient-to-r from-card to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 sm:w-24 bg-gradient-to-l from-card to-transparent" />

        <Marquee
          pauseOnHover
          className="[--duration:28s] [--gap:0rem] py-0"
          aria-hidden="true"
        >
          {REPEATED_CORRIDORS.map((item, idx) => (
            <div
              key={`${item.corridor}-${idx}`}
              className="flex items-center gap-3 px-6 py-2.5 font-mono text-xs uppercase tracking-[0.14em]"
            >
              <span className={cn("inline-block size-2 rounded-none", item.dot)} aria-hidden="true" />
              <span className={cn("font-bold text-xs sm:text-sm tracking-wide", item.color)}>
                {item.corridor}
              </span>
              <span className={cn("border px-2 py-0.5 font-mono text-xs font-semibold tracking-wider", item.badge)}>
                {item.tag}
              </span>
            </div>
          ))}
        </Marquee>
      </div>
    </div>
  )
}

interface RevealProps {
  children: React.ReactNode
  className?: string
  delay?: number
}

/**
 * Scroll reveal wrapper providing coordinated entry animation with reduced-motion support.
 */
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
