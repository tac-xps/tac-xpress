export default function DriverLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="mx-auto min-h-screen max-w-md bg-muted shadow-xl sm:border-x">
      <header className="sticky top-0 z-10 flex items-center justify-between bg-primary p-4 text-primary-foreground">
        <div className="text-lg font-semibold tracking-tight">Delivery workspace</div>
        <div className="text-sm">Staff access</div>
      </header>
      <main className="p-4">{children}</main>
    </div>
  )
}
