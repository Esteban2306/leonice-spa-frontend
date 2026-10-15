"use client";

import { type RefObject } from "react";

import {
  ensureGsap,
  MOTION_OK,
  ScrollTrigger,
  useIsomorphicLayoutEffect,
} from "@/src/features/landing/motion/gsap";
import { stackTop } from "@/src/features/landing/motion/section-stack";

const REMEASURE_MS = 160;

export function useSectionStack(mainRef: RefObject<HTMLElement | null>) {
  useIsomorphicLayoutEffect(() => {
    const main = mainRef.current;
    if (!main) return;
    const gsap = ensureGsap();
    const mm = gsap.matchMedia();

    mm.add(MOTION_OK, () => {
      const [base, over] = Array.from(main.querySelectorAll<HTMLElement>(":scope > section[id]"));
      if (!base || !over) return;

      let remeasure = 0;
      base.classList.add("stack-base");

      const measure = () => {
        base.style.setProperty("--stack-top", `${stackTop(window.innerHeight, base.offsetHeight)}px`);
      };

      let frame = 0;
      let coverStart = Number.POSITIVE_INFINITY;
      const syncCovered = () => {
        frame = 0;
        if (window.scrollY >= coverStart) base.dataset.covered = "1";
        else delete base.dataset.covered;
      };
      const onScroll = () => {
        if (!frame) frame = window.requestAnimationFrame(syncCovered);
      };

      const cover = ScrollTrigger.create({
        trigger: over,
        start: "top top",
        end: "max",
        onRefresh: (self) => {
          coverStart = self.start;
          syncCovered();
        },
      });
      window.addEventListener("scroll", onScroll, { passive: true });

      const onRefresh = () => measure();
      ScrollTrigger.addEventListener("refresh", onRefresh);

      const observer = new ResizeObserver(() => {
        window.clearTimeout(remeasure);
        remeasure = window.setTimeout(() => ScrollTrigger.refresh(), REMEASURE_MS);
      });
      observer.observe(base);

      measure();

      return () => {
        window.clearTimeout(remeasure);
        window.cancelAnimationFrame(frame);
        window.removeEventListener("scroll", onScroll);
        observer.disconnect();
        ScrollTrigger.removeEventListener("refresh", onRefresh);
        cover.kill();
        base.classList.remove("stack-base");
        delete base.dataset.covered;
        base.style.removeProperty("--stack-top");
      };
    });

    return () => mm.revert();
  }, [mainRef]);
}
