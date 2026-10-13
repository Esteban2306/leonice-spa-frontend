"use client";

import { useRef } from "react";
import { ArrowRight } from "lucide-react";

import { BookingLink } from "@/src/features/landing/components/action-link";
import { MediaFrame } from "@/src/features/landing/components/media-frame";
import { heroContent } from "@/src/features/landing/content/landing-content";
import { SECTION_IDS } from "@/src/features/landing/lib/site-config";
import {
  EASE_OUT,
  ensureGsap,
  MOTION_OK,
  SplitText,
  useIsomorphicLayoutEffect,
} from "@/src/features/landing/motion/gsap";
import { scrollToSection } from "@/src/features/landing/motion/scroll-to-section";
import { useSurfaceGlow } from "@/src/features/landing/motion/use-surface-glow";

interface HeroMediaProps {
  videoSrc?: string | null;
  poster?: string | null;
}

function HeroMedia({ videoSrc, poster }: HeroMediaProps) {
  return (
    <div aria-hidden="true" className="absolute inset-0 -z-10 overflow-hidden">
      {videoSrc ? (
        <video
          className="h-full w-full object-cover"
          src={videoSrc}
          poster={poster ?? undefined}
          autoPlay
          muted
          loop
          playsInline
        />
      ) : (
        <div data-hero-bg className="hero-fade absolute inset-0 origin-top" />
      )}
      <div
        data-hero-beam
        className="absolute -left-1/4 top-[-20%] h-[140%] w-[70%] -rotate-[18deg] bg-[linear-gradient(90deg,transparent,rgb(255_226_180/0.55),transparent)] opacity-0 blur-2xl"
      />
    </div>
  );
}

function PortalCard({
  title,
  target,
  tone,
  hint,
  image,
}: {
  title: string;
  target: string;
  tone: "dark" | "light";
  hint: string;
  image: string | null;
}) {
  const glowRef = useSurfaceGlow<HTMLAnchorElement>();
  const dark = tone === "dark";
  return (
    <a
      ref={glowRef}
      data-hero-portal
      href={`#${target}`}
      onClick={(event) => {
        event.preventDefault();
        scrollToSection(target);
      }}
      className={`glow group/portal relative block aspect-[16/9] overflow-hidden rounded-[2rem] desk:aspect-[16/9.5] ${
        dark ? "lit-dark lit-hover bg-[#062112]" : "lit lit-hover bg-[#F2EBDB]"
      }`}
    >
      <MediaFrame
        src={image}
        alt=""
        hint={hint}
        tone={dark ? "dark" : "light"}
        className="absolute inset-y-0 left-0 w-[55%]"
        imageClassName="transition-transform duration-[1100ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover/portal:scale-[1.06]"
        compact
        sizes="240px"
      />
      <div
        aria-hidden="true"
        className={`absolute inset-0 ${
          dark
            ? "bg-[linear-gradient(90deg,transparent_25%,#062112_62%)]"
            : "bg-[linear-gradient(90deg,transparent_25%,#F2EBDB_62%)]"
        }`}
      />
      <span
        className={`absolute right-5 top-4 max-w-[55%] text-right font-heading text-[clamp(1.5rem,2.2vw,2rem)] leading-tight ${
          dark ? "text-[#F2EBDB]" : "text-[#062112]"
        }`}
      >
        {title}
      </span>
      <span
        aria-hidden="true"
        className={`absolute bottom-4 right-5 grid size-12 place-items-center rounded-full transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover/portal:-rotate-45 ${
          dark ? "bg-[#F2EBDB] text-[#062112]" : "bg-[#062112] text-[#F2EBDB]"
        }`}
      >
        <ArrowRight className="size-5" />
      </span>
    </a>
  );
}

export function HeroSection({ videoSrc = null }: { videoSrc?: string | null }) {
  const rootRef = useRef<HTMLElement>(null);

  useIsomorphicLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const gsap = ensureGsap();
    const mm = gsap.matchMedia();

    mm.add(MOTION_OK, () => {
      const title = root.querySelector<HTMLElement>("[data-hero-title]");
      const split = title
        ? SplitText.create(title, { type: "lines,words", mask: "lines", linesClass: "pb-[0.08em]" })
        : null;

      const tl = gsap.timeline({ defaults: { ease: EASE_OUT } });
      tl.fromTo(
        "[data-hero-bg]",
        { scale: 1.08, filter: "saturate(0.6) brightness(1.08)" },
        { scale: 1, filter: "saturate(1) brightness(1)", duration: 2.2, clearProps: "filter" },
        0,
      )
        .fromTo(
          "[data-hero-beam]",
          { xPercent: -60, opacity: 0 },
          { xPercent: 20, opacity: 1, duration: 2.4, ease: "power2.out" },
          0.1,
        )
        .from(split?.words ?? [], { yPercent: 110, duration: 1.2, stagger: 0.045 }, 0.35)
        .from("[data-hero-rule]", { scaleY: 0, transformOrigin: "top", duration: 1.4 }, 0.6)
        .from(
          "[data-hero-copy] > *",
          { y: 18, opacity: 0, filter: "blur(6px)", duration: 1, stagger: 0.12, clearProps: "filter" },
          0.85,
        )
        .from(
          "[data-hero-portal]",
          {
            clipPath: "inset(0 100% 0 0 round 32px)",
            x: -24,
            duration: 1.3,
            stagger: 0.16,
            ease: "expo.inOut",
          },
          0.7,
        );

      gsap.to("[data-hero-content]", {
        yPercent: -10,
        opacity: 0.35,
        ease: "none",
        scrollTrigger: { trigger: root, start: "top top", end: "bottom top", scrub: true },
      });
      gsap.to("[data-hero-beam]", {
        xPercent: 45,
        ease: "none",
        scrollTrigger: { trigger: root, start: "top top", end: "bottom top", scrub: true },
      });

      return () => split?.revert();
    }, root);

    return () => mm.revert();
  }, []);

  return (
    <section
      ref={rootRef}
      id={SECTION_IDS.home}
      tabIndex={-1}
      aria-labelledby="hero-title"
      className="relative isolate flex min-h-[100svh] items-center overflow-hidden pb-20 pt-[calc(var(--nav-height)+3rem)] outline-none"
    >
      <HeroMedia videoSrc={videoSrc} />

      <div
        data-hero-content
        className="mx-auto grid w-full max-w-[1440px] items-center gap-10 px-5 sm:px-8 desk:grid-cols-[minmax(0,1fr)_auto_minmax(0,25rem)] desk:gap-16"
      >
        <div className="flex max-w-[44rem] flex-col gap-8">
          <h1
            id="hero-title"
            data-hero-title
            className="sunlit-text font-heading text-[clamp(2.75rem,5.2vw,4.75rem)] leading-[1.02] tracking-[-0.015em] text-balance text-[#062112]"
          >
            {heroContent.title}
          </h1>
          <div data-hero-copy className="flex flex-col gap-7">
            <div>
              <BookingLink
                variant="cream"
                size="lg"
                message="Hola, quiero agendar mi diagnóstico capilar en Leonice."
              >
                {heroContent.primaryAction}
              </BookingLink>
            </div>
            <p className="max-w-[46ch] font-sans text-lg leading-relaxed text-[#062112]/85 sm:text-xl">
              {heroContent.lead}
            </p>
          </div>
        </div>

        <span
          data-hero-rule
          aria-hidden="true"
          className="hidden h-[24rem] w-px bg-[linear-gradient(180deg,transparent,#FDF8F1_20%,#FDF8F1_80%,transparent)] desk:block"
        />

        <nav aria-label="Accesos rápidos" className="grid gap-5 sm:grid-cols-2 desk:grid-cols-1">
          {heroContent.portals.map((portal) => (
            <PortalCard
              key={portal.id}
              title={portal.title}
              target={portal.target}
              tone={portal.tone}
              hint={portal.imageHint}
              image={portal.image}
            />
          ))}
        </nav>
      </div>
    </section>
  );
}
