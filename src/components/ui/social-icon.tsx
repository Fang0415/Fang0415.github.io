'use client';

import { useState } from 'react';

export interface SocialIconItem {
  id: string;
  label: string;
  icon: string;
  href?: string;
}

interface Props {
  items: SocialIconItem[];
}

export default function SocialIcon({ items }: Props) {
  const [activeId, setActiveId] = useState<string | null>(null);

  return (
    <div className="social-icon-list" aria-label="Social profiles">
      {items.map((item) => {
        const isActive = activeId === item.id;
        const className = `social-icon-button${isActive ? ' is-active' : ''}${item.href ? '' : ' is-unset'}`;
        const contents = (
          <>
            <img src={item.icon} alt="" />
            <span className="social-icon-label">{item.label}</span>
            <span className="social-icon-tooltip" role="tooltip">
              {item.href ? item.label : `${item.label} · Not linked`}
            </span>
          </>
        );

        return item.href ? (
          <a
            className={className}
            href={item.href}
            key={item.id}
            target="_blank"
            rel="noreferrer"
            aria-label={item.label}
            onClick={() => setActiveId(isActive ? null : item.id)}
          >
            {contents}
          </a>
        ) : (
          <button
            className={className}
            key={item.id}
            type="button"
            aria-label={`${item.label}, not linked`}
            aria-pressed={isActive}
            onClick={() => setActiveId(isActive ? null : item.id)}
          >
            {contents}
          </button>
        );
      })}
    </div>
  );
}
