"use client"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { Moon, Sun } from "lucide-react"
export function ThemeSwitcher() {
  const { setTheme, resolvedTheme } = useTheme()
  return <Button onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")} size="icon" variant="ghost" aria-label="Toggle color theme"><Sun className="hidden size-4 dark:block" /><Moon className="size-4 dark:hidden" /></Button>
}
