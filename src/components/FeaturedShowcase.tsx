'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { PROJECTS, SHOWCASE_STATUS, type Project } from '../lib/site';
import FolioIcon from './FolioIcon';

interface Props {
  projects?: Project[];
}

/**
 * Featured projects, selected with a tab row.
 *
 * The earlier version pinned a 4×100vh track and drove the selection from
 * scroll position. It looked good on a desktop mouse wheel and nowhere else:
 * the steps were hidden under 880px, which left phones stuck on project one,
 * and four screens of hijacked scrolling is the opposite of a calm page.
 * Tabs give the same "one project at a time" reading with a short crossfade
 * and no scroll ownership.
 */
export default function FeaturedShowcase({ projects }: Props) {
  const items = useMemo(() => (projects?.length ? projects : PROJECTS).slice(0, 4), [projects]);
  const [selected, setSelected] = useState(0);

  if (!items.length) return null;

  const index = Math.min(selected, items.length - 1);
  const active = items[index];
  const [statusLabel, statusKind] = SHOWCASE_STATUS[active.status];
  const highlights = active.highlights?.length ? active.highlights : [active.description];

  return (
    <section className="kit-section kit-section--tight" aria-labelledby="showcase-title">
      <div className="kit-container">
        <div className="sec-head">
          <div>
            <p className="sec-eyebrow">项目</p>
            <h2 className="sec-title" id="showcase-title">最近做的几个项目</h2>
          </div>
          <Link className="sec-link" href="/projects/">
            全部项目 <FolioIcon name="arrow-right" className="icon" />
          </Link>
        </div>

        <div className="sc">
          <div className="sc-tabs" role="tablist" aria-label="精选项目">
            {items.map((p, i) => (
              <button
                key={p.id}
                type="button"
                role="tab"
                id={`sc-tab-${p.id}`}
                aria-selected={i === index}
                aria-controls={`sc-panel-${p.id}`}
                className={`sc-tab ${i === index ? 'is-active' : ''}`.trim()}
                onClick={() => setSelected(i)}
              >
                <span className="sc-tab__num">{String(i + 1).padStart(2, '0')}</span>
                {p.title}
              </button>
            ))}
          </div>

          <div
            className="sc-panel sc-anim"
            key={active.id}
            role="tabpanel"
            id={`sc-panel-${active.id}`}
            aria-labelledby={`sc-tab-${active.id}`}
          >
            <div className="sc-intro">
              <div className="sc-meta">
                <span className={`sc-status sc-status--${statusKind}`}>{statusLabel}</span>
                <span className="sc-eyebrow">{active.category}</span>
              </div>
              <h3 className="sc-title">
                <a className="sc-titlelink" href={`/projects/${active.id}/`}>{active.title}</a>
              </h3>
              <p className="sc-desc">{active.description}</p>
              <div className="sc-tech">
                {active.stack.map((t) => <span key={t} className="sc-chip">{t}</span>)}
              </div>
              <div className="sc-links">
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

            <div className="sc-preview">
              <div className="sc-win">
                <div className="sc-win__bar" aria-hidden="true">
                  <span className="sc-win__dot" style={{ background: 'var(--rose-500)' }} />
                  <span className="sc-win__dot" style={{ background: 'var(--gold-500)' }} />
                  <span className="sc-win__dot" style={{ background: 'var(--green-500)' }} />
                  <span className="sc-win__title">{active.id} — {active.category}</span>
                </div>
                {/* A real screenshot always beats the stylised terminal, so the
                    cover wins whenever the project has one. */}
                {active.coverUrl ? (
                  <a className="sc-win__shot" href={`/projects/${active.id}/`}>
                    <img src={active.coverUrl} alt={active.coverAlt || `${active.title} 预览`} />
                  </a>
                ) : (
                  <div className="sc-win__body">
                    <div className="sc-cmd"><span className="p">$</span>{active.id} --what-it-does</div>
                    <ul className="sc-out">
                      {highlights.map((h) => (
                        <li key={h}><span className="b">▸</span><span>{h}</span></li>
                      ))}
                    </ul>
                    {(active.period || active.role) && (
                      <div className="sc-foot">
                        {active.period && <span>{active.period}</span>}
                        {active.role && <span>· {active.role}</span>}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
