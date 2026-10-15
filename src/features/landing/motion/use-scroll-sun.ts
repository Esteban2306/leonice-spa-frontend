"use client";

import { useEffect, type RefObject } from "react";

import {
  coarseLight,
  FINE_STEPS,
  MOVING_STEPS,
  lightFor,
  sameLight,
  scrollThumbCenter,
  sunPosition,
  surfaceLight,
  type SurfaceLight,
} from "@/src/features/landing/motion/sun-engine";

export const SUN_SURFACES =
  ".lit, .lit-dark, .sun-shadow, .sun-shadow-ink, .sun-panel, .sun-glass, .why-gallery .ag-panel, .treatments-gallery .ag-panel, .treatments-gallery .treatment-cta";

const EASE = 0.24;
const SETTLE_PX = 0.4;
const STATIC_PROGRESS = 0.25;

function writeLight(target: HTMLElement, light: SurfaceLight) {
  target.style.setProperty("--sx", light.sx.toFixed(2));
  target.style.setProperty("--sy", light.sy.toFixed(2));
  target.style.setProperty("--sd", light.sd.toFixed(2));
}

export function useScrollSun(
  rootRef: RefObject<HTMLElement | null>,
  haloRef: RefObject<HTMLElement | null>,
  shadeRef: RefObject<HTMLElement | null>,
) {
  useEffect(() => {
    const root = rootRef.current;
    const halo = haloRef.current;
    const shade = shadeRef.current;
    if (!root || !halo || !shade) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const visible = new Set<HTMLElement>();
    const written = new WeakMap<HTMLElement, SurfaceLight>();
    let rootLight: SurfaceLight | undefined;
    let viewport = { width: window.innerWidth, height: window.innerHeight };
    let haloHeight = halo.offsetHeight;
    let shadeHeight = shade.offsetHeight;
    let targetY = 0;
    let sunY = 0;
    let frame = 0;
    let dirty = true;

    const measureTarget = () => {
      viewport = { width: window.innerWidth, height: window.innerHeight };
      haloHeight = halo.offsetHeight;
      shadeHeight = shade.offsetHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrollY = reduced
        ? STATIC_PROGRESS * Math.max(documentHeight - viewport.height, 0)
        : window.scrollY;
      targetY = scrollThumbCenter(scrollY, documentHeight, viewport);
    };

    const paint = () => {
      frame = 0;
      const delta = targetY - sunY;
      const moving = Math.abs(delta) > SETTLE_PX;
      sunY = moving ? sunY + delta * EASE : targetY;
      const sun = sunPosition(sunY, viewport);

      const surfaces = [...visible].filter((surface) => !surface.closest("[data-covered], [data-moving]"));
      const rects = surfaces.map((surface) => surface.getBoundingClientRect());

      halo.style.transform = `translate3d(50%, ${(sunY - haloHeight / 2).toFixed(1)}px, 0)`;
      shade.style.transform = `translate3d(50%, ${(sunY - shadeHeight / 2).toFixed(1)}px, 0)`;

      const center = coarseLight(lightFor(sun, { x: viewport.width / 2, y: viewport.height / 2 }, viewport));
      if (!sameLight(rootLight, center)) {
        rootLight = center;
        writeLight(root, center);
      }

      surfaces.forEach((surface, index) => {
        const light = surfaceLight(rects[index], sun, viewport, moving ? MOVING_STEPS : FINE_STEPS);
        if (sameLight(written.get(surface), light)) return;
        written.set(surface, light);
        writeLight(surface, light);
      });

      dirty = false;
      if (moving) schedule();
    };

    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(paint);
    };

    const refresh = () => {
      dirty = true;
      schedule();
    };

    const visibility = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const surface = entry.target as HTMLElement;
          if (entry.isIntersecting) visible.add(surface);
          else visible.delete(surface);
        }
        refresh();
      },
      { rootMargin: "25% 0px 25% 0px" },
    );

    const tracked = new Set<HTMLElement>();
    const scan = () => {
      const found = new Set(root.querySelectorAll<HTMLElement>(SUN_SURFACES));
      for (const surface of found) {
        if (!tracked.has(surface)) {
          tracked.add(surface);
          visibility.observe(surface);
        }
      }
      for (const surface of tracked) {
        if (!found.has(surface)) {
          tracked.delete(surface);
          visible.delete(surface);
          visibility.unobserve(surface);
        }
      }
    };

    let scanFrame = 0;
    const scheduleScan = () => {
      if (scanFrame) return;
      scanFrame = requestAnimationFrame(() => {
        scanFrame = 0;
        scan();
        refresh();
      });
    };

    const mutations = new MutationObserver(scheduleScan);
    mutations.observe(root, { childList: true, subtree: true, attributes: true, attributeFilter: ["class"] });

    const onScroll = () => {
      if (reduced) return;
      measureTarget();
      schedule();
    };
    const onResize = () => {
      measureTarget();
      refresh();
    };
    const onSettle = () => {
      if (!dirty) refresh();
    };

    measureTarget();
    sunY = targetY;
    scan();
    root.dataset.sun = "ready";
    paint();

    window.addEventListener("sun:refresh", refresh);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    root.addEventListener("transitionend", onSettle);
    root.addEventListener("animationend", onSettle);

    return () => {
      window.removeEventListener("sun:refresh", refresh);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      root.removeEventListener("transitionend", onSettle);
      root.removeEventListener("animationend", onSettle);
      mutations.disconnect();
      visibility.disconnect();
      if (frame) cancelAnimationFrame(frame);
      if (scanFrame) cancelAnimationFrame(scanFrame);
      delete root.dataset.sun;
    };
  }, [rootRef, haloRef, shadeRef]);
}
