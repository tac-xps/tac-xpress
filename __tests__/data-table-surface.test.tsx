// @vitest-environment jsdom
import { afterEach, describe, expect, it } from "vitest"
import { act } from "react"
import { createRoot, type Root } from "react-dom/client"
import { getCoreRowModel, getPaginationRowModel, useReactTable } from "@tanstack/react-table"
import { DataTable } from "@/components/ui/data-table/data-table"

Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true })
let root: Root | undefined
let container: HTMLDivElement | undefined
const rows = [{ awb: "TAC-SYNTHETIC-001" }, { awb: "TAC-SYNTHETIC-002" }]
const emptyRows: typeof rows = []
const columns = [{ accessorKey: "awb", header: "AWB" }]

function Register({ enclosed, empty }: { enclosed: boolean; empty: boolean }) {
  const table = useReactTable({
    data: empty ? emptyRows : rows,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageIndex: 0, pageSize: 1 } },
  })
  const register = <DataTable table={table} columnsLength={1} bordered={enclosed ? false : undefined} />
  return enclosed ? <section className="bg-card border">{register}</section> : register
}

afterEach(async () => {
  if (root) await act(async () => root?.unmount())
  container?.remove()
  root = undefined
  container = undefined
})

describe("register surface ownership", () => {
  it.each([true, false])("keeps exactly one surface and working pagination when enclosed=%s", async (enclosed) => {
    container = document.createElement("div")
    document.body.append(container)
    root = createRoot(container)
    await act(async () => root?.render(<Register enclosed={enclosed} empty={false} />))
    expect(container.querySelectorAll(".bg-card")).toHaveLength(1)
    expect(container.textContent).toContain("TAC-SYNTHETIC-001")
    const next = Array.from(container.querySelectorAll("button")).find((button) => button.textContent?.includes("Go to next page"))
    if (!next) throw new Error("Expected next page button")
    await act(async () => next.click())
    expect(container.textContent).toContain("TAC-SYNTHETIC-002")
    expect(container.textContent).not.toContain("TAC-SYNTHETIC-001")
    await act(async () => root?.render(<Register enclosed={enclosed} empty />))
    expect(container.querySelectorAll(".bg-card")).toHaveLength(1)
    expect(container.textContent).toContain("No results found")
    expect(next.disabled).toBe(true)
  })
})
