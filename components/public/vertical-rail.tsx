import { ReactNode } from "react"
import { cn } from "@/lib/utils"

export function VerticalRail({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <ol className={cn("cargo-rail relative ml-2 border-l border-dashed border-border py-4 sm:ml-4", className)}>
      {children}
    </ol>
  )
}

export function VerticalRailStep({
  number,
  title,
  text,
  className,
}: {
  number: string
  title: string
  text: string
  className?: string
}) {
  return (
    <li className={cn("cargo-rail-step relative pb-16 pl-8 last:pb-0 sm:pl-12", className)}>
      <span className="cargo-rail-marker absolute -left-[8.5px] top-1 flex h-4 w-4 items-center justify-center rounded-none bg-primary/20 ring-4 ring-background">
        <span className="h-2 w-2 rounded-none bg-primary" />
      </span>
      <div className="flex flex-col gap-3 md:max-w-xl">
        <span className="font-mono text-sm font-bold text-muted-foreground">{number}</span>
        <h3 className="text-xl font-medium">{title}</h3>
        <p className="leading-relaxed text-muted-foreground">{text}</p>
      </div>
    </li>
  )
}
