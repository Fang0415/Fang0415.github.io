'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';

/**
 * Two-phase page transition on route change.
 *
 * Phase 1 — page-leave: as soon as the user clicks an internal link,
 * <main> eases to 55% opacity over 120ms. This gives instant feedback
 * that the click registered, and it covers the RSC round-trip with
 * motion instead of a frozen page.
 *
 * Phase 2 — page-enter: on the first painted frame after React commits
 * the new route, the leave class comes off and the enter class goes on
 * atomically, so the fade-in animation starts from exactly the opacity
 * the fade-out ended at. The swap is gated behind requestAnimationFrame
 * rather than done synchronously at commit time: the animation timeline
 * starts when the class is applied, and the commit's style recalc and
 * hydration work can push the first real paint hundreds of milliseconds
 * out — frames the animation would silently burn through, leaving only
 * its tail visible, which reads as a hard cut. Holding page-leave until
 * the swap also means the new content's first paint lands exactly on the
 * 0.55 floor of the pageIn keyframes, so there is never a brightness
 * step on already-visible content.
 *
 * Phase 2 is skipped on the initial mount (nothing to transition from),
 * so the first-paint entrance choreography (.rise, .cb-onload) plays as
 * designed on a fresh load; the pinning below exists for SPA
 * navigations, where replaying element-level entrances made the page
 * feel like it was re-assembling itself — and made the hero image flash.
 *
 * The numbers below have matching copies in globals.css (search for
 * "Page transitions"). If you change one side, change the other.
 */

// How long the leave phase runs. Keep it very short: it's only the
// "click registered" cue, not an exit animation. Production RSC
// responses arrive in ~50ms, so anything longer gets truncated anyway.
// CSS copy: html.page-leave main { transition-duration: 120ms }
const LEAVE_MS = 120;
// How far the page dims during the leave phase. Stopping well short
// of 0 avoids a true blank frame even if the server is slow.
// CSS copy: the `from` keyframe of the pageIn animation.
const LEAVE_OPACITY = 0.55;
// How long the enter fade runs. CSS copy: html.page-enter main {
// animation-duration: 300ms }. Used only as a fallback if the
// animationend listener below somehow doesn't fire.
const ENTER_MS = 300;
// Safety net: if the RSC fetch hangs, don't leave the page dimmed.
const LEAVE_TIMEOUT_MS = 5000;

// The rAF-gated class swap (see the header comment) assumes the browser
// paints between route commit and the callback. When the tab is in the
// background it never does — rAF is suspended entirely — so schedule the
// swap for the next visibilitychange, and use the leave safety net as a
// shared deadline so a permanently hidden tab still ends up cleaned up.
const ENTER_SWAP_TIMEOUT_MS = LEAVE_TIMEOUT_MS;

export default function ViewTransitions() {
  const pathname = usePathname();
  // usePathname() never returns null at runtime; the || '' is only to
  // satisfy the type. The ref is initialized on the very first render,
  // so the phase-2 effect can distinguish initial mount from navigations.
  const previousPath = useRef<string>(pathname || '');

  // Phase 1 fires on link click, before Next.js even starts fetching.
  // The listener is attached to <body> rather than document: Next's
  // router intercepts clicks during the document-level capture phase,
  // and a document-level listener would see event.defaultPrevented
  // already true. <body> sits inside the document, so its capture
  // phase still runs before the router has made that decision.
  //
  // We listen for mousedown rather than click. Click fires after
  // mouseup, by which point the router's fetch is already underway;
  // mousedown is where the user actually committed to the navigation,
  // and it gives the leave transition a head start.
  useEffect(() => {
    const root = document.documentElement;
    const body = document.body;
    let leaveTimer: number | undefined;
    let restoreTimer: number | undefined;

    const onMouseDown = (event: MouseEvent) => {
      if (event.button !== 0) return;
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

      const anchor = (event.target as HTMLElement).closest?.('a[href]');
      if (!(anchor instanceof HTMLAnchorElement)) return;
      if (anchor.target === '_blank' || anchor.hasAttribute('download')) return;

      const url = new URL(anchor.href, window.location.href);
      if (url.origin !== window.location.origin) return;
      // Pure hash changes and links to the page we're already on don't
      // remount anything, so there's nothing to transition.
      if (url.pathname === window.location.pathname) return;

      root.classList.add('page-leave');
      // If navigation somehow never completes, bring the page back.
      // Phase 2 listens for this class's removal: if it fires before the
      // route commits, the swap and its cleanup timers are cancelled.
      leaveTimer = window.setTimeout(() => {
        root.classList.remove('page-leave');
      }, LEAVE_TIMEOUT_MS);
    };

    // If the click never turns into a navigation (prevented default,
    // router rejection), nothing else removes page-leave — the safety
    // timer above only fires after 5s, far too long for a no-op click.
    // Restore the page on the next frame instead.
    const onClickCapture = (event: MouseEvent) => {
      if (!root.classList.contains('page-leave')) return;
      if (event.defaultPrevented) return; // the router took this one
      restoreTimer = window.setTimeout(() => {
        root.classList.remove('page-leave');
      }, 250);
    };

    body.addEventListener('mousedown', onMouseDown, true);
    body.addEventListener('click', onClickCapture, true);
    return () => {
      body.removeEventListener('mousedown', onMouseDown, true);
      body.removeEventListener('click', onClickCapture, true);
      window.clearTimeout(leaveTimer);
      window.clearTimeout(restoreTimer);
      root.classList.remove('page-leave');
    };
  }, []);

  // Phase 2 fires when the new route commits — but only on actual
  // navigations. On the initial mount we return early: there is no old
  // page to leave from, and running the pinning/settling below would
  // cancel the first-paint entrance choreography this site's sections
  // are designed around.
  useEffect(() => {
    const root = document.documentElement;
    if (pathname === previousPath.current) return;
    previousPath.current = pathname || '';

    // Wait until the browser is about to actually paint before swapping
    // the classes (see the header comment). While page-leave is still
    // on, the fresh content paints at the same 0.55 the leave transition
    // ended at, so the user never sees a brightness step. In a hidden
    // tab rAF is suspended, so arm two more triggers for the same swap:
    // the next visibilitychange (user comes back) and a backstop timer,
    // so a permanently backgrounded navigation still cleans up after
    // itself — hidden tabs never fire animation events, so the fallback
    // inside the swap can't run until the swap itself has.
    let swapped = false;
    let cleanup: (() => void) | undefined;
    const runSwap = () => {
      if (swapped) return;
      swapped = true;
      cleanup?.();

      root.classList.remove('page-leave');
      root.classList.add('page-enter');

      // .rise elements on the freshly-mounted page get pinned to their
      // final state with inline styles. Their keyframe animation
      // (kitRise: opacity 0 → 1 over 620ms) is meant for first paint; on
      // an SPA navigation it would restart the moment the page-enter
      // suppression lifts — the hero image visibly vanishing and rising
      // again. Inline styles override the animation's fill, so the
      // element stays put. The settle pass below does the same for
      // .cb-reveal / .cb-onload.
      document.querySelectorAll<HTMLElement>('.rise').forEach((el) => {
        el.style.animation = 'none';
        el.style.opacity = '1';
        el.style.transform = 'none';
      });

      // RevealManager runs on the same pathname change and sets up its
      // IntersectionObserver. Let it observe first, then mark everything
      // as already in place so no element-level entrance replays.
      document.querySelectorAll('.cb-reveal, .cb-onload').forEach((el) => {
        el.classList.add('is-in');
      });

      // Remove page-enter only when the fade-in has actually finished
      // painting. A fixed timer (an earlier approach) fired on React's
      // commit schedule, but the browser's style recalc can swallow the
      // animation's early frames — the class came off before the fade
      // had visibly played, which read as a hard cut. animationend is
      // driven by the compositor, so the class stays until the fade is
      // real.
      const main = document.querySelector('main');
      let done = false;
      const finish = () => {
        if (done) return;
        done = true;
        root.classList.remove('page-enter');
      };
      const onAnimationEnd = (event: AnimationEvent) => {
        if (event.target === main && event.animationName === 'pageIn') finish();
      };
      main?.addEventListener('animationend', onAnimationEnd);
      // Fallback in case the animation is suppressed (reduced motion) or
      // the event is swallowed: still clean up, just later. The listener
      // lives only until either path fires.
      const timer = window.setTimeout(() => {
        main?.removeEventListener('animationend', onAnimationEnd);
        finish();
      }, ENTER_MS + 400);
    };

    const raf = requestAnimationFrame(runSwap);
    const onVisible = () => {
      if (document.visibilityState === 'visible') runSwap();
    };
    document.addEventListener('visibilitychange', onVisible);
    // The leave safety net and the no-op-click restorer both express
    // "the leave phase is over" by removing the class; whatever the
    // reason, the page must not stay in a half-transition state.
    const classWatcher = new MutationObserver(() => {
      if (!root.classList.contains('page-leave')) runSwap();
    });
    classWatcher.observe(root, { attributes: true, attributeFilter: ['class'] });
    // Backstop for a swap that would otherwise never run: a hidden tab
    // never fires animation events, so without this the fallback timer
    // inside runSwap couldn't do its job either.
    const swapTimer = window.setTimeout(runSwap, ENTER_SWAP_TIMEOUT_MS);

    cleanup = () => {
      cancelAnimationFrame(raf);
      document.removeEventListener('visibilitychange', onVisible);
      classWatcher.disconnect();
      window.clearTimeout(swapTimer);
    };

    return cleanup;
    // previousPath is a ref, not state — intentionally not a dependency.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  return null;
}
