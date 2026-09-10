import * as Sentry from "@sentry/nextjs"
import { sql, type SQL } from "drizzle-orm"

import { supabaseAdmin } from "@/lib/supabase/clients"

export type AuditAction = string
export type AuditEntity = string

type AuditMetadata = Record<string, unknown> | null

type AuditInsertPayload = {
  user_email: string | null
  user_id: string | null
  action: AuditAction
  entity: AuditEntity | null
  entity_id: string | null
  resource_id: string | null
  metadata: AuditMetadata
  before: Record<string, unknown> | null
  after: Record<string, unknown> | null
  created_at: string
}

type AuditInput = {
  action: AuditAction
  entity?: AuditEntity
  entityId?: string | null
  userId?: string | null
  userEmail?: string | null
  resourceId?: string | null
  metadata?: Record<string, unknown>
  before?: Record<string, unknown> | null
  after?: Record<string, unknown> | null
  createdAt?: string
}

function auditPayload({
  action,
  entity,
  entityId,
  userId,
  userEmail,
  resourceId,
  metadata,
  before,
  after,
  createdAt,
}: AuditInput): AuditInsertPayload {
  const effectiveEntityId = entityId ?? resourceId ?? null
  const effectiveResourceId = resourceId ?? entityId ?? null
  return {
    user_email: userEmail ?? "unknown",
    user_id: userId ?? null,
    action,
    entity: entity ?? null,
    entity_id: effectiveEntityId,
    resource_id: effectiveResourceId,
    metadata: metadata ?? null,
    before: before ?? null,
    after: after ?? null,
    created_at: createdAt ?? new Date().toISOString(),
  }
}

/** Insert with the caller's transaction so an audit failure rolls back the mutation. */
export async function logAuditInTransaction(
  tx: { execute: (query: SQL) => Promise<unknown> },
  input: AuditInput
) {
  const payload = auditPayload(input)
  await tx.execute(sql`
    insert into public.audit_log
      (user_email, user_id, action, entity, entity_id, resource_id, metadata, "before", "after", created_at)
    values
      (${payload.user_email}, ${payload.user_id}, ${payload.action}, ${payload.entity},
       ${payload.entity_id}, ${payload.resource_id}, ${payload.metadata === null ? null : JSON.stringify(payload.metadata)}::jsonb,
       ${payload.before === null ? null : JSON.stringify(payload.before)}::jsonb, ${payload.after === null ? null : JSON.stringify(payload.after)}::jsonb,
       ${payload.created_at}::timestamptz)
  `)
}

export async function logAudit(input: AuditInput) {
  const { error } = await supabaseAdmin
    .from("audit_log")
    .insert(auditPayload(input))

  if (error) {
    Sentry.captureException(error, {
      tags: { area: "audit_log" },
      extra: {
        action: input.action,
        entity: input.entity,
        entityId: input.entityId ?? input.resourceId ?? null,
      },
    })
    throw error
  }
}

export async function writeAuditLog({
  userEmail,
  action,
  resourceId,
  metadata,
}: {
  userEmail: string
  action: AuditAction
  resourceId?: string
  metadata?: Record<string, unknown>
}) {
  void logAudit({
    userEmail,
    action,
    resourceId,
    metadata,
  }).catch((error) => {
    console.error("[audit_log] Failed to write audit entry:", error)
  })
}
