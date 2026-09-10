"use client"
import { useState } from "react"
import { authenticatePortalAccess } from "@/app/actions/portal-auth"
import { AuthModal } from "@/components/auth-modal"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Mail } from "lucide-react"
export default function PortalLoginForm() {
  const [pending, setPending] = useState(false)
  const [error, setError] = useState("")
  const [sent, setSent] = useState(false)
  const [register, setRegister] = useState(false)
  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault(); setPending(true); setError("")
    const form = new FormData(event.currentTarget)
    try { const result = await authenticatePortalAccess(form); if (result.error) setError(result.error); else setSent(true) }
    catch { setError("We couldn’t connect. Please try again.") }
    finally { setPending(false) }
  }
  return <div className="flex flex-col gap-6">
    {sent ? <div role="status" className="flex flex-col gap-3 rounded-lg bg-accent p-5"><Mail className="size-6" /><h2 className="font-semibold">Check your inbox</h2><p className="text-sm leading-relaxed">If your email is registered, a secure sign-in link is on its way. Open it in this browser to access your portal.</p><Button variant="outline" onClick={() => setSent(false)}>Use another email</Button></div> : <form onSubmit={submit} className="flex flex-col gap-4"><div className="flex flex-col gap-2"><Label htmlFor="portal-email">Email address</Label><Input id="portal-email" name="email" type="email" autoComplete="email" maxLength={254} placeholder="you@example.com" required /></div>{error && <p role="alert" className="text-sm text-destructive">{error}</p>}<Button type="submit" disabled={pending}>{pending ? "Sending link…" : "Email me a sign-in link"}</Button></form>}
    <p className="text-center text-sm text-muted-foreground">New here? <Button variant="link" onClick={() => setRegister(true)}>Create a portal account</Button></p>
    <AuthModal isOpen={register} onClose={() => setRegister(false)} />
  </div>
}
