'use client';

import { type CSSProperties, useEffect, useState } from 'react';
import { AI_SKILLS } from '@/lib/ai-skills';
import { useSitePreferences } from './SitePreferences';

const SKILL_COLUMNS = Array.from({ length: 4 }, (_, column) =>
  AI_SKILLS.filter((_, index) => index % 4 === column),
);
const COLUMN_DIRECTIONS = ['up', 'down', 'up', 'down'] as const;

export default function HomeSkillRepository() {
  const { locale } = useSitePreferences();
  const zh = locale === 'zh';
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const timer = window.setInterval(() => setActive((current) => (current + 1) % AI_SKILLS.length), 3000);
    return () => window.clearInterval(timer);
  }, [paused]);

  const skill = AI_SKILLS[active];

  return (
    <section className="brand-skills" id="skills" aria-labelledby="brand-skills-title">
      <div className="brand-section-head brand-skills__head">
        <h2 id="brand-skills-title">{zh ? 'Skill 仓库' : 'Skill Repository'}</h2>
        <p>{zh ? '我为 AI 辅助开发收集和编写的可复用指令与工作流。' : 'Reusable instructions and workflows I collect and write for AI-assisted development.'}</p>
      </div>
      <div className="brand-skills__shell">
        <div
          className={`brand-skills__visual brand-skills__visual--path ${paused ? 'is-paused' : ''}`}
          aria-label={zh ? '交互式 AI Skill 列表' : 'Interactive AI skill library'}
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          <div className="brand-skills__streams">
            {SKILL_COLUMNS.map((items, columnIndex) => {
              const direction = COLUMN_DIRECTIONS[columnIndex];
              const streamStyle = {
                '--skill-stream-count': items.length,
                '--skill-stream-duration': `${items.length * 4}s`,
                '--skill-stream-delay': `${columnIndex * -3.7}s`,
              } as CSSProperties;

              return (
                <div className={`brand-skill-stream is-${direction}`} key={columnIndex}>
                  <div className="brand-skill-stream__track" style={streamStyle}>
                    {[0, 1].map((copyIndex) => (
                      <div
                        className="brand-skill-stream__set"
                        key={copyIndex}
                        aria-hidden={copyIndex === 1 || undefined}
                      >
                        {items.map((item) => {
                          const index = AI_SKILLS.indexOf(item);
                          return (
                            <button
                              className={`brand-skill-node ${index === active ? 'is-active' : ''}`}
                              key={`${item.name}-${copyIndex}`}
                              type="button"
                              tabIndex={copyIndex === 1 ? -1 : undefined}
                              aria-label={copyIndex === 0 ? (zh ? `查看 ${item.name}` : `Show ${item.name}`) : undefined}
                              aria-pressed={copyIndex === 0 ? index === active : undefined}
                              onPointerDown={() => setActive(index)}
                              onClick={() => setActive(index)}
                              onFocus={() => { setPaused(true); setActive(index); }}
                              onBlur={() => setPaused(false)}
                              onMouseEnter={() => setActive(index)}
                            >
                              <img src={item.poster} alt="" draggable={false} />
                            </button>
                          );
                        })}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <article className="brand-skills__copy" aria-live="polite">
          <div className="brand-skills__content" key={skill.name}>
            <h3>{skill.name}</h3>
            <p>{zh ? skill.summaryZh : skill.summary}</p>
          </div>
        </article>
      </div>
    </section>
  );
}
