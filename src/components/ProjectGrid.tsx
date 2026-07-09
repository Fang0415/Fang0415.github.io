'use client';

import { useMemo, useState } from 'react';
import ProjectCard from './ProjectCard';
import type { Project } from '../lib/site';

interface Props {
  projects: Project[];
}

export default function ProjectGrid({ projects }: Props) {
  const categories = useMemo(() => ['全部', ...Array.from(new Set(projects.map((p) => p.category)))], [projects]);
  const [filter, setFilter] = useState('全部');
  const shown = projects.filter((p) => filter === '全部' || p.category === filter);

  return (
    <>
      <div className="filter-bar" data-proj-filter>
        {categories.map((c) => (
          <button
            key={c}
            className={`filter-chip ${c === filter ? 'filter-chip--active' : ''}`}
            data-filter={c}
            onClick={() => setFilter(c)}
          >
            {c}
          </button>
        ))}
        <span className="filter-spacer"></span>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--text-muted)' }} data-proj-count>
          共 {shown.length} 个项目
        </span>
      </div>
      <div className="grid-auto" style={{ marginTop: 24 }} data-proj-grid>
        {shown.map((p) => (
          <div key={p.id} data-category={p.category}>
            <ProjectCard
              title={p.title}
              description={p.description}
              stack={p.stack}
              status={p.status}
              role={p.role}
              period={p.period}
              highlights={p.highlights}
              href={`/projects/#${p.id}`}
              repo={p.repo}
              demo={p.demo}
            />
          </div>
        ))}
      </div>
    </>
  );
}
