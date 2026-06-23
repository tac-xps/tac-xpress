import {
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { DashboardCard } from "@/components/dashboard-card"
import { Delta, DeltaIcon, DeltaValue } from "@/components/delta"
import { DataLabel } from "@/components/typography/data-label"

const vitals = [
  {
    label: "REV",
    name: "Total Revenue",
    value: "₹1.2M",
    delta: 12.4,
    deltaLabel: "higher vs prior month",
    suffix: "%",
  },
  {
    label: "ADT",
    name: "Avg Delivery Time",
    value: "2.4d",
    delta: -0.3,
    deltaLabel: "faster vs prior month",
    suffix: "d",
  },
  {
    label: "CSAT",
    name: "Customer Satisfaction",
    value: "4.8",
    delta: 0.1,
    deltaLabel: "higher vs prior month",
    suffix: "/5",
  },
] as const

export function BusinessKPIs() {
  return (
    <DashboardCard className="md:col-span-2 lg:col-span-4">
      <CardHeader className="border-b">
        <CardTitle className="text-balance">Business KPIs</CardTitle>
        <CardDescription className="text-pretty">
          Key performance indicators for operations and revenue.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ul className="grid gap-6 sm:grid-cols-3">
          {vitals.map((v) => (
            <li className="flex flex-col gap-1" key={v.label}>
              <p className="text-sm font-medium text-pretty">{v.label}</p>
              <DataLabel className="m-0">{v.name}</DataLabel>
              <p className="text-2xl font-semibold tracking-tight text-balance tabular-nums">
                {v.value}
              </p>
              <div className="flex items-center gap-1.5 text-sm font-medium tracking-wider text-muted-foreground uppercase">
                <Delta value={v.delta} variant="default">
                  <DeltaIcon />
                  <DeltaValue suffix={v.suffix} />
                </Delta>
                <span>{v.deltaLabel}</span>
              </div>
            </li>
          ))}
        </ul>
      </CardContent>
    </DashboardCard>
  )
}
