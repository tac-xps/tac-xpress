import Link from "next/link"
import { ChevronLeft, ChevronRight } from "lucide-react"

import { Button } from "@/components/ui/button"

export const DEFAULT_PAGE_SIZE = 25

export function parsePage(value: string | string[] | undefined) {
  const parsed = Number(Array.isArray(value) ? value[0] : value)
  return Number.isInteger(parsed) && parsed > 0 ? parsed : 1
}

export function PageNavigation({
  page,
  hasNext,
  pathname,
}: {
  page: number
  hasNext: boolean
  pathname: string
}) {
  if (page === 1 && !hasNext) return null

  return (
    <div className="flex items-center justify-end gap-2 border-t border-border/50 px-4 py-3">
      <Button
        asChild={page > 1}
        disabled={page === 1}
        size="sm"
        variant="outline"
      >
        {page > 1 ? (
          <Link href={`${pathname}?page=${page - 1}`}>
            <ChevronLeft className="size-4" />
            Previous
          </Link>
        ) : (
          <span>
            <ChevronLeft className="size-4" />
            Previous
          </span>
        )}
      </Button>
      <span className="px-2 text-sm text-muted-foreground">Page {page}</span>
      <Button asChild={hasNext} disabled={!hasNext} size="sm" variant="outline">
        {hasNext ? (
          <Link href={`${pathname}?page=${page + 1}`}>
            Next
            <ChevronRight className="size-4" />
          </Link>
        ) : (
          <span>
            Next
            <ChevronRight className="size-4" />
          </span>
        )}
      </Button>
    </div>
  )
}
