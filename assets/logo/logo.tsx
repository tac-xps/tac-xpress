"use client"

import React from "react"
import { useSidebar } from "@/components/ui/sidebar"
import { cn } from "@/lib/utils"

const LogoIcon = ({ className }: { className?: string }) => (
  <div
    className={cn(
      "relative flex shrink-0 items-center justify-center overflow-hidden rounded-lg bg-gradient-to-br from-primary to-blue-400 shadow-md ring-1 shadow-primary/30 ring-white/20 dark:ring-white/10",
      "transition-all duration-300 ease-out group-hover:scale-105 group-hover:shadow-lg group-hover:shadow-primary/40",
      className
    )}
  >
    {/* Inner glow effect for premium depth */}
    <div className="absolute inset-0 z-0 rounded-lg mix-blend-overlay ring-1 ring-white/20 ring-inset"></div>

    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      className="z-10 size-full p-[20%] text-white drop-shadow-sm"
    >
      <defs>
        <linearGradient
          id="dashboard-logo-grad"
          x1="0%"
          y1="0%"
          x2="100%"
          y2="100%"
        >
          <stop offset="0%" stopColor="currentColor" stopOpacity="1" />
          <stop offset="100%" stopColor="currentColor" stopOpacity="0.4" />
        </linearGradient>
      </defs>
      <path
        d="M12 2L2 7L12 12L22 7L12 2Z"
        fill="url(#dashboard-logo-grad)"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path
        d="M2 17L12 22L22 17"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M2 12L12 17L22 12"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  </div>
)

export function Logo() {
  const { state } = useSidebar()

  if (state === "collapsed") {
    return (
      <div className="group flex h-full w-full cursor-pointer items-center justify-center">
        <LogoIcon className="h-8 w-8" />
      </div>
    )
  }

  return (
    <div className="group flex w-full cursor-pointer items-center justify-center gap-2.5 px-1 font-heading text-xl select-none">
      <LogoIcon className="h-8 w-8" />
      <div className="flex items-center pt-[2px]">
        <span className="font-black tracking-tight text-foreground uppercase">
          TAC
        </span>
        <span className="ml-[1px] font-medium tracking-[0.05em] text-muted-foreground uppercase">
          XPRESS
        </span>
      </div>
    </div>
  )
}
