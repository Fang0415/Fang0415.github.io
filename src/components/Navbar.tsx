'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import FolioIcon from './FolioIcon';
import { SitePreferenceControls, useSitePreferences } from './SitePreferences';
import { NAV_LINKS, PROFILE, type SiteProfileData } from '../lib/site';

export default function Navbar({ profile = PROFILE }: { profile?: SiteProfileData }) {
  const pathname = usePathname();
  const { locale } = useSitePreferences();
  const currentPath = pathname.replace(/\/+$/, '') || '/';

  return (
    <nav className="folio-nav" aria-label={locale === 'zh' ? '主导航' : 'Main navigation'}>
      <div className="folio-nav__inner">
        <Link className="folio-nav__brand" href="/">
          <img src="/assets/personal-brand/sunflower-mark.png" alt="" width="24" height="24" />
          <span>{profile.wordmark}</span>
        </Link>
        <div className="folio-nav__links">
          {NAV_LINKS.map((item) => {
            const targetPath = item.href.replace(/\/+$/, '') || '/';
            const active = currentPath === targetPath || currentPath.startsWith(`${targetPath}/`);
            return (
              <Link
                className={`folio-nav__link ${active ? 'folio-nav__link--active' : ''}`}
                href={item.href}
                key={item.href}
                aria-current={active ? 'page' : undefined}
              >
                {item.label[locale]}
              </Link>
            );
          })}
          <SitePreferenceControls />
          <a
            className="folio-nav__contact"
            href={profile.email ? `mailto:${profile.email}` : profile.github}
            target={!profile.email ? '_blank' : undefined}
            rel={!profile.email ? 'noreferrer' : undefined}
          >
            {locale === 'zh' ? '联系' : 'Contact'}
          </a>
        </div>
        <button className="folio-nav__menu" id="cb-menu-open" aria-label={locale === 'zh' ? '打开菜单' : 'Open menu'}>
          <FolioIcon name="menu" className="icon" />
        </button>
      </div>
    </nav>
  );
}
