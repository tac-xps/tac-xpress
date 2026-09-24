import { requireAdminPage } from "@/lib/auth/page-access"
import { db } from "@/lib/db"
import { backgroundJobs, deadLetterQueue } from "@/lib/db/schema"
import { desc, eq } from "drizzle-orm"
import { PageHeader } from "@/components/operations/page-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"

export default async function JobsPage() {
  await requireAdminPage()

  const [failedJobs, dlqItems] = await Promise.all([
    db.select().from(backgroundJobs).where(eq(backgroundJobs.status, 'failed')).orderBy(desc(backgroundJobs.createdAt)).limit(100),
    db.select().from(deadLetterQueue).orderBy(desc(deadLetterQueue.createdAt)).limit(100)
  ])

  return (
    <div className="flex min-w-0 flex-col gap-6">
      <PageHeader 
        title="Background Jobs & DLQ" 
        description="Monitor failed background jobs and dead letter queue items."
      />

      <div className="grid gap-6">
        <Card className="shadow-none">
          <CardHeader>
            <CardTitle>Failed Background Jobs</CardTitle>
            <CardDescription>Jobs that exceeded max retries</CardDescription>
          </CardHeader>
          <CardContent className="px-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="pl-5">Kind</TableHead>
                  <TableHead>Dedupe Key</TableHead>
                  <TableHead>Attempts</TableHead>
                  <TableHead>Last Error</TableHead>
                  <TableHead>Created</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {failedJobs.map((job) => (
                  <TableRow key={job.id}>
                    <TableCell className="pl-5 font-medium">{job.kind}</TableCell>
                    <TableCell className="font-mono text-xs">{job.dedupeKey}</TableCell>
                    <TableCell>{job.attempts}</TableCell>
                    <TableCell className="max-w-[300px] truncate" title={job.lastError ?? ""}>{job.lastError}</TableCell>
                    <TableCell className="whitespace-nowrap">{format(new Date(job.createdAt), "PPp")}</TableCell>
                  </TableRow>
                ))}
                {!failedJobs.length && (
                  <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                      No failed jobs.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card className="shadow-none">
          <CardHeader>
            <CardTitle>Dead Letter Queue</CardTitle>
            <CardDescription>Unprocessable webhook events and actions</CardDescription>
          </CardHeader>
          <CardContent className="px-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="pl-5">Action</TableHead>
                  <TableHead>Payload snippet</TableHead>
                  <TableHead>Error</TableHead>
                  <TableHead>Created</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {dlqItems.map((dlq) => (
                  <TableRow key={dlq.id}>
                    <TableCell className="pl-5 font-medium">{dlq.action}</TableCell>
                    <TableCell className="font-mono text-xs max-w-[200px] truncate">
                      {JSON.stringify(dlq.payload)}
                    </TableCell>
                    <TableCell className="max-w-[300px] truncate text-destructive" title={dlq.error ?? ""}>
                      {dlq.error}
                    </TableCell>
                    <TableCell className="whitespace-nowrap">{format(new Date(dlq.createdAt), "PPp")}</TableCell>
                  </TableRow>
                ))}
                {!dlqItems.length && (
                  <TableRow>
                    <TableCell colSpan={4} className="h-24 text-center text-muted-foreground">
                      DLQ is empty.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
