import { NextResponse } from "next/server"
import * as Sentry from "@sentry/nextjs"
import { db } from "@/lib/db"
import { users } from "@/lib/db/schema"
import { eq, or, ilike, and, isNull } from "drizzle-orm"
import { requireDashboardApi } from "@/lib/auth/guards"

export async function GET(request: Request) {
  try {
    const authResult = await requireDashboardApi()
    if (!authResult.ok) return authResult.response

    const { searchParams } = new URL(request.url)
    const query = searchParams.get("query") || ""

    if (!query) {
      // If no query, return an empty array or recent customers
      const recentCustomers = await db
        .select({
          id: users.id,
          name: users.name,
          email: users.email,
          phone: users.phone,
          address: users.address,
          pinCode: users.pinCode,
          city: users.city,
          state: users.state,
        })
        .from(users)
        .where(and(eq(users.role, "customer"), isNull(users.deletedAt)))
        .limit(5)

      return NextResponse.json(recentCustomers)
    }

    // Use ilike for case-insensitive partial matching
    const searchPattern = `%${query}%`
    const finalResults = await db
      .select({
        id: users.id,
        name: users.name,
        email: users.email,
        phone: users.phone,
        address: users.address,
        pinCode: users.pinCode,
        city: users.city,
        state: users.state,
      })
      .from(users)
      .where(
        and(
          eq(users.role, "customer"),
          isNull(users.deletedAt),
          or(
            ilike(users.name, searchPattern),
            ilike(users.email, searchPattern),
            ilike(users.phone, searchPattern)
          )
        )
      )
      .limit(10)

    return NextResponse.json(finalResults)
  } catch (error) {
    Sentry.captureException(error)
    console.error("Error fetching customers:", error)
    return NextResponse.json(
      { error: "Failed to fetch customers" },
      { status: 500 }
    )
  }
}
