import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import MarkdownIt from 'markdown-it';
import hljs from 'highlight.js';
import katex from 'katex';

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
  /** Set only for posts whose cover asset resolved; Markdown posts have none. */
  coverUrl?: string;
}

export interface BlogPost {
  slug: string;
  body: string;
  html: string;
  /** Headings lifted out of `html` for the article sidebar. */
  toc?: TocEntry[];
  data: {
    title: string;
    description: string;
    pubDate: Date;
    updatedDate?: Date;
    tags: string[];
    draft?: boolean;
    coverUrl?: string;
    coverAlt?: string;
  };
}

export interface TocEntry {
  id: string;
  text: string;
  level: 1 | 2 | 3;
}

const blogDir = path.join(process.cwd(), 'src/content/blog');

function escapeHtml(unsafe: string): string {
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

const md = new MarkdownIt({
  html: false,
  linkify: true,
  typographer: true,
  highlight: (str, lang) => {
    if (lang && hljs.getLanguage(lang)) {
      try {
        return `<pre class="hljs"><code class="language-${lang}">${hljs.highlight(str, { language: lang, ignoreIllegals: true }).value}</code></pre>`;
      } catch {
        /* fall through to plain escape */
      }
    }
    return `<pre class="hljs"><code>${escapeHtml(str)}</code></pre>`;
  },
});

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

/**
 * Turns a heading's text into a stable anchor. CJK is kept verbatim — browsers
 * handle percent-encoded fragments fine, and transliterating "为什么" to
 * something Latin would make the anchor unrecognisable in a shared link.
 */
function headingId(text: string, used: Set<string>): string {
  const base = text
    .trim()
    .toLowerCase()
    .replace(/[^\w一-龥]+/g, '-')
    .replace(/^-+|-+$/g, '') || 'section';
  let candidate = base;
  let n = 2;
  while (used.has(candidate)) {
    candidate = `${base}-${n}`;
    n += 1;
  }
  used.add(candidate);
  return candidate;
}

/* ── Callout: Obsidian-style "> [!tip]" blocks ── */
const CALLOUT_LABELS: Record<string, string> = {
  note: '笔记',
  tip: '提示',
  warning: '警告',
  important: '重要',
  caution: '注意',
  info: '信息',
};

const SUNFLOWER_ICON = `
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
    <circle cx="12" cy="12" r="3.5" fill="currentColor" fill-opacity="0.22"/>
    <path d="M12 4.5V2M12 22v-2.5M4.5 12H2M22 12h-2.5M6.7 6.7 5 5M19 19l-1.7-1.7M6.7 17.3 5 19M19 5l-1.7 1.7"/>
    <circle cx="12" cy="12" r="1.8" fill="currentColor"/>
  </svg>
`;

function renderCallout(html: string): string {
  return html.replace(
    /<blockquote>\s*<p>\s*\[!([a-zA-Z]+)\](?:\s+([^\n]*))?\n?([\s\S]*?)<\/p>\s*<\/blockquote>/g,
    (match, type, title, body) => {
      const kind = type.toLowerCase();
      const label = title || CALLOUT_LABELS[kind] || kind.toUpperCase();
      return `
        <div class="callout callout--${kind}">
          <div class="callout__title">
            <span class="callout__icon">${SUNFLOWER_ICON}</span>
            <span class="callout__label">${escapeHtml(label)}</span>
          </div>
          <div class="callout__body">${body.trim() || ''}</div>
        </div>
      `.trim();
    },
  );
}

/* ── LaTeX: inline $...$ and display $$...$$ ── */
function renderMath(body: string): { text: string; math: Map<string, string> } {
  const math = new Map<string, string>();
  let counter = 0;

  const stash = (latex: string, displayMode: boolean): string => {
    const key = `{{{MATH_${counter++}}}}`;
    try {
      math.set(key, katex.renderToString(latex, { displayMode, throwOnError: false }));
    } catch {
      math.set(key, escapeHtml(latex));
    }
    return key;
  };

  // Display math first so it doesn't collide with inline matches
  let text = body.replace(/\$\$([\s\S]+?)\$\$/g, (_, latex) => stash(latex, true));
  // Inline math: $...$ but not $$...$$
  text = text.replace(/(?<!\$)\$([^$\n]+?)\$(?!\$)/g, (_, latex) => stash(latex, false));

  return { text, math };
}

function unstashMath(html: string, math: Map<string, string>): string {
  let out = html;
  math.forEach((value, key) => {
    out = out.replace(new RegExp(`<p>\\s*${key.replace(/[{}]/g, '\\$&')}\\s*</p>`, 'g'), value);
    out = out.replace(new RegExp(key.replace(/[{}]/g, '\\$&'), 'g'), value);
  });
  return out;
}

/**
 * Renders Markdown and collects the h1/h2/h3 outline in the same pass, so the
 * anchors in the table of contents are guaranteed to exist in the HTML.
 */
export function renderMarkdown(body: string): { html: string; toc: TocEntry[] } {
  const { text: mathText, math } = renderMath(body ?? '');
  const tokens = md.parse(mathText, {});
  const toc: TocEntry[] = [];
  const used = new Set<string>();

  tokens.forEach((token, index) => {
    if (token.type !== 'heading_open') return;
    const level = Number(token.tag.slice(1));
    if (level !== 1 && level !== 2 && level !== 3) return;
    const text = tokens[index + 1]?.content ?? '';
    if (!text) return;
    const id = headingId(text, used);
    token.attrSet('id', id);
    toc.push({ id, text, level: level as 1 | 2 | 3 });
  });

  let html = md.renderer.render(tokens, md.options, {});
  html = renderCallout(html);
  html = unstashMath(html, math);
  return { html, toc };
}

export function markdownToHtml(body: string): string {
  return renderMarkdown(body).html;
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

  const { html, toc } = renderMarkdown(parsed.content);

  return {
    slug,
    body: parsed.content,
    html,
    toc,
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

/** Sort newest-first; used by every list view. */
export function sortedPosts(posts: BlogPost[]): BlogPost[] {
  return [...posts].sort((a, b) => b.data.pubDate.getTime() - a.data.pubDate.getTime());
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
    coverUrl: post.data.coverUrl,
  };
}
