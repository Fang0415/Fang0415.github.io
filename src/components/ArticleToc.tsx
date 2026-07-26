'use client';

import { useEffect, useState } from 'react';
import type { TocEntry } from '../lib/posts';

interface Props {
  entries: TocEntry[];
}

const DESKTOP = '(min-width: 1080px)';

/**
 * Article outline. On a wide screen it is a sticky rail that highlights the
 * section you are reading; on a phone there is no room for a rail, so the same
 * list collapses behind a tappable summary and starts closed — an eight-item
 * outline pushed above the first paragraph is worse than no outline at all.
 */
export default function ArticleToc({ entries }: Props) {
  const [open, setOpen] = useState(false);
  const [wide, setWide] = useState(false);
  const [activeId, setActiveId] = useState<string | null>(entries[0]?.id ?? null);

  useEffect(() => {
    const query = window.matchMedia(DESKTOP);
    const sync = () => {
      setWide(query.matches);
      setOpen(query.matches);
    };
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

    // rootMargin pulls the trigger line down under the floating nav, so the
    // highlighted item matches the heading actually visible at the top.
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

  if (entries.length < 2) return null;

  return (
    <nav className={`article-toc ${open ? 'is-open' : ''}`} aria-label="文章目录">
      <button
        type="button"
        className="article-toc__toggle"
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
      >
        <span>目录</span>
        <span className="article-toc__chev" aria-hidden="true">{open ? '−' : '+'}</span>
      </button>
      {open && (
        <ol className="article-toc__list">
          {entries.map((entry) => (
            <li key={entry.id} className={`article-toc__item article-toc__item--h${entry.level}`}>
              <a
                href={`#${entry.id}`}
                className={activeId === entry.id ? 'is-active' : ''}
                onClick={() => {
                  setActiveId(entry.id);
                  if (!wide) setOpen(false);
                }}
              >
                {entry.text}
              </a>
            </li>
          ))}
        </ol>
      )}
    </nav>
  );
}
