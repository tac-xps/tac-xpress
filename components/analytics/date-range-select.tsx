"use client"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useRouter, useSearchParams } from "next/navigation"

const PERIODS = [
  { value: "7d", label: "Last 7 days" },
  { value: "30d", label: "Last 30 days" },
  { value: "90d", label: "Last 90 days" },
  { value: "month", label: "This month" },
  { value: "lastmonth", label: "Last month" },
  { value: "all", label: "All time" },
]

export function DateRangeSelect({ current }: { current: string }) {
  const router = useRouter()
  const searchParams = useSearchParams()

  function handleChange(val: string) {
    const params = new URLSearchParams(searchParams)
    params.set("period", val)
    router.push(`?${params.toString()}`, { scroll: false })
  }

  return (
    <Select value={current} onValueChange={handleChange}>
      <SelectTrigger className="w-full sm:w-[180px] h-9">
        <SelectValue placeholder="Select period" />
      </SelectTrigger>
      <SelectContent position="popper" sideOffset={4}>
        {PERIODS.map((p) => (
          <SelectItem key={p.value} value={p.value}>
            {p.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
