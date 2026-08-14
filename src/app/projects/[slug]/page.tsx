import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import Button from '../../../components/Button';
import FolioIcon from '../../../components/FolioIcon';
import Badge from '../../../components/Badge';
import Tag from '../../../components/Tag';
import ProjectCard from '../../../components/ProjectCard';
import { SiteText } from '../../../components/SitePreferences';
import { getProjectBySlug, getVisibleProjects } from '../../../lib/managed-content';
import { renderMarkdown } from '../../../lib/posts';
import { SHOWCASE_STATUS, listFor, textFor } from '../../../lib/site';

interface Params {
  slug: string;
}

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) return {};
  const title = textFor(project.title, 'en');
  const description = textFor(project.summary, 'en');
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'article',
      images: project.coverUrl ? [{ url: project.coverUrl }] : undefined,
    },
  };
}

const STATUS_VARIANT = {
  planning: 'neutral',
  in_progress: 'warning',
  completed: 'brand',
  published: 'success',
} as const;

export default async function ProjectDetailPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) notFound();

  const bodyZhSource = project.content ? textFor(project.content, 'zh') : '';
  const bodyEnSource = project.content ? textFor(project.content, 'en') : '';
  const bodyZh = bodyZhSource.trim() ? renderMarkdown(bodyZhSource) : null;
  const bodyEn = bodyEnSource.trim() ? renderMarkdown(bodyEnSource) : null;
  const [statusLabel] = SHOWCASE_STATUS[project.status];

  // Two sibling projects to keep the page from dead-ending. Same category first,
  // because "more like this" beats "whatever sorted next".
  const all = await getVisibleProjects();
  const related = [
    ...all.filter((item) => item.id !== project.id && item.category === project.category),
    ...all.filter((item) => item.id !== project.id && item.category !== project.category),
  ].slice(0, 2);

  return (
    <>
      <div className="kit-container project-shell" style={{ paddingTop: 28 }}>
        <Button variant="text" href="/projects/" iconLeft={<FolioIcon name="arrow-left" className="icon" />}>
          <SiteText en="Back to projects" zh="返回项目列表" />
        </Button>
      </div>

      <header className="kit-container project-shell project-head rise">
        <div className="project-head__meta">
          <span className="sec-eyebrow" style={{ margin: 0 }}>{project.category}</span>
          <Badge variant={STATUS_VARIANT[project.status]} dot><SiteText en={statusLabel.en} zh={statusLabel.zh} /></Badge>
          {project.updatedAt && <span className="project-head__date"><SiteText en={`Updated ${project.updatedAt}`} zh={`更新于 ${project.updatedAt}`} /></span>}
        </div>
        <h1><SiteText en={project.title.en} zh={project.title.zh} /></h1>
        <p className="project-head__summary"><SiteText en={project.summary.en} zh={project.summary.zh} /></p>

        {(project.github || project.demo) && (
          <div className="project-head__actions">
            {project.demo && (
              <Button variant="primary" href={project.demo} iconRight={<FolioIcon name="arrow-up-right" className="icon" />}>
                <SiteText en="Open demo" zh="打开演示" />
              </Button>
            )}
            {project.github && (
              <Button variant="secondary" href={project.github} iconLeft={<FolioIcon name="github" className="icon" />}>
                <SiteText en="View code" zh="查看代码" />
              </Button>
            )}
          </div>
        )}
      </header>

      {project.coverUrl && (
        <div className="kit-container project-shell">
          <figure className="project-cover rise rise-2">
            <img src={project.coverUrl} alt={project.coverAlt || `${textFor(project.title, 'en')} cover`} className="img-fade" />
          </figure>
        </div>
      )}

      <section className="kit-section" style={{ paddingTop: project.coverUrl ? 40 : 24 }}>
        <div className="kit-container project-shell project-grid">
          <aside className="project-aside">
            <div className="project-aside__block">
              <h2 className="sec-eyebrow" style={{ margin: '0 0 12px' }}><SiteText en="Tags" zh="标签" /></h2>
              {project.tags.length > 0
                ? <div className="tool-grid">{project.tags.map((item) => <Tag key={item}>{item}</Tag>)}</div>
                : <p className="project-aside__empty"><SiteText en="Not provided" zh="未填写" /></p>}
            </div>
            {(project.highlights.zh.length > 0 || project.highlights.en.length > 0) && (
              <div className="project-aside__block">
                <h2 className="sec-eyebrow" style={{ margin: '0 0 12px' }}><SiteText en="Highlights" zh="要点" /></h2>
                <SiteText
                  en={<ul className="project-aside__list">{listFor(project.highlights, 'en').map((item) => <li key={item}>{item}</li>)}</ul>}
                  zh={<ul className="project-aside__list">{listFor(project.highlights, 'zh').map((item) => <li key={item}>{item}</li>)}</ul>}
                />
              </div>
            )}
            <div className="project-aside__block">
              <h2 className="sec-eyebrow" style={{ margin: '0 0 12px' }}><SiteText en="Links" zh="链接" /></h2>
              <div className="project-aside__links">
                {project.github && (
                  <a href={project.github}><FolioIcon name="github" className="icon" /> GitHub</a>
                )}
                {project.demo && (
                  <a href={project.demo}><FolioIcon name="arrow-up-right" className="icon" /> <SiteText en="Demo" zh="演示" /></a>
                )}
                {!project.github && !project.demo && <p className="project-aside__empty"><SiteText en="Not public yet" zh="暂未公开" /></p>}
              </div>
            </div>
          </aside>

          <div className="project-body">
            {(bodyZh || bodyEn)
              ? (
                <SiteText
                  en={<div className="article-body" dangerouslySetInnerHTML={{ __html: bodyEn?.html ?? bodyZh?.html ?? '' }} />}
                  zh={<div className="article-body" dangerouslySetInnerHTML={{ __html: bodyZh?.html ?? bodyEn?.html ?? '' }} />}
                />
              )
              : (
                <p className="project-body__blank">
                  <SiteText
                    en="The detailed project notes are still being prepared."
                    zh="详细记录还没写完。先留下项目简介，等内容整理好后，我会补上实现过程和踩过的坑。"
                  />
                </p>
              )}
          </div>
        </div>
      </section>

      {related.length > 0 && (
        <section className="kit-section kit-section--tight" style={{ background: 'var(--bg-soft)' }}>
          <div className="kit-container project-shell">
            <div className="sec-head">
              <div>
                <p className="sec-eyebrow"><SiteText en="Keep exploring" zh="继续看" /></p>
                <h2 className="sec-title"><SiteText en="Other projects" zh="其他项目" /></h2>
              </div>
              <Link className="sec-link" href="/projects/">
                <SiteText en="All projects" zh="全部项目" /> <FolioIcon name="arrow-right" className="icon" />
              </Link>
            </div>
            <div className="grid-2">
              {related.map((item) => (
                <ProjectCard
                  key={item.id}
                  title={item.title}
                  description={item.summary}
                  tags={item.tags}
                  status={item.status}
                  highlights={item.highlights}
                  href={`/projects/${item.id}/`}
                />
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
