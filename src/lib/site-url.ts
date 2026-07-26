/**
 * The site's canonical origin.
 *
 * Everything that has to emit an absolute URL — the RSS feed, the sitemap,
 * robots.txt, Open Graph tags — reads it from here, so a deployment only has to
 * set `SITE_URL` once. The trailing slash is stripped because every caller
 * concatenates a path that already starts with one.
 */
export const SITE_URL = (process.env.SITE_URL || 'http://localhost:3000').replace(/\/+$/, '');

export function absoluteUrl(path: string): string {
  return `${SITE_URL}${path.startsWith('/') ? path : `/${path}`}`;
}
