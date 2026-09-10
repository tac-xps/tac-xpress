import React from "react"
import { cn } from "@/lib/utils"

/**
 * TAC-XPRESS Logo — Nordic Lagom edition
 *
 * Design rationale:
 * - A single, flat geometric mark: two forward-slanting lines converging
 *   to a central vertical stroke — evoking a flight path / vector arrow
 *   without any decoration, glow, or gradient.
 * - Monochrome: uses currentColor so it inherits the surface's foreground,
 *   ensuring legibility on both white and dark backgrounds with zero custom
 *   logic.
 * - Typography: "TAC" in bold tracked caps anchors the brand name;
 *   "XPRESS" in regular weight with wider tracking signals speed without
 *   shouting. The two-weight split is a Nordic Lagom typographic idiom.
 * - The word mark uses a 1px vertical separator between mark and text for
 *   calm structure — no box, no badge, no gradient badge.
 */

export const LogoMark = ({
  className,
  ...props
}: React.ComponentProps<"svg">) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 20 20"
    fill="none"
    aria-hidden="true"
    className={cn("shrink-0 text-foreground", className)}
    {...props}
  >
    {/*
     * Three-stroke vector glyph:
     *  - Two angled strokes form a chevron pointing right → speed, direction
     *  - One vertical stroke at the tip → authority, structure
     * All strokes share the same weight; simplicity is the craft.
     */}
    <path
      d="M2 5.5L10 10L2 14.5"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="square"
      strokeLinejoin="miter"
    />
    <path
      d="M10 2L10 18"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="square"
    />
    <path
      d="M10 10L18 10"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="square"
    />
  </svg>
)

export const Logo = ({
  className,
  ...props
}: React.ComponentProps<"div">) => (
  <div
    className={cn(
      "group flex items-center gap-2.5 select-none",
      className
    )}
    {...props}
  >
    <LogoMark className="h-full w-auto" />

    {/* 1 px vertical rule — structural separator, Nordic Lagom detail */}
    <span
      aria-hidden="true"
      className="block h-4 w-px shrink-0 bg-border"
    />

    {/* Word mark — two-weight typographic pair */}
    <span className="flex items-baseline gap-[3px] font-heading leading-none tracking-tight">
      <span className="text-[0.85em] font-bold uppercase text-foreground">
        TAC
      </span>
      <span className="text-[0.85em] font-normal tracking-[0.12em] uppercase text-muted-foreground">
        XPRESS
      </span>
    </span>
  </div>
)
