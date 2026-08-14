'use client';

import { AnimatePresence, motion } from 'motion/react';
import Link from 'next/link';
import { useEffect, useRef, useState, type KeyboardEvent, type MouseEvent } from 'react';
import { X } from 'lucide-react';
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
  scale: number;
}

const PROJECT_LAYOUT_SPRING = {
  type: 'spring' as const,
  stiffness: 155,
  damping: 24,
  mass: 0.9,
  restDelta: 0.5,
  restSpeed: 10,
};

function getSelectedOffset(rect: DOMRect): SelectedOffset {
  const scale = Math.min(
    1.1,
    (window.innerWidth - 24) / rect.width,
    (window.innerHeight - 24) / rect.height,
  );
  return {
    x: window.innerWidth / 2 - (rect.left + rect.width / 2),
    y: window.innerHeight / 2 - (rect.top + rect.height / 2),
    scale,
  };
}

export function LayoutGrid({ cards }: { cards: LayoutGridCard[] }) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [returningId, setReturningId] = useState<string | null>(null);
  const [selectedOffset, setSelectedOffset] = useState<SelectedOffset>({ x: 0, y: 0, scale: 1 });
  const selectedCardRef = useRef<HTMLElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  const closeSelected = () => {
    if (!selectedId) return;
    setReturningId(selectedId);
    setSelectedId(null);
  };

  const openSelected = (cardId: string, element: HTMLElement) => {
    setReturningId(null);
    setSelectedOffset(getSelectedOffset(element.getBoundingClientRect()));
    setSelectedId(cardId);
  };

  useEffect(() => {
    if (!selectedId) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeButtonRef.current?.focus();

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
      <div className="brand-archive__grid">
        {cards.map((card, index) => {
          const isSelected = selectedId === card.id;
          const isReturning = returningId === card.id;
          const isExpanded = isSelected || isReturning;

          const handleClick = (event: MouseEvent<HTMLElement>) => {
            if (!isSelected) openSelected(card.id, event.currentTarget);
          };
          const handleKeyDown = (event: KeyboardEvent<HTMLElement>) => {
            if (!isSelected && (event.key === 'Enter' || event.key === ' ')) {
              event.preventDefault();
              openSelected(card.id, event.currentTarget);
            }
          };

          return (
            <motion.article
              animate={isSelected
                ? { x: selectedOffset.x, y: selectedOffset.y, scale: selectedOffset.scale }
                : { x: 0, y: 0, scale: 1 }}
              aria-labelledby={isExpanded ? `layout-grid-title-${card.id}` : undefined}
              aria-modal={isExpanded ? true : undefined}
              className={`brand-archive-card brand-archive-card--${index + 1}${isExpanded ? ' layout-grid__selected-card' : ''}`}
              initial={false}
              key={card.id}
              onClick={handleClick}
              onAnimationComplete={() => {
                if (isReturning) setReturningId(null);
              }}
              onKeyDown={handleKeyDown}
              ref={isExpanded ? selectedCardRef : undefined}
              role={isExpanded ? 'dialog' : 'button'}
              tabIndex={isExpanded ? -1 : 0}
              transition={PROJECT_LAYOUT_SPRING}
            >
              <div className="brand-archive-card__image">
                <img alt={card.thumbnailAlt} src={card.thumbnail} />
                <span>{card.category}</span>
              </div>

              <div className="brand-archive-card__copy">
                <h3 id={isExpanded ? `layout-grid-title-${card.id}` : undefined}>
                  <SiteText en={card.title.en} zh={card.title.zh} />
                </h3>
                <p><SiteText en={card.description.en} zh={card.description.zh} /></p>
                <div className="layout-grid__selected-meta">
                  <span>{card.tags.slice(0, isExpanded ? 3 : 2).join(' · ')}</span>
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

              {index === 0 && !isExpanded && (
                <em><SiteText en={card.status.en} zh={card.status.zh} /></em>
              )}

              <AnimatePresence>
                {isSelected && (
                  <motion.button
                    animate={{ opacity: 1, scale: 1 }}
                    aria-label="Close project preview"
                    className="layout-grid__close"
                    exit={{ opacity: 0, scale: 0.92 }}
                    initial={{ opacity: 0, scale: 0.92 }}
                    key="close"
                    onClick={(event) => {
                      event.stopPropagation();
                      closeSelected();
                    }}
                    ref={closeButtonRef}
                    transition={{ duration: 0.2, ease: 'easeOut' }}
                    type="button"
                  >
                    <X aria-hidden="true" size={18} strokeWidth={1.8} />
                  </motion.button>
                )}
              </AnimatePresence>
            </motion.article>
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
