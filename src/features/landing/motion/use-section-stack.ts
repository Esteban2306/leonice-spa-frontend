"use client";

import { type RefObject } from "react";

import {
  ensureGsap,
  MOTION_OK,
  ScrollTrigger,
  useIsomorphicLayoutEffect,
} from "@/src/features/landing/motion/gsap";
import {
  directionFor,
  layerState,
  NAV_OFFSET,
  originY,
  stackTop,
} from "@/src/features/landing/motion/section-stack";

const MOBILE_QUERY = "(max-width: 767px)";
const REMEASURE_MS = 160;

function settleTarget(section: HTMLElement): HTMLElement | null {
  const children = Array.from(section.children).filter(
    (node): node is HTMLElement => node instanceof HTMLElement && !node.hasAttribute("aria-hidden"),
  );
  return children.find((node) => node.className.includes("mx-auto")) ?? null;
}

export function useSectionStack(mainRef: RefObject<HTMLElement | null>) {
  useIsomorphicLayoutEffect(() => {
    const main = mainRef.current;
    if (!main) return;
    const gsap = ensureGsap();
    const mm = gsap.matchMedia();

    mm.add(MOTION_OK, () => {
      const sections = Array.from(main.querySelectorAll<HTMLElement>(":scope > section[id]"));
      if (sections.length < 2) return;

      const inner = sections.map(settleTarget);
      const progress = sections.map(() => 0);
      const covered = sections.map(() => false);
      const written = sections.map(() => "");
      const writtenInner = sections.map(() => "");
      let viewport = window.innerHeight;
      let mobile = window.matchMedia(MOBILE_QUERY).matches;
      let remeasure = 0;

      sections.forEach((section, index) => {
        section.classList.add("stack-layer");
        section.style.zIndex = String(index + 1);
      });

      const measure = () => {
        viewport = window.innerHeight;
        mobile = window.matchMedia(MOBILE_QUERY).matches;
        sections.forEach((section) => {
          const height = section.offsetHeight;
          const top = stackTop(viewport, height);
          section.style.setProperty("--stack-top", `${top}px`);
          section.style.transformOrigin = `50% ${originY(viewport, height, top).toFixed(0)}px`;
        });
      };

      const apply = () => {
        sections.forEach((section, index) => {
          const state = layerState({
            direction: directionFor(index),
            progress: index === 0 ? 1 : progress[index],
            nextProgress: progress[index + 1] ?? 0,
            viewportHeight: viewport,
            mobile,
          });

          const identity = state.x === 0 && state.y === 0 && state.scale === 1;
          const transform = identity
            ? ""
            : `translate3d(${state.x.toFixed(2)}%, ${state.y.toFixed(1)}px, 0) scale(${state.scale.toFixed(4)})`;
          if (written[index] !== transform) {
            written[index] = transform;
            section.style.transform = transform;
          }
          section.style.willChange = state.active ? "transform" : "";
          if (state.active !== (section.dataset.moving === "1")) {
            if (state.active) section.dataset.moving = "1";
            else {
              delete section.dataset.moving;
              window.dispatchEvent(new Event("sun:refresh"));
            }
          }
          const hidden = covered[index];
          if (hidden !== (section.dataset.covered === "1")) {
            if (hidden) section.dataset.covered = "1";
            else delete section.dataset.covered;
          }
          section.style.setProperty("--stack-shade", state.shade.toFixed(3));
          section.style.setProperty("--stack-r", `${state.radius.toFixed(1)}px`);
          section.style.setProperty("--stack-rim", state.rim.toFixed(3));

          const target = inner[index];
          if (target) {
            const settle =
              state.settleX === 0 && state.settleY === 0
                ? ""
                : `translate3d(${state.settleX.toFixed(2)}%, ${state.settleY.toFixed(1)}px, 0)`;
            if (writtenInner[index] !== settle) {
              writtenInner[index] = settle;
              target.style.transform = settle;
            }
          }
        });
      };

      const reset = () => {
        sections.forEach((section, index) => {
          written[index] = "";
          writtenInner[index] = "";
          section.style.transform = "";
          inner[index]?.style.removeProperty("transform");
        });
      };

      const triggers = sections.map((section, index) =>
        index === 0
          ? null
          : ScrollTrigger.create({
              trigger: section,
              start: "top bottom",
              end: `top ${NAV_OFFSET}px`,
              onUpdate: (self) => {
                progress[index] = self.progress;
                apply();
              },
              onRefresh: (self) => {
                progress[index] = self.progress;
              },
            }),
      );

      const coverTriggers = sections.map((section, index) =>
        index === 0
          ? null
          : ScrollTrigger.create({
              trigger: section,
              start: "top top",
              end: () => (section.offsetHeight >= window.innerHeight ? "bottom bottom" : "top top+=1"),
              onToggle: (self) => {
                covered[index - 1] = self.isActive;
                apply();
              },
              onRefresh: (self) => {
                covered[index - 1] = self.isActive;
              },
            }),
      );

      const onRefreshInit = () => reset();
      const onRefresh = () => {
        measure();
        sections.forEach((_, index) => {
          const trigger = triggers[index];
          if (trigger) progress[index] = trigger.progress;
          const cover = coverTriggers[index];
          if (cover) covered[index - 1] = cover.isActive;
        });
        apply();
      };
      ScrollTrigger.addEventListener("refreshInit", onRefreshInit);
      ScrollTrigger.addEventListener("refresh", onRefresh);

      const observer = new ResizeObserver(() => {
        window.clearTimeout(remeasure);
        remeasure = window.setTimeout(() => ScrollTrigger.refresh(), REMEASURE_MS);
      });
      sections.forEach((section) => observer.observe(section));

      measure();
      onRefresh();

      return () => {
        window.clearTimeout(remeasure);
        observer.disconnect();
        ScrollTrigger.removeEventListener("refreshInit", onRefreshInit);
        ScrollTrigger.removeEventListener("refresh", onRefresh);
        triggers.forEach((trigger) => trigger?.kill());
        coverTriggers.forEach((trigger) => trigger?.kill());
        sections.forEach((section, index) => {
          section.classList.remove("stack-layer");
          section.style.zIndex = "";
          section.style.transform = "";
          section.style.transformOrigin = "";
          section.style.willChange = "";
          delete section.dataset.covered;
          delete section.dataset.moving;
          section.style.removeProperty("--stack-top");
          section.style.removeProperty("--stack-shade");
          section.style.removeProperty("--stack-r");
          section.style.removeProperty("--stack-rim");
          inner[index]?.style.removeProperty("transform");
        });
      };
    });

    return () => mm.revert();
  }, [mainRef]);
}
