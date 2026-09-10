import type { ReactNode } from "react"
export function PageHeader({
  title,
  description,
  children,
}: {
  title: string
  description: string
  children?: ReactNode
}) {
  return (
    <div className="flex flex-col items-start justify-between gap-5 sm:flex-row sm:items-end">
      <div className="min-w-0">
        <h1 className="text-3xl font-medium tracking-tight">{title}</h1>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
          {description}
        </p>
      </div>
      {children && (
        <div className="flex shrink-0 flex-wrap items-center gap-2">
          {children}
        </div>
      )}
    </div>
  )
}
