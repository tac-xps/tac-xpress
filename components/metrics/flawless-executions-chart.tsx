import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
export function FlawlessExecutionsChart({
  onTimeCount,
  deliveredCount,
}: {
  onTimeCount: number
  deliveredCount: number
}) {
  const rate = deliveredCount ? (onTimeCount / deliveredCount) * 100 : null
  return (
    <Card className="shadow-none">
      <CardHeader>
        <CardTitle>On-time deliveries</CardTitle>
        <CardDescription>
          Recorded deliveries in the last 30 days
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-5">
        <p className="text-4xl font-medium tabular-nums">
          {rate === null ? "No data" : `${rate.toFixed(1)}%`}
        </p>
        <Progress value={rate ?? 0} aria-label="On-time delivery percentage" />
        <p className="text-sm">
          {onTimeCount} of {deliveredCount} assessed deliveries
        </p>
        <p className="text-xs leading-relaxed text-muted-foreground">
          Compares the first delivered tracking event with the expected delivery
          date. Shipments without either record are excluded.
        </p>
      </CardContent>
    </Card>
  )
}
