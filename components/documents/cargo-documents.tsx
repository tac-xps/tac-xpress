"use client"
import { useId, useState } from "react"
import { Download } from "lucide-react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useCargoDocuments } from "./use-cargo-documents"
export function CargoDocuments({
  entity,
  id,
}: {
  entity: "shipments" | "manifests"
  id: string
}) {
  const documents = useCargoDocuments(entity, id)
  const [file, setFile] = useState<File | null>(null)
  const inputId = useId()
  return (
    <Card className="shadow-none">
      <CardHeader>
        <CardTitle>
          {entity === "shipments" ? "Shipment documents" : "Manifest documents"}
        </CardTitle>
        <CardDescription>
          Private files for admins and staff · latest 100 documents
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-5">
        {documents.error && (
          <Alert variant="destructive">
            <AlertDescription>
              {documents.error}
              <Button variant="link" className="px-0" onClick={documents.retry}>
                Refresh documents
              </Button>
            </AlertDescription>
          </Alert>
        )}
        <form
          className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-end"
          onSubmit={async (event) => {
            event.preventDefault()
            const form = event.currentTarget
            if (file && (await documents.upload(file))) {
              setFile(null)
              form.reset()
            }
          }}
        >
          <div className="grid min-w-0 flex-1 gap-2">
            <Label htmlFor={inputId}>Attach a document</Label>
            <Input
              id={inputId}
              type="file"
              accept="application/pdf,image/jpeg,image/png"
              disabled={documents.uploading}
              onChange={(event) => setFile(event.target.files?.[0] ?? null)}
            />
            <p className="text-xs text-muted-foreground">
              PDF, JPEG or PNG · up to 5 MB per file
            </p>
          </div>
          <Button type="submit" disabled={!file || documents.uploading}>
            {documents.uploading ? "Uploading…" : "Upload"}
          </Button>
        </form>
        {documents.loading ? (
          <p role="status" className="text-sm text-muted-foreground">
            Loading documents…
          </p>
        ) : (
          <ul className="flex flex-col gap-2">
            {documents.files.map((item) => (
              <li
                key={item.path}
                className="flex items-center justify-between gap-3 border-t pt-3"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm">{item.name}</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {Math.ceil(item.size / 1024)} KB
                  </p>
                </div>
                <Button asChild variant="ghost" size="icon">
                  <a
                    href={`/api/documents?path=${encodeURIComponent(item.path)}`}
                    download
                    aria-label={`Download ${item.name}`}
                  >
                    <Download />
                  </a>
                </Button>
              </li>
            ))}
            {!documents.files.length && !documents.error && (
              <li className="py-3 text-sm text-muted-foreground">
                No documents attached yet.
              </li>
            )}
          </ul>
        )}
      </CardContent>
    </Card>
  )
}
