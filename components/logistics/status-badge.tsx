import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
export function StatusBadge({ status = "pending", label, className, showDot = true }: { status?: string; label?: string; className?: string; showDot?: boolean; pulse?: boolean }) {
  const tone = ["delivered", "active", "paid"].includes(status) ? "border-status-delivered/20 bg-status-delivered/10 text-status-delivered"
    : ["failed", "unpaid"].includes(status) ? "border-status-failed/20 bg-status-failed/10 text-status-failed"
    : ["in-transit", "out-for-delivery", "processing"].includes(status) ? "border-status-transit/20 bg-status-transit/10 text-status-transit"
    : "border-border bg-muted text-muted-foreground"
  return <Badge variant="outline" className={cn("gap-1.5 text-xs font-medium capitalize", tone, className)}>{showDot && <span aria-hidden="true" className="size-1.5 rounded-none bg-current" />}{label || status.replaceAll("-", " ")}</Badge>
}


