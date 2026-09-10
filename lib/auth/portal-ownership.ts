import "server-only"
import { and, isNull, or, sql } from "drizzle-orm"
import { shipments } from "@/lib/db/schema"

// Email is obtained from Supabase getUser, never from a caller-supplied identity.
export function shipmentOwnerFilter(email: string) {
  return and(isNull(shipments.deletedAt), or(
    sql`lower(${shipments.consignorEmail}) = ${email.toLowerCase()}`,
    sql`lower(${shipments.consigneeEmail}) = ${email.toLowerCase()}`,
  ))
}

// Financial records are available to the sender, not everyone receiving cargo.
export function invoiceOwnerFilter(email: string) {
  return and(isNull(shipments.deletedAt), sql`lower(${shipments.consignorEmail}) = ${email.toLowerCase()}`)
}
