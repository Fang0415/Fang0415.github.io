'use client';

import { AnimatePresence, animate, motion, useMotionValue, useTransform } from 'motion/react';
import Link from 'next/link';
import { useEffect, useRef, useState, type KeyboardEvent, type MouseEvent } from 'react';
import { SiteText } from '../SitePreferences';
import type { LocalizedText } from '../../lib/site';

export interface LayoutGridCard {
  id: string;
  href: string;
  title: LocalizedText;
  description: LocalizedText;
  thumbnail: string;
  thumbnailAlt: string;
  category: string;
  tags: string[];
  status: LocalizedText;
}

interface SelectedOffset {
  x: number;
  y: number;
  startWidth: number;
  startHeight: number;
  width: number;
  height: number;
}

const PROJECT_PATH_TRANSITION = {
  duration: 0.5,
  ease: [0.4, 0, 0.2, 1] as [number, number, number, number],
};

const DETAIL_CARD_ASPECT = 1568 / 1003;
const DETAIL_CARD_MAX_WIDTH = 760;

function cubicBezierPoint(progress: number, controlA: number, controlB: number, end: number) {
  const inverse = 1 - progress;
  return (
    3 * inverse * inverse * progress * controlA
    + 3 * inverse * progress * progress * controlB
    + progress * progress * progress * end
  );
}

function getSelectedOffset(rect: DOMRect): SelectedOffset {
  const width = Math.min(DETAIL_CARD_MAX_WIDTH, window.innerWidth - 48);
  const height = width / DETAIL_CARD_ASPECT;
  const viewportFit = Math.min(
    1,
    (window.innerWidth - 48) / width,
    (window.innerHeight - 96) / height,
  );
  const fittedWidth = width * viewportFit;
  const fittedHeight = height * viewportFit;

  return {
    x: window.innerWidth / 2 - (rect.left + fittedWidth / 2),
    y: window.innerHeight / 2 - (rect.top + fittedHeight / 2),
    startWidth: rect.width,
    startHeight: rect.height,
    width: fittedWidth,
    height: fittedHeight,
  };
}

export function LayoutGrid({ cards }: { cards: LayoutGridCard[] }) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [returningId, setReturningId] = useState<string | null>(null);
  const [selectedOffset, setSelectedOffset] = useState<SelectedOffset>({
    x: 0,
    y: 0,
    startWidth: 0,
    startHeight: 0,
    width: 0,
    height: 0,
  });
  const selectedCardRef = useRef<HTMLElement>(null);
  const selectedOffsetRef = useRef(selectedOffset);
  const pathProgress = useMotionValue(0);
  selectedOffsetRef.current = selectedOffset;

  const pathX = useTransform(pathProgress, (progress) => {
    const { x } = selectedOffsetRef.current;
    return cubicBezierPoint(progress, x * 0.28, x * 0.72, x);
  });
  const pathY = useTransform(pathProgress, (progress) => {
    const { x, y } = selectedOffsetRef.current;
    const arcLift = Math.min(72, Math.max(34, Math.abs(x) * 0.14));
    return cubicBezierPoint(
      progress,
      y * 0.2 - arcLift * 0.72,
      y * 0.82 - arcLift * 0.72,
      y,
    );
  });
  const pathWidth = useTransform(pathProgress, (progress) => (
    selectedOffsetRef.current.startWidth
    + (selectedOffsetRef.current.width - selectedOffsetRef.current.startWidth) * progress
  ));
  const pathHeight = useTransform(pathProgress, (progress) => (
    selectedOffsetRef.current.startHeight
    + (selectedOffsetRef.current.height - selectedOffsetRef.current.startHeight) * progress
  ));

  const closeSelected = () => {
    if (!selectedId) return;
    selectedCardRef.current?.focus({ preventScroll: true });
    setReturningId(selectedId);
    setSelectedId(null);
  };

  const openSelected = (cardId: string, element: HTMLElement) => {
    setReturningId(null);
    setSelectedOffset(getSelectedOffset(element.getBoundingClientRect()));
    pathProgress.set(0);
    setSelectedId(cardId);
  };

  useEffect(() => {
    if (!selectedId && !returningId) return;

    const returningCardId = returningId;
    const controls = animate(
      pathProgress,
      selectedId ? 1 : 0,
      PROJECT_PATH_TRANSITION,
    );

    if (returningCardId) {
      controls.then(() => {
        setReturningId((currentId) => (
          currentId === returningCardId ? null : currentId
        ));
      });
    }

    return () => controls.stop();
  }, [pathProgress, returningId, selectedId]);

  useEffect(() => {
    if (!selectedId) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    selectedCardRef.current?.focus({ preventScroll: true });

    const handleKeyDown = (event: globalThis.KeyboardEvent) => {
      if (event.key === 'Escape') closeSelected();
    };
    const handlePointerDown = (event: PointerEvent) => {
      const selectedCard = selectedCardRef.current;
      if (selectedCard && !selectedCard.contains(event.target as Node)) closeSelected();
    };
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('pointerdown', handlePointerDown, true);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('pointerdown', handlePointerDown, true);
    };
  }, [selectedId]);

  return (
    <>
      <div className={`brand-archive__grid brand-archive__grid--count-${cards.length}`}>
        {cards.map((card, index) => {
          const isSelected = selectedId === card.id;
          const isReturning = returningId === card.id;
          const isExpanded = isSelected || isReturning;

          const handleClick = (event: MouseEvent<HTMLElement>) => {
            if (!isExpanded) openSelected(card.id, event.currentTarget);
          };
          const handleKeyDown = (event: KeyboardEvent<HTMLElement>) => {
            if (!isExpanded && (event.key === 'Enter' || event.key === ' ')) {
              event.preventDefault();
              openSelected(card.id, event.currentTarget);
            }
          };

          return (
            <div className={`brand-archive-card-slot brand-archive-card-slot--${index + 1}`} key={card.id}>
              <motion.article
                aria-labelledby={isExpanded ? `layout-grid-title-${card.id}` : undefined}
                aria-modal={isExpanded ? true : undefined}
                className={`brand-archive-card brand-archive-card--${index + 1}${isExpanded ? ' layout-grid__selected-card' : ''}${isSelected ? ' layout-grid__selected-card--active' : ''}${isReturning ? ' layout-grid__selected-card--returning' : ''}`}
                initial={false}
                onClick={handleClick}
                onKeyDown={handleKeyDown}
                ref={isExpanded ? selectedCardRef : undefined}
                role={isExpanded ? 'dialog' : 'button'}
                style={isExpanded ? {
                  height: pathHeight,
                  width: pathWidth,
                  x: pathX,
                  y: pathY,
                } : undefined}
                tabIndex={isExpanded ? -1 : 0}
              >
              <div className="brand-archive-card__image">
                <img alt={card.thumbnailAlt} src={card.thumbnail} />
                <span><SiteText en={card.title.en} zh={card.title.zh} /></span>
              </div>

              <div className="brand-archive-card__copy">
                <h3 id={isExpanded ? `layout-grid-title-${card.id}` : undefined}>
                  <SiteText en={card.title.en} zh={card.title.zh} />
                </h3>
                <p><SiteText en={card.description.en} zh={card.description.zh} /></p>
                <div className="layout-grid__selected-meta">
                  <span>{card.category}</span>
                  <span>{card.tags.slice(0, 3).join(' · ')}</span>
                  <span><SiteText en={card.status.en} zh={card.status.zh} /></span>
                </div>
                <div className="layout-grid__selected-actions">
                  <Link
                    className="layout-grid__detail-link"
                    href={card.href}
                    onClick={(event) => event.stopPropagation()}
                  >
                    <SiteText en="View project" zh="查看项目" />
                    <span aria-hidden="true">↗</span>
                  </Link>
                </div>
              </div>

              </motion.article>
            </div>
          );
        })}
      </div>

      <AnimatePresence>
        {selectedId && (
          <motion.button
            animate={{ opacity: 1 }}
            aria-label="Close project preview"
            className="layout-grid__backdrop"
            exit={{ opacity: 0 }}
            initial={{ opacity: 0 }}
            key="project-backdrop"
            onPointerDown={closeSelected}
            transition={{ duration: 0.32, ease: 'easeOut' }}
            type="button"
          />
        )}
      </AnimatePresence>
    </>
  );
}
