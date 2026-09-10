import "server-only"
import { z } from "zod"
import { db } from "@/lib/db"
import { shipments, manifests } from "@/lib/db/schema"
import { and, eq, isNull } from "drizzle-orm"
export const cargoEntitySchema = z.enum(["shipments", "manifests"])
export async function existingCargoRecord(entity: string, id: string) {
  if (!cargoEntitySchema.safeParse(entity).success || !z.string().uuid().safeParse(id).success) return false
  const rows = entity === "shipments"
    ? await db.select({ id: shipments.id }).from(shipments).where(and(eq(shipments.id, id), isNull(shipments.deletedAt))).limit(1)
    : await db.select({ id: manifests.id }).from(manifests).where(eq(manifests.id, id)).limit(1)
  return rows.length > 0
}
export function parseCargoPath(path: string) {
  const parts = path.split("/")
  if (parts.length !== 3 || !cargoEntitySchema.safeParse(parts[0]).success || !z.string().uuid().safeParse(parts[1]).success || !/^[a-f0-9-]{36}_[a-zA-Z0-9_-]{1,80}\.(pdf|jpg|png)$/.test(parts[2])) return null
  return { entity: parts[0], id: parts[1], filename: parts[2] }
}

