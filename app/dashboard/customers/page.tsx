import React from "react"
import { db } from "@/lib/db"
import { users } from "@/lib/db/schema"
import { eq, desc, isNull, and } from "drizzle-orm"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Download, Filter, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { AddCustomerDialog } from "./add-customer-dialog"
import { CustomerActions } from "./customer-actions"
import { CustomerDataTable } from "./customer-data-table"
import { CustomersIcon } from "@/components/icons/sidebar-icons"
import {
  DEFAULT_PAGE_SIZE,
  PageNavigation,
  parsePage,
} from "@/components/ui/page-navigation"

export default async function CustomersPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string | string[] }>
}) {
  const page = parsePage((await searchParams).page)
  const rows = await db
    .select()
    .from(users)
    .where(and(eq(users.role, "customer"), isNull(users.deletedAt)))
    .orderBy(desc(users.createdAt))
    .limit(DEFAULT_PAGE_SIZE + 1)
    .offset((page - 1) * DEFAULT_PAGE_SIZE)
  const hasNext = rows.length > DEFAULT_PAGE_SIZE
  const dbCustomers = rows.slice(0, DEFAULT_PAGE_SIZE)

  return (
    <div className="mx-auto flex w-full max-w-[1600px] flex-col gap-4 md:gap-8">
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div className="flex items-center gap-4">
          <div className="shrink-0 rounded-lg bg-primary/10 p-3">
            <CustomersIcon className="size-8 text-primary" />
          </div>
          <div className="space-y-1">
            <h1 className="text-3xl font-semibold tracking-tight text-foreground">
              Customers
            </h1>
            <p className="text-sm text-muted-foreground">
              Manage client relationships and track lifetime value.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="border-border/50 bg-background">
            <Filter className="mr-2 size-4" />
            Filter
          </Button>
          <Button variant="outline" className="border-border/50 bg-background">
            <Download className="mr-2 size-4" />
            Export
          </Button>
          <AddCustomerDialog />
        </div>
      </div>

      <Card className="overflow-hidden delay-0">
        <CardHeader className="flex flex-row items-center justify-between border-b border-border/50 bg-muted/20 p-4">
          <CardTitle className="text-base font-semibold tracking-tight">
            Client Roster
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="w-full">
            <CustomerDataTable data={dbCustomers} />
            <PageNavigation
              page={page}
              hasNext={hasNext}
              pathname="/dashboard/customers"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
