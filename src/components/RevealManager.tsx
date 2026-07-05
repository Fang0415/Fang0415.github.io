'use client';

import { useEffect } from 'react';

export default function RevealManager() {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    document.documentElement.classList.add('js-reveal');

    const reveals = document.querySelectorAll<HTMLElement>('.cb-reveal');
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-in');
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -8% 0px' }
    );
    reveals.forEach((el) => io.observe(el));

    requestAnimationFrame(() => {
      document.querySelectorAll('.cb-onload').forEach((el) => el.classList.add('is-in'));
    });

    const fallback = window.setTimeout(() => {
      document.querySelectorAll('.cb-reveal, .cb-onload').forEach((el) => el.classList.add('is-in'));
    }, 1600);

    return () => {
      window.clearTimeout(fallback);
      io.disconnect();
    };
  }, []);

  return null;
}
