import type { MetadataRoute } from 'next';
import { getAllProjects, getPublishedPostMetas } from '../lib/managed-content';
import { SITE_URL } from '../lib/site-url';

// Content lives in Postgres, so the sitemap has to be generated per request
// rather than frozen at build time.
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [posts, projects] = await Promise.all([getPublishedPostMetas(), getAllProjects()]);
  const now = new Date();

  const staticPages: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`, lastModified: now, changeFrequency: 'weekly', priority: 1 },
    { url: `${SITE_URL}/projects/`, lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${SITE_URL}/blog/`, lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${SITE_URL}/about/`, lastModified: now, changeFrequency: 'monthly', priority: 0.5 },
  ];

  return [
    ...staticPages,
    ...posts.map((post) => ({
      url: `${SITE_URL}${post.href}`,
      lastModified: new Date(post.isoDate),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    })),
    ...projects.map((project) => ({
      url: `${SITE_URL}/projects/${project.id}/`,
      lastModified: project.updatedAt ? new Date(project.updatedAt) : now,
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    })),
  ];
}
