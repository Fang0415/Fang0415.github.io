'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import FolioIcon from './FolioIcon';
import { PROFILE, NAV_LINKS, type SiteProfileData } from '../lib/site';

export default function MobileMenu({ profile = PROFILE }: { profile?: SiteProfileData }) {
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
        <span className="folio-mobilemenu__brand">
          <span className="folio-nav__mark" style={{ background: 'var(--text-primary)', color: '#fff' }}>{profile.mark}</span>
          {profile.wordmark}
        </span>
        <button className="folio-iconbtn folio-iconbtn--outline" id="cb-menu-close" aria-label="关闭">
          <FolioIcon name="x-close" className="icon" />
        </button>
      </div>
      <div className="folio-mobilemenu__links">
        {NAV_LINKS.map((l) => <Link key={l.href} className="cb-menu-link" href={l.href}>{l.label}</Link>)}
      </div>
      <div className="folio-mobilemenu__foot">
        {profile.github && <a href={profile.github}>GitHub</a>}
        {profile.email && <a href={`mailto:${profile.email}`}>邮件</a>}
        <a href="/rss.xml">RSS</a>
      </div>
    </div>
  );
}
