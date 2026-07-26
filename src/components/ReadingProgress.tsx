'use client';

import { useEffect, useRef } from 'react';

/**
 * A 2px gold hairline under the nav showing how far into the article you are.
 * Written straight to the DOM through a ref: a React state update per scroll
 * frame would re-render the whole article for a width change.
 */
export default function ReadingProgress() {
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let raf = 0;

    const update = () => {
      raf = 0;
      const bar = barRef.current;
      if (!bar) return;
      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      const ratio = scrollable > 0 ? window.scrollY / scrollable : 0;
      bar.style.width = `${Math.min(Math.max(ratio, 0), 1) * 100}%`;
    };

    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };

    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  return (
    <div className="read-progress" aria-hidden="true">
      <div className="read-progress__bar" ref={barRef} />
    </div>
  );
}
