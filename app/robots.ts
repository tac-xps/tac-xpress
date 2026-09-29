import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = (process.env.NEXT_PUBLIC_APP_URL || 'https://tac-xpress.com').replace(/\/+$/, '');

  return {
    rules: {
      userAgent: '*',
      allow: ['/', '/track', '/login'],
      disallow: ['/dashboard', '/api', '/_next'],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
