import SocialRow from './SocialRow';
import { PROFILE, NAV_LINKS, type SiteProfileData } from '../lib/site';

export default function Footer({ profile = PROFILE }: { profile?: SiteProfileData }) {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-brand">
          <div className="mark">{profile.mark}</div>
          <div className="footer-tag">
            由 {profile.name} 维护和写作。这里保存工程笔记、项目复盘，以及围绕 AI 构建工具时学到的东西。
            站点仍在持续迭代。
          </div>
          <div style={{ marginTop: 18 }}><SocialRow size="sm" profile={profile} /></div>
        </div>
        <div className="footer-col">
          <h4>站点</h4>
          {NAV_LINKS.map((link) => <a key={link.href} href={link.href}>{link.label}</a>)}
        </div>
        <div className="footer-col">
          <h4>其他地方</h4>
          <a href={profile.github}>GitHub</a>
          <span>微信</span>
          <a href="/rss.xml">RSS 订阅</a>
          <a href={`mailto:${profile.email}`}>邮件</a>
        </div>
      </div>
      <div className="footer-base">
        <span>© {new Date().getFullYear()} {profile.name}</span>
        <span>认真维护 · 不放追踪脚本</span>
      </div>
    </footer>
  );
}
