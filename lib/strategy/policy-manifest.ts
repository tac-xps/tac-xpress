// lib/strategy/policy-manifest.ts
// The central contract mapping UI capabilities to RLS policies.

export const POLICY_MANIFEST = {
  organizations: {
    select: {
      requiredCapabilities: ["org:member"],
      rlsPolicy: "users_view_own_org",
    },
    update: {
      requiredCapabilities: ["org:admin"],
      rlsPolicy: "org_admin_update",
    },
  },
  users: {
    select: {
      requiredCapabilities: ["org:member"],
      rlsPolicy: "users_view_org_users",
    },
    update: {
      requiredCapabilities: ["user:self", "org:admin"],
      rlsPolicy: "users_self_or_admin_update",
    },
  },
  shipments: {
    select: {
      requiredCapabilities: ["org:member"],
      rlsPolicy: "shipments_view_org",
    },
    insert: {
      requiredCapabilities: ["org:manager"],
      rlsPolicy: "shipments_manager_insert",
    },
    update: {
      requiredCapabilities: ["shipment:owner", "org:manager"],
      rlsPolicy: "shipments_owner_or_manager_update",
    },
    delete: {
      requiredCapabilities: ["org:admin"],
      rlsPolicy: "shipments_admin_delete",
    },
  },
  warehouses: {
    select: {
      requiredCapabilities: ["org:member"],
      rlsPolicy: "warehouses_view_org",
    },
    update: {
      requiredCapabilities: ["warehouse:manager"],
      rlsPolicy: "warehouses_manager_update",
    },
  },
  inventory: {
    select: {
      requiredCapabilities: ["org:member"],
      rlsPolicy: "inventory_view_org",
    },
    update: {
      requiredCapabilities: ["warehouse:operator"],
      rlsPolicy: "inventory_operator_update",
    },
  },
  tracking_events: {
    select: {
      requiredCapabilities: ["org:member", "carrier:partner"],
      rlsPolicy: "tracking_org_or_carrier",
    },
  },
} as const

export type TableName = keyof typeof POLICY_MANIFEST
export type Operation = "select" | "insert" | "update" | "delete"
export type Capability =
  | "org:member"
  | "org:manager"
  | "org:admin"
  | "user:self"
  | "shipment:owner"
  | "warehouse:manager"
  | "warehouse:operator"
  | "carrier:partner"
