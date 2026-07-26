'use client';

import { useMemo, useState } from 'react';
import PostCard from './PostCard';
import FolioIcon from './FolioIcon';
import type { PostMeta } from '../lib/posts';

const CATEGORY_ORDER = ['RAG', '系统设计', 'AI 应用', '工程实践'];

interface Props {
  posts: PostMeta[];
  search?: boolean;
}

export default function WritingList({ posts, search = true }: Props) {
  const present = CATEGORY_ORDER.filter((c) => posts.some((p) => p.category === c));
  const categories = ['全部', ...present];
  const [cat, setCat] = useState('全部');
  const [q, setQ] = useState('');

  const visiblePosts = useMemo(() => {
    const query = q.trim().toLowerCase();
    return posts.filter((p) => {
      const inCat = cat === '全部' || p.category === cat;
      const haystack = `${p.title} ${p.excerpt}`.toLowerCase();
      const inQ = !query || haystack.includes(query);
      return inCat && inQ;
    });
  }, [posts, cat, q]);

  return (
    <div data-writing-list>
      <div className="filter-bar">
        {categories.map((c) => (
          <button
            key={c}
            className={`filter-chip ${c === cat ? 'filter-chip--active' : ''}`}
            data-filter={c}
            onClick={() => setCat(c)}
          >
            {c}
          </button>
        ))}
        {search && (
          <>
            <span className="filter-spacer"></span>
            <div className="wl-search">
              <FolioIcon name="search" className="icon" />
              <input
                type="search"
                placeholder="搜索文章..."
                data-writing-search
                aria-label="搜索文章"
                value={q}
                onChange={(event) => setQ(event.target.value)}
              />
            </div>
          </>
        )}
      </div>

      <div className="post-list" data-writing-items>
        {visiblePosts.map((p) => (
          <div key={p.href} data-category={p.category} data-haystack={`${p.title} ${p.excerpt}`.toLowerCase()}>
            <PostCard
              layout="row"
              title={p.title}
              excerpt={p.excerpt}
              date={p.date}
              readingTime={p.readTime}
              href={p.href}
              tags={[p.category]}
              coverUrl={p.coverUrl}
            />
          </div>
        ))}
      </div>
      {visiblePosts.length === 0 && <div className="wl-empty" data-writing-empty>没有匹配的文章。</div>}

      <style jsx>{`
        .wl-search {
          display: flex; align-items: center; gap: 8px; width: min(240px, 100%);
          padding: 8px 14px; border-radius: var(--radius-full);
          background: var(--bg-soft); border: 1px solid var(--border-default);
          color: var(--text-muted);
          transition: border-color var(--dur-1) var(--ease-out), background-color var(--dur-1) var(--ease-out);
        }
        .wl-search:focus-within { border-color: var(--border-strong); background: var(--surface-card); }
        /* Below 620px the chips already wrap, so the search takes its own full row. */
        @media (max-width: 620px) {
          .wl-search { width: 100%; }
        }
        .wl-search .icon { width: 16px; height: 16px; flex: none; }
        .wl-search input {
          border: none; outline: none; background: none; width: 100%;
          font-family: var(--font-sans); font-size: var(--fs-body-sm); color: var(--text-primary);
        }
        .wl-empty {
          padding: 48px 0; text-align: center; color: var(--text-muted);
          font-family: var(--font-mono); font-size: 13px;
        }
      `}</style>
    </div>
  );
}
