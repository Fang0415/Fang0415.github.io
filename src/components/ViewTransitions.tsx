'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';

/**
 * Two-phase fade transition on route change: the old page dissolves
 * away, the new page dissolves in.
 *
 * Phase 1 — page-leave: as soon as the user clicks an internal link,
 * <main> fades fully out to opacity 0 over 220ms. This gives instant
 * feedback that the click registered, and it covers the RSC round-trip
 * with motion instead of a frozen page.
 *
 * Phase 2 — page-enter: the new route fades in from 0 over 340ms. The
 * swap from "leave" to "enter" is gated on BOTH of these being true:
 *
 *   1. The leave fade has actually finished (transitionend on <main>,
 *      not a fixed timer — the compositor owns the truth).
 *   2. The new route has painted its first frame (double-rAF after the
 *      React commit, so we know the fresh content is really on screen
 *      underneath the still-invisible main).
 *
 * Holding page-leave until both are true is what makes the join
 * seamless: main stays at opacity 0 while the new content assembles
 * underneath, so there is never a white gap and never a brightness
 * step — just old page gone, new page arriving.
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

// How long the leave fade runs. CSS copy: html.page-leave main {
// transition-duration: 220ms }.
const LEAVE_MS = 220;
// How long the enter fade runs. CSS copy: html.page-enter main {
// animation-duration: 340ms }. Used only as a fallback if the
// animationend listener below somehow doesn't fire.
const ENTER_MS = 340;
// Safety net: if the RSC fetch hangs, don't leave the page invisible.
const LEAVE_TIMEOUT_MS = 5000;

export default function ViewTransitions() {
  const pathname = usePathname();
  // usePathname() never returns null at runtime; the || '' is only to
  // satisfy the type. The ref is initialized on the very first render,
  // so the phase-2 effect can distinguish initial mount from navigations.
  const previousPath = useRef<string>(pathname || '');
  // Set by phase 1 when a fade-out completes; read by phase 2. A plain
  // ref (not state) because it coordinates two effects, not rendering.
  const leaveEnded = useRef(false);

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
    let endListener: ((event: TransitionEvent) => void) | undefined;

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

      leaveEnded.current = false;
      root.classList.add('page-leave');

      // The leave fade is a CSS transition, and transitions can be
      // interrupted (e.g. the route commits and re-styles main) before
      // they finish. So instead of trusting transitionend alone, arm a
      // timer for the same duration and treat whichever fires first as
      // "the fade is done". Either path flips leaveEnded so phase 2 can
      // proceed as soon as its own readiness condition is met.
      const main = document.querySelector('main');
      const markLeaveEnded = () => { leaveEnded.current = true; };
      endListener = (event: TransitionEvent) => {
        if (event.target === main && event.propertyName === 'opacity') markLeaveEnded();
      };
      main?.addEventListener('transitionend', endListener);
      leaveTimer = window.setTimeout(markLeaveEnded, LEAVE_MS + 80);

      // If navigation somehow never completes, bring the page back.
      restoreTimer = window.setTimeout(() => {
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
      document.querySelector('main')?.removeEventListener('transitionend', endListener as EventListener);
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

    // Gate the swap on BOTH conditions (see the header comment):
    //
    //   A. New content painted — double-rAF after commit. rAF fires
    //      before the browser paints, so waiting for the second one
    //      means "the frame after this one is the first real paint".
    //   B. Leave fade finished — leaveEnded, set by phase 1 when the
    //      opacity transition completes.
    //
    // The swap runs on whichever of A/B completes LAST. In the common
    // case the fade is still running when the paint is ready, so B is
    // the trigger; on a slow network the paint arrives first and the
    // user simply waits at a blank screen for content, which is the
    // honest thing to show. In a hidden tab rAF never fires, so arm a
    // visibilitychange listener and a backstop timer as well.
    let painted = false;
    const maybeSwap = () => {
      if (painted && leaveEnded.current) runSwap();
    };

    const raf1 = requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        painted = true;
        maybeSwap();
      });
    });

    // Re-check when the leave fade ends (phase 1 flips the ref).
    const leaveWatcher = new MutationObserver(() => {
      // page-leave being removed by the safety net means the fade is
      // over however it happened; proceed if paint is ready.
      if (!root.classList.contains('page-leave')) {
        leaveEnded.current = true;
        maybeSwap();
      }
    });
    leaveWatcher.observe(root, { attributes: true, attributeFilter: ['class'] });

    const onVisible = () => {
      if (document.visibilityState === 'visible') {
        painted = true;
        maybeSwap();
      }
    };
    document.addEventListener('visibilitychange', onVisible);

    // Poll leaveEnded on a slow interval as a final trigger for the
    // normal case where rAF already ran but the fade was still going.
    const poll = window.setInterval(maybeSwap, 50);

    // Backstop: never leave the page invisible, whatever goes wrong.
    const swapTimer = window.setTimeout(runSwap, LEAVE_TIMEOUT_MS);

    cleanup = () => {
      cancelAnimationFrame(raf1);
      leaveWatcher.disconnect();
      document.removeEventListener('visibilitychange', onVisible);
      window.clearInterval(poll);
      window.clearTimeout(swapTimer);
    };

    return cleanup;
    // previousPath is a ref, not state — intentionally not a dependency.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  return null;
}

