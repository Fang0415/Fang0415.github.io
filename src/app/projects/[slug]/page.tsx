import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Button from '../../../components/Button';
import FolioIcon from '../../../components/FolioIcon';
import Badge from '../../../components/Badge';
import { SiteText } from '../../../components/SitePreferences';
import { getProjectBySlug } from '../../../lib/managed-content';
import { renderMarkdown } from '../../../lib/posts';
import { SHOWCASE_STATUS, textFor } from '../../../lib/site';

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
        </div>
        <div className="project-head__main">
          <div className="project-head__copy">
            <h1><SiteText en={project.title.en} zh={project.title.zh} /></h1>
            <p className="project-head__summary"><SiteText en={project.summary.en} zh={project.summary.zh} /></p>
          </div>

          {(project.github || project.demo) && (
            <div className="project-head__actions">
              {project.demo && (
                <Button variant="primary" href={project.demo} iconRight={<FolioIcon name="arrow-up-right" className="icon" />}>
                  <SiteText en="Open demo" zh="打开演示" />
                </Button>
              )}
              {project.github && (
                <Button variant="text" href={project.github} iconLeft={<FolioIcon name="github" className="icon" />}>
                  <SiteText en="View code" zh="查看代码" />
                </Button>
              )}
            </div>
          )}
        </div>
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
    </>
  );
}
