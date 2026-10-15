"use client";

import { useRef, type ReactNode } from "react";

import { useScrollSun } from "@/src/features/landing/motion/use-scroll-sun";

import "@/src/features/landing/landing.css";
import "@/src/features/landing/sunlight.css";

export function SunlightStage({ children }: { children: ReactNode }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const haloRef = useRef<HTMLDivElement>(null);
  const shadeRef = useRef<HTMLDivElement>(null);
  useScrollSun(rootRef, haloRef, shadeRef);

  return (
    <div ref={rootRef} className="landing relative isolate">
      {children}
      <div ref={shadeRef} aria-hidden="true" className="sun-shade" />
      <div ref={haloRef} aria-hidden="true" className="sun-halo">
        <div className="sun-halo__light" />
        <div className="sun-halo__sway">
          <div className="sun-halo__beams" />
        </div>
        <div className="sun-halo__core" />
      </div>
    </div>
  );
}
