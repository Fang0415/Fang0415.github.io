import type { CSSProperties } from 'react';
import FeaturedShowcase from '../components/FeaturedShowcase';
import PostCard from '../components/PostCard';
import Card from '../components/Card';
import Avatar from '../components/Avatar';
import Button from '../components/Button';
import SocialRow from '../components/SocialRow';
import FolioIcon from '../components/FolioIcon';
import ExperienceSummary from '../components/ExperienceSummary';
import { PROFILE } from '../lib/site';
import { getPublishedPostMetas, getVisibleProjects } from '../lib/managed-content';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const [latest, projects] = await Promise.all([
    getPublishedPostMetas(),
    getVisibleProjects(),
  ]);

  return (
    <>
      <section className="hero hero--feature">
        <div className="hero-banner hero-banner--lineart rise">
          <img className="hero-banner-img" src="/assets/hero-lineart.png" alt="夏日下午向日葵田的黑白线稿" />
          <div className="kit-container hero-banner-inner">
            <p className="hero-eyebrow hero-eyebrow--on-image">
              <span className="hero-dot"></span>
              {PROFILE.role} <span className="loc">· {PROFILE.location}</span>
            </p>
            <h1>我在构建<em>{PROFILE.hero}</em>。</h1>
          </div>
        </div>
        <div className="kit-container hero-sub rise rise-2">
          <p className="hero-lead">{PROFILE.lead}</p>
          <div className="hero-actions">
            <Button variant="primary" href="/projects/" iconRight={<FolioIcon name="arrow-right" className="icon" />}>
              看看项目
            </Button>
            <Button variant="secondary" href="/blog/">阅读文章</Button>
          </div>
          <div className="hero-foot">
            <SocialRow />
            <p className="hero-now">
              <span className="hero-now-dot"></span>
              近况 · 正在打磨 <strong>ragkit</strong> · 整理后端工程笔记
            </p>
          </div>
        </div>
      </section>

      <FeaturedShowcase projects={projects} />

      <section className="kit-section kit-section--tight">
        <div className="kit-container">
          <ExperienceSummary />
        </div>
      </section>

      <section className="kit-section kit-section--tight" style={{ background: 'var(--bg-soft)' }}>
        <div className="kit-container">
          <div className="sec-head">
            <div>
              <p className="sec-eyebrow">笔记</p>
              <h2 className="sec-title">最新文章</h2>
            </div>
            <a className="sec-link" href="/blog/">全部文章 <FolioIcon name="arrow-right" className="icon" /></a>
          </div>
          <div className="grid-3">
            {latest.slice(0, 3).map((post, i) => (
              <div key={post.href} className="cb-reveal" style={{ '--reveal-delay': `${i * 100}ms` } as CSSProperties}>
                <PostCard
                  layout="card"
                  title={post.title}
                  excerpt={post.excerpt}
                  date={post.date}
                  readingTime={post.readTime}
                  category={post.category}
                  href={post.href}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="kit-section">
        <div className="kit-container">
          <Card padLg className="cb-reveal about-preview">
            <Avatar name={PROFILE.name} size="xl" />
            <div>
              <p className="sec-eyebrow" style={{ marginBottom: 8 }}>关于</p>
              <p style={{ fontSize: 'var(--fs-h3)', fontWeight: 600, lineHeight: 1.5, margin: 0, letterSpacing: '-0.01em', maxWidth: '32em' }}>
                我是 {PROFILE.name}，关注后端工程、RAG 和开发工具链。
                最近主要在做检索系统、评估流程，以及那些让 AI 功能真正可靠的基础设施。
              </p>
            </div>
            <Button variant="ghost" href="/about/" iconRight={<FolioIcon name="arrow-right" className="icon" />}>
              了解更多
            </Button>
          </Card>
        </div>
      </section>
    </>
  );
}
