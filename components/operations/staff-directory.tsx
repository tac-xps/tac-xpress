"use client"
import { useEffect, useState } from "react"
import { getTeamMembers } from "@/app/actions/user"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
type Member = Awaited<ReturnType<typeof getTeamMembers>>[number]
export function StaffDirectory() {
  const [members, setMembers] = useState<Member[] | null>(null)
  const [failed, setFailed] = useState(false)
  useEffect(() => {
    let active = true
    getTeamMembers()
      .then((value) => {
        if (active) setMembers(value)
      })
      .catch(() => {
        if (active) setFailed(true)
      })
    return () => {
      active = false
    }
  }, [])
  return (
    <section className="space-y-4">
      <h3 className="text-sm font-medium">Staff directory</h3>
      <p className="text-xs leading-relaxed text-muted-foreground">
        Up to 100 provisioned staff accounts. Access changes are managed through
        the administrator provisioning process.
      </p>
      {failed ? (
        <Alert variant="destructive">
          <AlertDescription>
            Unable to load the staff directory.
          </AlertDescription>
        </Alert>
      ) : members ? (
        <ul className="divide-y">
          {members.map((member) => (
            <li
              key={member.id}
              className="flex items-center justify-between gap-3 py-3"
            >
              <span className="min-w-0">
                <span className="block truncate text-sm">
                  {member.fullName || "Staff"}
                </span>
                <span className="block truncate text-xs text-muted-foreground">
                  {member.email}
                </span>
              </span>
              <Badge variant="outline">{member.role}</Badge>
            </li>
          ))}
        </ul>
      ) : (
        <p role="status" className="text-sm text-muted-foreground">
          Loading staff accounts…
        </p>
      )}
    </section>
  )
}
