import Link from 'next/link';
import HomeAboutOrbit from '../components/HomeAboutOrbit';
import HomeBlogAccordion from '../components/HomeBlogAccordion';
import HomeSkillRepository from '../components/HomeSkillRepository';
import { SiteText } from '../components/SitePreferences';
import { getPublishedPostMetas, getSiteProfile, getVisibleProjects } from '../lib/managed-content';
import { SHOWCASE_STATUS, textFor, type Project } from '../lib/site';

export const dynamic = 'force-dynamic';

const PROJECT_IMAGES: Record<string, string> = {
  linkrag: '/assets/projects/linkrag-cover.png',
  'notes-cli': '/assets/personal-brand/notes-cli.png',
  streamq: '/assets/personal-brand/ragkit-mono.png',
  'embed-bench': '/assets/personal-brand/profile-work.png',
  logpipe: '/assets/personal-brand/hero.png',
  dotfiles: '/assets/personal-brand/ragkit-mono.png',
};

const LEGACY_HERO = "There's still so much I don't know, so I keep digging.";
const FIGMA_HERO = 'From a simple idea, rebuild the whole world.';

const PERSONAL_UPDATES = [
  { text: 'LinkRag is now live', textZh: 'LinkRag 已上线', href: '/projects/linkrag/' },
  { text: 'Learning distributed systems', textZh: '正在学习分布式系统' },
  { text: 'Recently shipped notes-cli', textZh: '最近完成 notes-cli', href: '/projects/notes-cli/' },
  { text: 'Writing about retrieval metrics', textZh: '正在写检索指标相关笔记', href: '/blog/' },
  { text: 'Open to backend and AI collaboration', textZh: '期待后端与 AI 方向的合作' },
] as const;

function projectImage(project: Project) {
  if (project.coverUrl) return project.coverUrl;
  return PROJECT_IMAGES[project.id] || '/assets/personal-brand/agent-workflow.png';
}

function PersonalUpdateGroup({ duplicate = false }: { duplicate?: boolean }) {
  return (
    <div className="brand-status-marquee__group" aria-hidden={duplicate || undefined}>
      {PERSONAL_UPDATES.map((item) => {
        const content = <span className="brand-status-marquee__text"><SiteText en={item.text} zh={item.textZh} /></span>;

        if (!duplicate && 'href' in item) {
          return (
            <Link className="brand-status-marquee__item" href={item.href} key={item.text}>
              {content}
            </Link>
          );
        }

        return <span className="brand-status-marquee__item" key={item.text}>{content}</span>;
      })}
    </div>
  );
}

export default async function HomePage() {
  const [latest, visibleProjects, profile] = await Promise.all([
    getPublishedPostMetas(),
    getVisibleProjects(),
    getSiteProfile(),
  ]);
  const projects = visibleProjects;
  const hero = !profile.hero || profile.hero === LEGACY_HERO ? FIGMA_HERO : profile.hero;
  const posts = [
    ...latest.slice(0, 6),
    ...(latest.length < 6 ? [{
      title: 'More notes will arrive as the projects evolve',
      excerpt: '项目仍在迭代，新的实现记录会随着工程决策逐步补齐。',
      href: '/blog/',
    }] : []),
  ].slice(0, 6);

  return (
    <div className="brand-home">
      <section className="brand-hero" aria-labelledby="brand-hero-title">
        <div className="brand-hero__copy rise">
          <h1 id="brand-hero-title">{hero}</h1>
          <p><SiteText en="I build backend systems, AI applications, and RAG experiments — then write down what I learn." zh="我构建后端系统、AI 应用与 RAG 实验，也把一路学到的内容记录下来。" /></p>
          <div className="brand-hero__actions">
            <Link className="brand-button brand-button--primary" href="#projects"><SiteText en="View Projects" zh="查看项目" /></Link>
            <Link className="brand-button brand-button--secondary" href="#blog"><SiteText en="Read Blog" zh="阅读博客" /></Link>
          </div>
        </div>

        <div className="brand-status-marquee" aria-label="Current status and recent updates">
          <div className="brand-status-marquee__track">
            <PersonalUpdateGroup />
            <PersonalUpdateGroup duplicate />
          </div>
        </div>

        <div className="brand-hero__visual rise rise-2">
          <img src="/assets/personal-brand/hero.png" alt="向日葵田里的动漫女孩" />
        </div>
      </section>

      <HomeAboutOrbit
        name={profile.name}
        avatarUrl={profile.avatarUrl}
        email={profile.email}
        github={profile.github}
        wechat={profile.wechat}
        qq={profile.qq}
        reddit={profile.reddit}
        intro="I’m Fang, a student and full-stack developer focused on backend systems, AI applications, and RAG experiments. I enjoy turning small ideas into complete, useful products."
      />

      <section className="brand-archive" id="projects" aria-labelledby="brand-archive-title">
        <div className="brand-section-head">
          <h2 id="brand-archive-title"><SiteText en="What I Done" zh="我做过的事" /></h2>
          <p><SiteText en="Ideas turned into tools, experiments, and systems — each one a step toward building something useful." zh="把想法变成工具、实验与系统——每一次实践，都向真正有用的产品迈进一步。" /></p>
        </div>
        <div className="brand-archive__grid">
          {projects.slice(0, 5).map((project, index) => (
            <Link
              className={`brand-archive-card brand-archive-card--${index + 1}`}
              href={`/projects/${project.id}/`}
              key={project.id}
            >
              <div className="brand-archive-card__image">
                <img src={projectImage(project)} alt={project.coverAlt || `${textFor(project.title, 'en')} project visual`} />
                <span>{project.category}</span>
              </div>
              <div className="brand-archive-card__copy">
                <h3><SiteText en={project.title.en} zh={project.title.zh} /></h3>
                <p><SiteText en={project.summary.en} zh={project.summary.zh} /></p>
                <div>
                  <span>{project.tags.slice(0, 2).join(' · ')}</span>
                  <span><SiteText en={SHOWCASE_STATUS[project.status][0].en} zh={SHOWCASE_STATUS[project.status][0].zh} /></span>
                </div>
              </div>
              {index === 0 && <em><SiteText en={SHOWCASE_STATUS[project.status][0].en} zh={SHOWCASE_STATUS[project.status][0].zh} /></em>}
            </Link>
          ))}
        </div>
        <div className="brand-archive__mini-grid">
          {projects.slice(5).map((project) => (
            <Link className="brand-archive-mini-card" href={`/projects/${project.id}/`} key={project.id}>
              <img src={projectImage(project)} alt={project.coverAlt || `${textFor(project.title, 'en')} project visual`} />
              <div>
                <h3><SiteText en={project.title.en} zh={project.title.zh} /></h3>
                <p><SiteText en={project.summary.en} zh={project.summary.zh} /></p>
                <span>{project.tags.slice(0, 2).join(' · ')}</span>
                <span><SiteText en={SHOWCASE_STATUS[project.status][0].en} zh={SHOWCASE_STATUS[project.status][0].zh} /></span>
              </div>
            </Link>
          ))}
          {[
            ['Fang Blog', 'A personal site designed, developed, deployed, and maintained as one complete product.', '/assets/personal-brand/notes-cli.png', 'Next.js · TypeScript', 'Now'],
            ['AI Agent Workflow', 'Experiments with agent boundaries, tool use, and reliable handoffs between judgment and automation.', '/assets/personal-brand/agent-workflow.png', 'AI · Product', 'Writing'],
          ].map(([title, description, image, stack, state]) => (
            <article key={title}>
              <img src={image} alt="" />
              <div><h3>{title}</h3><p>{description}</p><span>{stack}</span><span>{state}</span></div>
            </article>
          ))}
        </div>
        <p className="brand-archive__foot"><SiteText en="Want implementation details? " zh="想了解实现细节？" /><Link href="/projects/"><SiteText en="Browse all projects" zh="查看全部项目" /></Link></p>
      </section>

      <HomeSkillRepository />

      <section className="brand-blog" id="blog" aria-labelledby="brand-blog-title">
        <div className="brand-section-head">
          <h2 id="brand-blog-title"><SiteText en="Latest writing" zh="最新文章" /></h2>
          <p><SiteText en="Project notes and engineering decisions. " zh="记录项目过程与工程决策。" /><Link href="/blog/"><SiteText en="All posts →" zh="全部文章 →" /></Link></p>
        </div>
        <HomeBlogAccordion posts={posts} />
      </section>
    </div>
  );
}
