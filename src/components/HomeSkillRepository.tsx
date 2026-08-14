'use client';

import { useEffect, useState } from 'react';
import MarqueeAlongSvgPath from './ui/marquee-along-svg-path';
import { SKILLS } from '@/lib/skills';
import { useSitePreferences } from './SitePreferences';

const SKILL_PATH = 'M120 -40C620 -40 620 140 380 180C140 220 140 340 380 380C620 420 620 600 120 600';

export default function HomeSkillRepository() {
  const { locale } = useSitePreferences();
  const zh = locale === 'zh';
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const timer = window.setInterval(() => setActive((current) => (current + 1) % SKILLS.length), 3400);
    return () => window.clearInterval(timer);
  }, [paused]);

  const skill = SKILLS[active];

  return (
    <section className="brand-skills" id="skills" aria-labelledby="brand-skills-title">
      <div className="brand-section-head brand-skills__head">
        <h2 id="brand-skills-title">{zh ? 'Skill 仓库' : 'Skill Repository'}</h2>
        <p>{zh ? '持续更新我用于构建产品的工具、系统与工程实践。' : 'A living collection of tools, systems, and practices I use to build.'}</p>
      </div>
      <div className="brand-skills__shell">
        <div
          className="brand-skills__visual brand-skills__visual--path"
          aria-label={zh ? '交互式技能轨迹' : 'Interactive skill path'}
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          <MarqueeAlongSvgPath
            path={SKILL_PATH}
            pathId="brand-skill-motion-path"
            viewBox="0 0 760 560"
            baseVelocity={4.2}
            slowdownOnHover
            slowDownFactor={0}
            draggable
            dragSensitivity={0.1}
            dragVelocityDecay={0.94}
            dragAwareDirection
            repeat={1}
            responsive
            grabCursor
            className="brand-skills__path-marquee"
          >
            {SKILLS.map((item, index) => (
              <button
                className={`brand-skill-node ${index === active ? 'is-active' : ''}`}
                key={item.name}
                type="button"
                aria-label={zh ? `查看${item.nameZh}` : `Show ${item.name}`}
                aria-pressed={index === active}
                onPointerDown={() => setActive(index)}
                onClick={() => setActive(index)}
                onFocus={() => { setPaused(true); setActive(index); }}
                onBlur={() => setPaused(false)}
                onMouseEnter={() => setActive(index)}
              >
                <img src={item.poster} alt="" draggable={false} />
              </button>
            ))}
          </MarqueeAlongSvgPath>
        </div>

        <article className="brand-skills__copy" aria-live="polite">
          <div className="brand-skills__content" key={skill.name}>
            <h3>{zh ? skill.nameZh : skill.name}</h3>
            <p>{zh ? skill.summaryZh : skill.summary}</p>
          </div>
        </article>
      </div>
    </section>
  );
}
