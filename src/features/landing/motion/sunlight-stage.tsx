"use client";

import { useRef, type ReactNode } from "react";

import {
  ensureGsap,
  MOTION_OK,
  useIsomorphicLayoutEffect,
} from "@/src/features/landing/motion/gsap";

import "@/src/features/landing/landing.css";

const MORNING = 30;
const AFTERNOON = -16;
const STEP = 0.5;

function applySun(root: HTMLElement, degrees: number) {
  const radians = (degrees * Math.PI) / 180;
  const dx = Math.cos(radians);
  const dy = Math.sin(radians);
  root.style.setProperty("--sun-dx", dx.toFixed(3));
  root.style.setProperty("--sun-dy", dy.toFixed(3));
  root.style.setProperty("--sun-angle", `${degrees.toFixed(1)}deg`);
  root.style.setProperty("--sun-y", `${(50 - dy * 70).toFixed(1)}%`);
}

export function SunlightStage({ children }: { children: ReactNode }) {
  const rootRef = useRef<HTMLDivElement>(null);

  useIsomorphicLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const gsap = ensureGsap();
    const sun = { angle: MORNING };
    applySun(root, sun.angle);

    const mm = gsap.matchMedia();
    mm.add(MOTION_OK, () => {
      let last = sun.angle;
      const update = () => {
        const next = Math.round(sun.angle / STEP) * STEP;
        if (next !== last) {
          last = next;
          applySun(root, next);
        }
      };
      gsap.to(sun, {
        angle: AFTERNOON,
        ease: "none",
        onUpdate: update,
        scrollTrigger: {
          trigger: root,
          start: "top top",
          end: "bottom bottom",
          scrub: 1.2,
        },
      });
    });

    return () => mm.revert();
  }, []);

  return (
    <div ref={rootRef} className="landing relative isolate">
      {children}
      <div aria-hidden="true" className="landing-sun" />
    </div>
  );
}
