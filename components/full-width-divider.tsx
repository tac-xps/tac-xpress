import { cn } from "@/lib/utils"

interface FullWidthDividerProps extends React.HTMLAttributes<HTMLDivElement> {}

export function FullWidthDivider({
  className,
  ...props
}: FullWidthDividerProps) {
  return (
    <div
      className={cn("absolute right-0 left-0 h-px w-full bg-border", className)}
      {...props}
    />
  )
}
