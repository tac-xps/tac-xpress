import { cn } from "@/lib/utils"

interface DecorIconProps extends React.SVGProps<SVGSVGElement> {
  position?: "top-left" | "top-right" | "bottom-left" | "bottom-right"
}

export function DecorIcon({ className, position, ...props }: DecorIconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      className={cn(
        "absolute z-10 text-primary transition-all duration-300",
        // Faint glow using filter only in dark mode
        "dark:drop-shadow-[0_0_6px_var(--color-primary)]",
        {
          "-top-3 -left-3": position === "top-left",
          "-top-3 -right-3 rotate-90": position === "top-right",
          "-bottom-3 -left-3 -rotate-90": position === "bottom-left",
          "-right-3 -bottom-3 rotate-180": position === "bottom-right",
        },
        className
      )}
      {...props}
    >
      <g transform="rotate(45 12 12)">
        <path
          d="M6 4 L14 12 L6 20 M14 4 L22 12 L14 20"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
    </svg>
  )
}
