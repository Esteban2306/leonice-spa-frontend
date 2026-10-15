"use client";

import { ensureGsap, EASE_IN_OUT } from "./gsap";

const NAV_OFFSET = 88;

export function scrollToSection(id: string) {
  const target = document.getElementById(id);
  if (!target) {
    window.location.assign(id === "inicio" ? "/" : `/#${id}`);
    return;
  }
  const gsap = ensureGsap();
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const distance = Math.abs(target.getBoundingClientRect().top);
  const duration = reduced ? 0 : Math.min(1.6, Math.max(0.7, distance / 2200));

  gsap.killTweensOf(window);
  gsap.to(window, {
    duration,
    ease: EASE_IN_OUT,
    scrollTo: { y: target, offsetY: id === "inicio" ? 0 : NAV_OFFSET, autoKill: true },
    onComplete: () => {
      history.replaceState(null, "", id === "inicio" ? window.location.pathname : `#${id}`);
      target.focus({ preventScroll: true });
    },
  });
}
