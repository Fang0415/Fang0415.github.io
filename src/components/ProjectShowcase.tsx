'use client';

import { useMemo, useState } from 'react';
import { CoverflowCarousel, type CoverflowSlide } from './ui/coverflow-carousel';
import { SHOWCASE_STATUS, listFor, textFor, type Project } from '../lib/site';
import FolioIcon from './FolioIcon';
import { useSitePreferences } from './SitePreferences';

interface Props {
  projects: Project[];
}

const ACCENTS = ['#2376c6', '#5aa53f', '#f6b417', '#f0738b', '#626770'];

export default function ProjectShowcase({ projects }: Props) {
  const { locale } = useSitePreferences();
  const [selected, setSelected] = useState(0);
  const slides = useMemo<CoverflowSlide[]>(
    () => projects.map((project, index) => ({
      src: project.coverUrl,
      alt: project.coverAlt || `${textFor(project.title, locale)} project preview`,
      title: textFor(project.title, locale),
      subtitle: project.category,
      eyebrow: 'Project preview',
      accent: ACCENTS[index % ACCENTS.length],
    })),
    [locale, projects],
  );

  if (!projects.length) return null;
  const index = Math.min(selected, projects.length - 1);
  const active = projects[index];

  return (
    <div className="ps">
      <div className="ps-canvas">
        <CoverflowCarousel
          slides={slides}
          cardWidth="clamp(250px, 34vw, 420px)"
          rotate={42}
          depth={0.62}
          perspective={3.2}
          gap={0.08}
          fade={0.16}
          showNavigation
          showPagination
          label={locale === 'zh' ? '项目展示' : 'Project showcase'}
          onSelectedChange={setSelected}
        />
      </div>

      <div className="ps-detail" key={active.id} aria-live="polite">
        <div className="ps-detail__meta">
          <span className={`sc-status sc-status--${SHOWCASE_STATUS[active.status][1]}`}>
            {textFor(SHOWCASE_STATUS[active.status][0], locale)}
          </span>
          <span className="sc-eyebrow">{active.category}</span>
        </div>
        <h2 className="ps-detail__title">{textFor(active.title, locale)}</h2>
        <p className="ps-detail__summary">{textFor(active.summary, locale)}</p>
        {listFor(active.highlights, locale).length > 0 && (
          <ul className="ps-detail__list">
            {listFor(active.highlights, locale).map((highlight) => <li key={highlight}>{highlight}</li>)}
          </ul>
        )}
        <div className="ps-detail__tags">
          {active.tags.slice(0, 4).map((item) => <span key={item} className="sc-chip">{item}</span>)}
          {active.tags.length > 4 && <span className="sc-chip">+{active.tags.length - 4}</span>}
        </div>
        <div className="ps-detail__links">
          <a className="sc-link" href={`/projects/${active.id}/`}>
            {locale === 'zh' ? '查看详情' : 'View details'} <FolioIcon name="arrow-right" className="icon" />
          </a>
          {active.demo && (
            <a className="sc-link" href={active.demo}>
              {locale === 'zh' ? '查看演示' : 'Open demo'} <FolioIcon name="arrow-up-right" className="icon" />
            </a>
          )}
          {active.github && (
            <a className="sc-link sc-link--muted" href={active.github}>
              <FolioIcon name="github" className="icon" /> {locale === 'zh' ? '源码' : 'Code'}
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
