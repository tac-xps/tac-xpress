"use client"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { Moon, Sun } from "lucide-react"
import { cn } from "@/lib/utils"

export function ThemeSwitcher({ className }: { className?: string }) {
  const { setTheme, resolvedTheme } = useTheme()
  return (
    <Button
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
      variant="ghost"
      size="icon"
      className={cn("size-9 rounded-none", className)}
      aria-label="Toggle color theme"
    >
      <Sun className="hidden size-3.5 dark:block" />
      <Moon className="size-3.5 dark:hidden" />
    </Button>
  )
}

