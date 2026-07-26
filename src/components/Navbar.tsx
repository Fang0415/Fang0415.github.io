'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Button from './Button';
import FolioIcon from './FolioIcon';
import { PROFILE, NAV_LINKS, type SiteProfileData } from '../lib/site';

export default function Navbar({ profile = PROFILE }: { profile?: SiteProfileData }) {
  const path = usePathname() || '/';
  const isHome = path === '/';
  const isActive = (href: string) => href === '/' ? isHome : path.startsWith(href);

  // Only the home page has a state to track: elsewhere the nav is always the
  // solid pill, and the CSS keys that off data-home so it is right on the first
  // paint instead of waiting for this effect.
  useEffect(() => {
    if (!isHome) {
      document.body.classList.remove('nav-scrolled');
      return;
    }
    const onScroll = () => {
      document.body.classList.toggle('nav-scrolled', window.scrollY > 16);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [isHome]);

  return (
    <nav className="folio-nav" data-home={isHome ? 'true' : 'false'}>
      <div className="folio-nav__inner">
        <a className="folio-nav__brand" href="/">
          <span className="folio-nav__mark">{profile.mark}</span>{profile.wordmark}
        </a>
        <div className="folio-nav__links">
          {NAV_LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              aria-current={isActive(l.href) ? 'page' : undefined}
              className={`folio-nav__link ${isActive(l.href) ? 'folio-nav__link--active' : ''}`.trim()}
            >
              {l.label}
            </a>
          ))}
        </div>
        <div className="folio-nav__right">
          <Button size="sm" variant="primary" href="/rss.xml" iconLeft={<FolioIcon name="rss" className="icon" />}>
            订阅
          </Button>
          <button className="folio-nav__menu" id="cb-menu-open" aria-label="菜单">
            <FolioIcon name="menu" className="icon" />
          </button>
        </div>
      </div>
    </nav>
  );
}
