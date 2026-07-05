import type { Metadata } from 'next';
import WritingList from '../../components/WritingList';
import { getPublishedPostMetas } from '../../lib/managed-content';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: '文章',
  description: '关于后端系统、RAG 和开发工具链的实践笔记。',
};

export default async function BlogPage() {
  const posts = await getPublishedPostMetas();

  return (
    <>
      <section className="page-head">
        <div className="kit-container">
          <h1 className="rise">文章</h1>
          <p className="rise rise-2">
            这里记录后端系统、RAG 和开发工具链相关的实践笔记。
            写作是为了把问题想清楚，也让学到的东西之后还能复用。
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
