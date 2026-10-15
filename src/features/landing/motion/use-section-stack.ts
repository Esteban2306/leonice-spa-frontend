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

      const cover = ScrollTrigger.create({
        trigger: over,
        start: "top top",
        end: "max",
        onToggle: (self) => {
          if (self.isActive) base.dataset.covered = "1";
          else delete base.dataset.covered;
        },
        onRefresh: (self) => {
          if (self.isActive) base.dataset.covered = "1";
          else delete base.dataset.covered;
        },
      });

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
