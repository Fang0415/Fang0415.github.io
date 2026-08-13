import Link from 'next/link';
import HomeAboutOrbit from '../components/HomeAboutOrbit';
import HomeBlogAccordion from '../components/HomeBlogAccordion';
import { getPublishedPostMetas, getSiteProfile, getVisibleProjects } from '../lib/managed-content';
import { PROJECTS, type Project } from '../lib/site';

export const dynamic = 'force-dynamic';

const PROJECT_IMAGES: Record<string, string> = {
  ragkit: '/assets/personal-brand/ragkit-mono.png',
  'notes-cli': '/assets/personal-brand/notes-cli.png',
  streamq: '/assets/personal-brand/ragkit-mono.png',
  'embed-bench': '/assets/personal-brand/profile-work.png',
  logpipe: '/assets/personal-brand/hero.png',
  dotfiles: '/assets/personal-brand/ragkit-mono.png',
};

const LEGACY_HERO = "There's still so much I don't know, so I keep digging.";
const FIGMA_HERO = 'From a simple idea, rebuild the whole world.';

const PERSONAL_UPDATES = [
  { text: 'Currently building a RAG evaluation toolkit', href: '/projects/ragkit/' },
  { text: 'Learning distributed systems' },
  { text: 'Recently shipped notes-cli', href: '/projects/notes-cli/' },
  { text: 'Writing about retrieval metrics', href: '/blog/' },
  { text: 'Open to backend and AI collaboration' },
] as const;

function projectImage(project: Project) {
  if (project.coverUrl) return project.coverUrl;
  return PROJECT_IMAGES[project.id] || '/assets/personal-brand/agent-workflow.png';
}

function PersonalUpdateGroup({ duplicate = false }: { duplicate?: boolean }) {
  return (
    <div className="brand-status-marquee__group" aria-hidden={duplicate || undefined}>
      {PERSONAL_UPDATES.map((item) => {
        const content = <span className="brand-status-marquee__text">{item.text}</span>;

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
  const projects = [
    ...visibleProjects,
    ...PROJECTS.filter((item) => !visibleProjects.some((project) => project.id === item.id)),
  ];
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
          <p>I build backend systems, AI applications, and RAG experiments — then write down what I learn.</p>
          <div className="brand-hero__actions">
            <Link className="brand-button brand-button--primary" href="#projects">View Projects</Link>
            <Link className="brand-button brand-button--secondary" href="#blog">Read Blog</Link>
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
          <h2 id="brand-archive-title">What I Done</h2>
          <p>Ideas turned into tools, experiments, and systems — each one a step toward building something useful.</p>
        </div>
        <div className="brand-archive__grid">
          {projects.slice(0, 5).map((project, index) => (
            <Link
              className={`brand-archive-card brand-archive-card--${index + 1}`}
              href={`/projects/${project.id}/`}
              key={project.id}
            >
              <div className="brand-archive-card__image">
                <img src={projectImage(project)} alt={project.coverAlt || `${project.title} 项目视觉`} />
                <span>{project.category}</span>
              </div>
              <div className="brand-archive-card__copy">
                <h3>{project.title}</h3>
                <p>{project.description}</p>
                <div>
                  <span>{project.stack.slice(0, 2).join(' · ')}</span>
                  <span>{project.period || (project.status === 'active' ? 'Now' : '2025')}</span>
                </div>
              </div>
              {index === 0 && <em>Active</em>}
            </Link>
          ))}
        </div>
        <div className="brand-archive__mini-grid">
          {projects.slice(5).map((project) => (
            <Link className="brand-archive-mini-card" href={`/projects/${project.id}/`} key={project.id}>
              <img src={projectImage(project)} alt={project.coverAlt || `${project.title} 项目视觉`} />
              <div>
                <h3>{project.title}</h3>
                <p>{project.description}</p>
                <span>{project.stack.slice(0, 2).join(' · ')}</span>
                <span>{project.period || (project.status === 'active' ? 'Now' : '2025')}</span>
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
        <p className="brand-archive__foot">Want implementation details? <Link href="/projects/">Browse all projects</Link></p>
      </section>

      <section className="brand-blog" id="blog" aria-labelledby="brand-blog-title">
        <div className="brand-section-head">
          <h2 id="brand-blog-title">Latest writing</h2>
          <p>Project notes and engineering decisions. <Link href="/blog/">All posts →</Link></p>
        </div>
        <HomeBlogAccordion posts={posts} />
      </section>
    </div>
  );
}
