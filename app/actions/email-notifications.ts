"use server"

import { supabaseAdmin } from "@/lib/supabase/clients"
import { sanitizeHtml } from "@/lib/sanitize"

const RESEND_API_KEY = process.env.RESEND_API_KEY
const FROM_EMAIL = process.env.FROM_EMAIL || "support@tac-xpress.app"
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"

export type NotificationType =
  | "ticket_created"
  | "ai_replied"
  | "agent_replied"
  | "sla_breach"
  | "resolved"

interface EmailPayload {
  to: string
  ticketId: string
  subject: string
  type: NotificationType
  body?: string
}

// ---------------------------------------------------------------------------
// Subject line builder
// ---------------------------------------------------------------------------
function buildSubject(type: NotificationType, ticketSubject: string): string {
  const prefixes: Record<NotificationType, string> = {
    ticket_created: "[TAC-XPRESS] Ticket Received",
    ai_replied: "[TAC-XPRESS] Update on Your Ticket",
    agent_replied: "[TAC-XPRESS] Agent Response",
    sla_breach: "[TAC-XPRESS] Urgent: Ticket Escalated",
    resolved: "[TAC-XPRESS] Ticket Resolved",
  }
  return `${prefixes[type]}: ${ticketSubject}`
}

// ---------------------------------------------------------------------------
// HTML email templates (inline CSS for compatibility)
// ---------------------------------------------------------------------------
function buildEmailContent(
  type: NotificationType,
  subject: string,
  body?: string,
  ticketId?: string
) {
  const portalUrl = `${APP_URL}/portal/tickets`
  const ticketLabel = ticketId ? `#${ticketId.slice(0, 8).toUpperCase()}` : ""
  const supportEmail = FROM_EMAIL
  // Sanitize body and subject to prevent XSS via email in webmail clients
  const safeBody = body ? sanitizeHtml(body) : ""
  const safeSubject = subject ? sanitizeHtml(subject) : ""

  const base = (content: string) => `
<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8" /><meta name="viewport" content="width=device-width, initial-scale=1.0" /></head>
<body style="margin:0;padding:0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;background:#f5f5f5;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f5f5;padding:32px 0;">
    <tr><td align="center">
      <table width="560" cellpadding="0" cellspacing="0" style="background:#ffffff;border:1px solid #e5e7eb;max-width:560px;width:100%;">
        <!-- Header -->
        <tr><td style="padding:20px 24px;border-bottom:2px solid #1a1a1a;background:#1a1a1a;">
          <span style="color:#ffffff;font-size:14px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;">TAC-XPRESS</span>
          <span style="color:#6b7280;font-size:11px;margin-left:8px;">Logistics Support</span>
        </td></tr>
        <!-- Body -->
        <tr><td style="padding:28px 24px;">
          ${content}
          <hr style="border:none;border-top:1px solid #f3f4f6;margin:24px 0;" />
          <p style="color:#9ca3af;font-size:11px;margin:0;">
            If you have questions, reply to this email or visit <a href="${portalUrl}" style="color:#6366f1;">your ticket portal</a>.<br />
            This is an automated message from TAC-XPRESS — ${supportEmail}
          </p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`

  const btn = (url: string, text: string) =>
    `<a href="${url}" style="display:inline-block;background:#1a1a1a;color:#ffffff;text-decoration:none;font-size:12px;font-weight:600;letter-spacing:0.08em;text-transform:uppercase;padding:10px 20px;margin-top:16px;">${text}</a>`

  const templates: Record<NotificationType, { html: string; text: string }> = {
    ticket_created: {
      html: base(`
        <h2 style="font-size:18px;font-weight:700;color:#111827;margin:0 0 8px;">We've received your ticket ${ticketLabel}</h2>
        <p style="color:#374151;font-size:14px;margin:0 0 12px;"><strong>Subject:</strong> ${safeSubject}</p>
        <p style="color:#6b7280;font-size:14px;margin:0 0 16px;">Our AI is analyzing your request now and a support agent will follow up within 2 hours.</p>
        ${btn(portalUrl, "View Ticket")}
      `),
      text: `TAC-XPRESS: We received your ticket ${ticketLabel}.\nSubject: ${subject}\nWe'll respond within 2 hours.\n\nView: ${portalUrl}`,
    },
    ai_replied: {
      html: base(`
        <h2 style="font-size:18px;font-weight:700;color:#111827;margin:0 0 8px;">Update on your ticket ${ticketLabel}</h2>
        <p style="color:#374151;font-size:14px;margin:0 0 12px;"><strong>Subject:</strong> ${safeSubject}</p>
        <blockquote style="border-left:3px solid #6366f1;padding:12px 16px;background:#f5f3ff;color:#374151;font-size:14px;margin:0 0 16px;">${safeBody}</blockquote>
        <p style="color:#6b7280;font-size:13px;margin:0 0 4px;">Need to add more info? Reply via the portal.</p>
        ${btn(portalUrl, "Reply or View Thread")}
      `),
      text: `Update on ${subject} ${ticketLabel}:\n\n${body || ""}\n\nReply: ${portalUrl}`,
    },
    agent_replied: {
      html: base(`
        <h2 style="font-size:18px;font-weight:700;color:#111827;margin:0 0 8px;">A support agent responded to ${ticketLabel}</h2>
        <p style="color:#374151;font-size:14px;margin:0 0 12px;"><strong>Subject:</strong> ${safeSubject}</p>
        <blockquote style="border-left:3px solid #10b981;padding:12px 16px;background:#f0fdf4;color:#374151;font-size:14px;margin:0 0 16px;">${safeBody}</blockquote>
        ${btn(portalUrl, "Reply Here")}
      `),
      text: `Agent response on ${subject} ${ticketLabel}:\n\n${body || ""}\n\nReply: ${portalUrl}`,
    },
    sla_breach: {
      html: base(`
        <h2 style="font-size:18px;font-weight:700;color:#dc2626;margin:0 0 8px;">⚠️ Urgent: Your ticket has been escalated ${ticketLabel}</h2>
        <p style="color:#374151;font-size:14px;margin:0 0 12px;"><strong>Subject:</strong> ${safeSubject}</p>
        <p style="color:#6b7280;font-size:14px;margin:0 0 16px;">We've escalated your ticket to our senior team due to SLA requirements. Expect an update very shortly.</p>
        ${btn(portalUrl, "View Ticket")}
      `),
      text: `URGENT: Your ticket ${subject} ${ticketLabel} has been escalated. We'll update you soon.\n\nView: ${portalUrl}`,
    },
    resolved: {
      html: base(`
        <h2 style="font-size:18px;font-weight:700;color:#111827;margin:0 0 8px;">Ticket Resolved ✓ ${ticketLabel}</h2>
        <p style="color:#374151;font-size:14px;margin:0 0 12px;"><strong>Subject:</strong> ${safeSubject}</p>
        <p style="color:#6b7280;font-size:14px;margin:0 0 16px;">Your ticket has been marked as resolved. If you need further help, please open a new ticket.</p>
        ${btn(portalUrl, "View History")}
      `),
      text: `Resolved: ${subject} ${ticketLabel}.\nView history: ${portalUrl}`,
    },
  }

  return templates[type]
}

import * as Sentry from "@sentry/nextjs"

// ---------------------------------------------------------------------------
// Main function — sends via Resend and logs to email_notifications table
// ---------------------------------------------------------------------------
export async function sendTicketNotification(payload: EmailPayload) {
  try {
    if (!RESEND_API_KEY) {
      console.warn(
        "[Email] RESEND_API_KEY not set — email skipped:",
        payload.type,
        payload.to
      )
      return { skipped: true }
    }

    const { to, ticketId, subject, type, body } = payload
    const { html, text } = buildEmailContent(type, subject, body, ticketId)
    const emailSubject = buildSubject(type, subject)

    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: `TAC-XPRESS Support <${FROM_EMAIL}>`,
        to,
        subject: emailSubject,
        html,
        text,
      }),
    })

    if (!response.ok) {
      const errorBody = await response.json().catch(() => ({}))
      console.error("[Email] Resend error:", errorBody)
      // Log failure to DB so we can retry
      await supabaseAdmin.from("email_notifications").insert({
        ticket_id: ticketId,
        recipient_email: to,
        template_name: type,
        subject: emailSubject,
        body_html: html,
        body_text: text,
        status: "failed",
        sent_at: new Date().toISOString(),
      })
      return {
        success: false,
        error: `Resend API error: ${JSON.stringify(errorBody)}`,
      }
    }

    const result = await response.json()

    // Log success
    await supabaseAdmin.from("email_notifications").insert({
      ticket_id: ticketId,
      recipient_email: to,
      template_name: type,
      subject: emailSubject,
      body_html: html,
      body_text: text,
      status: "sent",
      provider_message_id: result.id,
      sent_at: new Date().toISOString(),
    })

    return { success: true, data: result }
  } catch (error: any) {
    Sentry.captureException(error)
    return { success: false, error: error.message || "Internal Server Error" }
  }
}
