import { db } from "@/lib/db"
import { invoices, users, shipments } from "@/lib/db/schema"
import { eq, desc } from "drizzle-orm"
import { notFound } from "next/navigation"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export const dynamic = "force-dynamic"

export default async function CustomerLedgerPage(props: {
  params: Promise<{ id: string }>
}) {
  const params = await props.params
  const customerId = params.id

  const customer = await db.query.users.findFirst({
    where: eq(users.id, customerId),
  })

  if (!customer) {
    notFound()
  }

  const customerInvoices = await db
    .select({
      id: invoices.id,
      amount: invoices.amount,
      advancePaid: invoices.advancePaid,
      balanceDue: invoices.balanceDue,
      status: invoices.status,
      createdAt: invoices.createdAt,
      awbNumber: shipments.awbNumber,
    })
    .from(invoices)
    .leftJoin(shipments, eq(invoices.shipmentId, shipments.id))
    .where(eq(invoices.customerId, customerId))
    .orderBy(desc(invoices.createdAt))

  const totalBilled = customerInvoices.reduce(
    (sum, inv) => sum + (inv.amount || 0),
    0
  )
  const totalAdvance = customerInvoices.reduce(
    (sum, inv) => sum + (inv.advancePaid || 0),
    0
  )
  const totalDue = customerInvoices.reduce(
    (sum, inv) => sum + (inv.balanceDue || 0),
    0
  )

  return (
    <div className="flex flex-col gap-4 md:gap-6">
      <div>
        <h1 className="text-xl font-semibold tracking-tight">
          Customer Ledger
        </h1>
        <p className="text-muted-foreground">
          Statement of Account for {customer.email}
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Billed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ₹{(totalBilled / 100).toLocaleString()}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Total Paid (Advances)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-trend-positive text-2xl font-bold">
              ₹{(totalAdvance / 100).toLocaleString()}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Balance Due</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">
              ₹{(totalDue / 100).toLocaleString()}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-4 border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>AWB Number</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Billed</TableHead>
              <TableHead className="text-right">Paid</TableHead>
              <TableHead className="text-right">Due</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {customerInvoices.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  No invoices found for this customer.
                </TableCell>
              </TableRow>
            ) : (
              customerInvoices.map((inv) => (
                <TableRow key={inv.id}>
                  <TableCell>
                    {new Date(inv.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="font-medium">
                    {inv.awbNumber || "N/A"}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        inv.status === "paid" ? "default" : "destructive"
                      }
                    >
                      {inv.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    ₹{((inv.amount || 0) / 100).toLocaleString()}
                  </TableCell>
                  <TableCell className="text-trend-positive text-right">
                    ₹{((inv.advancePaid || 0) / 100).toLocaleString()}
                  </TableCell>
                  <TableCell className="text-right font-bold text-destructive">
                    ₹{((inv.balanceDue || 0) / 100).toLocaleString()}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
