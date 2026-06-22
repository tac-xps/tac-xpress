import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import type { HubOperationsSummary } from "@/lib/dashboard-metrics"
import { ArrowRight, MapPin } from "lucide-react"

type EarningReportChartProps = {
  summary: HubOperationsSummary
}

export function EarningReportChart({ summary }: EarningReportChartProps) {
  return (
    <Card className="group relative flex h-full min-h-[350px] flex-col overflow-hidden delay-500">
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="absolute inset-0 bg-[url('/images/dashboard/8a.png')] bg-cover bg-center transition-transform duration-700 ease-out group-hover:scale-105 dark:bg-[url('/images/dashboard/8b.png')]" />
        <div className="absolute inset-0 bg-gradient-to-b from-background/95 via-background/20 to-background/90" />
      </div>

      <CardHeader className="relative z-10 p-6">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-base font-semibold tracking-tight">
            <MapPin className="size-4 text-primary" />
            Regional Hub Operations
          </CardTitle>
          <div className="relative flex h-2 w-2">
            {summary.hasLiveData ? (
              <>
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-status-delivered opacity-75"></span>
                <span className="relative inline-flex size-2 rounded-full bg-status-delivered"></span>
              </>
            ) : (
              <span className="relative inline-flex size-2 rounded-full bg-muted-foreground"></span>
            )}
          </div>
        </div>
        <p className="mt-1 text-sm leading-snug text-foreground drop-shadow-sm">
          {summary.title}
        </p>
        <p className="mt-2 text-sm leading-snug text-foreground/75 drop-shadow-sm">
          {summary.description}
        </p>
      </CardHeader>

      <CardContent className="relative z-10 min-h-[150px] flex-1 p-0" />

      <div className="relative z-10 p-4">
        <Button
          asChild
          className="w-full border border-border/50 bg-background/80 text-foreground shadow-lg backdrop-blur-md transition-all group-hover:shadow-xl hover:bg-background/90"
          variant="outline"
        >
          <Link href="/dashboard/hubs">
            View Hub Network
            <ArrowRight className="ml-2 size-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </Button>
      </div>
    </Card>
  )
}
