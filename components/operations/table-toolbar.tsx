import Link from "next/link"
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
  return (
    <form
      action={pathname}
      method="get"
      className="flex flex-col items-stretch gap-3 border-b p-4 sm:flex-row sm:items-end"
    >
      <div className="grid min-w-0 flex-1 gap-2">
        <Label htmlFor="record-search">Search all records</Label>
        <Input
          key={query}
          id="record-search"
          type="search"
          name="q"
          defaultValue={query}
          maxLength={100}
          placeholder={placeholder}
          className="bg-background"
        />
      </div>
      {statuses.length > 0 && (
        <div className="grid gap-2 sm:w-44">
          <Label htmlFor="record-status">Status</Label>
          <Select key={status} name="status" defaultValue={status}>
            <SelectTrigger id="record-status" className="w-full bg-background">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All statuses</SelectItem>
              {statuses.map((item) => (
                <SelectItem key={item.value} value={item.value}>
                  {item.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}
      {sort && <input type="hidden" name="sort" value={sort} />}
      {order && <input type="hidden" name="order" value={order} />}
      <Button type="submit">Apply</Button>
      {(query || status !== "all") && (
        <Button asChild variant="ghost">
          <Link href={pathname}>Clear</Link>
        </Button>
      )}
    </form>
  )
}
