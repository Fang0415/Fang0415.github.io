import type { CollectionEntry } from 'astro:content';

/**
 * The four editorial categories from the Cream Blog design system, each
 * bound to one earth-accent hue. Derived from a post's tags so existing
 * frontmatter needs no changes.
 */
export type CategoryColor = 'clay' | 'ochre' | 'sage' | 'slate';

export interface PostMeta {
  title: string;
  excerpt: string;
  date: string;          // 2026.06.18
  isoDate: string;       // 2026-06-18
  category: string;
  categoryColor: CategoryColor;
  readTime: string;      // 8 min read
  href: string;
}

// Ordered rules: first matching tag wins. Maps real tags onto the
// design system's four categories + colors.
const CATEGORY_RULES: { match: string[]; category: string; color: CategoryColor }[] = [
  { match: ['RAG', '检索', '召回', '评估'], category: 'RAG', color: 'clay' },
  { match: ['AI Agent', 'Agent', 'Codex', '工作流', 'LLM', 'AI'], category: 'AI 应用', color: 'sage' },
  { match: ['VPS', '网络', '后端', '系统设计', '数据库', 'Nginx', 'Linux'], category: '系统设计', color: 'slate' },
];
const FALLBACK = { category: '工程实践', color: 'ochre' as CategoryColor };

// Canonical category order for filter chips.
export const CATEGORY_ORDER = ['RAG', '系统设计', 'AI 应用', '工程实践'];
export const CATEGORY_COLORS: Record<string, CategoryColor> = {
  RAG: 'clay',
  '系统设计': 'slate',
  'AI 应用': 'sage',
  '工程实践': 'ochre',
};

function categoryFor(tags: string[]): { category: string; color: CategoryColor } {
  for (const rule of CATEGORY_RULES) {
    if (tags.some((t) => rule.match.includes(t))) {
      return { category: rule.category, color: rule.color };
    }
  }
  return FALLBACK;
}

// Read time from raw markdown length. CJK reads ~400 chars/min; this is a
// rough but honest estimate, the way the brand prefers real numbers.
function readTimeFor(body: string): string {
  const chars = body.replace(/\s+/g, '').length;
  return `${Math.max(1, Math.round(chars / 400))} min read`;
}

function dotDate(d: Date): string {
  const iso = d.toISOString().slice(0, 10); // 2026-06-18
  return iso.replaceAll('-', '.');
}

export function toMeta(post: CollectionEntry<'blog'>): PostMeta {
  const { category, color } = categoryFor(post.data.tags);
  return {
    title: post.data.title,
    excerpt: post.data.description,
    date: dotDate(post.data.pubDate),
    isoDate: post.data.pubDate.toISOString().slice(0, 10),
    category,
    categoryColor: color,
    readTime: readTimeFor(post.body ?? ''),
    href: `/blog/${post.slug}/`,
  };
}

export function sortedPosts(posts: CollectionEntry<'blog'>[]): CollectionEntry<'blog'>[] {
  return [...posts].sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());
}
