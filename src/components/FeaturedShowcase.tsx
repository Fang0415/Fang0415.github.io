'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { PROJECTS, SHOWCASE_STATUS, type Project } from '../lib/site';
import FolioIcon from './FolioIcon';

interface Props {
  projects?: Project[];
}

export default function FeaturedShowcase({ projects }: Props) {
  const items = useMemo(() => (projects?.length ? projects : PROJECTS).slice(0, 4), [projects]);
  const data = items.map((p) => {
    const [label, kind] = SHOWCASE_STATUS[p.status];
    return { ...p, statusLabel: label, statusKind: kind };
  });
  const n = data.length;
  const trackRef = useRef<HTMLElement>(null);
  const [selected, setSelected] = useState(0);
  const [pos, setPos] = useState(0);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const mq = window.matchMedia('(max-width: 880px)');
    let raf = 0;

    const update = () => {
      raf = 0;
      if (mq.matches) {
        setPos(selected);
        return;
      }
      const vh = window.innerHeight;
      const total = track.offsetHeight - vh;
      const scrolled = Math.min(Math.max(-track.getBoundingClientRect().top, 0), Math.max(total, 1));
      const progress = total > 0 ? scrolled / total : 0;
      const nextPos = Math.max(0, Math.min(progress * (n - 1), n - 1));
      setPos(nextPos);
      setSelected(Math.round(nextPos));
    };

    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };

    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [n, selected]);

  const scrollToStep = (i: number) => {
    const track = trackRef.current;
    if (!track) return;
    const mq = window.matchMedia('(max-width: 880px)');
    if (mq.matches) {
      setSelected(i);
      setPos(i);
      return;
    }
    const vh = window.innerHeight;
    const total = track.offsetHeight - vh;
    const trackTop = track.getBoundingClientRect().top + window.scrollY;
    window.scrollTo({ top: Math.round(trackTop + (i / Math.max(n - 1, 1)) * total), behavior: 'smooth' });
  };

  const baseIdx = Math.min(Math.floor(pos), n - 1);
  const frac = pos - baseIdx;
  const nextIdx = baseIdx + 1 < n ? baseIdx + 1 : null;

  return (
    <section ref={trackRef} className="fs-track" data-fs-track style={{ height: `calc(${n} * 100vh)` }}>
      <div className="fs-pin">
        <div className="kit-container">
          <div className="sec-head">
            <div>
              <p className="sec-eyebrow">精选项目</p>
              <h2 className="sec-title">一些正在打磨的东西</h2>
            </div>
            <a className="sec-link" href="/projects/">全部项目 <FolioIcon name="arrow-right" className="icon" /></a>
          </div>

          <div className="fs">
            <div className="fs-intro-wrap">
              {data.map((p, i) => (
                <div key={p.id} className={`fs-intro ${i === selected ? 'fs-anim' : ''}`} data-fs-intro={i} hidden={i !== selected}>
                  <div className="fs-count">{String(i + 1).padStart(2, '0')} <span>/ {String(n).padStart(2, '0')}</span></div>
                  <div className="fs-meta">
                    <span className={`fs-status fs-status--${p.statusKind}`}>{p.statusLabel}</span>
                    <span className="fs-eyebrow">{p.category}</span>
                  </div>
                  <h3 className="fs-title">{p.title}</h3>
                  <p className="fs-desc">{p.description}</p>
                  <div className="fs-tech">{p.stack.map((t) => <span key={t} className="fs-chip">{t}</span>)}</div>
                  <div className="fs-links">
                    {p.demo && <a className="fs-link" href={p.demo}>查看演示 ↗</a>}
                    {p.repo && <a className="fs-link fs-link--muted" href={p.repo}>GitHub ↗</a>}
                  </div>
                </div>
              ))}
            </div>

            <div className="fs-win-stack" data-fs-stack>
              {data.map((p, i) => {
                const isBase = i === baseIdx;
                const isNext = i === nextIdx && frac > 0.0005;
                const hidden = !isBase && !isNext;
                const transform = isNext ? `translateY(${(1 - frac) * 100}%)` : 'translateY(0%)';
                return (
                  <div
                    key={p.id}
                    className={`fs-win-layer ${isNext ? 'fs-win-layer--over' : ''}`}
                    data-fs-layer={i}
                    style={{ zIndex: isNext ? 2 : 1, transform }}
                    hidden={hidden}
                  >
                    <div className="fs-win">
                      <div className="fs-win__bar">
                        <span className="fs-win__dot" style={{ background: '#f0738b' }}></span>
                        <span className="fs-win__dot" style={{ background: '#f6b417' }}></span>
                        <span className="fs-win__dot" style={{ background: '#5aa53f' }}></span>
                        <span className="fs-win__title">{p.id}</span>
                      </div>
                      <div className="fs-win__body"><span className="fs-win__tag">{p.title} — 预览</span></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="fs-steps" data-fs-steps>
            {data.map((p, i) => (
              <button
                key={p.id}
                className={`fs-step ${i === selected ? 'is-active' : ''}`}
                data-fs-step={i}
                aria-label={`查看 ${p.title}`}
                onClick={() => scrollToStep(i)}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
