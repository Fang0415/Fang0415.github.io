import SocialRow from './SocialRow';
import { PROFILE } from '../lib/site';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-brand">
          <div className="mark">{PROFILE.mark}</div>
          <div className="footer-tag">
            由 {PROFILE.name} 维护和写作。这里保存工程笔记、项目复盘，以及围绕 AI 构建工具时学到的东西。
            站点仍在持续迭代。
          </div>
          <div style={{ marginTop: 18 }}><SocialRow size="sm" /></div>
        </div>
        <div className="footer-col">
          <h4>站点</h4>
          <a href="/">首页</a>
          <a href="/projects/">项目</a>
          <a href="/blog/">文章</a>
          <a href="/about/">关于</a>
        </div>
        <div className="footer-col">
          <h4>其他地方</h4>
          <a href={PROFILE.github}>GitHub</a>
          <a href={PROFILE.x}>X / Twitter</a>
          <a href="/rss.xml">RSS 订阅</a>
          <a href={`mailto:${PROFILE.email}`}>邮件</a>
        </div>
      </div>
      <div className="footer-base">
        <span>© 2026 {PROFILE.name}</span>
        <span>认真维护 · 不放追踪脚本</span>
      </div>
    </footer>
  );
}
