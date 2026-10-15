"use client";

import { useRef } from "react";

import { ActionLink, BookingLink } from "@/src/features/landing/components/action-link";
import { TREATMENTS_PAGE } from "@/src/features/landing/lib/catalog-links";
import { LandingIcon } from "@/src/features/landing/components/landing-icon";
import { MediaFrame } from "@/src/features/landing/components/media-frame";
import { SectionHeading } from "@/src/features/landing/components/section-heading";
import {
  promiseContent,
  type PromiseItem,
} from "@/src/features/landing/content/landing-content";
import { SECTION_IDS } from "@/src/features/landing/lib/site-config";
import {
  EASE_OUT,
  ensureGsap,
  MOTION_OK,
  SplitText,
  useIsomorphicLayoutEffect,
} from "@/src/features/landing/motion/gsap";
import { useSurfaceGlow } from "@/src/features/landing/motion/use-surface-glow";
import { SectionAtmosphere } from "@/src/features/landing/components/section-atmosphere";

const SIZE_CLASSES: Record<PromiseItem["size"], string> = {
  feature: "desk:row-span-2 min-h-[26rem] desk:min-h-0",
  square: "min-h-[18rem]",
  tall: "desk:row-span-2 min-h-[22rem]",
  wide: "desk:col-span-2 min-h-[18rem]",
};

function PromiseTile({ item }: { item: PromiseItem }) {
  const glowRef = useSurfaceGlow<HTMLElement>();
  const feature = item.size === "feature";

  return (
    <article
      ref={glowRef}
      data-promise-tile
      className={`glow lit-dark lit-hover group/promise relative isolate flex flex-col justify-end overflow-hidden rounded-[2rem] bg-[#0b2c1a] ${SIZE_CLASSES[item.size]}`}
    >
      <MediaFrame
        src={item.image}
        alt=""
        hint={item.imageHint}
        tone="dark"
        labelPosition="top"
        className="absolute inset-0 -z-10"
        imageClassName="transition-transform duration-[1400ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover/promise:scale-[1.06]"
        sizes={feature ? "(min-width: 1024px) 45vw, 100vw" : "(min-width: 1024px) 28vw, 100vw"}
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgb(6_33_18/0.05)_20%,rgb(6_33_18/0.88)_100%)]"
      />

      <div className="flex flex-col gap-3 p-6 sm:p-8">
        <span className="grid size-11 place-items-center rounded-full border border-[#E0BC87]/40 text-[#E0BC87]">
          <LandingIcon name={item.icon} className="size-5" />
        </span>
        <h3
          className={`font-sans font-bold leading-tight text-[#FDF8F1] text-balance ${
            feature ? "text-[clamp(1.75rem,2.6vw,2.4rem)]" : "text-[clamp(1.3rem,1.8vw,1.6rem)]"
          }`}
        >
          {item.title}
        </h3>
        <p
          className={`max-w-[46ch] font-sans leading-relaxed text-[#F2EBDB]/80 transition-colors duration-500 group-hover/promise:text-[#F2EBDB] ${
            feature ? "text-base" : "text-sm"
          }`}
        >
          {item.description}
        </p>
        {(feature || item.size === "wide") && (
          <div className="mt-2 flex items-center gap-4">
            <BookingLink
              variant="outline-cream"
              size="sm"
              arrow={false}
              message={`Hola, quiero agendar en Leonice: ${item.title}.`}
            >
              Reservar
            </BookingLink>
            <ActionLink variant="link-cream" href={TREATMENTS_PAGE}>
              Ver tratamientos
            </ActionLink>
          </div>
        )}
      </div>
    </article>
  );
}

export function PromiseSection() {
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
        const split = heading ? SplitText.create(heading, { type: "chars", mask: "chars" }) : null;
        const tl = gsap.timeline({
          defaults: { ease: EASE_OUT },
          scrollTrigger: { trigger: root, start: "top 68%" },
        });
        tl.from(split?.chars ?? [], { yPercent: 110, duration: 0.9, stagger: 0.025 })
          .from("[data-lead]", { opacity: 0, y: 14, duration: 0.9 }, 0.3)
          .from(
            "[data-promise-tile]",
            {
              clipPath: "inset(0 100% 0 0 round 32px)",
              duration: 1.4,
              stagger: 0.14,
              ease: "expo.inOut",
            },
            0.25,
          )
          .from(
            "[data-promise-tile] h3, [data-promise-tile] p",
            { opacity: 0, y: 16, duration: 0.8, stagger: 0.05 },
            0.9,
          );
        return () => split?.revert();
      },
      root,
    );

    return () => mm.revert();
  }, []);

  return (
    <section
      ref={rootRef}
      id={SECTION_IDS.promise}
      tabIndex={-1}
      aria-labelledby="promise-title"
      className="relative isolate overflow-hidden bg-[#062112] py-24 outline-none sm:py-32"
    >
      <SectionAtmosphere name="promise" />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-40 top-1/4 h-[36rem] w-[36rem] rounded-full bg-[radial-gradient(circle,rgb(224_188_135/0.18),transparent_65%)] blur-2xl"
      />
      <div className="relative mx-auto flex max-w-[1440px] flex-col gap-14 px-5 sm:px-8">
        <SectionHeading
          id="promise-title"
          title={promiseContent.title}
          lead={promiseContent.lead}
          align="center"
          tone="dark"
        />
        <div className="grid gap-5 desk:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)_minmax(0,1fr)] desk:grid-rows-[minmax(17rem,1fr)_minmax(15rem,1fr)]">
          {promiseContent.items.map((item) => (
            <PromiseTile key={item.id} item={item} />
          ))}
        </div>
      </div>
    </section>
  );
}
