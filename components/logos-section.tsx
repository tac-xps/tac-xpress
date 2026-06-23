import { LogoCloud } from "@/components/logo-cloud"
import { DecorIcon } from "@/components/decor-icon"
import { FullWidthDivider } from "@/components/full-width-divider"

export function LogosSection() {
  return (
    <section className="mb-12">
      <h2 className="py-6 text-center text-lg font-medium tracking-tight text-muted-foreground md:text-xl">
        Trusted by <span className="text-foreground">experts</span>
      </h2>
      <div className="relative *:border-0">
        <DecorIcon className="size-5" position="top-left" />
        <DecorIcon className="size-5" position="top-right" />
        <DecorIcon className="size-5" position="bottom-left" />
        <DecorIcon className="size-5" position="bottom-right" />

        <FullWidthDivider className="-top-px" />
        <LogoCloud />
        <FullWidthDivider className="-bottom-px" />
      </div>
    </section>
  )
}
