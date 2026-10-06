import Link from "next/link"
import { Search, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export function TableToolbar({
  pathname,
  query,
  status = "all",
  statuses = [],
  placeholder = "Search records",
  sort,
  order,
}: {
  pathname: string
  query: string
  status?: string
  statuses?: { value: string; label: string }[]
  placeholder?: string
  sort?: string
  order?: string
}) {
  const isFiltered = Boolean(query || (status && status !== "all"))

  return (
    <form
      action={pathname}
      method="get"
      className="flex flex-wrap items-center gap-2.5 border-b border-border/80 bg-muted/20 px-4 py-3"
    >
      <div className="relative min-w-[200px] flex-1 sm:max-w-xs">
        <Label htmlFor="record-search" className="sr-only">
          Search records
        </Label>
        <Search className="pointer-events-none absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground/70" />
        <Input
          key={query}
          id="record-search"
          type="search"
          name="q"
          defaultValue={query}
          maxLength={100}
          placeholder={placeholder}
          className="h-8.5 rounded-xs border-border/80 bg-background pl-8 text-xs shadow-none placeholder:text-muted-foreground/60"
        />
      </div>

      {statuses.length > 0 && (
        <div className="flex items-center">
          <Label htmlFor="record-status" className="sr-only">
            Status
          </Label>
          <Select key={status} name="status" defaultValue={status}>
            <SelectTrigger
              id="record-status"
              className="h-8.5 min-w-[130px] rounded-xs border-border/80 bg-background text-xs shadow-none"
            >
              <SelectValue placeholder="All statuses" />
            </SelectTrigger>
            <SelectContent align="start">
              <SelectItem value="all" className="text-xs">
                All statuses
              </SelectItem>
              {statuses.map((item) => (
                <SelectItem key={item.value} value={item.value} className="text-xs">
                  {item.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {sort && <input type="hidden" name="sort" value={sort} />}
      {order && <input type="hidden" name="order" value={order} />}

      <Button
        type="submit"
        variant="secondary"
        size="sm"
        className="h-8.5 rounded-xs px-3 text-xs font-medium cursor-pointer"
      >
        Filter
      </Button>

      {isFiltered && (
        <Button
          asChild
          variant="ghost"
          size="sm"
          className="h-8.5 rounded-xs px-2.5 text-xs text-muted-foreground hover:text-foreground cursor-pointer"
        >
          <Link href={pathname} className="inline-flex items-center gap-1.5">
            <X className="size-3.5" />
            Reset
          </Link>
        </Button>
      )}
    </form>
  )
}
