// Tailark Veil contact/content heading composition.
import Link from "next/link"
import { CargoImage, type CargoAsset } from "./cargo-image"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
export function PageIntro({
  eyebrow,
  title,
  description,
  image,
}: {
  eyebrow: string
  title: string
  description: string
  image?: CargoAsset
}) {
  return (
    <section className="cargo-container py-12 lg:py-20">
      <Breadcrumb className="mb-10">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/">Home</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{eyebrow}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <div
        className={
          image ? "grid items-center gap-10 lg:grid-cols-2 lg:gap-16" : ""
        }
      >
        <div>
          <p className="cargo-eyebrow mb-5 text-muted-foreground">{eyebrow}</p>
          <h1 className="cargo-heading max-w-3xl">{title}</h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">
            {description}
          </p>
        </div>
        {image && <CargoImage asset={image} className="cargo-page-media" />}
      </div>
    </section>
  )
}
