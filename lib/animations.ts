import type { Variants, Transition } from "motion/react"

/**
 * Standardized Spring & Timing Presets for TAC-XPRESS.
 * Calibrated for high responsiveness (Purpose, Performance, Polish).
 */
export const springs = {
  /** Snappy & physical for buttons, pills, toggles, and icons */
  snappy: { type: "spring", stiffness: 450, damping: 35 } as const,
  /** Gentle & natural for cards, sheets, dialogs, and drawer panels */
  gentle: { type: "spring", stiffness: 300, damping: 28 } as const,
  /** Bouncy for success checkmarks, celebratory badges, and radar pulses */
  bouncy: { type: "spring", stiffness: 400, damping: 20 } as const,
  /** Smooth for layoutId glider bars, tabs, and route indicators */
  smooth: { type: "spring", stiffness: 220, damping: 24 } as const,
}

/** Cubic-bezier curves for standard CSS/Motion transitions */
export const easings = {
  easeOutExpo: [0.16, 1, 0.3, 1] as const,
  easeOutCubic: [0.33, 1, 0.68, 1] as const,
}

/**
 * Common Micro-Interaction Gestures
 */
export const microGestures = {
  tap: { scale: 0.98 },
  tapSubtle: { scale: 0.99 },
  hoverLift: { y: -2 },
  hoverLiftMedium: { y: -4 },
  hoverScale: { scale: 1.02 },
  iconRotate: { rotate: 6, scale: 1.08 },
  iconNudgeX: { x: 2 },
  iconNudgeUp: { y: -2 },
}

/** Container variant to coordinate staggered child item appearances */
export function createStaggerContainer(
  staggerChildren = 0.05,
  delayChildren = 0
): Variants {
  return {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren,
        delayChildren,
      },
    },
  }
}

export type StaggerContainerType = Variants & ((staggerChildren?: number, delayChildren?: number) => Variants)

const defaultStaggerVariants = createStaggerContainer(0.05, 0)

export const staggerContainer: StaggerContainerType = Object.assign(
  (staggerChildren = 0.05, delayChildren = 0): Variants => createStaggerContainer(staggerChildren, delayChildren),
  defaultStaggerVariants
)

export const staggerItem: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: springs.gentle as Transition,
  },
}

export const staggerItemScale: Variants = {
  hidden: { opacity: 0, scale: 0.96 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: springs.gentle as Transition,
  },
}

export const fadeSlideVariant: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: springs.gentle as Transition,
  },
  exit: { opacity: 0, y: -20, transition: { duration: 0.18 } },
}

export const standardFade: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.25 } },
  exit: { opacity: 0, transition: { duration: 0.18 } },
}

export const bubblePopVariant: Variants = {
  hidden: { opacity: 0, y: 8, scale: 0.96 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: springs.snappy as Transition,
  },
  exit: { opacity: 0, scale: 0.96, transition: { duration: 0.15 } },
}
