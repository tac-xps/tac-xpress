"use client"

import * as React from "react"
import {
  Download,
  FileText,
  FileUp,
  Image as ImageIcon,
  Loader2,
  Trash2,
  UploadCloud,
} from "lucide-react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useCargoDocuments } from "./use-cargo-documents"
import { cn } from "@/lib/utils"

export function CargoDocuments({
  entity,
  id,
}: {
  entity: "shipments" | "manifests"
  id: string
}) {
  const documents = useCargoDocuments(entity, id)
  const [file, setFile] = React.useState<File | null>(null)
  const [isDragOver, setIsDragOver] = React.useState(false)
  const inputRef = React.useRef<HTMLInputElement>(null)

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragOver(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragOver(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragOver(false)
    if (documents.uploading) return
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0])
    }
  }

  const handleUpload = async () => {
    if (!file) return
    const success = await documents.upload(file)
    if (success) {
      setFile(null)
      if (inputRef.current) inputRef.current.value = ""
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${Math.ceil(bytes / 1024)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }

  const isPdf = (name: string) => name.toLowerCase().endsWith(".pdf")

  return (
    <Card className="rounded-none border-border bg-card shadow-none">
      <CardHeader className="border-b border-border/80 pb-4">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-base font-semibold tracking-tight">
              {entity === "shipments" ? "Shipment Documents" : "Manifest Documents"}
            </CardTitle>
            <CardDescription className="text-xs">
              Secure operational attachments · accessible by authenticated staff
            </CardDescription>
          </div>
          <span className="font-mono text-xs text-muted-foreground">
            {documents.files.length} {documents.files.length === 1 ? "file" : "files"}
          </span>
        </div>
      </CardHeader>

      <CardContent className="flex flex-col gap-6 pt-5">
        {documents.error && (
          <Alert variant="destructive" className="rounded-none">
            <AlertDescription className="flex items-center justify-between text-xs">
              <span>{documents.error}</span>
              <Button
                variant="link"
                size="sm"
                className="h-auto p-0 text-xs text-destructive underline"
                onClick={documents.retry}
              >
                Retry
              </Button>
            </AlertDescription>
          </Alert>
        )}

        {/* ── Modern Dropzone Upload Area ── */}
        <div
          role="button"
          tabIndex={file ? -1 : 0}
          aria-label="Choose a document to upload"
          onKeyDown={(e) => {
            if (!file && (e.key === "Enter" || e.key === " ")) {
              e.preventDefault()
              inputRef.current?.click()
            }
          }}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => !file && inputRef.current?.click()}
          className={cn(
            "relative flex flex-col items-center justify-center p-6 text-center border transition-all duration-200 cursor-pointer rounded-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
            isDragOver
              ? "border-primary bg-primary-wash/50"
              : file
              ? "border-border/90 bg-muted/20 cursor-default"
              : "border-dashed border-border/90 bg-muted/10 hover:border-border-strong hover:bg-muted/20"
          )}
        >
          <input
            ref={inputRef}
            type="file"
            accept="application/pdf,image/jpeg,image/png"
            disabled={documents.uploading}
            className="hidden"
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
          />

          {!file ? (
            <div className="flex flex-col items-center gap-2">
              <div className="flex size-10 items-center justify-center rounded-none bg-muted/60 text-muted-foreground">
                <UploadCloud className="size-5" />
              </div>
              <div className="space-y-0.5">
                <p className="text-xs font-medium text-foreground">
                  <span className="text-primary hover:underline font-semibold">
                    Click to upload
                  </span>{" "}
                  or drag and drop document
                </p>
                <p className="text-[11px] text-muted-foreground">
                  PDF, JPEG or PNG · maximum 5 MB
                </p>
              </div>
            </div>
          ) : (
            <div className="flex w-full items-center justify-between gap-3 p-1">
              <div className="flex items-center gap-3 min-w-0">
                <div className="flex size-9 shrink-0 items-center justify-center rounded-none bg-primary/10 text-primary">
                  {isPdf(file.name) ? (
                    <FileText className="size-4" />
                  ) : (
                    <ImageIcon className="size-4" />
                  )}
                </div>
                <div className="text-left min-w-0">
                  <p className="truncate text-xs font-medium text-foreground">
                    {file.name}
                  </p>
                  <p className="text-[11px] text-muted-foreground font-mono">
                    {formatFileSize(file.size)}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="size-8 rounded-none text-muted-foreground hover:text-destructive"
                  disabled={documents.uploading}
                  onClick={(e) => {
                    e.stopPropagation()
                    setFile(null)
                    if (inputRef.current) inputRef.current.value = ""
                  }}
                  aria-label="Remove selected file"
                >
                  <Trash2 className="size-3.5" />
                </Button>
                <Button
                  type="button"
                  size="sm"
                  disabled={documents.uploading}
                  onClick={(e) => {
                    e.stopPropagation()
                    handleUpload()
                  }}
                  className="rounded-none text-xs h-8 px-3"
                >
                  {documents.uploading ? (
                    <>
                      <Loader2 className="size-3 mr-1.5 animate-spin" />
                      Uploading…
                    </>
                  ) : (
                    <>
                      <FileUp className="size-3 mr-1.5" />
                      Upload File
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* ── Document Register List ── */}
        <div className="space-y-2">
          <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Attached Files
          </h4>

          {documents.loading ? (
            <div className="space-y-2">
              <div className="h-12 w-full animate-pulse bg-muted/40 rounded-none" />
              <div className="h-12 w-full animate-pulse bg-muted/40 rounded-none" />
            </div>
          ) : documents.files.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-6 border border-border/60 bg-muted/10 text-center">
              <p className="text-xs text-muted-foreground">
                No documents attached to this {entity === "shipments" ? "shipment" : "manifest"}.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-border/60 border border-border/80 bg-card">
              {documents.files.map((item) => (
                <div
                  key={item.path}
                  className="flex items-center justify-between p-3 transition-colors hover:bg-muted/20"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="flex size-8 shrink-0 items-center justify-center rounded-none bg-muted/50 text-muted-foreground">
                      {isPdf(item.name) ? (
                        <FileText className="size-4 text-primary" />
                      ) : (
                        <ImageIcon className="size-4 text-primary" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-xs font-medium text-foreground">
                        {item.name}
                      </p>
                      <p className="text-[10px] text-muted-foreground font-mono">
                        {formatFileSize(item.size)}
                      </p>
                    </div>
                  </div>

                  <Button asChild variant="outline" size="sm" className="rounded-none h-7 px-2.5 text-xs">
                    <a
                      href={`/api/documents?path=${encodeURIComponent(item.path)}`}
                      download
                      aria-label={`Download ${item.name}`}
                    >
                      <Download className="size-3 mr-1" />
                      Download
                    </a>
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
