import * as React from "react"
import { cn } from "@/lib/utils"

interface AppShellProps extends React.HTMLAttributes<HTMLDivElement> {
  sidebar: React.ReactNode
  children: React.ReactNode
}

export function AppShell({
  sidebar,
  children,
  className,
  ...props
}: AppShellProps) {
  return (
    <div
      className={cn(
        "flex h-screen w-full overflow-hidden bg-background",
        className
      )}
      {...props}
    >
      <div className="flex-none">{sidebar}</div>
      <main className="flex-1 overflow-y-auto">{children}</main>
    </div>
  )
}
