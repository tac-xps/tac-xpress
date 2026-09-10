import Link from "next/link"
import { Button } from "@/components/ui/button"
export default function NotFound() {
  return <main className="mx-auto flex min-h-svh max-w-xl flex-col items-start justify-center gap-6 px-6 py-16">
    <p className="font-mono text-sm text-muted-foreground">404 · Page not found</p>
    <h1 className="text-4xl font-semibold tracking-tight">Let’s get you back on your way.</h1>
    <p className="text-lg leading-relaxed text-muted-foreground">This page may have moved, or the address may be incomplete. You can return home or look up a shipment.</p>
    <div className="flex flex-wrap gap-3"><Button asChild><Link href="/">Back to home</Link></Button><Button asChild variant="outline"><Link href="/track">Track a shipment</Link></Button></div>
  </main>
}
