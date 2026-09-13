import { db } from "@/lib/db"
import { invoices } from "@/lib/db/schema"
import { and, eq, desc, isNotNull } from "drizzle-orm"
import { Download, FileText } from "lucide-react"
import { DataLabel } from "@/components/typography/data-label"
import { Skeleton } from "@/components/ui/skeleton"

// A shipment's documents are the invoice PDFs stored in the `cargo-documents`
// bucket. `pdfUrl` is either an in-app route (starts with "/") or a bucket path
// served by the `/api/documents` download endpoint.
function documentHref(pdfUrl: string) {
  if (pdfUrl.startsWith("/")) return pdfUrl
  return `/api/documents?path=${encodeURIComponent(pdfUrl)}`
}

function invoiceLabel(id: string) {
  return `Invoice INV-${id.split("-")[0].toUpperCase()}`
}

function DocumentsCardShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="space-y-4 border bg-card p-6 shadow-sm">
      <DataLabel className="block">Documents</DataLabel>
      {children}
    </div>
  )
}

export async function ShipmentDocumentsCard({
  shipmentId,
}: {
  shipmentId: string
}) {
  const documents = await db
    .select({ id: invoices.id, pdfUrl: invoices.pdfUrl })
    .from(invoices)
    .where(and(eq(invoices.shipmentId, shipmentId), isNotNull(invoices.pdfUrl)))
    .orderBy(desc(invoices.createdAt))

  return (
    <DocumentsCardShell>
      {documents.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          No documents available for this shipment.
        </p>
      ) : (
        <ul className="space-y-2">
          {documents.map((doc) => (
            <li key={doc.id}>
              <a
                href={documentHref(doc.pdfUrl!)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between gap-3 rounded-md border bg-background px-4 py-3 text-sm transition-colors hover:bg-muted"
              >
                <span className="flex items-center gap-2 font-medium">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  {invoiceLabel(doc.id)}
                </span>
                <Download className="h-4 w-4 text-muted-foreground" />
              </a>
            </li>
          ))}
        </ul>
      )}
    </DocumentsCardShell>
  )
}

export function ShipmentDocumentsCardSkeleton() {
  return (
    <DocumentsCardShell>
      <div className="space-y-2">
        <Skeleton className="h-12 w-full rounded-md" />
        <Skeleton className="h-12 w-full rounded-md" />
      </div>
    </DocumentsCardShell>
  )
}
