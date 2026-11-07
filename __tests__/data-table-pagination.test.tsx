// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { act, useState } from "react"
import { createRoot, type Root } from "react-dom/client"
import {
  getCoreRowModel,
  useReactTable,
  type PaginationState,
  type Table,
} from "@tanstack/react-table"
import { DataTablePagination } from "@/components/ui/data-table/data-table-pagination"

Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true })
let container: HTMLDivElement
let root: Root
let table: Table<{ id: string }> | undefined
function Pagination({
  pages,
  initialIndex = 0,
}: {
  pages: number
  initialIndex?: number
}) {
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: initialIndex,
    pageSize: 25,
  })
  const current = useReactTable<{ id: string }>({
    data: [],
    columns: [{ accessorKey: "id" }],
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    pageCount: pages,
    state: { pagination },
    onPaginationChange: setPagination,
  })
  table = current
  return <DataTablePagination table={current} />
}
beforeEach(() => {
  container = document.createElement("div")
  document.body.append(container)
  root = createRoot(container)
  vi.stubGlobal(
    "fetch",
    vi.fn(() => {
      throw new Error("Unexpected network request")
    })
  )
})
afterEach(async () => {
  await act(async () => root.unmount())
  container.remove()
  table = undefined
  vi.unstubAllGlobals()
})

describe("data table pagination", () => {
  it("shows Page 0 of 0 and disables every paging control for empty data", async () => {
    await act(async () =>
      root.render(<Pagination pages={0} initialIndex={4} />)
    )
    expect(container.textContent).toContain("Page 0 of 0")
    expect(table?.getState().pagination.pageIndex).toBe(0)
    const controls = Array.from(container.querySelectorAll("button")).filter(
      (button) => button.textContent?.includes("Go to")
    )
    expect(controls).toHaveLength(4)
    expect(controls.every((button) => button.disabled)).toBe(true)
  })

  it("associates the Rows per page label with its real select trigger using unique IDs", async () => {
    await act(async () =>
      root.render(
        <>
          <Pagination pages={1} />
          <Pagination pages={1} />
        </>
      )
    )
    const triggers = Array.from(
      container.querySelectorAll<HTMLButtonElement>('[role="combobox"]')
    )
    expect(triggers).toHaveLength(2)
    expect(triggers.map((trigger) => trigger.labels?.[0]?.textContent)).toEqual(
      ["Rows per page", "Rows per page"]
    )
    expect(triggers[0].id).not.toBe(triggers[1].id)
  })

  it("recovers a stale page index after the result count shrinks", async () => {
    await act(async () =>
      root.render(<Pagination pages={5} initialIndex={4} />)
    )
    expect(container.textContent).toContain("Page 5 of 5")
    await act(async () =>
      root.render(<Pagination pages={2} initialIndex={4} />)
    )
    expect(table?.getState().pagination.pageIndex).toBe(1)
    expect(container.textContent).toContain("Page 2 of 2")
    expect(fetch).not.toHaveBeenCalled()
  })

  it("preserves normal previous/next navigation and does not submit an enclosing form", async () => {
    const submit = vi.fn((event: React.FormEvent) => event.preventDefault())
    await act(async () =>
      root.render(
        <form onSubmit={submit}>
          <Pagination pages={3} />
        </form>
      )
    )
    const next = Array.from(container.querySelectorAll("button")).find(
      (button) => button.textContent?.includes("Go to next page")
    )
    if (!next) throw new Error("Expected next-page control")
    await act(async () => next.click())
    expect(container.textContent).toContain("Page 2 of 3")
    expect(table?.getState().pagination.pageIndex).toBe(1)
    expect(submit).not.toHaveBeenCalled()
  })

  it("keeps next-page navigation for an unknown manual page count and disables last-page jump", async () => {
    await act(async () => root.render(<Pagination pages={-1} />))
    expect(container.textContent).not.toContain("of -1")
    const next = Array.from(container.querySelectorAll("button")).find(
      (button) => button.textContent?.includes("Go to next page")
    )
    const last = Array.from(container.querySelectorAll("button")).find(
      (button) => button.textContent?.includes("Go to last page")
    )
    expect(next?.disabled).toBe(false)
    expect(last?.disabled).toBe(true)
  })
})
