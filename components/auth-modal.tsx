"use client"
import Link from "next/link"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
export function AuthModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  return <Dialog open={isOpen} onOpenChange={(open) => { if (!open) onClose() }}><DialogContent><DialogHeader><DialogTitle>Staff workspace</DialogTitle><DialogDescription>Only provisioned admins and staff need to sign in. Customers can track shipments and contact the team without an account.</DialogDescription></DialogHeader><Button asChild><Link href="/signin">Staff sign in</Link></Button><Button asChild variant="outline"><Link href="/track">Track a shipment</Link></Button></DialogContent></Dialog>
}

