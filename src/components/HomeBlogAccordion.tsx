'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';

export type HomePost = {
  title: string;
  excerpt?: string;
  preview?: string;
  href: string;
  date?: string;
  category?: string;
  readTime?: string;
};

const VISIBLE_SLOTS = 6;
const FLIP_DELAY_MS = 7600;
const FLIP_DURATION_MS = 1160;
const HOVER_INTENT_MS = 260;
const POPOVER_LEAVE_MS = 180;

type PreviewPosition = { x: number; y: number; side: 'right' | 'left' };

function postAt(posts: HomePost[], index: number) {
  return posts[((index % posts.length) + posts.length) % posts.length];
}

function FlapFace({ post, sequence }: { post: HomePost; sequence: number }) {
  return (
    <span className="brand-flap__face">
      <span className="brand-flap__number">{String(sequence + 1).padStart(2, '0')}</span>
      <strong>{post.title}</strong>
      <time>{post.date || '更新中'}</time>
    </span>
  );
}

export default function HomeBlogAccordion({ posts }: { posts: HomePost[] }) {
  const [offset, setOffset] = useState(0);
  const [isFlipping, setIsFlipping] = useState(false);
  const [hoveredSlot, setHoveredSlot] = useState<number | null>(null);
  const [focusWithin, setFocusWithin] = useState(false);
  const [previewIndex, setPreviewIndex] = useState<number | null>(null);
  const [previewPosition, setPreviewPosition] = useState<PreviewPosition>({ x: 24, y: 24, side: 'right' });
  const [reducedMotion, setReducedMotion] = useState(false);
  const hoverTimer = useRef<number | null>(null);
  const closeTimer = useRef<number | null>(null);

  const visibleCount = Math.min(VISIBLE_SLOTS, posts.length);
  const paused = reducedMotion || hoveredSlot !== null || focusWithin || previewIndex !== null;

  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    const updatePreference = () => setReducedMotion(query.matches);
    updatePreference();
    query.addEventListener('change', updatePreference);
    return () => query.removeEventListener('change', updatePreference);
  }, []);

  useEffect(() => {
    if (paused || isFlipping || posts.length < 2) return;
    const timer = window.setTimeout(() => setIsFlipping(true), FLIP_DELAY_MS);
    return () => window.clearTimeout(timer);
  }, [isFlipping, offset, paused, posts.length]);

  useEffect(() => {
    if (!isFlipping) return;
    const timer = window.setTimeout(() => {
      setOffset((current) => (current + 1) % posts.length);
      setIsFlipping(false);
    }, FLIP_DURATION_MS);
    return () => window.clearTimeout(timer);
  }, [isFlipping, posts.length]);

  useEffect(() => {
    if (previewIndex === null) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setPreviewIndex(null);
    };
    window.addEventListener('keydown', closeOnEscape);
    return () => window.removeEventListener('keydown', closeOnEscape);
  }, [previewIndex]);

  useEffect(() => () => {
    if (hoverTimer.current !== null) window.clearTimeout(hoverTimer.current);
    if (closeTimer.current !== null) window.clearTimeout(closeTimer.current);
  }, []);

  if (!posts.length) return null;

  const openPreview = (index: number) => {
    setPreviewIndex(index);
  };

  const updatePreviewPosition = (clientX: number, clientY: number) => {
    const size = Math.min(380, window.innerWidth - 24, window.innerHeight - 24);
    const gap = 18;
    const fitsRight = window.innerWidth - clientX - gap >= size;
    const side = fitsRight ? 'right' : 'left';
    const x = side === 'right'
      ? clientX + gap
      : Math.max(12, clientX - size - gap);
    const y = Math.max(12, Math.min(clientY - (size / 2), window.innerHeight - size - 12));
    setPreviewPosition({ x, y, side });
  };

  const startHoverPreview = (slot: number, index: number) => {
    setHoveredSlot(slot);
    if (hoverTimer.current !== null) window.clearTimeout(hoverTimer.current);
    hoverTimer.current = window.setTimeout(() => openPreview(index), HOVER_INTENT_MS);
  };

  const cancelHoverPreview = () => {
    setHoveredSlot(null);
    if (hoverTimer.current !== null) {
      window.clearTimeout(hoverTimer.current);
      hoverTimer.current = null;
    }
    closeTimer.current = window.setTimeout(() => setPreviewIndex(null), POPOVER_LEAVE_MS);
  };

  const previewPost = previewIndex === null ? null : postAt(posts, previewIndex);

  return (
    <>
      <div
        className="brand-blog__flap-list"
        aria-label="最新博客机械翻页板"
        onFocusCapture={() => setFocusWithin(true)}
        onBlurCapture={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setFocusWithin(false);
        }}
      >
        {Array.from({ length: visibleCount }, (_, slot) => {
          const currentIndex = (offset + slot) % posts.length;
          const nextIndex = (currentIndex + 1) % posts.length;
          const currentPost = postAt(posts, currentIndex);
          const nextPost = postAt(posts, nextIndex);

          return (
            <article
              className={`brand-flap${isFlipping ? ' is-flipping' : ''}`}
              key={slot}
              style={{ '--flap-delay': `${slot * 120}ms` } as React.CSSProperties}
              onMouseEnter={() => startHoverPreview(slot, currentIndex)}
              onMouseMove={(event) => updatePreviewPosition(event.clientX, event.clientY)}
              onMouseLeave={cancelHoverPreview}
            >
              <Link
                className="brand-flap__button"
                href={currentPost.href}
                aria-label={`阅读文章：${currentPost.title}`}
              >
                <span className="brand-flap__board" aria-hidden="true">
                  <span className="brand-flap__idle">
                    <FlapFace post={currentPost} sequence={currentIndex} />
                  </span>
                  <span className="brand-flap__half brand-flap__half--top-under">
                    <FlapFace post={nextPost} sequence={nextIndex} />
                  </span>
                  <span className="brand-flap__half brand-flap__half--bottom-under">
                    <FlapFace post={currentPost} sequence={currentIndex} />
                  </span>
                  <span className="brand-flap__half brand-flap__half--top-flap">
                    <FlapFace post={currentPost} sequence={currentIndex} />
                  </span>
                  <span className="brand-flap__half brand-flap__half--bottom-flap">
                    <FlapFace post={nextPost} sequence={nextIndex} />
                  </span>
                  <span className="brand-flap__settled">
                    <FlapFace post={nextPost} sequence={nextIndex} />
                  </span>
                </span>
              </Link>
            </article>
          );
        })}
      </div>

      {previewPost && previewIndex !== null && (
        <aside
          className="brand-blog-preview__dialog"
          aria-label={`文章预览：${previewPost.title}`}
          style={{
            left: previewPosition.x,
            top: previewPosition.y,
            '--preview-origin-x': previewPosition.side === 'right' ? '0%' : '100%',
          } as React.CSSProperties}
        >
          <h3>{previewPost.title}</h3>
          <p>{previewPost.preview || previewPost.excerpt || '文章内容正在整理中。'}</p>
        </aside>
      )}
    </>
  );
}
