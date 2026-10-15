"use client";

import { ensureGsap, EASE_IN_OUT } from "./gsap";
import { naturalTop } from "./section-stack";

const NAV_OFFSET = 88;

function restingTop(target: HTMLElement): number {
  const parent = target.parentElement;
  if (!parent || !target.classList.contains("stack-base")) {
    return target.getBoundingClientRect().top + window.scrollY;
  }
  const heights: number[] = [];
  for (const sibling of Array.from(parent.children)) {
    if (sibling === target) break;
    if (sibling instanceof HTMLElement) heights.push(sibling.offsetHeight);
  }
  return naturalTop(parent.getBoundingClientRect().top, window.scrollY, heights);
}

export function scrollToSection(id: string) {
  const target = document.getElementById(id);
  if (!target) {
    window.location.assign(id === "inicio" ? "/" : `/#${id}`);
    return;
  }
  const gsap = ensureGsap();
  const top = restingTop(target);
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const offset = id === "inicio" ? 0 : NAV_OFFSET;
  const distance = Math.abs(top - offset - window.scrollY);
  const duration = reduced ? 0 : Math.min(1.6, Math.max(0.7, distance / 2200));

  gsap.killTweensOf(window);
  gsap.to(window, {
    duration,
    ease: EASE_IN_OUT,
    scrollTo: { y: top - offset, autoKill: true },
    onComplete: () => {
      history.replaceState(null, "", id === "inicio" ? window.location.pathname : `#${id}`);
      target.focus({ preventScroll: true });
    },
  });
}
