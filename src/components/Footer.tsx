import Link from 'next/link';
import { PROFILE, type SiteProfileData } from '../lib/site';

export default function Footer({ profile = PROFILE }: { profile?: SiteProfileData }) {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-top">
          <div className="footer-brand">
            <div className="footer-brand__name">
              <img src="/assets/personal-brand/sunflower-mark.png" alt="" width="24" height="24" />
              <strong>{profile.wordmark}</strong>
            </div>
            <p>Student and full-stack developer focused on backend systems, AI applications, RAG, and the craft of shipping complete products.</p>
          </div>
          <div className="footer-col">
            <h3>Computer Brain</h3>
            <Link href="/#experience">Voice Synthesis</Link>
            <Link href="/projects/">Projects</Link>
            <Link href="/#experience">Experience</Link>
            <Link href="/about/">Now</Link>
          </div>
          <div className="footer-col">
            <h3>Company</h3>
            <Link href="/about/">About Us</Link>
            <Link href="/about/">About</Link>
            <Link href="/blog/">Blog</Link>
            <a href={profile.github} target="_blank" rel="noreferrer">GitHub</a>
          </div>
        </div>

        <div className="footer-newsletter">
          <div>
            <h3>Notes from the work</h3>
            <p>Occasional writing about projects, engineering trade-offs, and things I am still learning.</p>
          </div>
          <form action="/rss.xml">
            <div><input type="email" aria-label="Email" placeholder="Enter your email" /><button aria-label="Subscribe">→</button></div>
            <p>No noise. Just new work and useful notes.</p>
          </form>
        </div>

        <div className="footer-base">
          <span>© {new Date().getFullYear()} {profile.name}. Built by hand.</span>
          <span><Link href="/about/">Terms</Link><Link href="/about/">Privacy</Link><Link href="/about/">Cookies</Link></span>
        </div>
      </div>
    </footer>
  );
}
