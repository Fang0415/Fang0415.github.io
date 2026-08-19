'use client';

import Tag from './Tag';
import { useSitePreferences } from './SitePreferences';
import { SKILLS } from '../lib/skills';

export default function SkillsDirectory() {
  const { locale } = useSitePreferences();
  const zh = locale === 'zh';

  return (
    <>
      <section className="page-head skill-directory__head">
        <div className="kit-container">
          <h1 className="rise">{zh ? '技能仓库' : 'Skills'}</h1>
          <p className="rise rise-2">
            {zh
              ? '工具只是表层，这里记录我如何使用它们进行设计、构建与学习。'
              : 'The tools are only the surface. This is how I use them to design, build, and learn.'}
          </p>
        </div>
      </section>

      <section className="kit-section skill-directory">
        <div className="kit-container skill-directory__grid">
          {SKILLS.map((skill) => (
            <article className="skill-directory-card" id={skill.slug} key={skill.slug}>
              <img src={skill.poster} alt="" />
              <div className="skill-directory-card__copy">
                <span className="skill-directory-card__index">{skill.index}</span>
                <h2>{zh ? skill.nameZh : skill.name}</h2>
                <p>{zh ? skill.summaryZh : skill.summary}</p>
                <div className="skill-directory-card__tags">
                  {skill.details.map((detail) => <Tag key={detail}>{detail}</Tag>)}
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
