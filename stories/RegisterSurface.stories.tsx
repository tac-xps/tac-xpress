import type { Meta, StoryObj } from "@storybook/nextjs"
import { getCoreRowModel, getPaginationRowModel, useReactTable } from "@tanstack/react-table"
import { DataTable } from "@/components/ui/data-table/data-table"

const records = [
  { awb: "TAC-SYNTHETIC-001", route: "New Delhi to Imphal" },
  { awb: "TAC-SYNTHETIC-002", route: "Imphal to New Delhi" },
]
const emptyRecords: typeof records = []
const columns = [
  { accessorKey: "awb", header: "AWB" },
  { accessorKey: "route", header: "Route" },
]

function RegisterPreview({ enclosed = false, empty = false, loading = false }) {
  const table = useReactTable({
    data: empty ? emptyRecords : records,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  })
  const register = <DataTable table={table} columnsLength={columns.length} bordered={!enclosed} isLoading={loading} />
  return (
    <main className="min-h-svh bg-background p-4 text-foreground">
      <div className="mx-auto flex max-w-5xl flex-col gap-4">
        <h1 className="text-2xl font-semibold">Register composition</h1>
        <p className="text-sm text-muted-foreground">Synthetic records. No operational actions are connected.</p>
        {enclosed ? (
          <section className="min-w-0 overflow-hidden border bg-card" aria-label="Enclosed register">
            <h2 className="border-b p-4 font-semibold">Shipment records</h2>
            {register}
          </section>
        ) : register}
      </div>
    </main>
  )
}

const meta = {
  title: "Audit/Register surface",
  component: RegisterPreview,
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof RegisterPreview>
export default meta
type Story = StoryObj<typeof meta>
export const Standalone: Story = {}
export const Enclosed: Story = { args: { enclosed: true } }
export const Empty: Story = { args: { enclosed: true, empty: true } }
export const Loading: Story = { args: { enclosed: true, loading: true } }
