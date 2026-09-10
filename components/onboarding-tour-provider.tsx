"use client"
import { useState, useTransition } from "react"
import { completeTour } from "@/app/actions/user"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { toast } from "sonner"
const steps = [
  { title: "Welcome to the operations workspace", description: "TAC-XPRESS staff manage cargo, dispatch, warehouse, billing and support here. Customers use the public website without an account." },
  { title: "Find the right work", description: "The sidebar groups daily operations, the network, business and service, and reporting. Collapse it with Ctrl B when you need more room." },
  { title: "Search a page or shipment", description: "Use workspace search, or Ctrl K, to open an operational page or track a shipment by AWB. Table filters search the records for the relevant page." },
  { title: "Keep changes clear", description: "Shipment events, dispatch actions and manifest finalization record movement. Check the details before saving; publish only suitable information to public tracking." },
  { title: "Make the workspace yours", description: "Open your staff account for profile and appearance settings, to restart this introduction, or to sign out." },
]
export function OnboardingTourProvider({ isOnboarded }: { isOnboarded: boolean }) {
  const [open, setOpen] = useState(!isOnboarded)
  const [step, setStep] = useState(0)
  const [pending, startTransition] = useTransition()
  function finish() { startTransition(async () => { try { const result = await completeTour(); if (!result.success) throw new Error(); setOpen(false) } catch { toast.error("Could not save the tour preference. You can continue working."); setOpen(false) } }) }
  return <Dialog open={open} onOpenChange={(value) => { if (!value) finish() }}><DialogContent><DialogHeader><DialogTitle>{steps[step].title}</DialogTitle><DialogDescription className="pt-3 leading-relaxed">{steps[step].description}</DialogDescription></DialogHeader><Progress value={(step + 1) / steps.length * 100} className="my-4 h-1.5" aria-label="Workspace introduction progress" /><div className="flex justify-between gap-3"><Button variant="ghost" disabled={pending} onClick={finish}>Skip introduction</Button>{step < steps.length - 1 ? <Button onClick={() => setStep((value) => value + 1)}>Continue</Button> : <Button disabled={pending} onClick={finish}>{pending ? "Saving…" : "Start working"}</Button>}</div></DialogContent></Dialog>
}

