'use client';

import Link from 'next/link';
import FolioIcon from './FolioIcon';
import { PROFILE, type SiteProfileData } from '../lib/site';

export default function Navbar({ profile = PROFILE }: { profile?: SiteProfileData }) {
  return (
    <nav className="folio-nav" aria-label="主导航">
      <div className="folio-nav__inner">
        <Link className="folio-nav__brand" href="/">
          <img src="/assets/personal-brand/sunflower-mark.png" alt="" width="24" height="24" />
          <span>{profile.wordmark}</span>
        </Link>
        <div className="folio-nav__links">
          <Link className="folio-nav__link" href="/#projects">
            Projects <img src="/assets/personal-brand/chevron.svg" alt="" />
          </Link>
          <Link className="folio-nav__link" href="/#experience">
            Experience <img src="/assets/personal-brand/chevron.svg" alt="" />
          </Link>
          <Link className="folio-nav__link" href="/#blog">Blog</Link>
          <span className="folio-nav__divider" aria-hidden="true" />
          <button className="folio-nav__theme" type="button" aria-label="外观设置">
            <img src="/assets/personal-brand/theme.svg" alt="" />
          </button>
          <a
            className="folio-nav__contact"
            href={profile.email ? `mailto:${profile.email}` : profile.github}
            target={!profile.email ? '_blank' : undefined}
            rel={!profile.email ? 'noreferrer' : undefined}
          >
            Contact
          </a>
        </div>
        <button className="folio-nav__menu" id="cb-menu-open" aria-label="打开菜单">
          <FolioIcon name="menu" className="icon" />
        </button>
      </div>
    </nav>
  );
}
