import { requireStaffPage } from "@/lib/auth/page-access"
import * as Sentry from "@sentry/nextjs"
import { Calculator } from "lucide-react"
import { desc, isNull, sql } from "drizzle-orm"

import { AddPricingRuleDialog } from "./add-pricing-rule-dialog"
import { PricingCalculatorClient } from "./pricing-calculator-client"
import { PricingDataTable } from "./pricing-data-table"
import { PricingIcon } from "@/components/icons/sidebar-icons"
import { db } from "@/lib/db"
import { pricingRules } from "@/lib/db/schema"
import { parseRecordQuery, type RecordSearchParams } from "@/lib/table-query"

export default async function PricingPage({
  searchParams,
}: {
  searchParams: Promise<RecordSearchParams>
}) {
  await requireStaffPage()

  const { page, pageSize } = parseRecordQuery(await searchParams, [])
  let rules: (typeof pricingRules.$inferSelect)[] = []
  let totalCount = 0

  try {
    const [rulesData, countData] = await Promise.all([
      db
        .select()
        .from(pricingRules)
        .where(isNull(pricingRules.deletedAt))
        .orderBy(desc(pricingRules.createdAt))
        .limit(pageSize)
        .offset((page - 1) * pageSize),
      db
        .select({ count: sql<number>`count(*)` })
        .from(pricingRules)
        .where(isNull(pricingRules.deletedAt))
    ])
    rules = rulesData
    totalCount = Number(countData[0].count)
  } catch (error) {
    Sentry.captureException(error)
    throw error
  }
  
  const pageCount = Math.ceil(totalCount / pageSize)

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 duration-500 animate-in fade-in md:gap-8">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div className="flex items-center gap-4">
          <div className="shrink-0 rounded-none bg-primary/10 p-3">
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

      <PricingDataTable data={rules} pageCount={pageCount} />
    </div>
  )
}
