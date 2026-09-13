"use client"

import { useRLS, type TableName, type Operation } from "@/lib/auth/useRLS"
import { POLICY_MANIFEST } from "@/lib/strategy/policy-manifest"
import { Lock, ShieldAlert, ArrowUpRight, AlertTriangle, RefreshCw } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

interface SecureBoundaryProps {
  table: TableName
  operation: Operation
  resourceId?: string
  children: React.ReactNode
  fallback?: "hidden" | "blurred" | "boundary"
  upgradePath?: string
}

export function SecureBoundary({
  table,
  operation,
  resourceId,
  children,
  fallback = "boundary",
  upgradePath,
}: SecureBoundaryProps) {
  const { canAccess, isLoading, error, refetch } = useRLS()

  if (isLoading)
    return <div className="h-8 w-full animate-pulse rounded bg-muted" />

  // The capability check failed. Without this branch the placeholder above
  // would pulse forever, or fall through to a misleading "restricted" state.
  if (error) {
    if (fallback === "hidden") return null
    return (
      <div className="flex items-center justify-between gap-3 rounded-lg border border-dashed border-destructive/30 bg-destructive/5 p-4">
        <div className="flex items-start gap-3">
          <AlertTriangle className="mt-0.5 h-5 w-5 text-destructive" />
          <div className="space-y-1">
            <p className="text-sm font-medium text-destructive">
              Could not verify access
            </p>
            <p className="text-xs text-destructive/80">
              Your permissions could not be checked.
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => refetch()}
          className="inline-flex items-center gap-1 rounded-md border border-destructive/30 px-2 py-1 text-xs font-medium text-destructive hover:bg-destructive/10"
        >
          <RefreshCw className="h-3 w-3" /> Retry
        </button>
      </div>
    )
  }

  const hasAccess = resourceId
    ? canAccess(table, operation, resourceId)
    : canAccess(table, operation)

  if (hasAccess) return <>{children}</>

  if (fallback === "hidden") return null
  if (fallback === "blurred") {
    return (
      <div className="pointer-events-none relative blur-sm select-none">
        {children}
        <div className="absolute inset-0 flex items-center justify-center">
          <Lock className="h-6 w-6 text-muted-foreground" />
        </div>
      </div>
    )
  }

  const requiredCaps =
    (POLICY_MANIFEST as any)[table]?.[operation]?.requiredCapabilities || []

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative rounded-lg border border-dashed border-status-pending/30 bg-status-pending/5 p-4"
      >
        <div className="flex items-start gap-3">
          <ShieldAlert className="mt-0.5 h-5 w-5 text-status-pending" />
          <div className="space-y-1">
            <p className="text-sm font-medium text-status-pending">
              Restricted: {table}.{operation}
            </p>
            <p className="text-xs text-status-pending/80">
              Requires: {requiredCaps.join(" or ")}
            </p>
            {upgradePath && (
              <a
                href={upgradePath}
                className="inline-flex items-center gap-1 text-xs text-status-pending underline hover:text-status-pending/80"
              >
                Request access <ArrowUpRight className="h-3 w-3" />
              </a>
            )}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
