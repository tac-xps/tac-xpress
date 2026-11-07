"use client"

import React from "react"
import { useTheme } from "next-themes"
import { AnimatedThemeToggler } from "@/components/ui/animated-theme-toggler"
import { useHydrated } from "@/hooks/use-hydrated"
import { cn } from "@/lib/utils"

export function ThemeToggle({
  className,
  iconClassName,
}: {
  className?: string
  iconClassName?: string
}) {
  const { resolvedTheme, setTheme } = useTheme()
  const mounted = useHydrated()

  if (!mounted) {
    return (
      <div
        className={cn(
          "size-9 border border-border/80 bg-card rounded-none flex items-center justify-center text-muted-foreground",
          className
        )}
        aria-hidden="true"
      >
        <span className={cn("size-3.5", iconClassName)} />
      </div>
    )
  }

  return (
    <AnimatedThemeToggler
      variant="rectangle"
      duration={450}
      theme={resolvedTheme === "dark" ? "dark" : "light"}
      onThemeChange={(newTheme) => setTheme(newTheme)}
      iconClassName={cn("size-3.5 text-foreground/85 transition-colors", iconClassName)}
      className={cn(
        "size-9 border border-border/80 bg-card hover:bg-muted text-foreground transition-colors duration-150 rounded-none flex items-center justify-center focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring shadow-2xs active:scale-95 cursor-pointer",
        className
      )}
      aria-label="Toggle color theme"
    />
  )
}
