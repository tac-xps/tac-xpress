import { Header } from "@/components/header"
import { Footer } from "@/layout/footer"
import { AmbientBackground } from "@/app/(landing)/components/ambient-background"

export default function Page() {
  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden bg-premium-mesh text-foreground">
      <AmbientBackground />
      <Header />
      <main className="relative mx-auto flex w-full max-w-7xl grow flex-col items-center justify-center p-8">
        <h1 className="font-heading text-4xl tracking-tight text-primary uppercase md:text-5xl">
          Surface Cargo
        </h1>
        <p className="mt-4 text-center text-muted-foreground">
          This page is currently under construction. Please check back later.
        </p>
      </main>
      <Footer />
    </div>
  )
}
