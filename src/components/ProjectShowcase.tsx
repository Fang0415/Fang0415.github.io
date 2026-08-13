'use client';

import { useMemo, useState } from 'react';
import { CoverflowCarousel, type CoverflowSlide } from './ui/coverflow-carousel';
import { SHOWCASE_STATUS, type Project } from '../lib/site';
import FolioIcon from './FolioIcon';

interface Props {
  projects: Project[];
}

const ACCENTS = ['#2376c6', '#5aa53f', '#f6b417', '#f0738b', '#626770'];

export default function ProjectShowcase({ projects }: Props) {
  const [selected, setSelected] = useState(0);
  const slides = useMemo<CoverflowSlide[]>(
    () => projects.map((project, index) => ({
      src: project.coverUrl,
      alt: project.coverAlt || `${project.title} 项目预览占位图`,
      title: project.title,
      subtitle: project.category,
      eyebrow: 'Project preview',
      accent: ACCENTS[index % ACCENTS.length],
    })),
    [projects],
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
          label="项目展示"
          onSelectedChange={setSelected}
        />
      </div>

      <div className="ps-detail" key={active.id} aria-live="polite">
        <div className="ps-detail__meta">
          <span className={`sc-status sc-status--${SHOWCASE_STATUS[active.status][1]}`}>
            {SHOWCASE_STATUS[active.status][0]}
          </span>
          <span className="sc-eyebrow">{active.category}</span>
          {active.period && <span className="ps-detail__period">{active.period}</span>}
        </div>
        <h2 className="ps-detail__title">{active.title}</h2>
        <p className="ps-detail__summary">{active.description}</p>
        {active.highlights && active.highlights.length > 0 && (
          <ul className="ps-detail__list">
            {active.highlights.map((highlight) => <li key={highlight}>{highlight}</li>)}
          </ul>
        )}
        <div className="ps-detail__tags">
          {active.stack.map((item) => <span key={item} className="sc-chip">{item}</span>)}
        </div>
        <div className="ps-detail__links">
          <a className="sc-link" href={`/projects/${active.id}/`}>
            查看详情 <FolioIcon name="arrow-right" className="icon" />
          </a>
          {active.demo && (
            <a className="sc-link" href={active.demo}>
              查看演示 <FolioIcon name="arrow-up-right" className="icon" />
            </a>
          )}
          {active.repo && (
            <a className="sc-link sc-link--muted" href={active.repo}>
              <FolioIcon name="github" className="icon" /> 源码
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
