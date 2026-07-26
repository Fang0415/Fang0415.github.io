import type { Metadata } from 'next';
import WritingList from '../../components/WritingList';
import { getPublishedPostMetas } from '../../lib/managed-content';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: '文章',
  description: 'Fang 关于后端、AI 应用开发和 RAG 的学习与开发笔记。',
};

export default async function BlogPage() {
  const posts = await getPublishedPostMetas();

  return (
    <>
      <section className="page-head">
        <div className="kit-container">
          <h1 className="rise">文章</h1>
          <p className="rise rise-2">
            开发时遇到的问题、读源码时记下的细节，还有一些没有标准答案的取舍，
            都会写在这里。希望这些记录不只对未来的我有用。
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
