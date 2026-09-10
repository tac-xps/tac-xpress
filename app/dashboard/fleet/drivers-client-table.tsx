"use client"
import type { Driver } from "@/lib/db/schema"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { DriverActions } from "./driver-actions"
export function DriversClientTable({ drivers }: { drivers: Driver[] }) {
  return <Card className="shadow-none"><CardHeader><CardTitle>Drivers</CardTitle><CardDescription>{drivers.length} records on this page</CardDescription></CardHeader><CardContent className="px-0"><Table><TableHeader><TableRow><TableHead className="pl-5">Driver</TableHead><TableHead>Phone</TableHead><TableHead>Licence</TableHead><TableHead>Status</TableHead><TableHead>Actions</TableHead></TableRow></TableHeader><TableBody>{drivers.map((driver) => <TableRow key={driver.id}><TableCell className="pl-5 font-medium">{driver.name}</TableCell><TableCell>{driver.phone}</TableCell><TableCell className="font-mono text-xs">{driver.licenseNumber}</TableCell><TableCell><Badge variant="outline" className="capitalize">{driver.status.replaceAll("_", " ")}</Badge></TableCell><TableCell><DriverActions driver={driver} /></TableCell></TableRow>)}{!drivers.length && <TableRow><TableCell colSpan={5} className="h-24 text-center text-muted-foreground">No matching drivers.</TableCell></TableRow>}</TableBody></Table></CardContent></Card>
}

