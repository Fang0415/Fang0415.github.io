'use client';

import { useEffect, useState } from 'react';
import type { TocEntry } from '../lib/posts';

interface Props {
  entries: TocEntry[];
}

const WIDE = '(min-width: 1080px)';

/**
 * Article outline rendered as a fixed left rail on wide screens.
 * - Desktop (≥1080px): the rail is position:fixed to the viewport's left edge,
 *   independent of the article column — so the body can keep a comfortable
 *   measure while the outline floats alongside it.
 * - Narrow screens: the rail collapses into a tappable summary that opens
 *   inline above the body.
 *
 * Indented entries get a thin guide line on the left, mirroring the
 * personal-portfolio reference: depth is communicated by position + a hairline,
 * not by colour or weight alone.
 */
export default function ArticleToc({ entries }: Props) {
  const [open, setOpen] = useState(false);
  const [wide, setWide] = useState(false);
  const [activeId, setActiveId] = useState<string | null>(entries[0]?.id ?? null);

  useEffect(() => {
    const query = window.matchMedia(WIDE);
    const sync = () => setWide(query.matches);
    sync();
    query.addEventListener('change', sync);
    return () => query.removeEventListener('change', sync);
  }, []);

  useEffect(() => {
    if (!entries.length) return;
    const headings = entries
      .map((entry) => document.getElementById(entry.id))
      .filter((el): el is HTMLElement => Boolean(el));
    if (!headings.length) return;

    // Trigger line sits just under the floating nav; the highlighted item is
    // the topmost heading whose top edge has crossed it.
    const io = new IntersectionObserver(
      (observed) => {
        const visible = observed
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
        if (visible) setActiveId(visible.target.id);
      },
      { rootMargin: '-88px 0px -70% 0px', threshold: 0 },
    );
    headings.forEach((heading) => io.observe(heading));
    return () => io.disconnect();
  }, [entries]);

  if (entries.length === 0) return null;

  const minLevel = Math.min(...entries.map((e) => e.level));

  return (
    <nav className={`article-toc ${open ? 'is-open' : ''}`} aria-label="文章目录">
      <button
        type="button"
        className="article-toc__toggle"
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
      >
        <span className="article-toc__label">
          <svg className="article-toc__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
            <path d="M8 6h13M8 12h13M8 18h13M3.5 6h.01M3.5 12h.01M3.5 18h.01"/>
          </svg>
          目录
        </span>
        <span className="article-toc__count">{entries.length}</span>
        <span className="article-toc__chev" aria-hidden="true">{open ? '−' : '+'}</span>
      </button>
      {(wide || open) && (
        <ol className="article-toc__list">
          {entries.map((entry) => {
            const depth = entry.level - minLevel;
            const isActive = activeId === entry.id;
            return (
              <li
                key={entry.id}
                className="article-toc__item"
                style={{ ['--depth' as string]: depth }}
              >
                <a
                  href={`#${entry.id}`}
                  className={isActive ? 'is-active' : ''}
                  onClick={() => {
                    setActiveId(entry.id);
                    if (!wide) setOpen(false);
                  }}
                >
                  <span className="article-toc__text">{entry.text}</span>
                </a>
              </li>
            );
          })}
        </ol>
      )}
    </nav>
  );
}
