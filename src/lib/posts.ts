import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import MarkdownIt from 'markdown-it';

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

export interface BlogPost {
  slug: string;
  body: string;
  html: string;
  data: {
    title: string;
    description: string;
    pubDate: Date;
    updatedDate?: Date;
    tags: string[];
    draft?: boolean;
  };
}

const blogDir = path.join(process.cwd(), 'src/content/blog');
const md = new MarkdownIt({ html: false, linkify: true, typographer: true });

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

export function categoryForTags(tags: string[]): { category: string; color: TagVariant } {
  for (const rule of CATEGORY_RULES) {
    if (tags.some((t) => rule.match.includes(t))) {
      return { category: rule.category, color: rule.color };
    }
  }
  return FALLBACK;
}

// Read time from raw markdown length. CJK reads ~400 chars/min; a rough but
// honest estimate, the way the brand prefers real numbers.
export function readTimeFor(body: string): string {
  const chars = body.replace(/\s+/g, '').length;
  return `约 ${Math.max(1, Math.round(chars / 400))} 分钟阅读`;
}

export function isoDate(d: Date): string {
  return d.toISOString().slice(0, 10); // 2026-06-18
}

export function markdownToHtml(body: string): string {
  return md.render(body);
}

function toDate(value: unknown): Date {
  if (value instanceof Date) return value;
  return new Date(String(value));
}

function readPost(filename: string): BlogPost {
  const slug = filename.replace(/\.mdx?$/, '');
  const raw = fs.readFileSync(path.join(blogDir, filename), 'utf8');
  const parsed = matter(raw);
  const data = parsed.data;
  const pubDate = toDate(data.pubDate);
  const updatedDate = data.updatedDate ? toDate(data.updatedDate) : undefined;

  return {
    slug,
    body: parsed.content,
    html: markdownToHtml(parsed.content),
    data: {
      title: String(data.title ?? slug),
      description: String(data.description ?? ''),
      pubDate,
      updatedDate,
      tags: Array.isArray(data.tags) ? data.tags.map(String) : [],
      draft: Boolean(data.draft),
    },
  };
}

export function getAllPosts(): BlogPost[] {
  return fs
    .readdirSync(blogDir)
    .filter((file) => /\.mdx?$/.test(file))
    .map(readPost)
    .filter((post) => !post.data.draft);
}

export function getPostBySlug(slug: string): BlogPost | undefined {
  const filename = fs
    .readdirSync(blogDir)
    .find((file) => file.replace(/\.mdx?$/, '') === slug);
  if (!filename) return undefined;
  const post = readPost(filename);
  return post.data.draft ? undefined : post;
}

export function toMeta(post: BlogPost): PostMeta {
  const { category, color } = categoryForTags(post.data.tags);
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

export function sortedPosts(posts: BlogPost[]): BlogPost[] {
  return [...posts].sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());
}
