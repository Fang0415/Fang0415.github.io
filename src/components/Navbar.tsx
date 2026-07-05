'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Button from './Button';
import FolioIcon from './FolioIcon';
import { PROFILE, NAV_LINKS } from '../lib/site';

export default function Navbar() {
  const path = usePathname() || '/';
  const isHome = path === '/';
  const isActive = (href: string) => href === '/' ? isHome : path.startsWith(href);

  useEffect(() => {
    const onScroll = () => {
      const collapsed = !isHome || window.scrollY > 16;
      document.body.classList.toggle('nav-scrolled', collapsed);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [isHome]);

  return (
    <nav className="folio-nav" data-home={isHome ? 'true' : 'false'}>
      <div className="folio-nav__inner">
        <a className="folio-nav__brand" href="/">
          <span className="folio-nav__mark">{PROFILE.mark}</span>{PROFILE.wordmark}
        </a>
        <div className="folio-nav__links">
          {NAV_LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
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
