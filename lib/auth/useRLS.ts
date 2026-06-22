"use client"

import { useQuery } from "@tanstack/react-query"
import { useSession } from "next-auth/react"
import {
  POLICY_MANIFEST,
  type TableName,
  type Operation,
} from "@/lib/strategy/policy-manifest"
import { z } from "zod"

export type { TableName, Operation }

const CapabilityResponse = z.object({
  capabilities: z.array(z.string()),
  token: z.string().nullable(),
  orgId: z.string(),
  role: z.string().nullable(),
})

export type RLSContext = z.infer<typeof CapabilityResponse>

const CAPABILITY_CACHE_KEY = ["tacxpress", "capabilities"]

export function useRLS() {
  const { data: session } = useSession()

  const {
    data: context,
    isLoading,
    error,
  } = useQuery({
    queryKey: CAPABILITY_CACHE_KEY,
    queryFn: async (): Promise<RLSContext> => {
      const res = await fetch("/api/auth/capabilities")

      if (!res.ok) throw new Error("Capability evaluation failed")
      return CapabilityResponse.parse(await res.json())
    },
    enabled: !!session,
    staleTime: 1000 * 60 * 4,
  })

  const can = (table: TableName, operation: Operation): boolean => {
    if (!context) return false

    const tablePolicy = POLICY_MANIFEST[table] as Partial<
      Record<Operation, { requiredCapabilities: readonly string[] }>
    >
    const policy = tablePolicy[operation]
    if (!policy) return false

    return policy.requiredCapabilities.some((cap: string) => {
      if (cap === "shipment:owner") {
        return true
      }
      return context.capabilities.includes(cap)
    })
  }

  const canAccess = (
    table: TableName,
    operation: Operation,
    resourceId?: string
  ): boolean => {
    if (!context) return false

    const tablePolicy = POLICY_MANIFEST[table] as Partial<
      Record<Operation, { requiredCapabilities: readonly string[] }>
    >
    const policy = tablePolicy[operation]
    if (!policy) return false

    return policy.requiredCapabilities.some((cap: string) => {
      if (cap === "shipment:owner" && resourceId) {
        return context.capabilities.includes(`shipment:${resourceId}:owner`)
      }
      return context.capabilities.includes(cap)
    })
  }

  return {
    can,
    canAccess,
    isLoading,
    error,
    role: context?.role,
    orgId: context?.orgId,
    capabilityToken: context?.token,
    isAuthorized: (table: TableName, operation: Operation) =>
      can(table, operation),
  }
}
