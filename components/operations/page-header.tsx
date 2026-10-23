import type { ReactNode } from "react"
import { cn } from "@/lib/utils"

export function PageHeader({
  title,
  description,
  eyebrow,
  children,
  className,
}: {
  title: string
  description?: string
  eyebrow?: string
  children?: ReactNode
  className?: string
}) {
  return (
    <div className={cn("flex flex-col items-start justify-between gap-5 border-b border-border/70 pb-6 sm:flex-row sm:items-end", className)}>
      <div className="min-w-0 space-y-1.5">
        <div className="flex items-center gap-2">
          <span className="size-1.5 bg-primary rounded-none" aria-hidden="true" />
          <span className="font-mono text-xs font-semibold uppercase tracking-[0.08em] text-muted-foreground">
            {eyebrow || "Tac-Xpress / Operations"}
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-semibold tracking-[-0.03em] text-foreground text-balance">
          {title}
        </h1>
        {description && (
          <p className="max-w-3xl text-sm leading-relaxed text-muted-foreground font-normal text-pretty">
            {description}
          </p>
        )}
      </div>
      {children && (
        <div className="flex shrink-0 flex-wrap items-center gap-2.5">
          {children}
        </div>
      )}
    </div>
  )
}
