import React from "react"
import { cn } from "@/lib/utils"

export const LogoIcon = ({
  className,
  ...props
}: React.ComponentProps<"div">) => (
  <div
    className={cn(
      "relative flex items-center justify-center overflow-hidden rounded-lg bg-gradient-to-br from-primary to-accent shadow-md ring-1 shadow-primary/30 ring-white/20 dark:ring-white/10",
      "transition-all duration-300 ease-out group-hover:scale-105 group-hover:shadow-lg group-hover:shadow-primary/40",
      className
    )}
    {...props}
  >
    {/* Inner glow effect for premium depth */}
    <div className="absolute inset-0 z-0 rounded-lg mix-blend-overlay ring-1 ring-white/20 ring-inset"></div>

    {/* Abstract Fast Package SVG */}
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      className="z-10 size-full p-[20%] text-white drop-shadow-sm"
    >
      <defs>
        <linearGradient id="logo-cube-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="currentColor" stopOpacity="1" />
          <stop offset="100%" stopColor="currentColor" stopOpacity="0.4" />
        </linearGradient>
      </defs>

      {/* Speed lines */}
      <path
        d="M1 12h6M3 8h4M2 16h5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Package (Isometric Box) */}
      {/* Top face */}
      <path
        d="M16 4L10 7L16 10L22 7L16 4Z"
        fill="url(#logo-cube-grad)"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      {/* Left face */}
      <path
        d="M10 7V15L16 18V10"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      {/* Right face */}
      <path
        d="M22 7V15L16 18"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </svg>
  </div>
)

export const Logo = ({
  className,
  title1 = "TAC",
  title2 = "XPRESS",
  textColor1 = "text-foreground",
  textColor2 = "text-muted-foreground",
  ...props
}: React.ComponentProps<"div"> & {
  title1?: string
  title2?: string
  textColor1?: string
  textColor2?: string
}) => (
  <div
    className={cn(
      "group flex h-8 cursor-pointer items-center gap-2.5 font-heading text-xl select-none",
      className
    )}
    {...props}
  >
    <LogoIcon className="aspect-square h-full w-auto" />
    <div className="flex items-center pt-[2px]">
      <span className={cn("font-black tracking-tight uppercase", textColor1)}>
        {title1}
      </span>
      <span
        className={cn(
          "ml-[1px] font-medium tracking-[0.05em] uppercase opacity-70",
          textColor2
        )}
      >
        {title2}
      </span>
    </div>
  </div>
)
