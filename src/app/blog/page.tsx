import type { Metadata } from 'next';
import WritingList from '../../components/WritingList';
import { getPublishedPostMetas } from '../../lib/managed-content';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: '文章',
  description: '写代码之余，也写一点想法。',
};

export default async function BlogPage() {
  const posts = await getPublishedPostMetas();

  return (
    <>
      <section className="page-head">
        <div className="kit-container">
          <h1 className="rise">文章</h1>
          <p className="rise rise-2">
            写代码之余，也写一点想法。
          </p>
        </div>
      </section>

      <section className="kit-section" style={{ paddingTop: 36 }}>
        <div className="kit-container">
          <WritingList posts={posts} />
        </div>
      </section>
    </>
  );
}
