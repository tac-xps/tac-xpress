"use client"

import { useTheme } from "next-themes"
import * as React from "react"
import { Button } from "@/components/ui/button"
import { MoonIcon, SunIcon } from "@/components/icons/sidebar-icons"

export function ThemeSwitcher() {
  const { setTheme, theme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  const isDark = theme === "dark" || resolvedTheme === "dark"

  const toggleTheme = React.useCallback(() => {
    const nextTheme = isDark ? "light" : "dark"
    setTheme(nextTheme)
  }, [isDark, setTheme])

  if (!mounted) {
    return (
      <Button className="text-muted-foreground" size="icon-sm" variant="ghost">
        <div className="h-4 w-4" />
      </Button>
    )
  }

  return (
    <Button
      className="text-muted-foreground"
      onClick={toggleTheme}
      size="icon-sm"
      variant="ghost"
    >
      {isDark ? (
        <SunIcon className="h-5 w-5" />
      ) : (
        <MoonIcon className="h-5 w-5" />
      )}
      <span className="sr-only">Toggle theme</span>
    </Button>
  )
}
