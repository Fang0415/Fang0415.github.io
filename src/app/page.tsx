import type { CSSProperties } from 'react';
import Link from 'next/link';
import FeaturedShowcase from '../components/FeaturedShowcase';
import PostCard from '../components/PostCard';
import Card from '../components/Card';
import Avatar from '../components/Avatar';
import Button from '../components/Button';
import SocialRow from '../components/SocialRow';
import FolioIcon from '../components/FolioIcon';
import ExperienceSummary from '../components/ExperienceSummary';
import { getPublishedPostMetas, getSiteProfile, getVisibleExperiences, getVisibleProjects } from '../lib/managed-content';

export const dynamic = 'force-dynamic';

function renderHeroQuote(text: string) {
  return text.split(/\b(don't know|digging)\b/gi).map((part, index) =>
    /^(don't know|digging)$/i.test(part)
      ? <em key={`${part}-${index}`}>{part}</em>
      : part
  );
}

export default async function HomePage() {
  const [latest, projects, experiences, profile] = await Promise.all([
    getPublishedPostMetas(),
    getVisibleProjects(),
    getVisibleExperiences(),
    getSiteProfile(),
  ]);

  return (
    <>
      <section className="hero hero--feature">
        <div className="hero-banner hero-banner--color rise">
          <div className="hero-banner__frame">
            <img className="hero-banner-img img-fade" src="/assets/hero-sunflower.jpg" alt="夏日下午的向日葵田" />
            <div className="hero-banner-inner">
              <h1 className="hero-quote">{renderHeroQuote(profile.hero)}</h1>
            </div>
          </div>
        </div>
        <div className="kit-container hero-sub rise rise-2">
          <p className="hero-lead">{profile.lead}</p>
          <div className="hero-actions">
            <Button variant="primary" href="/projects/" iconRight={<FolioIcon name="arrow-right" className="icon" />}>
              看项目
            </Button>
            <Button variant="secondary" href="/blog/">读文章</Button>
          </div>
          <div className="hero-foot">
            <SocialRow profile={profile} />
            {profile.now[0] && (
              <p className="hero-now">
                <span className="hero-now-dot"></span>
                最近 · {profile.now[0]}
              </p>
            )}
          </div>
        </div>
      </section>

      <FeaturedShowcase projects={projects} />

      <section className="kit-section kit-section--tight">
        <div className="kit-container">
          <ExperienceSummary items={experiences} />
        </div>
      </section>

      <section className="kit-section kit-section--tight" style={{ background: 'var(--bg-soft)' }}>
        <div className="kit-container">
          <div className="sec-head">
            <div>
              <p className="sec-eyebrow">写作</p>
              <h2 className="sec-title">最近写的文章</h2>
            </div>
            <Link className="sec-link" href="/blog/">全部文章 <FolioIcon name="arrow-right" className="icon" /></Link>
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
                  coverUrl={post.coverUrl}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="kit-section">
        <div className="kit-container">
          <Card padLg soft className="cb-reveal about-preview">
            <Avatar name={profile.name} size="xl" />
            <div>
              <p className="sec-eyebrow" style={{ marginBottom: 10 }}>关于</p>
              <p className="about-preview__line">
                我是 {profile.name}，学生和全栈开发者，最近在学后端和 AI 应用。
                这里放项目，也放笔记。
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
