"use client";

import { useRef, type CSSProperties } from "react";

import { ATMOSPHERES, type AtmosphereName } from "@/src/features/landing/atmosphere/atmosphere-presets";
import { ensureGsap, MOTION_OK, ScrollTrigger, useIsomorphicLayoutEffect } from "@/src/features/landing/motion/gsap";

import "@/src/features/landing/atmosphere.css";

const ACROSS = { start: "top bottom", end: "bottom top" } as const;
const PARALLAX = 18;

export function SectionAtmosphere({ name }: { name: AtmosphereName }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const preset = ATMOSPHERES[name];
  const sun = "sun" in preset ? preset.sun : undefined;

  useIsomorphicLayoutEffect(() => {
    const root = rootRef.current;
    const section = root?.parentElement;
    if (!root || !section) return;
    const gsap = ensureGsap();
    const mm = gsap.matchMedia();

    mm.add(
      MOTION_OK,
      () => {
        const scrub = { trigger: section, ...ACROSS, scrub: 1.2 };
        ScrollTrigger.create({ trigger: section, ...ACROSS, toggleClass: { targets: root, className: "is-live" } });

        root.querySelectorAll<HTMLElement>("[data-atmo-depth]").forEach((layer) => {
          const depth = Number(layer.dataset.atmoDepth) * PARALLAX;
          gsap.fromTo(layer, { yPercent: depth }, { yPercent: -depth, ease: "none", scrollTrigger: scrub });
        });

        const warmth = root.querySelector("[data-atmo-sun]");
        if (warmth) {
          gsap
            .timeline({ scrollTrigger: scrub })
            .fromTo(warmth, { yPercent: 40, opacity: 0.15 }, { yPercent: 0, opacity: 1, ease: "sine.out", duration: 1 })
            .to(warmth, { yPercent: -40, opacity: 0.15, ease: "sine.in", duration: 1 });
        }
      },
      root,
    );

    return () => mm.revert();
  }, []);

  return (
    <div ref={rootRef} aria-hidden="true" data-tone={preset.tone} className="atmo">
      {preset.fields.map((field, index) => (
        <div
          key={index}
          data-atmo-depth={field.depth}
          className="atmo__depth"
          style={
            {
              "--field-x": `${field.x}%`,
              "--field-y": `${field.y}%`,
              "--field-size": `${field.size}vmax`,
            } as CSSProperties
          }
        >
          <div
            data-drift={field.drift}
            className="atmo__field"
            style={{ "--field-color": field.color } as CSSProperties}
          />
        </div>
      ))}
      {sun ? (
        <div data-atmo-sun className="atmo__sun" style={{ "--field-color": sun } as CSSProperties} />
      ) : null}
      <div className="atmo__grain" />
    </div>
  );
}
