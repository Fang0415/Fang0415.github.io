'use client';

import { useEffect } from 'react';
import FolioIcon from './FolioIcon';
import { PROFILE, NAV_LINKS } from '../lib/site';

export default function MobileMenu() {
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

    openBtn?.addEventListener('click', open);
    closeBtn?.addEventListener('click', close);
    const links = menu?.querySelectorAll('.cb-menu-link') ?? [];
    links.forEach((a) => a.addEventListener('click', close));

    return () => {
      openBtn?.removeEventListener('click', open);
      closeBtn?.removeEventListener('click', close);
      links.forEach((a) => a.removeEventListener('click', close));
      document.body.style.overflow = '';
    };
  }, []);

  return (
    <div id="cb-mobile-menu" className="folio-mobilemenu" hidden>
      <div className="folio-mobilemenu__head">
        <span className="folio-mobilemenu__brand">
          <span className="folio-nav__mark" style={{ background: 'var(--text-primary)', color: '#fff' }}>{PROFILE.mark}</span>
          {PROFILE.wordmark}
        </span>
        <button className="folio-iconbtn folio-iconbtn--outline" id="cb-menu-close" aria-label="关闭">
          <FolioIcon name="x-close" className="icon" />
        </button>
      </div>
      <div className="folio-mobilemenu__links">
        {NAV_LINKS.map((l) => <a key={l.href} className="cb-menu-link" href={l.href}>{l.label}</a>)}
      </div>
      <div className="folio-mobilemenu__foot">
        <a href={PROFILE.github}>GitHub</a>
        <a href={`mailto:${PROFILE.email}`}>邮件</a>
        <a href="/rss.xml">RSS</a>
      </div>
    </div>
  );
}
