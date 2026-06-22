import fs from 'fs';
import path from 'path';

const pages = [
  '/app/operations/air-cargo/page.tsx',
  '/app/operations/surface-cargo/page.tsx',
  '/app/operations/live-tracking/page.tsx',
  '/app/operations/network-map/page.tsx',
  '/app/operations/warehouse/page.tsx',
  '/app/company/about/page.tsx',
  '/app/company/fleet/page.tsx',
  '/app/company/careers/page.tsx',
  '/app/company/investors/page.tsx',
  '/app/company/contact/page.tsx',
  '/app/resources/api/page.tsx',
  '/app/resources/docs/page.tsx',
  '/app/resources/webhooks/page.tsx',
  '/app/resources/support/page.tsx'
];

const getTemplate = (title) => `import { Header } from "@/components/header"
import { Footer } from "@/layout/footer"
import { AmbientBackground } from "@/app/(landing)/components/ambient-background"

export default function Page() {
  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden bg-premium-mesh text-foreground">
      <AmbientBackground />
      <Header />
      <main className="relative mx-auto flex w-full max-w-7xl grow flex-col items-center justify-center p-8">
        <h1 className="font-heading text-4xl tracking-tight text-primary uppercase md:text-5xl">
          ${title}
        </h1>
        <p className="mt-4 text-center text-muted-foreground">
          This page is currently under construction. Please check back later.
        </p>
      </main>
      <Footer />
    </div>
  )
}
`;

pages.forEach((pagePath) => {
  const fullPath = path.join(process.cwd(), pagePath);
  const dir = path.dirname(fullPath);
  
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  
  if (!fs.existsSync(fullPath)) {
    // Generate a title from the path
    const parts = pagePath.split('/');
    const titleRaw = parts[parts.length - 2];
    const title = titleRaw.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
    
    fs.writeFileSync(fullPath, getTemplate(title));
    console.log(`Created ${pagePath}`);
  } else {
    console.log(`Skipped ${pagePath} (already exists)`);
  }
});
