import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Avatar from '../../../components/Avatar';
import Button from '../../../components/Button';
import FolioIcon from '../../../components/FolioIcon';
import Tag from '../../../components/Tag';
import ReadingProgress from '../../../components/ReadingProgress';
import ArticleToc from '../../../components/ArticleToc';
import { getPostNeighbours, getPublishedPostBySlug, getSiteProfile } from '../../../lib/managed-content';
import { toMeta } from '../../../lib/posts';

interface Params {
  slug: string;
}

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPublishedPostBySlug(slug);
  if (!post) return {};
  return {
    title: post.data.title,
    description: post.data.description,
    openGraph: {
      title: post.data.title,
      description: post.data.description,
      type: 'article',
      publishedTime: post.data.pubDate.toISOString(),
      images: post.data.coverUrl ? [{ url: post.data.coverUrl }] : undefined,
    },
  };
}

export default async function BlogPostPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const post = await getPublishedPostBySlug(slug);
  if (!post) notFound();

  const meta = toMeta(post);
  const [profile, neighbours] = await Promise.all([getSiteProfile(), getPostNeighbours(slug)]);
  const toc = post.toc ?? [];

  return (
    <>
      <ReadingProgress />

      <div className="article-shell">
        <div className="article-lede">
          <div className="article-shell__back">
            <Button variant="text" href="/blog/" iconLeft={<FolioIcon name="arrow-left" className="icon" />}>
              返回文章列表
            </Button>
          </div>

          <header className="article-head rise">
            <div className="article-meta">
              <span style={{ color: 'var(--brand-deep)', fontWeight: 600 }}>{meta.category}</span>
              <span className="dot"></span><span>{meta.date}</span>
              <span className="dot"></span><span>{meta.readTime}</span>
            </div>
            <h1>{post.data.title}</h1>
            {post.data.description && <p className="article-lead">{post.data.description}</p>}
            <div className="article-byline">
              <div className="article-byline__who">
                <Avatar name={profile.name} size="sm" />
                <span>{profile.name}</span>
              </div>
              {post.data.tags.length > 0 && (
                <div className="article-tags">
                  {post.data.tags.map((tag) => <Tag key={tag}>{tag}</Tag>)}
                </div>
              )}
            </div>
          </header>

          {post.data.coverUrl && (
            <figure className="article-cover rise rise-2">
              <img src={post.data.coverUrl} alt={post.data.coverAlt || post.data.title} />
            </figure>
          )}
        </div>

        <div className="article-cols">
          <aside className="article-rail">
            <ArticleToc entries={toc} />
          </aside>

          <article className="article-main">
            <div className="article-body" dangerouslySetInnerHTML={{ __html: post.html }} />

            {(neighbours.prev || neighbours.next) && (
              <nav className="article-nav" aria-label="上下篇">
                {neighbours.prev ? (
                  <a className="article-nav__item" href={neighbours.prev.href}>
                    <span className="article-nav__label">
                      <FolioIcon name="arrow-left" className="icon" /> 上一篇
                    </span>
                    <span className="article-nav__title">{neighbours.prev.title}</span>
                  </a>
                ) : <span aria-hidden="true" />}
                {neighbours.next && (
                  <a className="article-nav__item article-nav__item--next" href={neighbours.next.href}>
                    <span className="article-nav__label">
                      下一篇 <FolioIcon name="arrow-right" className="icon" />
                    </span>
                    <span className="article-nav__title">{neighbours.next.title}</span>
                  </a>
                )}
              </nav>
            )}

            <div className="article-foot">
              <Button variant="secondary" href="/blog/" iconLeft={<FolioIcon name="arrow-left" className="icon" />}>
                返回文章列表
              </Button>
              <Button variant="ghost" href="/rss.xml" iconLeft={<FolioIcon name="rss" className="icon" />}>
                订阅更新
              </Button>
            </div>
          </article>
        </div>
      </div>
    </>
  );
}
