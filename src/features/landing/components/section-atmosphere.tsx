"use client";

import { useMemo, useRef, type CSSProperties } from "react";

import { branch, strandBundle } from "@/src/features/landing/atmosphere/atmosphere-geometry";
import { ATMOSPHERES, type AtmosphereName } from "@/src/features/landing/atmosphere/atmosphere-presets";
import { ensureGsap, MOTION_OK, ScrollTrigger, useIsomorphicLayoutEffect } from "@/src/features/landing/motion/gsap";

import "@/src/features/landing/atmosphere.css";

const ACROSS = { start: "top bottom", end: "bottom top" } as const;

export function SectionAtmosphere({ name }: { name: AtmosphereName }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const preset = ATMOSPHERES[name];
  const sprig = "sprig" in preset ? preset.sprig : undefined;
  const placement = "window" in preset ? preset.window : undefined;

  const strands = useMemo(() => preset.strands.map((spec) => strandBundle(spec)), [preset]);
  const branches = useMemo(() => sprig?.map((spec) => branch(spec)) ?? [], [sprig]);

  useIsomorphicLayoutEffect(() => {
    const root = rootRef.current;
    const section = root?.parentElement;
    if (!root || !section) return;
    const gsap = ensureGsap();
    const mm = gsap.matchMedia();

    mm.add(
      MOTION_OK,
      () => {
        const scrub = { trigger: section, ...ACROSS, scrub: 0.8 };
        ScrollTrigger.create({ trigger: section, ...ACROSS, toggleClass: { targets: root, className: "is-live" } });

        const light = root.querySelector("[data-atmo-window]");
        if (light) {
          gsap.fromTo(
            light,
            { yPercent: 22, xPercent: 6, rotate: -3 },
            { yPercent: -22, xPercent: -6, rotate: 4, ease: "none", scrollTrigger: scrub },
          );
          gsap
            .timeline({ scrollTrigger: scrub })
            .fromTo(light, { opacity: 0.35 }, { opacity: 1, ease: "sine.out", duration: 1 })
            .to(light, { opacity: 0.35, ease: "sine.in", duration: 1 });
        }

        const lines = root.querySelectorAll("[data-atmo-strand]");
        gsap.fromTo(
          lines,
          { strokeDashoffset: 1 },
          {
            strokeDashoffset: 0,
            ease: "none",
            stagger: 0.04,
            scrollTrigger: { trigger: section, start: "top 90%", end: "center 45%", scrub: 1 },
          },
        );

        const glints = root.querySelectorAll("[data-atmo-glint]");
        gsap.fromTo(glints, { strokeDashoffset: 0.07 }, { strokeDashoffset: -1, ease: "none", scrollTrigger: scrub });
      },
      root,
    );

    return () => mm.revert();
  }, []);

  return (
    <div ref={rootRef} aria-hidden="true" data-tone={preset.tone} className="atmo">
      <div className="atmo__grain" />

      {placement ? (
        <div
          data-atmo-window
          data-side={placement.side}
          className="atmo__window"
          style={{ top: placement.top, "--atmo-width": placement.width } as CSSProperties}
        >
          <div className="atmo__bloom" />
          <div className="atmo__panes" />
          {branches.length > 0 ? (
            <div className="atmo__sprig">
              <svg viewBox="0 0 400 400">
                {branches.map((item, index) => (
                  <g key={index}>
                    <path d={item.stem} className="atmo__stem" />
                    {item.leaves.map((leaf, leafIndex) => (
                      <path key={leafIndex} d={leaf.d} transform={leaf.transform} />
                    ))}
                  </g>
                ))}
              </svg>
            </div>
          ) : null}
        </div>
      ) : null}

      <svg viewBox="0 0 1440 900" preserveAspectRatio="none" className="atmo__strands">
        {strands.map((bundle, bundleIndex) => (
          <g key={bundleIndex}>
            {bundle.map((d, index) => (
              <path key={index} d={d} pathLength={1} data-atmo-strand className="atmo__strand" />
            ))}
            <path d={bundle[Math.floor(bundle.length / 2)]} pathLength={1} data-atmo-glint className="atmo__glint" />
          </g>
        ))}
      </svg>
    </div>
  );
}
