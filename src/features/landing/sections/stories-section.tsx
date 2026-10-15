"use client";

import { useRef, useState } from "react";

import { useMediaQuery } from "@/src/features/landing/motion/use-media-query";
import { AnimatePresence, motion } from "motion/react";
import { MoveHorizontal } from "lucide-react";

import CircularCarousel from "@/src/components/ui/CircularCarousel";
import { MediaFrame } from "@/src/features/landing/components/media-frame";
import { SectionHeading } from "@/src/features/landing/components/section-heading";
import {
  storiesContent,
  type StoryItem,
} from "@/src/features/landing/content/landing-content";
import { SECTION_IDS } from "@/src/features/landing/lib/site-config";
import {
  EASE_OUT,
  ensureGsap,
  MOTION_OK,
  SplitText,
  useIsomorphicLayoutEffect,
} from "@/src/features/landing/motion/gsap";

const EASE = [0.16, 1, 0.3, 1] as const;

function BeforeAfterFace({ story }: { story: StoryItem }) {
  return (
    <div className="story-face relative h-full w-full">
      <MediaFrame
        src={story.before}
        alt={`Antes: ${story.treatment}`}
        hint="Foto del antes"
        tone="dark"
        compact
        className="absolute inset-0"
        sizes="320px"
      />
      <MediaFrame
        src={story.after}
        alt={`Después: ${story.treatment}`}
        hint="Foto del después"
        compact
        className="story-face__after absolute inset-0"
        sizes="320px"
      />
      <span
        aria-hidden="true"
        className="story-face__rule absolute inset-y-0 w-[2px] -translate-x-1/2 bg-[#FDF8F1] shadow-[0_0_18px_rgb(255_222_170/0.9)]"
      >
        <span className="story-face__handle absolute left-1/2 top-1/2 grid size-9 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-[#FDF8F1] text-[#062112] sun-shadow">
          <MoveHorizontal className="size-4" />
        </span>
      </span>
      <span className="story-face__label absolute left-3 top-3 rounded-full bg-[#062112]/85 px-2.5 py-1 font-sans text-[11px] font-bold uppercase tracking-[0.12em] text-[#F2EBDB]">
        Antes
      </span>
      <span className="story-face__label absolute right-3 top-3 rounded-full bg-[#FDF8F1]/90 px-2.5 py-1 font-sans text-[11px] font-bold uppercase tracking-[0.12em] text-[#062112]">
        Después
      </span>
      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 h-1/3 bg-[linear-gradient(180deg,transparent,rgb(6_33_18/0.55))]"
      />
      <span className="story-face__label absolute inset-x-4 bottom-4 font-sans text-sm font-bold text-[#FDF8F1]">
        {story.treatment}
      </span>
    </div>
  );
}

export function StoriesSection() {
  const rootRef = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);
  const items = storiesContent.items;
  const story = items[active] ?? items[0];
  const compact = useMediaQuery("(max-width: 640px)");

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
        gsap
          .timeline({
            defaults: { ease: EASE_OUT },
            scrollTrigger: { trigger: root, start: "top 70%" },
          })
          .from(split?.words ?? [], { yPercent: 105, duration: 1, stagger: 0.04 })
          .from("[data-story-quote]", { opacity: 0, y: 20, filter: "blur(6px)", duration: 1, clearProps: "filter" }, 0.5);
        return () => split?.revert();
      },
      root,
    );

    return () => mm.revert();
  }, []);

  return (
    <section
      ref={rootRef}
      id={SECTION_IDS.stories}
      tabIndex={-1}
      aria-labelledby="stories-title"
      className="relative overflow-hidden bg-[#FDF8F1] py-24 outline-none sm:py-32"
    >
      <div className="mx-auto flex max-w-[1440px] flex-col gap-10 px-5 sm:px-8">
        <SectionHeading
          id="stories-title"
          title={storiesContent.title}
          lead="Gira el carrusel hacia un lado para ver el antes y hacia el otro para ver el después."
          align="center"
        />

        <div
          className={`relative ${compact ? "-mx-[45%] h-[30rem] w-[190%]" : "h-[32rem]"}`}
        >
          <CircularCarousel
            items={items.map((item) => ({ ...item, alt: item.treatment }))}
            preset="orbit"
            intro="rise"
            key={compact ? "compact" : "wide"}
            cardWidth={320}
            aspectRatio={0.82}
            gap={compact ? 10 : 44}
            autoplay="drift"
            speed={7}
            depthFade={0.35}
            fadeColor="#FDF8F1"
            cornerRadius={28}
            ariaLabel="Historias reales: antes y después"
            ofLabel="de"
            onChange={setActive}
            renderFace={(item) => <BeforeAfterFace story={item as StoryItem} />}
          />
        </div>

        <figure data-story-quote className="mx-auto flex min-h-[10rem] max-w-2xl flex-col items-center text-center">
          <AnimatePresence mode="wait">
            <motion.blockquote
              key={story.id}
              initial={{ opacity: 0, y: 14, filter: "blur(6px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)", transitionEnd: { filter: "none" } }}
              exit={{ opacity: 0, y: -10, filter: "blur(4px)", transition: { duration: 0.25 } }}
              transition={{ duration: 0.6, ease: EASE }}
              className="flex flex-col items-center gap-4"
              aria-live="polite"
            >
              <p className="font-heading text-[clamp(1.6rem,2.6vw,2.25rem)] leading-snug text-[#062112] text-balance">
                “{story.quote}”
              </p>
              <figcaption className="font-sans text-sm font-bold uppercase tracking-[0.14em] text-[#7a5a2c]">
                {story.author} · {story.treatment}
              </figcaption>
            </motion.blockquote>
          </AnimatePresence>
        </figure>
      </div>
    </section>
  );
}
