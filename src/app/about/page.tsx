import type { Metadata } from 'next';
import Avatar from '../../components/Avatar';
import Card from '../../components/Card';
import Tag from '../../components/Tag';
import Button from '../../components/Button';
import SocialRow from '../../components/SocialRow';
import FolioIcon from '../../components/FolioIcon';
import ExperienceSummary from '../../components/ExperienceSummary';
import { getSiteProfile, getVisibleExperiences } from '../../lib/managed-content';
import { splitPair } from '../../lib/site';
import { markdownToHtml } from '../../lib/posts';

export const metadata: Metadata = {
  title: '关于',
  description: '关于我：关注 RAG、后端工程和 AI 基础设施。',
};

export const dynamic = 'force-dynamic';

export default async function AboutPage() {
  const [profile, experiences] = await Promise.all([getSiteProfile(), getVisibleExperiences()]);
  const focus = profile.focus.map(splitPair);
  const background = profile.background.map(splitPair);

  return (
    <>
      <section style={{ paddingTop: 28 }}>
        <div className="kit-container">
          <div className="about-cover rise">
            <img src="/assets/hero-sunflower.jpg" alt="夏日下午的向日葵田" />
          </div>
          <div className="about-intro rise rise-2">
            <Avatar name={profile.name} size={96} />
            <div className="about-intro__text">
              <h1>关于我</h1>
              <p>{profile.role} · 常驻 {profile.location}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="kit-section" style={{ paddingTop: 40 }}>
        <div className="kit-container about-grid">
          <aside className="about-aside">
            <div className="sec-eyebrow">联系我</div>
            <SocialRow size="md" profile={profile} />
            <Button variant="secondary" size="sm" href={`mailto:${profile.email}`} iconLeft={<FolioIcon name="mail" className="icon" />}>
              发邮件
            </Button>
          </aside>

          <div>
            <div className="about-block">
              {/* Markdown so the console can add emphasis or a link without a deploy. */}
              <div
                className="prose"
                style={{ fontSize: 'var(--fs-body-lg)' }}
                dangerouslySetInnerHTML={{ __html: markdownToHtml(profile.aboutIntro) }}
              />
            </div>

            {focus.length > 0 && (
              <div className="about-block">
                <h2>关注方向</h2>
                <div className="grid-3">
                  {focus.map(([label, note]) => (
                    <Card key={label} soft>
                      <div style={{ fontWeight: 700, marginBottom: 6 }}>{label}</div>
                      <div style={{ fontSize: 'var(--fs-body-sm)', color: 'var(--text-secondary)', lineHeight: 1.55 }}>{note}</div>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {profile.now.length > 0 && (
              <div className="about-block">
                <h2>最近在做</h2>
                <ul className="prose" style={{ fontSize: 'var(--fs-body)', paddingLeft: '1.1em' }}>
                  {profile.now.map((item) => <li key={item}>{item}</li>)}
                </ul>
              </div>
            )}

            <div className="about-block">
              <h2>实践经历</h2>
              <ExperienceSummary items={experiences} showHeader={false} compact />
            </div>

            {profile.tools.length > 0 && (
              <div className="about-block">
                <h2>常用工具</h2>
                <div className="tool-grid">
                  {profile.tools.map((tool) => <Tag key={tool}>{tool}</Tag>)}
                </div>
              </div>
            )}

            {background.length > 0 && (
              <div className="about-block">
                <h2>一些背景</h2>
                <div className="kv">
                  {background.map(([key, value]) => (
                    <div key={key} className="kv-row"><span className="k">{key}</span><span className="v">{value}</span></div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
