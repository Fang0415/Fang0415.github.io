import type { Metadata } from 'next';
import Avatar from '../../components/Avatar';
import Card from '../../components/Card';
import Tag from '../../components/Tag';
import Button from '../../components/Button';
import SocialRow from '../../components/SocialRow';
import FolioIcon from '../../components/FolioIcon';
import { PROFILE } from '../../lib/site';

export const metadata: Metadata = {
  title: '关于',
  description: '关于我：关注 RAG、后端工程和 AI 基础设施。',
};

const focus = [
  { label: 'RAG 与检索', note: '切分、混合检索、评估' },
  { label: '后端系统', note: 'Postgres、队列、可观测性' },
  { label: '开发工具链', note: '小而明确的命令行工具' },
];
const tools = ['Python', 'Go', 'Rust', 'Postgres', 'pgvector', 'FastAPI', 'DuckDB', 'Neovim', 'Linux'];
const now = [
  '围绕更清晰的评估流程重构 ragkit。',
  '在读向量索引内部实现相关内容，包括 HNSW 和 IVF。',
  '尽量保持每周写一篇技术笔记的节奏。',
];
const background: [string, string][] = [
  ['现在', '后端 / AI 基础设施，构建检索系统'],
  ['之前', '平台工程与数据工程相关工作'],
  ['写作', 'RAG、Postgres、评估和开发工作流'],
  ['屏幕外', '机械键盘、长跑和不太稳定的咖啡品味'],
];

export default function AboutPage() {
  return (
    <>
      <section style={{ paddingTop: 28 }}>
        <div className="kit-container">
          <div className="about-cover rise">
            <img src="/assets/hero-sunflower.jpg" alt="夏日下午的向日葵田" />
          </div>
          <div className="about-intro rise rise-2">
            <Avatar name={PROFILE.name} size={96} />
            <div>
              <h1>关于我</h1>
              <p>{PROFILE.role} · 常驻 {PROFILE.location}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="kit-section" style={{ paddingTop: 40 }}>
        <div className="kit-container about-grid">
          <aside className="about-aside">
            <div className="sec-eyebrow" style={{ marginBottom: 12 }}>联系我</div>
            <SocialRow size="md" />
            <div style={{ marginTop: 20 }}>
              <Button variant="secondary" size="sm" href={`mailto:${PROFILE.email}`} iconLeft={<FolioIcon name="mail" className="icon" />}>
                发邮件
              </Button>
            </div>
          </aside>

          <div>
            <div className="about-block">
              <div className="prose" style={{ fontSize: 'var(--fs-body-lg)' }}>
                <p>
                  我是 {PROFILE.name}，一个长期关注后端系统的开发者，后来逐渐把注意力放到了 AI 基础设施上。
                  很多工作发生在技术栈中间那些不显眼的位置：检索管线、队列、评估流程，以及决定 AI 功能到底可靠还是只适合演示的基础设施。
                </p>
                <p>
                  我喜欢<strong>小而锋利的工具</strong>，也习惯把问题写下来。
                  这个站点用来保存实践中的判断和笔记，首先方便我自己复用，也希望对遇到类似问题的人有帮助。
                </p>
              </div>
            </div>

            <div className="about-block">
              <h2>关注方向</h2>
              <div className="grid-3">
                {focus.map((f) => (
                  <Card key={f.label} soft>
                    <div style={{ fontWeight: 700, marginBottom: 6 }}>{f.label}</div>
                    <div style={{ fontSize: 'var(--fs-body-sm)', color: 'var(--text-secondary)', lineHeight: 1.55 }}>{f.note}</div>
                  </Card>
                ))}
              </div>
            </div>

            <div className="about-block">
              <h2>最近在做</h2>
              <ul className="prose" style={{ fontSize: 'var(--fs-body)', paddingLeft: '1.1em' }}>
                {now.map((n) => <li key={n}>{n}</li>)}
              </ul>
            </div>

            <div className="about-block">
              <h2>常用工具</h2>
              <div className="tool-grid">
                {tools.map((t) => <Tag key={t}>{t}</Tag>)}
              </div>
            </div>

            <div className="about-block">
              <h2>一些背景</h2>
              <div className="kv">
                {background.map(([k, v]) => (
                  <div key={k} className="kv-row"><span className="k">{k}</span><span className="v">{v}</span></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
