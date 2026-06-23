import * as Sentry from "@sentry/nextjs"

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

export async function logAudit({
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
}: {
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
}) {
  const effectiveEntityId = entityId ?? resourceId ?? null
  const effectiveResourceId = resourceId ?? entityId ?? null
  const payload: AuditInsertPayload = {
    user_email: userEmail ?? null,
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

  const { error } = await supabaseAdmin.from("audit_log").insert(payload)

  if (error) {
    Sentry.captureException(error, {
      tags: { area: "audit_log" },
      extra: {
        action,
        entity,
        entityId: effectiveEntityId,
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
