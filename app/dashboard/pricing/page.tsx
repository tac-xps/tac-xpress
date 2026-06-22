import * as Sentry from "@sentry/nextjs"
import { Calculator } from "lucide-react"
import { desc, isNull } from "drizzle-orm"

import { AddPricingRuleDialog } from "./add-pricing-rule-dialog"
import { PricingActions } from "./pricing-actions"
import { PricingCalculatorClient } from "./pricing-calculator-client"
import { PricingIcon } from "@/components/icons/sidebar-icons"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { db } from "@/lib/db"
import { pricingRules } from "@/lib/db/schema"
import {
  DEFAULT_PAGE_SIZE,
  PageNavigation,
  parsePage,
} from "@/components/ui/page-navigation"

function formatServiceType(service: string) {
  return service
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ")
}

export default async function PricingPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string | string[] }>
}) {
  const page = parsePage((await searchParams).page)
  let rules: (typeof pricingRules.$inferSelect)[] = []

  try {
    rules = await db
      .select()
      .from(pricingRules)
      .where(isNull(pricingRules.deletedAt))
      .orderBy(desc(pricingRules.createdAt))
      .limit(DEFAULT_PAGE_SIZE + 1)
      .offset((page - 1) * DEFAULT_PAGE_SIZE)
  } catch (error) {
    Sentry.captureException(error)
    throw error
  }
  const hasNext = rules.length > DEFAULT_PAGE_SIZE
  rules = rules.slice(0, DEFAULT_PAGE_SIZE)

  return (
    <div className="mx-auto flex w-full max-w-[1200px] animate-in flex-col gap-4 duration-500 fade-in md:gap-8">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div className="flex items-center gap-4">
          <div className="shrink-0 rounded-lg bg-primary/10 p-3 shadow-inner">
            <PricingIcon className="size-8 text-primary" />
          </div>
          <div className="flex flex-col gap-1">
            <h1 className="text-3xl font-semibold tracking-tight text-foreground">
              Pricing & Rates
            </h1>
            <p className="text-sm text-muted-foreground">
              Rates shown here are active rules configured in the platform.
            </p>
          </div>
        </div>
        <AddPricingRuleDialog />
      </div>

      <PricingCalculatorClient />

      <Card className="overflow-hidden border border-border/60 bg-card/60 shadow-sm backdrop-blur-sm">
        <CardHeader className="flex flex-row items-center justify-between border-b border-border/50 bg-muted/10 p-6">
          <CardTitle className="flex items-center gap-2 text-lg font-semibold tracking-tight">
            <Calculator className="size-5 text-primary" />
            Active Route Rates
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {rules.length === 0 ? (
            <div className="flex min-h-48 flex-col items-center justify-center p-6 text-center">
              <Calculator className="mb-3 size-8 text-muted-foreground" />
              <p className="text-sm font-semibold">
                No pricing rules configured
              </p>
              <p className="mt-1 max-w-sm text-xs text-muted-foreground">
                Add an approved route rate before generating customer quotes.
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader className="bg-muted/5">
                <TableRow>
                  <TableHead className="pl-6 font-semibold">
                    Service Type
                  </TableHead>
                  <TableHead className="font-semibold">Origin Hub</TableHead>
                  <TableHead className="font-semibold">
                    Destination Hub
                  </TableHead>
                  <TableHead className="text-right font-semibold">
                    Base Price
                  </TableHead>
                  <TableHead className="text-right font-semibold">
                    Price per Kg
                  </TableHead>
                  <TableHead className="w-20 pr-6" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {rules.map((rule) => (
                  <TableRow key={rule.id}>
                    <TableCell className="pl-6 font-medium">
                      {formatServiceType(rule.serviceType)}
                    </TableCell>
                    <TableCell className="font-mono uppercase">
                      {rule.origin}
                    </TableCell>
                    <TableCell className="font-mono uppercase">
                      {rule.destination}
                    </TableCell>
                    <TableCell className="text-right font-medium tabular-nums">
                      ₹{(rule.basePrice / 100).toFixed(2)}
                    </TableCell>
                    <TableCell className="text-right font-medium tabular-nums">
                      ₹{(rule.pricePerKg / 100).toFixed(2)}
                    </TableCell>
                    <TableCell className="pr-6 text-center">
                      <PricingActions rule={rule} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
        <PageNavigation
          page={page}
          hasNext={hasNext}
          pathname="/dashboard/pricing"
        />
      </Card>
    </div>
  )
}
