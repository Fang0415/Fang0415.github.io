'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import FolioIcon from './FolioIcon';
import { SitePreferenceControls, useSitePreferences } from './SitePreferences';
import { PROFILE, NAV_LINKS, type SiteProfileData } from '../lib/site';

export default function MobileMenu({ profile = PROFILE }: { profile?: SiteProfileData }) {
  const pathname = usePathname();
  const { locale } = useSitePreferences();
  const currentPath = pathname.replace(/\/+$/, '') || '/';

  useEffect(() => {
    const menu = document.getElementById('cb-mobile-menu');
    const openBtn = document.getElementById('cb-menu-open');
    const closeBtn = document.getElementById('cb-menu-close');
    const open = () => {
      if (!menu) return;
      menu.hidden = false;
      menu.style.display = 'flex';
      document.body.style.overflow = 'hidden';
    };
    const close = () => {
      if (!menu) return;
      menu.hidden = true;
      menu.style.display = 'none';
      document.body.style.overflow = '';
    };

    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') close();
    };

    openBtn?.addEventListener('click', open);
    closeBtn?.addEventListener('click', close);
    document.addEventListener('keydown', onKey);
    const links = menu?.querySelectorAll('.cb-menu-link') ?? [];
    links.forEach((a) => a.addEventListener('click', close));

    return () => {
      openBtn?.removeEventListener('click', open);
      closeBtn?.removeEventListener('click', close);
      document.removeEventListener('keydown', onKey);
      links.forEach((a) => a.removeEventListener('click', close));
      document.body.style.overflow = '';
    };
  }, []);

  return (
    <div id="cb-mobile-menu" className="folio-mobilemenu" hidden>
      <div className="folio-mobilemenu__head">
        <Link className="folio-mobilemenu__brand" href="/">
          <img src="/assets/personal-brand/sunflower-mark.png" alt="" width="24" height="24" />
          {profile.wordmark}
        </Link>
        <div className="folio-mobilemenu__actions">
          <SitePreferenceControls mobile />
          <button className="folio-iconbtn folio-iconbtn--outline" id="cb-menu-close" aria-label={locale === 'zh' ? '关闭菜单' : 'Close menu'}>
            <FolioIcon name="x-close" className="icon" />
          </button>
        </div>
      </div>
      <div className="folio-mobilemenu__links">
        {NAV_LINKS.map((item) => {
          const targetPath = item.href.replace(/\/+$/, '') || '/';
          const active = currentPath === targetPath || currentPath.startsWith(`${targetPath}/`);
          return (
            <Link
              key={item.href}
              className={`cb-menu-link ${active ? 'is-active' : ''}`}
              href={item.href}
              aria-current={active ? 'page' : undefined}
            >
              {item.label[locale]}
            </Link>
          );
        })}
      </div>
      <div className="folio-mobilemenu__foot">
        {profile.github && <a href={profile.github}>GitHub</a>}
        {profile.email && <a href={`mailto:${profile.email}`}>{locale === 'zh' ? '邮件' : 'Email'}</a>}
        <a href="/rss.xml">RSS</a>
      </div>
    </div>
  );
}
