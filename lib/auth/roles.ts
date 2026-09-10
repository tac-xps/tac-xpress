/** Only provisioned application roles confer staff access. */
export function isStaffRole(role: unknown): role is "admin" | "staff" {
  return role === "admin" || role === "staff"
}
