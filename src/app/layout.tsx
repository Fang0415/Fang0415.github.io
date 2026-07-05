import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import Navbar from '../components/Navbar';
import MobileMenu from '../components/MobileMenu';
import Footer from '../components/Footer';
import RevealManager from '../components/RevealManager';
import { PROFILE } from '../lib/site';

export const metadata: Metadata = {
  metadataBase: process.env.SITE_URL ? new URL(process.env.SITE_URL) : undefined,
  title: {
    default: PROFILE.wordmark,
    template: `%s — ${PROFILE.wordmark}`,
  },
  description: '一个记录后端系统、RAG 和 AI 工程基础设施实践的中文技术博客。',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="zh-CN">
      <head>
        <link rel="stylesheet" href="/styles/global.css" />
      </head>
      <body>
        <Navbar />
        <MobileMenu />
        <main>{children}</main>
        <Footer />
        <RevealManager />
      </body>
    </html>
  );
}
