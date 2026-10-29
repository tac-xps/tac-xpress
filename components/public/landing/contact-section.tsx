"use client"

import React, { useState } from "react"
import { Check, Mail, MapPin, Phone, Clock, ArrowUpRight, Loader2, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/reui/badge"
import { IconTile } from "@/components/reui/icon-tile"
import { createTicket } from "@/app/actions/tickets"

export function ContactSection() {
  const [submitted, setSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [ticketId, setTicketId] = useState<string | null>(null)

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

    try {
      const payload = new FormData()
      payload.set("customer_name", formData.name.trim())
      payload.set("customer_email", formData.email.trim())
      if (formData.phone.trim()) {
        payload.set("customer_phone", formData.phone.trim())
      }
      payload.set("website", formData.website)

      const routeName = formData.origin === "DEL" ? "DEL to IMF (New Delhi to Imphal)" : "IMF to DEL (Imphal to New Delhi)"
      const modeName = formData.mode === "AIR" ? "Express Air (24h SLA)" : formData.mode === "SURFACE" ? "Surface Linehaul (4 to 5 days SLA)" : "Dedicated Charter"

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

      const res = await createTicket(payload)

      if (res?.error) {
        const errorMsg =
          typeof res.error === "object" && "_form" in res.error && Array.isArray(res.error._form)
            ? res.error._form[0]
            : "Unable to save booking request. Verify your details or call our dispatch desk directly."
        setSubmitError(errorMsg)
      } else if (res?.success) {
        setTicketId(res.ticketId ?? null)
        setSubmitted(true)
      }
    } catch {
      setSubmitError("Network exception occurred connecting to terminal dispatch. Call our 24/7 gate desk directly.")
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
      <div className="mx-auto w-full max-w-[1320px] px-6 lg:px-12">
        <div className="text-center max-w-xl mx-auto mb-16">
          <h2
            id="contact-heading"
            className="text-2xl font-medium tracking-tight text-foreground sm:text-4xl"
          >
            Get in touch
          </h2>
          <p className="mt-2 text-xs font-sans text-muted-foreground">
            Connect directly with our 24/7 terminal dispatch controllers for immediate booking and capacity allotment.
          </p>
        </div>

        <div className="mx-auto max-w-4xl border border-border bg-card overflow-hidden rounded-none shadow-2xs">
          <div className="grid grid-cols-1 md:grid-cols-12 items-stretch">
            {/* Left Column: Dark Terminal Operations Info */}
            <div className="bg-muted/40 p-8 sm:p-10 text-foreground md:col-span-5 flex flex-col justify-between border-b md:border-b-0 md:border-r border-border">
              <div>
                <Badge variant="primary-light" size="sm">
                  DEL ⇄ IMF Operations Desk
                </Badge>
                <h3 className="mt-2 text-xl font-medium text-foreground">
                  Terminal Control
                </h3>
                <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
                  Direct ramp dispatch and custody clearance operating 24 hours daily on the bilateral corridor.
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
                    <span className="text-muted-foreground">24/7 Gate Dispatch Operations</span>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-border/80 text-xs font-sans text-muted-foreground">
                <div className="flex items-center gap-1.5 text-foreground font-medium mb-1">
                  <Check className="size-3.5 text-primary" />
                  <span>Guaranteed belly-hold response in 15 mins</span>
                </div>
              </div>
            </div>

            {/* Right Column: Live Dispatch Inquiry Form */}
            <div className="p-8 sm:p-10 md:col-span-7 bg-background">
              {submitted ? (
                <div className="py-12 text-center space-y-3">
                  <IconTile variant="soft" size="lg" className="mx-auto rounded-none">
                    <Check className="size-5" aria-hidden="true" />
                  </IconTile>
                  <h4 className="text-lg font-medium text-foreground">Inquiry Registered</h4>
                  <p className="text-xs text-muted-foreground max-w-sm mx-auto leading-relaxed">
                    Our terminal dispatch controller has received your booking details and will confirm flight capacity allotment within 15 minutes.
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
                    <div className="flex items-start gap-2 border border-destructive/40 bg-destructive/10 p-3 text-xs text-destructive rounded-none">
                      <AlertCircle className="size-4 shrink-0 mt-0.5" />
                      <span>{submitError}</span>
                    </div>
                  )}

                  <div className="space-y-1.5">
                    <label htmlFor="contact-name" className="text-xs font-sans font-medium text-foreground">
                      Full Name / Entity Name
                    </label>
                    <input
                      id="contact-name"
                      required
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. Rajesh Kumar (Consignor)"
                      className="h-10 w-full border border-border bg-background px-3 text-base sm:text-xs text-foreground rounded-none focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-foreground"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <label htmlFor="contact-email" className="text-xs font-sans font-medium text-foreground">
                        Work Email
                      </label>
                      <input
                        id="contact-email"
                        required
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="rajesh@company.in"
                        className="h-10 w-full border border-border bg-background px-3 text-base sm:text-xs text-foreground rounded-none focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-foreground"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label htmlFor="contact-phone" className="text-xs font-sans font-medium text-foreground">
                        Phone (for updates)
                      </label>
                      <input
                        id="contact-phone"
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="+91 98765 43210"
                        className="h-10 w-full border border-border bg-background px-3 text-base sm:text-xs text-foreground rounded-none focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-foreground"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <label htmlFor="contact-mode" className="text-xs font-sans font-medium text-foreground">
                        Transit Mode
                      </label>
                      <select
                        id="contact-mode"
                        value={formData.mode}
                        onChange={(e) => setFormData({ ...formData, mode: e.target.value })}
                        className="h-10 w-full border border-border bg-background px-3 text-base sm:text-xs text-foreground rounded-none focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-foreground"
                      >
                        <option value="AIR">Air Express (24h)</option>
                        <option value="SURFACE">Surface Linehaul (4 to 5 days)</option>
                        <option value="CHARTER">Dedicated Charter</option>
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label htmlFor="contact-origin" className="text-xs font-sans font-medium text-foreground">
                        Bilateral Route
                      </label>
                      <select
                        id="contact-origin"
                        value={formData.origin}
                        onChange={(e) => setFormData({ ...formData, origin: e.target.value })}
                        className="h-10 w-full border border-border bg-background px-3 text-base sm:text-xs text-foreground rounded-none focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-foreground"
                      >
                        <option value="DEL">New Delhi ➔ Imphal</option>
                        <option value="IMF">Imphal ➔ New Delhi</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label htmlFor="contact-message" className="text-xs font-sans font-medium text-foreground">
                      Consignment Details (Commodity, Weight in kg)
                    </label>
                    <textarea
                      id="contact-message"
                      rows={3}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="e.g. 50 kg medical supplies, ready for departure from Delhi hub"
                      className="w-full border border-border bg-background p-3 text-base sm:text-xs text-foreground rounded-none focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-foreground"
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full h-10 rounded-none font-medium text-xs bg-foreground text-background hover:bg-foreground/90 transition-colors mt-2"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 size-3.5 animate-spin" />
                        Allocating Flight Capacity…
                      </>
                    ) : (
                      <>
                        Submit Booking Request
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
