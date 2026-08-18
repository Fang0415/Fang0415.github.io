'use client';

import Link from 'next/link';
import { PROFILE, type SiteProfileData } from '../lib/site';
import { useSitePreferences } from './SitePreferences';

export default function Footer({ profile = PROFILE }: { profile?: SiteProfileData }) {
  const { locale } = useSitePreferences();
  const zh = locale === 'zh';

  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-top">
          <div className="footer-brand">
            <div className="footer-brand__name">
              <img src="/assets/personal-brand/sunflower-mark.png" alt="" width="24" height="24" />
              <strong>{profile.wordmark}</strong>
            </div>
            <p>{zh ? '学生与全栈开发者，关注后端系统、AI 应用、RAG，以及把产品完整交付的工程实践。' : 'Student and full-stack developer focused on backend systems, AI applications, RAG, and the craft of shipping complete products.'}</p>
          </div>
          <div className="footer-col">
            <h3>{zh ? '探索方向' : 'Computer Brain'}</h3>
            <Link href="/#experience">{zh ? '个人介绍' : 'Profile'}</Link>
            <Link href="/projects/">{zh ? '项目' : 'Projects'}</Link>
            <Link href="/skills/">{zh ? '技能仓库' : 'Skills'}</Link>
            <Link href="/blog/">{zh ? '博客' : 'Writing'}</Link>
          </div>
          <div className="footer-col">
            <h3>{zh ? '站点' : 'Site'}</h3>
            <Link href="/projects/">{zh ? '全部项目' : 'All work'}</Link>
            <Link href="/blog/">{zh ? '全部文章' : 'All posts'}</Link>
            <a href={profile.github} target="_blank" rel="noreferrer">GitHub</a>
          </div>
        </div>

        <div className="footer-newsletter">
          <div>
            <h3>{zh ? '开发笔记' : 'Notes from the work'}</h3>
            <p>{zh ? '不定期记录项目、工程取舍，以及仍在学习的内容。' : 'Occasional writing about projects, engineering trade-offs, and things I am still learning.'}</p>
          </div>
          <form action="/rss.xml">
            <div><input type="email" aria-label={zh ? '邮箱' : 'Email'} placeholder={zh ? '输入你的邮箱' : 'Enter your email'} /><button aria-label={zh ? '订阅' : 'Subscribe'}>→</button></div>
            <p>{zh ? '不打扰，只发送新项目和有用的笔记。' : 'No noise. Just new work and useful notes.'}</p>
          </form>
        </div>

        <div className="footer-base">
          <span>© {new Date().getFullYear()} {profile.name}. {zh ? '独立设计与开发。' : 'Built by hand.'}</span>
        </div>
      </div>
    </footer>
  );
}
