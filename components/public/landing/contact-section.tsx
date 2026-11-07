"use client"

import React, { useState, useSyncExternalStore } from "react"
import { cn } from "@/lib/utils"
import { Check, Mail, MapPin, Phone, Clock, ArrowUpRight, Loader2, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/reui/badge"
import { IconTile } from "@/components/reui/icon-tile"
import { createTicket } from "@/app/actions/tickets"

const subscribeToHash = (callback: () => void) => {
  window.addEventListener("hashchange", callback)
  return () => window.removeEventListener("hashchange", callback)
}
const getHashSnapshot = () => (window.location.hash === "#feedback" ? "feedback" : "booking")
const getServerSnapshot = () => "booking"

export function ContactSection() {
  const [submitted, setSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<"customer_name" | "customer_email" | "customer_phone" | "message", string>>>({})
  const [ticketId, setTicketId] = useState<string | null>(null)
  const hashIntent = useSyncExternalStore(subscribeToHash, getHashSnapshot, getServerSnapshot)
  const [manualIntent, setManualIntent] = useState<"booking" | "feedback" | null>(null)
  const intent = manualIntent ?? hashIntent

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    mode: "AIR",
    weight: "30",
    origin: "DEL",
    message: "",
    website: "", // Honeypot field
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitError(null)
    setFieldErrors({})

    try {
      const payload = new FormData()
      payload.set("customer_name", formData.name.trim())
      payload.set("customer_email", formData.email.trim())
      if (formData.phone.trim()) {
        payload.set("customer_phone", formData.phone.trim())
      }
      payload.set("website", formData.website)

      const routeName = formData.origin === "DEL" ? "DEL to IMF (New Delhi to Imphal)" : "IMF to DEL (Imphal to New Delhi)"
      const modeName = formData.mode === "AIR" ? "Air cargo" : formData.mode === "SURFACE" ? "Surface cargo" : "Special handling review"

      if (intent === "feedback") {
        payload.set("category", "feedback")
        payload.set("subject", `[Customer Feedback] from ${formData.name.trim()}`)
        const feedbackMsg = [
          `Consignor / Customer: ${formData.name.trim()}`,
          `Phone: ${formData.phone.trim() || "Not provided"}`,
          `Feedback / Observations: ${formData.message.trim()}`,
        ].join("\n")
        payload.set("message", feedbackMsg)
      } else {
        payload.set("category", "shipment")
        payload.set("subject", `[Consignment Booking] ${formData.mode} on ${formData.origin === "DEL" ? "DEL -> IMF" : "IMF -> DEL"} (${formData.name.trim()})`)
        const detailsMessage = [
          `Corridor: ${routeName}`,
          `Transit Mode: ${modeName}`,
          `Consignor: ${formData.name.trim()}`,
          `Contact Phone: ${formData.phone.trim() || "Not provided"}`,
          `Consignment Details: ${formData.message.trim() || "Immediate commercial linehaul capacity requested."}`,
        ].join("\n")
        payload.set("message", detailsMessage)
      }

      const res = await createTicket(payload)

      if (res?.error) {
        const errors: typeof fieldErrors = {}
        for (const [key, messages] of Object.entries(res.error)) {
          if ((key === "customer_name" || key === "customer_email" || key === "customer_phone" || key === "message") && Array.isArray(messages)) {
            errors[key] = messages.filter((message) => typeof message === "string").join(" ")
          }
        }
        setFieldErrors(errors)
        const errorMsg =
          typeof res.error === "object" && "_form" in res.error && Array.isArray(res.error._form)
            ? res.error._form[0]
            : "Unable to save booking request. Verify your details or call our dispatch desk directly."
        setSubmitError(errorMsg)
        const firstInvalid = errors.customer_name ? "name" : errors.customer_email ? "email" : errors.customer_phone ? "phone" : errors.message ? "message" : null
        if (firstInvalid) document.getElementById(`contact-${firstInvalid}`)?.focus()
      } else if (res?.success) {
        setTicketId(res.ticketId ?? null)
        setSubmitted(true)
      }
    } catch {
      setSubmitError("Network exception occurred connecting to terminal dispatch. Contact our team for help.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section
      id="contact"
      aria-labelledby="contact-heading"
      className="w-full border-b border-border bg-background py-20 lg:py-28"
    >
      <div id="feedback" className="scroll-mt-24" />
      <div className="mx-auto w-full max-w-[1320px] px-6 lg:px-12">
        <div className="text-center max-w-xl mx-auto mb-16">
          <h2
            id="contact-heading"
            className="text-2xl font-medium tracking-tight text-foreground sm:text-4xl"
          >
            Get in touch
          </h2>
          <p className="mt-2 text-xs font-sans text-muted-foreground">
            Share your shipment details to request acceptance, a quote, and a delivery window.
          </p>
        </div>

        <div className="mx-auto max-w-4xl border border-border bg-card overflow-hidden rounded-none shadow-2xs">
          <div className="grid grid-cols-1 md:grid-cols-12 items-stretch">
            {/* Left Column: Dark Terminal Operations Info */}
            <div className="bg-muted/40 p-8 sm:p-10 text-foreground md:col-span-5 flex flex-col justify-between border-b md:border-b-0 md:border-r border-border">
              <div>
                <Badge variant="primary-light">
                  DEL ⇄ IMF Operations Desk
                </Badge>
                <h3 className="mt-2 text-xl font-medium text-foreground">
                  Terminal Control
                </h3>
                <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
                  Contact our team about cargo between New Delhi and Imphal, in either direction.
                </p>

                <div className="mt-8 space-y-4 text-xs font-sans">
                  <div className="flex items-start gap-3">
                    <MapPin className="size-4 text-primary shrink-0 mt-0.5" />
                    <div>
                      <div className="font-semibold text-foreground">Delhi Gateway:</div>
                      <div className="text-muted-foreground">IGI Cargo Terminal Gate 4, New Delhi</div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <MapPin className="size-4 text-primary shrink-0 mt-0.5" />
                    <div>
                      <div className="font-semibold text-foreground">Imphal Gateway:</div>
                      <div className="text-muted-foreground">Tulihal Cargo Apron, Imphal, Manipur</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Phone className="size-4 text-primary shrink-0" />
                    <span className="font-mono text-foreground">+91 98561 73829</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <Mail className="size-4 text-primary shrink-0" />
                    <span className="text-foreground">ops@tac-xpress.com</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <Clock className="size-4 text-primary shrink-0" />
                    <span className="text-muted-foreground">Confirm availability with our team</span>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-border/80 text-xs font-sans text-muted-foreground">
                <div className="flex items-center gap-1.5 text-foreground font-medium mb-1">
                  <Check className="size-3.5 text-primary" />
                  <span>Our team reviews your request before confirming a booking</span>
                </div>
              </div>
            </div>
            <div className="p-8 sm:p-10 md:col-span-7 bg-background">
              <div className="flex border border-border bg-muted/40 p-1 mb-6 rounded-none">
                <button
                  type="button"
                  onClick={() => { setManualIntent("booking"); setSubmitted(false); }}
                  className={cn(
                    "flex-1 py-1.5 text-xs font-medium transition-colors text-center rounded-none",
                    intent === "booking"
                      ? "bg-background text-foreground shadow-2xs font-semibold"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  Consignment Booking
                </button>
                <button
                  type="button"
                  onClick={() => { setManualIntent("feedback"); setSubmitted(false); }}
                  className={cn(
                    "flex-1 py-1.5 text-xs font-medium transition-colors text-center rounded-none",
                    intent === "feedback"
                      ? "bg-background text-foreground shadow-2xs font-semibold"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  Share Feedback
                </button>
              </div>

              {submitted ? (
                <div className="py-12 text-center space-y-3">
                  <IconTile variant="soft" size="lg" className="mx-auto rounded-none">
                    <Check className="size-5" aria-hidden="true" />
                  </IconTile>
                  <h4 className="text-lg font-medium text-foreground">
                    {intent === "feedback" ? "Feedback Received" : "Inquiry Registered"}
                  </h4>
                  <p className="text-xs text-muted-foreground max-w-sm mx-auto leading-relaxed">
                    {intent === "feedback"
                      ? "Thank you for sharing your experience. Our operations team reviews all customer feedback to calibrate corridor service quality."
                      : "Our terminal dispatch controller has received your booking details and will confirm flight capacity allotment within 15 minutes."}
                  </p>
                  {ticketId && (
                    <div className="mt-4 inline-block border border-border bg-muted/30 px-3 py-1.5 text-xs text-muted-foreground rounded-none">
                      Reference docket: <span className="font-mono font-semibold text-foreground">#{ticketId.slice(0, 8)}</span>
                    </div>
                  )}
                  <div className="pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setSubmitted(false)
                        setTicketId(null)
                        setFormData({
                          name: "",
                          email: "",
                          phone: "",
                          mode: "AIR",
                          weight: "30",
                          origin: "DEL",
                          message: "",
                          website: "",
                        })
                      }}
                      className="rounded-none text-xs"
                    >
                      Submit Another Booking
                    </Button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Honeypot field for bot protection */}
                  <input
                    type="text"
                    name="website"
                    value={formData.website}
                    onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                    tabIndex={-1}
                    autoComplete="off"
                    className="sr-only"
                    aria-hidden="true"
                  />

                  {submitError && (
                    <Alert variant="destructive">
                      <AlertCircle aria-hidden="true" />
                      <AlertTitle>Could not save your request</AlertTitle>
                      <AlertDescription>{submitError}</AlertDescription>
                    </Alert>
                  )}

                  <div className="space-y-1.5">
                    <label htmlFor="contact-name" className="text-xs font-sans font-medium text-foreground">
                      Full Name / Entity Name
                    </label>
                    <input
                      id="contact-name"
                      aria-invalid={Boolean(fieldErrors.customer_name)}
                      aria-describedby={fieldErrors.customer_name ? "contact-name-error" : undefined}
                      required
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. Rajesh Kumar (Consignor)"
                      className="h-10 w-full border border-border bg-background px-3 text-base sm:text-xs text-foreground rounded-none focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-foreground"
                    />
                    {fieldErrors.customer_name && <p id="contact-name-error" className="text-xs text-destructive">{fieldErrors.customer_name}</p>}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <label htmlFor="contact-email" className="text-xs font-sans font-medium text-foreground">
                        Work Email
                      </label>
                      <input
                        id="contact-email"
                        aria-invalid={Boolean(fieldErrors.customer_email)}
                        aria-describedby={fieldErrors.customer_email ? "contact-email-error" : undefined}
                        required
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="rajesh@company.in"
                        className="h-10 w-full border border-border bg-background px-3 text-base sm:text-xs text-foreground rounded-none focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-foreground"
                      />
                      {fieldErrors.customer_email && <p id="contact-email-error" className="text-xs text-destructive">{fieldErrors.customer_email}</p>}
                    </div>

                    <div className="space-y-1.5">
                      <label htmlFor="contact-phone" className="text-xs font-sans font-medium text-foreground">
                        Phone (for updates)
                      </label>
                      <input
                        id="contact-phone"
                        aria-invalid={Boolean(fieldErrors.customer_phone)}
                        aria-describedby={fieldErrors.customer_phone ? "contact-phone-error" : undefined}
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="+91 98765 43210"
                        className="h-10 w-full border border-border bg-background px-3 text-base sm:text-xs text-foreground rounded-none focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-foreground"
                      />
                      {fieldErrors.customer_phone && <p id="contact-phone-error" className="text-xs text-destructive">{fieldErrors.customer_phone}</p>}
                    </div>
                  </div>

                  {intent === "booking" && (
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                      <div className="space-y-1.5">
                        <label htmlFor="contact-mode" className="text-xs font-sans font-medium text-foreground">
                          Transit Mode
                        </label>
                        <Select value={formData.mode} onValueChange={(mode) => setFormData({ ...formData, mode })}>
                          <SelectTrigger id="contact-mode" className="w-full"><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="AIR">Air cargo</SelectItem>
                            <SelectItem value="SURFACE">Surface cargo</SelectItem>
                            <SelectItem value="CHARTER">Special handling review</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-1.5">
                        <label htmlFor="contact-origin" className="text-xs font-sans font-medium text-foreground">
                          Bilateral Route
                        </label>
                        <Select value={formData.origin} onValueChange={(origin) => setFormData({ ...formData, origin })}>
                          <SelectTrigger id="contact-origin" className="w-full"><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="DEL">New Delhi ➔ Imphal</SelectItem>
                            <SelectItem value="IMF">Imphal ➔ New Delhi</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  )}

                  <div className="space-y-1.5">
                    <label htmlFor="contact-message" className="text-xs font-sans font-medium text-foreground">
                      {intent === "feedback"
                        ? "Feedback & Observations"
                        : "Consignment Details (Commodity, Weight in kg)"}
                    </label>
                    <textarea
                      id="contact-message"
                      aria-invalid={Boolean(fieldErrors.message)}
                      aria-describedby={fieldErrors.message ? "contact-message-error" : undefined}
                      rows={3}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder={intent === "feedback"
                        ? "How was your logistics experience? Tell us what worked well, transit reliability, or areas for improvement..."
                        : "e.g. 50 kg medical supplies, ready for departure from Delhi hub"}
                      className="w-full border border-border bg-background p-3 text-base sm:text-xs text-foreground rounded-none focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-foreground"
                    />
                    {fieldErrors.message && <p id="contact-message-error" className="text-xs text-destructive">{fieldErrors.message}</p>}
                  </div>

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 size-3.5 animate-spin" />
                        Saving request…
                      </>
                    ) : (
                      <>
                        {intent === "feedback" ? "Submit Feedback" : "Submit Booking Request"}
                        <ArrowUpRight className="ml-1.5 size-3.5" />
                      </>
                    )}
                  </Button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
