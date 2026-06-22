import React from "react"
import { cn } from "@/lib/utils"

// Reusable SVG props
type IconProps = React.SVGProps<SVGSVGElement> & { className?: string }

// Utility wrapper for common styling and transitions
const SVGWrapper = ({
  children,
  className,
  viewBox = "0 0 24 24",
  fill = "none",
  ...props
}: React.PropsWithChildren<IconProps>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox={viewBox}
    fill={fill}
    className={cn(
      "transition-all duration-300 ease-in-out group-hover:scale-110",
      className
    )}
    {...props}
  >
    {children}
  </svg>
)

export const CargoPlaneIcon = ({ className, ...props }: IconProps) => (
  <SVGWrapper className={className} {...props}>
    <path
      d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.2-1.1.5l-1.3 1.5c-.3.3-.1.8.3.9l7.9 3.5-3.2 3.2-3.8-1c-.4-.1-.8 0-1.1.3l-1.1 1.1c-.2.2-.2.6 0 .8l4.2 2.5 2.5 4.2c.2.2.6.2.8 0l1.1-1.1c.3-.3.4-.7.3-1.1l-1-3.8 3.2-3.2 3.5 7.9c.1.4.6.6.9.3l1.5-1.3c.3-.2.6-.6.5-1.1z"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="group-hover:stroke-primary/80"
    />
    <path
      d="m12 12 3.5-3.5"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="opacity-50 group-hover:opacity-100"
    />
  </SVGWrapper>
)

export const RouteTruckIcon = ({ className, ...props }: IconProps) => (
  <SVGWrapper className={className} {...props}>
    <path
      d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="group-hover:stroke-primary/80"
    />
    <path
      d="M15 18H9"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14v10h1"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <circle
      cx="7"
      cy="18"
      r="2"
      stroke="currentColor"
      strokeWidth="1.5"
      className="group-hover:fill-primary/20"
    />
    <circle
      cx="17"
      cy="18"
      r="2"
      stroke="currentColor"
      strokeWidth="1.5"
      className="group-hover:fill-primary/20"
    />
    <path
      d="M14 13h5.5"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      className="opacity-50 group-hover:opacity-100"
    />
  </SVGWrapper>
)

export const MapMarkerIcon = ({ className, ...props }: IconProps) => (
  <SVGWrapper className={className} {...props}>
    <path
      d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="group-hover:fill-primary/10"
    />
    <circle
      cx="12"
      cy="10"
      r="3"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="group-hover:fill-primary/30"
    />
  </SVGWrapper>
)

export const TrackingBoxIcon = ({ className, ...props }: IconProps) => (
  <SVGWrapper className={className} {...props}>
    <path
      d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="group-hover:fill-primary/5"
    />
    <path
      d="m3.3 7 8.7 5 8.7-5"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M12 22V12"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="m8.5 4 7 4"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="opacity-50"
    />
  </SVGWrapper>
)

export const CustomArrowRightIcon = ({ className, ...props }: IconProps) => (
  <SVGWrapper className={className} {...props}>
    <path
      d="M5 12h14"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="transition-transform group-hover:translate-x-1"
    />
    <path
      d="m12 5 7 7-7 7"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="transition-transform group-hover:translate-x-1"
    />
  </SVGWrapper>
)

export const CustomGlobeIcon = ({ className, ...props }: IconProps) => (
  <SVGWrapper className={className} {...props}>
    <circle
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      strokeWidth="1.5"
      className="group-hover:stroke-primary/80"
    />
    <path
      d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"
      stroke="currentColor"
      strokeWidth="1.5"
      className="opacity-60 group-hover:opacity-100"
    />
    <path
      d="M2 12h20"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </SVGWrapper>
)

export const TeamUsersIcon = ({ className, ...props }: IconProps) => (
  <SVGWrapper className={className} {...props}>
    <path
      d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <circle
      cx="9"
      cy="7"
      r="4"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="group-hover:fill-primary/20"
    />
    <path
      d="M22 21v-2a4 4 0 0 0-3-3.87"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="opacity-60"
    />
    <path
      d="M16 3.13a4 4 0 0 1 0 7.75"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="opacity-60"
    />
  </SVGWrapper>
)

export const MountainResilienceIcon = ({ className, ...props }: IconProps) => (
  <SVGWrapper className={className} {...props}>
    <path
      d="m8 3 4 8 5-5 5 15H2L8 3z"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="group-hover:fill-primary/10"
    />
    <path
      d="M4.14 15.08c2.62-1.57 5.24-1.43 7.86.42 2.74 1.94 5.49 2 8.23.19"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="opacity-50"
    />
  </SVGWrapper>
)

export const HandshakeTrustIcon = ({ className, ...props }: IconProps) => (
  <SVGWrapper className={className} {...props}>
    <path
      d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="transition-colors group-hover:fill-primary/10"
    />
    <path
      d="M12 5 9.04 9.2a2.71 2.71 0 0 0-2.84 3.62l-1.12 1.12a2 2 0 0 0-.58 1.41v1.65"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="opacity-70"
    />
    <path
      d="M12 5l2.96 4.2a2.71 2.71 0 0 1 2.84 3.62l1.12 1.12a2 2 0 0 1 .58 1.41v1.65"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="opacity-70"
    />
  </SVGWrapper>
)

export const QuoteCustomIcon = ({ className, ...props }: IconProps) => (
  <SVGWrapper className={className} {...props}>
    <path
      d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="group-hover:fill-primary/20"
    />
    <path
      d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="group-hover:fill-primary/20"
    />
  </SVGWrapper>
)

export const SupportLifebuoyIcon = ({ className, ...props }: IconProps) => (
  <SVGWrapper className={className} {...props}>
    <circle
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      strokeWidth="1.5"
      className="group-hover:fill-primary/10"
    />
    <circle
      cx="12"
      cy="12"
      r="4"
      stroke="currentColor"
      strokeWidth="1.5"
      className="group-hover:stroke-primary"
    />
    <path
      d="m4.93 4.93 4.24 4.24"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="m14.83 14.83 4.24 4.24"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="m14.83 9.17 4.24-4.24"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="m4.93 19.07 4.24-4.24"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </SVGWrapper>
)

export const MessageChatIcon = ({ className, ...props }: IconProps) => (
  <SVGWrapper className={className} {...props}>
    <path
      d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="group-hover:fill-primary/10"
    />
  </SVGWrapper>
)

export const SendMessageIcon = ({ className, ...props }: IconProps) => (
  <SVGWrapper className={className} {...props}>
    <path
      d="m22 2-7 20-4-9-9-4Z"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="transition-transform group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:fill-primary/20"
    />
    <path
      d="M22 2 11 13"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="transition-transform group-hover:translate-x-1 group-hover:-translate-y-1"
    />
  </SVGWrapper>
)

export const CloseCustomIcon = ({ className, ...props }: IconProps) => (
  <SVGWrapper className={className} {...props}>
    <path
      d="M18 6 6 18"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="origin-center transition-transform group-hover:rotate-90"
    />
    <path
      d="m6 6 12 12"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="origin-center transition-transform group-hover:rotate-90"
    />
  </SVGWrapper>
)

export const ActivityPulseIcon = ({ className, ...props }: IconProps) => (
  <SVGWrapper className={className} {...props}>
    <path
      d="M22 12h-4l-3 9L9 3l-3 9H2"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="transition-colors group-hover:stroke-primary"
    />
  </SVGWrapper>
)

export const ShieldSecurityIcon = ({ className, ...props }: IconProps) => (
  <SVGWrapper className={className} {...props}>
    <path
      d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="transition-colors group-hover:fill-primary/20"
    />
  </SVGWrapper>
)

export const ZapLightningIcon = ({ className, ...props }: IconProps) => (
  <SVGWrapper className={className} {...props}>
    <path
      d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="transition-colors group-hover:fill-primary/20"
    />
  </SVGWrapper>
)

export const PhoneCallCustomIcon = ({ className, ...props }: IconProps) => (
  <SVGWrapper className={className} {...props}>
    <path
      d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="transition-colors group-hover:fill-primary/10"
    />
  </SVGWrapper>
)

export const MailCustomIcon = ({ className, ...props }: IconProps) => (
  <SVGWrapper className={className} {...props}>
    <rect
      width="20"
      height="16"
      x="2"
      y="4"
      rx="2"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="transition-colors group-hover:fill-primary/10"
    />
    <path
      d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="transition-colors group-hover:stroke-primary"
    />
  </SVGWrapper>
)

export const CheckCircleCustomIcon = ({ className, ...props }: IconProps) => (
  <SVGWrapper className={className} {...props}>
    <circle
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      strokeWidth="1.5"
      className="transition-colors group-hover:fill-primary/10"
    />
    <path
      d="m9 12 2 2 4-4"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="transition-colors group-hover:stroke-primary"
    />
  </SVGWrapper>
)

export const SearchCustomIcon = ({ className, ...props }: IconProps) => (
  <SVGWrapper className={className} {...props}>
    <circle
      cx="11"
      cy="11"
      r="8"
      stroke="currentColor"
      strokeWidth="1.5"
      className="transition-colors group-hover:stroke-primary"
    />
    <path
      d="m21 21-4.3-4.3"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="transition-colors group-hover:stroke-primary"
    />
  </SVGWrapper>
)
