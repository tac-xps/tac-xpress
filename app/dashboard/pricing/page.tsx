import type { Metadata } from "next"
import { requireStaffPage } from "@/lib/auth/page-access"
import * as Sentry from "@sentry/nextjs"
import { Calculator } from "lucide-react"
import { desc, isNull, sql } from "drizzle-orm"

export const metadata: Metadata = {
  title: "Pricing Rules & Calculator | TAC-XPRESS",
  description: "Freight corridor rates, volumetric weight calculation rules, and fuel surcharges.",
}

import { AddPricingRuleDialog } from "./add-pricing-rule-dialog"
import { PricingCalculatorClient } from "./pricing-calculator-client"
import { PricingDataTable } from "./pricing-data-table"
import { PageHeader } from "@/components/operations/page-header"
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
    <div className="flex min-w-0 flex-col gap-6">
      <PageHeader
        title="Pricing & Rates"
        description="Rates shown here are active rules configured in the platform."
      >
        <AddPricingRuleDialog />
      </PageHeader>

      <PricingCalculatorClient />

      <PricingDataTable data={rules} pageCount={pageCount} />
    </div>
  )
}
