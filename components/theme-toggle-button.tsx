"use client"

import { useTheme } from "next-themes"
import { AnimatedThemeToggler } from "@/components/ui/animated-theme-toggler"

export function ThemeToggleButton() {
  const { theme, resolvedTheme, setTheme } = useTheme()

  const mappedTheme =
    theme === "dark" || resolvedTheme === "dark" ? "dark" : "light"

  return (
    <AnimatedThemeToggler
      variant="star"
      duration={600}
      theme={mappedTheme as "light" | "dark"}
      onThemeChange={(newTheme) => setTheme(newTheme)}
    />
  )
}
