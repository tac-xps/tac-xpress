"use client"
import Link from "next/link"
import { format } from "date-fns"
import { Printer, Link as LinkIcon } from "lucide-react"
import { toast } from "sonner"
import { CargoDocuments } from "@/components/documents/cargo-documents"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { StatusBadge } from "@/components/logistics/status-badge"
export type ManifestItem = { id: string; shipment: { id: string; awbNumber: string; origin: string; destination: string; weightKg: number | null; status: string; consigneeName: string | null } | null }
export type ManifestDetail = {
  id: string; referenceId: string; status: "draft" | "finalized"; createdAt: Date;
  originHubId?: string | null; destinationHubId?: string | null; driverId?: string | null; vehicleId?: string | null;
  originHub?: { name: string } | null; destinationHub?: { name: string } | null;
  driver?: { name: string | null; phone: string | null } | null; vehicle?: { registrationNumber: string | null } | null; items?: ManifestItem[]
}
export function ManifestDetailDialog({ manifest, open, onOpenChange }: { manifest: ManifestDetail; open: boolean; onOpenChange: (open: boolean) => void }) {
  const items = manifest.items ?? []
  return <Dialog open={open} onOpenChange={onOpenChange}><DialogContent className="flex max-h-[90svh] flex-col overflow-hidden sm:max-w-3xl"><DialogHeader><DialogTitle className="pr-6 font-mono">{manifest.referenceId}</DialogTitle><DialogDescription>Created {format(new Date(manifest.createdAt), "dd MMM yyyy, HH:mm")} · Staff access required for documents</DialogDescription></DialogHeader>
    <Tabs defaultValue="overview" className="min-h-0 flex-1 overflow-y-auto"><TabsList className="mb-5"><TabsTrigger value="overview">Load details</TabsTrigger><TabsTrigger value="documents">Documents</TabsTrigger></TabsList>
      <TabsContent value="overview" className="space-y-6"><Badge variant="outline" className="capitalize">{manifest.status}</Badge><dl className="grid grid-cols-2 gap-5 text-sm sm:grid-cols-3">{[["Origin hub", manifest.originHub?.name ?? "Unassigned"], ["Destination hub", manifest.destinationHub?.name ?? "Unassigned"], ["Driver", manifest.driver?.name ?? "Unassigned"], ["Vehicle", manifest.vehicle?.registrationNumber ?? "Unassigned"], ["Shipments", String(items.length)], ["Actual weight", `${items.reduce((sum, item) => sum + (item.shipment?.weightKg ?? 0), 0).toFixed(1)} kg`]].map(([label, value]) => <div key={label}><dt className="text-muted-foreground">{label}</dt><dd className="mt-1 font-medium">{value}</dd></div>)}</dl>
      <div className="overflow-hidden rounded-none border"><Table><TableHeader><TableRow><TableHead>AWB</TableHead><TableHead>Route</TableHead><TableHead>Weight</TableHead><TableHead>Status</TableHead></TableRow></TableHeader><TableBody>{items.map((item) => <TableRow key={item.id}><TableCell>{item.shipment ? <Link className="font-mono underline-offset-4 hover:underline" href={`/dashboard/shipments/${item.shipment.id}`}>{item.shipment.awbNumber}</Link> : "Unavailable"}</TableCell><TableCell>{item.shipment ? `${item.shipment.origin} → ${item.shipment.destination}` : "—"}</TableCell><TableCell>{item.shipment?.weightKg ?? "—"} kg</TableCell><TableCell>{item.shipment && <StatusBadge status={item.shipment.status} />}</TableCell></TableRow>)}{items.length === 0 && <TableRow><TableCell colSpan={4} className="py-10 text-center text-muted-foreground">No shipments assigned yet.</TableCell></TableRow>}</TableBody></Table></div></TabsContent>
      <TabsContent value="documents"><CargoDocuments entity="manifests" id={manifest.id} /></TabsContent>
    </Tabs><DialogFooter className="gap-2 border-t pt-4"><Button variant="outline" asChild><a href={`/api/manifests/${manifest.id}/print`} target="_blank" rel="noopener noreferrer"><Printer />Print</a></Button><Button variant="outline" onClick={async () => { try { await navigator.clipboard.writeText(`${window.location.origin}/api/manifests/${manifest.id}/print`); toast.success("Staff document link copied") } catch { toast.error("Unable to copy this link") } }}><LinkIcon />Copy link</Button><Button onClick={() => onOpenChange(false)}>Done</Button></DialogFooter>
  </DialogContent></Dialog>
}
