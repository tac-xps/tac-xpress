import { cn } from "@/lib/utils"

interface GlassCardProps {
  children: React.ReactNode
  className?: string
  glowOnHover?: boolean
}

export function GlassCard({
  children,
  className,
  glowOnHover = true,
}: GlassCardProps) {
  return (
    <div className={cn("group relative", className)}>
      {/* Animated border glow on hover */}
      {glowOnHover && (
        <div className="absolute -inset-[1px] rounded-none bg-gradient-to-r from-primary via-secondary to-primary opacity-0 blur-sm transition-opacity duration-500 group-hover:opacity-100" />
      )}
      {/* Card body */}
      <div className="relative rounded-none border border-border/40 bg-card/65 p-6 backdrop-blur-xl">
        {children}
      </div>
    </div>
  )
}
