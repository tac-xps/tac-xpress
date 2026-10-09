/**
 * TAC-XPRESS Motion Theme System
 *
 * Implements "Living Logistics" & "Quiet Infrastructure" motion tokens.
 * Single source of truth for animation durations, easings, and springs.
 * Enforces compositor-friendly, calm, physical, and human movement.
 */

import type { Transition } from "motion/react"

/** Semantic duration tokens (in seconds) */
export const motionDurations = {
  /** 120ms - Instant tactile feedback (buttons, toggles) */
  instant: 0.12,
  /** 180ms - Fast micro-interactions */
  fast: 0.18,
  /** 240ms - Standard UI controls and dropdown transitions */
  control: 0.24,
  /** 600ms - Content reveals and waypoint updates */
  reveal: 0.6,
  /** 750ms - Editorial line reveals and image curtains */
  editorial: 0.75,
  /** 900ms - Hero entrance and chapter transitions */
  hero: 0.9,
  /** 1100ms - Brand statement resolution and narrative closure */
  statement: 1.1,
} as const

/** Semantic cubic-bezier easings */
export const motionEasings = {
  /** Nordic Editorial curve: graceful deceleration, no bounce */
  editorial: [0.22, 1, 0.36, 1] as const,
  /** Hero entrance curve: high initial velocity, long graceful settling */
  hero: [0.16, 1, 0.3, 1] as const,
  /** Linear progression for continuous scroll-linked values */
  linear: [0, 0, 1, 1] as const,
  /** Gentle standard ease-out */
  gentle: [0.33, 1, 0.68, 1] as const,
} as const

/** Calibrated Spring Configurations */
export const motionSprings = {
  /** Tactile spring: crisp, physical button/toggle feedback */
  springTactile: {
    type: "spring",
    stiffness: 340,
    damping: 30,
    mass: 0.7,
  } as const,
  /** Editorial spring: calm, natural layout glider and navigation transitions */
  springEditorial: {
    type: "spring",
    stiffness: 180,
    damping: 24,
    mass: 0.9,
  } as const,
  /** Scroll spring: smoothed scroll-linked progression across the Living Cargo Line */
  springScroll: {
    type: "spring",
    stiffness: 110,
    damping: 28,
    mass: 1.0,
  } as const,
} as const

/** Standardized Editorial Reveal Variants */
export const editorialReveal = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: motionDurations.editorial,
      ease: motionEasings.editorial,
    },
  },
} as const

/** Line-level Mask Reveal for Headings */
export const lineMaskReveal = {
  hidden: { y: "110%", opacity: 0.05 },
  visible: (i: number = 0) => ({
    y: "0%",
    opacity: 1,
    transition: {
      duration: motionDurations.hero,
      delay: i * 0.12,
      ease: motionEasings.hero,
    },
  }),
}

/** Standard micro-spring hover & tap transitions */
export const tactileInteraction: {
  whileHover: { y: number }
  whileTap: { scale: number }
  transition: Transition
} = {
  whileHover: { y: -1 },
  whileTap: { scale: 0.98 },
  transition: motionSprings.springTactile,
}
