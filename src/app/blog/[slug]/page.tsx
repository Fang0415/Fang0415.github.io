import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Avatar from '../../../components/Avatar';
import Button from '../../../components/Button';
import FolioIcon from '../../../components/FolioIcon';
import Tag from '../../../components/Tag';
import { getPublishedPostBySlug } from '../../../lib/managed-content';
import { toMeta } from '../../../lib/posts';
import { PROFILE } from '../../../lib/site';

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
  };
}

export default async function BlogPostPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const post = await getPublishedPostBySlug(slug);
  if (!post) notFound();
  const meta = toMeta(post);

  return (
    <>
      <div className="kit-narrow" style={{ paddingTop: 28 }}>
        <Button variant="text" href="/blog/" iconLeft={<FolioIcon name="arrow-left" className="icon" />}>
          返回文章列表
        </Button>
      </div>

      <header className="kit-narrow article-head rise">
        <div className="article-meta">
          <span style={{ color: 'var(--brand-deep)', fontWeight: 600 }}>{meta.category}</span>
          <span className="dot"></span><span>{meta.date}</span>
          <span className="dot"></span><span>{meta.readTime}</span>
        </div>
        <h1>{post.data.title}</h1>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Avatar name={PROFILE.name} size="sm" />
            <span style={{ fontSize: 'var(--fs-body-sm)', color: 'var(--text-secondary)' }}>{PROFILE.name}</span>
          </div>
          <div className="article-tags">
            {post.data.tags.map((t) => <Tag key={t}>{t}</Tag>)}
          </div>
        </div>
      </header>

      <article className="kit-narrow">
        <div className="article-body" dangerouslySetInnerHTML={{ __html: post.html }} />

        <div style={{ marginTop: 56, paddingTop: 32, borderTop: '1px solid var(--border-default)', display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <Button variant="secondary" href="/blog/" iconLeft={<FolioIcon name="arrow-left" className="icon" />}>
            返回文章列表
          </Button>
          <Button variant="ghost" href="/rss.xml" iconLeft={<FolioIcon name="rss" className="icon" />}>
            订阅
          </Button>
        </div>
      </article>
    </>
  );
}
