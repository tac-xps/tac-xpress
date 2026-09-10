"use client"
import type { Vehicle } from "@/lib/db/schema"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { VehicleActions } from "./vehicle-actions"
export function VehiclesClientTable({ vehicles, drivers }: { vehicles: (Vehicle & { driver?: { name: string } | null })[]; drivers: { id: string; name: string }[] }) {
  return <Card className="shadow-none"><CardHeader><CardTitle>Vehicles</CardTitle><CardDescription>{vehicles.length} records on this page</CardDescription></CardHeader><CardContent className="px-0"><Table><TableHeader><TableRow><TableHead className="pl-5">Registration</TableHead><TableHead>Capacity</TableHead><TableHead>Assigned driver</TableHead><TableHead>Status</TableHead><TableHead>Actions</TableHead></TableRow></TableHeader><TableBody>{vehicles.map((vehicle) => <TableRow key={vehicle.id}><TableCell className="pl-5 font-mono text-xs">{vehicle.registrationNumber}</TableCell><TableCell>{vehicle.capacityKg.toLocaleString("en-IN")} kg</TableCell><TableCell>{vehicle.driver?.name ?? "Not assigned"}</TableCell><TableCell><Badge variant="outline" className="capitalize">{vehicle.status}</Badge></TableCell><TableCell><VehicleActions vehicle={vehicle} drivers={drivers} /></TableCell></TableRow>)}{!vehicles.length && <TableRow><TableCell colSpan={5} className="h-24 text-center text-muted-foreground">No matching vehicles.</TableCell></TableRow>}</TableBody></Table></CardContent></Card>
}

