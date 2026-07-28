import type { Metadata, Viewport } from 'next';
import type { ReactNode } from 'react';
import Navbar from '../components/Navbar';
import MobileMenu from '../components/MobileMenu';
import Footer from '../components/Footer';
import RevealManager from '../components/RevealManager';
import ViewTransitions from '../components/ViewTransitions';
import { PROFILE } from '../lib/site';
import { getSiteProfile } from '../lib/managed-content';
import { SITE_URL } from '../lib/site-url';
import './globals.css';

const DESCRIPTION = 'Fang 的项目与技术笔记，主要关于后端、AI 应用开发和 RAG。';

export const metadata: Metadata = {
  // metadataBase is what turns the relative image paths below into absolute
  // URLs; without it Open Graph previews silently fall back to no image.
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${PROFILE.wordmark} — ${PROFILE.role}`,
    template: `%s — ${PROFILE.wordmark}`,
  },
  description: DESCRIPTION,
  applicationName: PROFILE.wordmark,
  authors: [{ name: PROFILE.name }],
  keywords: ['全栈开发', '后端开发', 'AI 应用开发', 'RAG', '技术博客', PROFILE.name],
  alternates: {
    canonical: '/',
    types: { 'application/rss+xml': '/rss.xml' },
  },
  openGraph: {
    type: 'website',
    locale: 'zh_CN',
    siteName: PROFILE.wordmark,
    title: `${PROFILE.wordmark} — ${PROFILE.role}`,
    description: DESCRIPTION,
    url: '/',
    images: [{ url: '/assets/hero-sunflower.jpg', width: 1200, height: 630, alt: PROFILE.wordmark }],
  },
  twitter: {
    card: 'summary_large_image',
    title: `${PROFILE.wordmark} — ${PROFILE.role}`,
    description: DESCRIPTION,
    images: ['/assets/hero-sunflower.jpg'],
  },
  robots: { index: true, follow: true },
};

// `viewport-fit=cover` lets the mobile menu use env(safe-area-inset-*).
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: '#ffffff',
};

export default async function RootLayout({ children }: { children: ReactNode }) {
  const profile = await getSiteProfile();

  return (
    <html lang="zh-CN">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Caveat:wght@500;600&family=Nunito:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap"
        />
        <link rel="stylesheet" href="/katex/katex.min.css" />
        <link rel="stylesheet" href="/highlight.js/styles/github.min.css" />
      </head>
      <body>
        <Navbar profile={profile} />
        <MobileMenu profile={profile} />
        <main>{children}</main>
        <Footer profile={profile} />
        <RevealManager />
        <ViewTransitions />
      </body>
    </html>
  );
}
