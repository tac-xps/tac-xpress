import { usePostHog } from 'posthog-js/react'

export type LogisticsEvents = {
  shipment_created: { shipment_id: string; destination: string; weight: number }
  invoice_paid: { invoice_id: string; amount: number; currency: string }
  driver_assigned: { driver_id: string; vehicle_id: string; manifest_id: string }
  ticket_escalated: { ticket_id: string; priority: 'high' | 'critical' }
}

export function useAnalytics() {
  const posthog = usePostHog()

  const trackEvent = <T extends keyof LogisticsEvents>(
    eventName: T,
    properties: LogisticsEvents[T]
  ) => {
    if (posthog) {
      posthog.capture(eventName, properties)
    }
  }

  return { trackEvent }
}
