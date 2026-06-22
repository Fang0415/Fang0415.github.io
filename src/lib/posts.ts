import type { CollectionEntry } from 'astro:content';

/**
 * Editorial categories, each bound to one Folio Tag variant. Derived from
 * a post's tags so existing frontmatter needs no changes. The chrome is in
 * English, but the posts themselves are real Chinese content, so category
 * labels stay in Chinese.
 */
export type TagVariant = 'solid' | 'teal' | 'sky' | 'amber';

export interface PostMeta {
  title: string;
  excerpt: string;
  date: string;          // 2026-06-18 (mono meta, Folio style)
  isoDate: string;       // 2026-06-18
  category: string;
  categoryColor: TagVariant;
  readTime: string;      // 8 min read
  href: string;
}

// Ordered rules: first matching tag wins. Maps real tags onto the four
// categories + a Folio Tag variant (gold / green / blue / coral).
const CATEGORY_RULES: { match: string[]; category: string; color: TagVariant }[] = [
  { match: ['RAG', '检索', '召回', '评估'], category: 'RAG', color: 'solid' },
  { match: ['AI Agent', 'Agent', 'Codex', '工作流', 'LLM', 'AI'], category: 'AI 应用', color: 'teal' },
  { match: ['VPS', '网络', '后端', '系统设计', '数据库', 'Nginx', 'Linux'], category: '系统设计', color: 'sky' },
];
const FALLBACK = { category: '工程实践', color: 'amber' as TagVariant };

// Canonical category order for filter chips.
export const CATEGORY_ORDER = ['RAG', '系统设计', 'AI 应用', '工程实践'];
export const CATEGORY_COLORS: Record<string, TagVariant> = {
  RAG: 'solid',
  '系统设计': 'sky',
  'AI 应用': 'teal',
  '工程实践': 'amber',
};

function categoryFor(tags: string[]): { category: string; color: TagVariant } {
  for (const rule of CATEGORY_RULES) {
    if (tags.some((t) => rule.match.includes(t))) {
      return { category: rule.category, color: rule.color };
    }
  }
  return FALLBACK;
}

// Read time from raw markdown length. CJK reads ~400 chars/min; a rough but
// honest estimate, the way the brand prefers real numbers.
function readTimeFor(body: string): string {
  const chars = body.replace(/\s+/g, '').length;
  return `${Math.max(1, Math.round(chars / 400))} min read`;
}

function isoDate(d: Date): string {
  return d.toISOString().slice(0, 10); // 2026-06-18
}

export function toMeta(post: CollectionEntry<'blog'>): PostMeta {
  const { category, color } = categoryFor(post.data.tags);
  const iso = isoDate(post.data.pubDate);
  return {
    title: post.data.title,
    excerpt: post.data.description,
    date: iso,
    isoDate: iso,
    category,
    categoryColor: color,
    readTime: readTimeFor(post.body ?? ''),
    href: `/blog/${post.slug}/`,
  };
}

export function sortedPosts(posts: CollectionEntry<'blog'>[]): CollectionEntry<'blog'>[] {
  return [...posts].sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());
}
