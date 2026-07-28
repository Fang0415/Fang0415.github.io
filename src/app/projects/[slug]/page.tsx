import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import Button from '../../../components/Button';
import FolioIcon from '../../../components/FolioIcon';
import Badge from '../../../components/Badge';
import Tag from '../../../components/Tag';
import ProjectCard from '../../../components/ProjectCard';
import { getProjectBySlug, getVisibleProjects } from '../../../lib/managed-content';
import { renderMarkdown } from '../../../lib/posts';
import { SHOWCASE_STATUS } from '../../../lib/site';

interface Params {
  slug: string;
}

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) return {};
  return {
    title: project.title,
    description: project.description,
    openGraph: {
      title: project.title,
      description: project.description,
      type: 'article',
      images: project.coverUrl ? [{ url: project.coverUrl }] : undefined,
    },
  };
}

const STATUS_VARIANT = {
  active: 'success',
  building: 'warning',
  shipped: 'brand',
  archived: 'neutral',
} as const;

export default async function ProjectDetailPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) notFound();

  const body = project.content?.trim() ? renderMarkdown(project.content) : null;
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
          返回项目列表
        </Button>
      </div>

      <header className="kit-container project-shell project-head rise">
        <div className="project-head__meta">
          <span className="sec-eyebrow" style={{ margin: 0 }}>{project.category}</span>
          <Badge variant={STATUS_VARIANT[project.status]} dot>{statusLabel}</Badge>
          {project.updatedAt && <span className="project-head__date">更新于 {project.updatedAt}</span>}
        </div>
        <h1>{project.title}</h1>
        <p className="project-head__summary">{project.description}</p>

        {(project.repo || project.demo) && (
          <div className="project-head__actions">
            {project.demo && (
              <Button variant="primary" href={project.demo} iconRight={<FolioIcon name="arrow-up-right" className="icon" />}>
                打开演示
              </Button>
            )}
            {project.repo && (
              <Button variant="secondary" href={project.repo} iconLeft={<FolioIcon name="github" className="icon" />}>
                查看代码
              </Button>
            )}
          </div>
        )}
      </header>

      {project.coverUrl && (
        <div className="kit-container project-shell">
          <figure className="project-cover rise rise-2">
            <img src={project.coverUrl} alt={project.coverAlt || `${project.title} 封面`} className="img-fade" />
          </figure>
        </div>
      )}

      <section className="kit-section" style={{ paddingTop: project.coverUrl ? 40 : 24 }}>
        <div className="kit-container project-shell project-grid">
          <aside className="project-aside">
            <div className="project-aside__block">
              <h2 className="sec-eyebrow" style={{ margin: '0 0 12px' }}>技术栈</h2>
              {project.stack.length > 0
                ? <div className="tool-grid">{project.stack.map((item) => <Tag key={item}>{item}</Tag>)}</div>
                : <p className="project-aside__empty">未填写</p>}
            </div>
            {project.highlights && project.highlights.length > 0 && (
              <div className="project-aside__block">
                <h2 className="sec-eyebrow" style={{ margin: '0 0 12px' }}>要点</h2>
                <ul className="project-aside__list">
                  {project.highlights.map((item) => <li key={item}>{item}</li>)}
                </ul>
              </div>
            )}
            <div className="project-aside__block">
              <h2 className="sec-eyebrow" style={{ margin: '0 0 12px' }}>链接</h2>
              <div className="project-aside__links">
                {project.repo && (
                  <a href={project.repo}><FolioIcon name="github" className="icon" /> 仓库</a>
                )}
                {project.demo && (
                  <a href={project.demo}><FolioIcon name="arrow-up-right" className="icon" /> 演示</a>
                )}
                {!project.repo && !project.demo && <p className="project-aside__empty">暂未公开</p>}
              </div>
            </div>
          </aside>

          <div className="project-body">
            {body
              ? <div className="article-body" dangerouslySetInnerHTML={{ __html: body.html }} />
              : (
                <p className="project-body__blank">
                  详细记录还没写完。先留下项目简介，等内容整理好后，我会补上实现过程和踩过的坑。
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
                <p className="sec-eyebrow">继续看</p>
                <h2 className="sec-title">其他项目</h2>
              </div>
              <Link className="sec-link" href="/projects/">
                全部项目 <FolioIcon name="arrow-right" className="icon" />
              </Link>
            </div>
            <div className="grid-2">
              {related.map((item) => (
                <ProjectCard
                  key={item.id}
                  title={item.title}
                  description={item.description}
                  stack={item.stack}
                  status={item.status}
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
