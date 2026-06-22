import React from "react"
import { db } from "@/lib/db"
import { invoices } from "@/lib/db/schema"
import { sql } from "drizzle-orm"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Download, Receipt, Search, Filter } from "lucide-react"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import { InvoiceDataTable } from "./invoice-data-table"
import { InvoicesIcon } from "@/components/icons/sidebar-icons"
import {
  DEFAULT_PAGE_SIZE,
  PageNavigation,
  parsePage,
} from "@/components/ui/page-navigation"

export default async function InvoicesPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string | string[] }>
}) {
  const page = parsePage((await searchParams).page)
  const monthStart = new Date()
  monthStart.setDate(1)
  monthStart.setHours(0, 0, 0, 0)

  const [invoiceRows, [financials]] = await Promise.all([
    db.query.invoices.findMany({
      with: { customer: true, shipment: true },
      orderBy: (invoice, { desc }) => [desc(invoice.createdAt)],
      limit: DEFAULT_PAGE_SIZE + 1,
      offset: (page - 1) * DEFAULT_PAGE_SIZE,
    }),
    db
      .select({
        outstanding: sql<number>`coalesce(sum(case when ${invoices.status} = 'unpaid' then coalesce(${invoices.balanceDue}, ${invoices.amount}) else 0 end), 0)`,
        receivedThisMonth: sql<number>`coalesce(sum(case when ${invoices.status} = 'paid' and ${invoices.updatedAt} >= date_trunc('month', now()) then ${invoices.amount} else 0 end), 0)`,
        overdueAccounts: sql<number>`count(*) filter (where ${invoices.status} = 'unpaid' and ${invoices.dueDate} < now())`,
      })
      .from(invoices),
  ])
  const hasNext = invoiceRows.length > DEFAULT_PAGE_SIZE
  const dbInvoices = invoiceRows.slice(0, DEFAULT_PAGE_SIZE)

  const currency = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
  })

  return (
    <div className="mx-auto flex w-full max-w-[1600px] flex-col gap-4 md:gap-8">
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div className="flex items-center gap-4">
          <div className="shrink-0 rounded-lg bg-primary/10 p-3">
            <InvoicesIcon className="size-8 text-primary" />
          </div>
          <div className="space-y-1">
            <h1 className="text-3xl font-semibold tracking-tight text-foreground">
              Invoices
            </h1>
            <p className="text-sm text-muted-foreground">
              Financial ledgers and outstanding balances.
            </p>
          </div>
        </div>
        <Link href="/dashboard/invoices/create">
          <Button className="bg-primary text-primary-foreground shadow-lg shadow-primary/20">
            <Receipt className="mr-2 size-4" />
            Create Invoice
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <Card className="delay-0">
          <CardContent className="p-6">
            <p className="mb-1 text-sm font-medium text-muted-foreground">
              Total Outstanding
            </p>
            <p className="text-3xl font-bold tracking-tight tabular-nums">
              {currency.format(Number(financials?.outstanding ?? 0) / 100)}
            </p>
          </CardContent>
        </Card>
        <Card className="delay-75">
          <CardContent className="p-6">
            <p className="mb-1 text-sm font-medium text-muted-foreground">
              Received This Month
            </p>
            <p className="text-trend-positive text-3xl font-bold tracking-tight tabular-nums">
              {currency.format(
                Number(financials?.receivedThisMonth ?? 0) / 100
              )}
            </p>
          </CardContent>
        </Card>
        <Card className="delay-150">
          <CardContent className="p-6">
            <p className="mb-1 text-sm font-medium text-muted-foreground">
              Overdue Accounts
            </p>
            <p className="text-trend-negative text-3xl font-bold tracking-tight tabular-nums">
              {Number(financials?.overdueAccounts ?? 0)}
            </p>
          </CardContent>
        </Card>
      </div>

      <Card className="delay-200">
        <CardHeader className="flex flex-col items-start justify-between gap-4 border-b border-border/50 p-4 sm:flex-row sm:items-center sm:gap-0">
          <CardTitle className="text-base font-semibold tracking-tight">
            Recent Invoices
          </CardTitle>
          <div className="flex w-full items-center gap-3 sm:w-auto">
            <div className="relative w-full sm:w-[250px]">
              <Search className="absolute top-2.5 left-2.5 size-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search Invoice ID or Client..."
                className="h-9 border-border/50 bg-background pl-8"
              />
            </div>
          </div>
        </CardHeader>
        <div className="w-full">
          <InvoiceDataTable data={dbInvoices} />
        </div>
        <PageNavigation
          page={page}
          hasNext={hasNext}
          pathname="/dashboard/invoices"
        />
      </Card>
    </div>
  )
}
