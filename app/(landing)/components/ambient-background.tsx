

export function AmbientBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">


      {/* Layer 1: Slow-moving aurora blobs */}
      <div
        className="absolute -top-1/2 -left-1/2 h-[200%] w-[200%] opacity-30"
        style={{
          animation: "aurora-slow 25s ease-in-out infinite",
          background: `radial-gradient(circle at 30% 30%, color-mix(in srgb, var(--color-primary) 40%, transparent) 0%, transparent 50%),
                       radial-gradient(circle at 70% 70%, color-mix(in srgb, var(--color-primary) 30%, transparent) 0%, transparent 50%)`,
        }}
      />
      {/* Layer 2: Grid overlay for "control room" feel */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(color-mix(in srgb, var(--color-primary) 30%, transparent) 1px, transparent 1px),
                           linear-gradient(90deg, color-mix(in srgb, var(--color-primary) 30%, transparent) 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
        }}
      />
      {/* Layer 3: Vignette for depth */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.1)_100%)] dark:bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.6)_100%)]" />
    </div>
  )
}
