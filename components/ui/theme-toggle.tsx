"use client"

import React from "react"
import { useTheme } from "next-themes"
import { AnimatedThemeToggler } from "@/components/ui/animated-theme-toggler"
import { useHydrated } from "@/hooks/use-hydrated"
import { cn } from "@/lib/utils"

export function ThemeToggle({ className }: { className?: string }) {
  const { resolvedTheme, setTheme } = useTheme()
  const mounted = useHydrated()

  if (!mounted) {
    return (
      <div
        className={cn(
          "size-8.5 border border-border/80 bg-card rounded-none flex items-center justify-center text-muted-foreground",
          className
        )}
        aria-hidden="true"
      >
        <span className="size-4" />
      </div>
    )
  }

  return (
    <AnimatedThemeToggler
      variant="star"
      duration={500}
      theme={resolvedTheme === "dark" ? "dark" : "light"}
      onThemeChange={(newTheme) => setTheme(newTheme)}
      className={cn(
        "size-8.5 border border-border/80 bg-card hover:bg-muted text-foreground transition-colors duration-150 rounded-none flex items-center justify-center focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring shadow-2xs active:scale-95 cursor-pointer",
        className
      )}
      aria-label="Toggle visual theme"
    />
  )
}

