import { cn } from "@/lib/utils"

export function StatusIndicator({
  className,
  status = "online",
}: {
  className?: string
  status?: "online" | "offline" | "busy" | "away"
}) {
  const statusColors = {
    online: "bg-status-delivered",
    offline: "bg-muted-foreground",
    busy: "bg-destructive",
    away: "bg-status-pending",
  }

  const pingColors = {
    online: "bg-status-delivered",
    offline: "bg-muted-foreground",
    busy: "bg-destructive",
    away: "bg-status-pending",
  }

  return (
    <span className={cn("relative flex h-2.5 w-2.5 shrink-0", className)}>
      {status === "online" && (
        <span
          className={cn(
            "absolute inline-flex h-full w-full animate-ping rounded-full opacity-75",
            pingColors[status]
          )}
        />
      )}
      <span
        className={cn(
          "relative inline-flex h-full w-full rounded-full",
          statusColors[status]
        )}
      />
    </span>
  )
}
