import SocialRow from './SocialRow';
import { PROFILE, NAV_LINKS, type SiteProfileData } from '../lib/site';

export default function Footer({ profile = PROFILE }: { profile?: SiteProfileData }) {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-brand">
          <div className="mark">{profile.mark}</div>
          <div className="footer-tag">
            {profile.name} 的项目和技术笔记。边学边做，也尽量把每个问题讲明白。
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
          {profile.wechat && <a href={profile.wechat}>微信</a>}
          <a href="/rss.xml">RSS 订阅</a>
          {profile.email && <a href={`mailto:${profile.email}`}>邮件</a>}
        </div>
      </div>
      <div className="footer-base">
        <span>© {new Date().getFullYear()} {profile.name}</span>
        <span>慢慢更新 · 不放追踪脚本</span>
      </div>
    </footer>
  );
}
