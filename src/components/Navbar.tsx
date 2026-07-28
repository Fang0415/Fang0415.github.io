'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Button from './Button';
import FolioIcon from './FolioIcon';
import { PROFILE, NAV_LINKS, type SiteProfileData } from '../lib/site';

export default function Navbar({ profile = PROFILE }: { profile?: SiteProfileData }) {
  const path = usePathname() || '/';
  const isActive = (href: string) => (href === '/' ? path === '/' : path.startsWith(href));

  return (
    <nav className="folio-nav">
      <div className="folio-nav__inner">
        <Link className="folio-nav__brand" href="/">
          <span className="folio-nav__mark">{profile.mark}</span>{profile.wordmark}
        </Link>
        <div className="folio-nav__links">
          {NAV_LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              aria-current={isActive(l.href) ? 'page' : undefined}
              className={`folio-nav__link ${isActive(l.href) ? 'folio-nav__link--active' : ''}`.trim()}
            >
              {l.label}
            </Link>
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
