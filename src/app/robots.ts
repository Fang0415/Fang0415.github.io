import type { MetadataRoute } from 'next';
import { SITE_URL } from '../lib/site-url';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      // The console and its endpoints are behind a session cookie anyway; keeping
      // them out of the index avoids handing crawlers a login page to retry.
      disallow: ['/admin', '/api/'],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
