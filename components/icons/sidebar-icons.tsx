import React from "react"
import type { SVGProps } from "react"

export function DashboardIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <rect
        x="3"
        y="3"
        width="7"
        height="9"
        rx="2"
        fill="currentColor"
        fillOpacity={0.2}
      />
      <rect
        x="14"
        y="3"
        width="7"
        height="5"
        rx="1.5"
        fill="currentColor"
        fillOpacity={0.2}
      />
      <rect
        x="14"
        y="12"
        width="7"
        height="9"
        rx="2"
        fill="currentColor"
        fillOpacity={0.2}
      />
      <rect
        x="3"
        y="16"
        width="7"
        height="5"
        rx="1.5"
        fill="currentColor"
        fillOpacity={0.2}
      />
    </svg>
  )
}

export function AnalyticsIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M3 3v18h18" strokeOpacity={0.4} />
      <path d="M7 14l4-4 4 4 6-6" />
      <circle cx="21" cy="8" r="2" fill="currentColor" fillOpacity={0.3} />
      <path
        d="M7 14l4-4 4 4 6-6V21H7z"
        fill="currentColor"
        fillOpacity={0.1}
        stroke="none"
      />
    </svg>
  )
}

export function MetricsIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M3 12h4l3-8 4 16 3-8h4" />
      <path
        d="M3 12h4l3-8 4 16 3-8h4"
        fill="currentColor"
        fillOpacity={0.1}
        stroke="none"
      />
      <circle
        cx="10"
        cy="4"
        r="2"
        fill="currentColor"
        fillOpacity={0.3}
        stroke="none"
      />
      <circle
        cx="14"
        cy="20"
        r="2"
        fill="currentColor"
        fillOpacity={0.3}
        stroke="none"
      />
    </svg>
  )
}

export function ShipmentsIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path
        d="M3 8v8c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V8l-9-5.5L3 8z"
        fill="currentColor"
        fillOpacity={0.1}
      />
      <path d="M21 8l-9 5.5L3 8" />
      <path d="M12 22V13.5" />
      <polygon
        points="12 13.5 21 8 12 2.5 3 8 12 13.5"
        fill="currentColor"
        fillOpacity={0.2}
        stroke="none"
      />
    </svg>
  )
}

export function DispatchIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path
        d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"
        fill="currentColor"
        fillOpacity={0.2}
      />
      <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" strokeWidth="1.5" />
      <path d="M15 4l-8 8" strokeOpacity={0.3} />
    </svg>
  )
}

export function ManifestsIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path
        d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"
        fill="currentColor"
        fillOpacity={0.1}
      />
      <path d="M14 2v6h6" fill="currentColor" fillOpacity={0.2} />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
      <polyline points="10 9 9 9 8 9" strokeWidth="2" />
    </svg>
  )
}

export function FleetIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M10 17h4V5H2v12h3" fill="currentColor" fillOpacity={0.1} />
      <path
        d="M20 17h2v-9l-3-3h-5v12h2"
        fill="currentColor"
        fillOpacity={0.2}
      />
      <circle
        cx="7.5"
        cy="17.5"
        r="2.5"
        fill="currentColor"
        fillOpacity={0.3}
      />
      <circle
        cx="17.5"
        cy="17.5"
        r="2.5"
        fill="currentColor"
        fillOpacity={0.3}
      />
      <line x1="2" y1="9" x2="10" y2="9" strokeOpacity={0.4} />
    </svg>
  )
}

export function TrackingIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path
        d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"
        fill="currentColor"
        fillOpacity={0.1}
      />
      <circle cx="12" cy="10" r="3" fill="currentColor" fillOpacity={0.3} />
      <path d="M12 10l3-3" strokeOpacity={0.5} />
    </svg>
  )
}

export function InvoicesIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path
        d="M4 2v20l2-2 2 2 2-2 2 2 2-2 2 2 2-2 2 2V2L18 4l-2-2-2 2-2-2-2 2-2-2-2 2Z"
        fill="currentColor"
        fillOpacity={0.1}
      />
      <rect
        x="8"
        y="10"
        width="8"
        height="4"
        rx="1"
        fill="currentColor"
        fillOpacity={0.2}
      />
      <line x1="12" y1="9" x2="12" y2="15" />
      <line x1="8" y1="6" x2="16" y2="6" strokeOpacity={0.4} />
    </svg>
  )
}

export function CustomersIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path
        d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"
        fill="currentColor"
        fillOpacity={0.1}
      />
      <circle cx="9" cy="7" r="4" fill="currentColor" fillOpacity={0.2} />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" strokeOpacity={0.5} />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" strokeOpacity={0.5} />
    </svg>
  )
}

export function PricingIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <circle cx="12" cy="12" r="10" fill="currentColor" fillOpacity={0.1} />
      <path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8" fill="none" />
      <line x1="12" y1="18" x2="12" y2="6" />
      <path d="M12 6v12" strokeWidth="3" strokeOpacity={0.2} />
    </svg>
  )
}

export function SupportIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path
        d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"
        fill="currentColor"
        fillOpacity={0.1}
      />
      <path
        d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"
        strokeWidth="1.5"
      />
    </svg>
  )
}

export function NotificationIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path
        d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"
        fill="currentColor"
        fillOpacity={0.1}
      />
      <path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </svg>
  )
}

export function SidebarCollapseIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
      <path d="M9 3v18" fill="currentColor" fillOpacity={0.1} />
      <path d="M15 15l-3-3 3-3" strokeOpacity={0.7} />
    </svg>
  )
}

export function SunIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <circle cx="12" cy="12" r="5" fill="currentColor" fillOpacity={0.1} />
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
    </svg>
  )
}

export function MoonIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path
        d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"
        fill="currentColor"
        fillOpacity={0.1}
      />
    </svg>
  )
}
