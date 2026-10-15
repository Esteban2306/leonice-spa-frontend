"use client";

import { useRef } from "react";

import AccordionGallery from "@/src/components/ui/AccordionGallery";
import { LandingIcon } from "@/src/features/landing/components/landing-icon";
import { SectionHeading } from "@/src/features/landing/components/section-heading";
import { whyContent } from "@/src/features/landing/content/landing-content";
import { SECTION_IDS } from "@/src/features/landing/lib/site-config";
import {
  EASE_OUT,
  ensureGsap,
  MOTION_OK,
  SplitText,
  useIsomorphicLayoutEffect,
} from "@/src/features/landing/motion/gsap";
import { SectionAtmosphere } from "@/src/features/landing/components/section-atmosphere";

export function WhySection() {
  const rootRef = useRef<HTMLElement>(null);

  useIsomorphicLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const gsap = ensureGsap();
    const mm = gsap.matchMedia();

    mm.add(
      MOTION_OK,
      () => {
        const heading = root.querySelector<HTMLElement>("[data-heading]");
        const split = heading ? SplitText.create(heading, { type: "words", mask: "words" }) : null;
        const tl = gsap.timeline({
          defaults: { ease: EASE_OUT },
          scrollTrigger: { trigger: root, start: "top 72%" },
        });
        tl.from(split?.words ?? [], { yPercent: 105, duration: 1.1, stagger: 0.04 }).from(
          ".ag-panel",
          {
            clipPath: "inset(100% 0 0 0 round 32px)",
            y: 40,
            duration: 1.2,
            stagger: 0.09,
            ease: "expo.inOut",
          },
          0.15,
        );
        return () => split?.revert();
      },
      root,
    );

    return () => mm.revert();
  }, []);

  const items = whyContent.items.map((item) => ({
    label: item.title,
    description: item.description,
    image: item.image ?? undefined,
    icon: <LandingIcon name={item.icon} className="size-7" />,
    hint: item.imageHint,
  }));

  return (
    <section
      ref={rootRef}
      id={SECTION_IDS.why}
      tabIndex={-1}
      aria-labelledby="why-title"
      className="stack-over relative isolate bg-[#FDF8F1] py-24 outline-none sm:py-32"
    >
      <SectionAtmosphere name="why" />
      <div className="mx-auto flex max-w-[1440px] flex-col gap-14 px-5 sm:px-8">
        <SectionHeading id="why-title" title={whyContent.title} align="center" />
        <AccordionGallery
          items={items}
          defaultIndex={2}
          height={460}
          gap={14}
          radius={32}
          expandRatio={0.42}
          tilt={4}
          parallax={0.35}
          grayscale={false}
          persistentLabels
          accentColor="#E0BC87"
          overlayColor="#062112"
          textColor="#FDF8F1"
          ariaLabel="Por qué elegir Leonice"
          className="why-gallery"
          renderMedia={(_item, index) => (
            <div
              role="img"
              aria-label={`Sin imagen: ${whyContent.items[index]?.imageHint ?? ""}`}
              data-tone="dark"
              className="media-empty flex h-full w-full items-start justify-center pt-24"
            >
              <span className="rounded-full border border-dashed border-[#E0BC87]/50 px-3 py-1 font-sans text-[11px] font-bold uppercase tracking-[0.14em] text-[#E0BC87]/80">
                Sin imagen
              </span>
            </div>
          )}
        />
      </div>
    </section>
  );
}
