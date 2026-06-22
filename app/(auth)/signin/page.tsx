import { LoginForm } from "@/components/login-form"
import Image from "next/image"
import { Logo } from "@/components/logo"
import Link from "next/link"
import { ThemeToggleButton } from "@/components/theme-toggle-button"

export default function SignInPage() {
  return (
    <div className="relative grid min-h-svh bg-background lg:grid-cols-2">
      <div className="absolute top-4 right-4 z-50">
        <ThemeToggleButton />
      </div>
      <div className="relative hidden overflow-hidden border-r border-white/10 bg-premium-mesh after:pointer-events-none after:absolute after:inset-0 after:bg-primary/5 lg:block">
        <Image
          src="/images/login-trans.png"
          alt="Tactical Logistics"
          fill
          sizes="(max-width: 1024px) 100vw, 50vw"
          className="object-contain p-8 lg:p-12"
          priority
        />

        <div className="relative z-20 flex h-full flex-col justify-between p-10 text-foreground">
          <Link href="/" className="transition-opacity hover:opacity-90">
            <Logo className="h-10 text-foreground" />
          </Link>

          <div className="mt-auto">
            <blockquote className="space-y-4">
              <p className="font-inter text-3xl leading-snug font-light tracking-tight text-foreground/90">
                "Revolutionized how we move cargo to the Northeast.
                <br />
                The most reliable partner we've worked with."
              </p>
              <footer className="font-inter text-sm font-medium tracking-widest text-foreground/60 uppercase">
                &mdash; Tapan Hidangmayum, Founder
              </footer>
            </blockquote>
          </div>
        </div>
      </div>

      <div className="relative flex flex-col items-center justify-center bg-background p-6 md:p-10 lg:p-20">
        <div className="w-full max-w-[400px] animate-in duration-700 zoom-in-95 fade-in">
          <div className="mb-8 flex justify-center lg:hidden">
            <Link href="/" className="transition-opacity hover:opacity-90">
              <Logo className="h-10" />
            </Link>
          </div>

          <LoginForm />
        </div>
      </div>
    </div>
  )
}
