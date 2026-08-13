import SocialIcon from './ui/social-icon';

interface Props {
  name: string;
  intro: string;
  avatarUrl?: string;
  email?: string;
  github?: string;
  wechat?: string;
  qq?: string;
  reddit?: string;
  twitter?: string;
}

const SIMPLE_ICONS = 'https://cdn.simpleicons.org';

const contactPlatforms = [
  { key: 'github', label: 'GitHub', icon: `${SIMPLE_ICONS}/github/181717` },
  { key: 'wechat', label: 'WeChat', icon: `${SIMPLE_ICONS}/wechat/07C160` },
  { key: 'qq', label: 'QQ', icon: `${SIMPLE_ICONS}/qq/1EBAFC` },
  { key: 'reddit', label: 'Reddit', icon: `${SIMPLE_ICONS}/reddit/FF4500` },
  { key: 'twitter', label: 'Twitter / X', icon: `${SIMPLE_ICONS}/x/111111` },
  { key: 'email', label: 'Email', icon: `${SIMPLE_ICONS}/gmail/EA4335` },
] as const;

export default function HomeAboutOrbit({
  name,
  avatarUrl,
  email,
  github,
  wechat,
  qq,
  reddit,
  twitter,
}: Props) {
  const hrefs = { github, wechat, qq, reddit, twitter, email };
  const socialItems = contactPlatforms.map((contact) => ({
    id: contact.key,
    label: contact.label,
    icon: contact.icon,
    href: contact.key === 'email'
      ? (email ? `mailto:${email}` : undefined)
      : (hrefs[contact.key]?.startsWith('http') ? hrefs[contact.key] : undefined),
  }));

  return (
    <section className="brand-about" id="experience" aria-labelledby="brand-profile-title">
      <div className="brand-about__shell">
        <div className="brand-about__inner">
          <article className="brand-about__profile cb-reveal">
            <header className="brand-about__headline">
              <h2 id="brand-profile-title">I&apos;m {name}</h2>
            </header>

            <div className="brand-about__biography">
              <p>
                A student exploring how backend engineering and AI agents can become reliable,
                useful products. I enjoy taking an idea from a rough prototype to a complete
                system—designing APIs, connecting data and retrieval workflows, evaluating model
                behavior, and writing down the decisions that make the result easier to understand
                and maintain.
              </p>
            </div>

            <div className="brand-about__contacts">
              <h3>Find me online</h3>
              <SocialIcon items={socialItems} />
            </div>
          </article>

          <figure className="brand-about__portrait cb-reveal" style={{ '--reveal-delay': '80ms' } as React.CSSProperties}>
            <img
              src={avatarUrl || '/assets/personal-brand/profile-work.png'}
              alt={`${name} portrait placeholder`}
            />
          </figure>

          <aside className="brand-about__traits cb-reveal" aria-label="Personal traits" style={{ '--reveal-delay': '140ms' } as React.CSSProperties}>
            <h3>Main directions</h3>
            <ol className="brand-about__direction-list">
              <li className="brand-about__direction">
                <span>01</span>
                <strong>Backend Systems</strong>
                <p>APIs, data flows, and services designed for clarity and reliability.</p>
              </li>
              <li className="brand-about__direction">
                <span>02</span>
                <strong>Agent Research</strong>
                <p>Tool use, memory, evaluation, and dependable agent handoffs.</p>
              </li>
              <li className="brand-about__direction">
                <span>03</span>
                <strong>Applied AI</strong>
                <p>RAG, retrieval quality, and experiments that can survive real use.</p>
              </li>
            </ol>
          </aside>
        </div>
      </div>

    </section>
  );
}
