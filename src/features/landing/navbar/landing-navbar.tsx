"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, MotionConfig, motion } from "motion/react";
import { ChevronDown, Menu, X } from "lucide-react";

import { BookingLink } from "@/src/features/landing/components/action-link";
import type {
  LandingCategory,
  LandingProduct,
} from "@/src/features/landing/content/landing-content";
import { SECTION_IDS, type SectionId } from "@/src/features/landing/lib/site-config";
import { scrollToSection } from "@/src/features/landing/motion/scroll-to-section";
import { ProductsPreview, TreatmentsPreview } from "@/src/features/landing/navbar/nav-previews";

import LogoB from "../../../../public/leonice-logo-b.png";

type Preview = "treatments" | "products";

const LINKS: { label: string; target: SectionId; preview?: Preview }[] = [
  { label: "Inicio", target: SECTION_IDS.home },
  { label: "Tratamientos", target: SECTION_IDS.treatments, preview: "treatments" },
  { label: "Productos", target: SECTION_IDS.products, preview: "products" },
  { label: "Contacto", target: SECTION_IDS.contact },
];

const TRACKED: SectionId[] = [
  SECTION_IDS.home,
  SECTION_IDS.why,
  SECTION_IDS.treatments,
  SECTION_IDS.stories,
  SECTION_IDS.promise,
  SECTION_IDS.products,
  SECTION_IDS.metrics,
  SECTION_IDS.contact,
];

const LINK_FOR_SECTION: Partial<Record<SectionId, SectionId>> = {
  [SECTION_IDS.why]: SECTION_IDS.home,
  [SECTION_IDS.stories]: SECTION_IDS.treatments,
  [SECTION_IDS.promise]: SECTION_IDS.treatments,
  [SECTION_IDS.metrics]: SECTION_IDS.products,
};

const EASE = [0.16, 1, 0.3, 1] as const;
const CLOSE_DELAY = 140;
const TOP_ZONE = 80;
const SWITCH_DISTANCE = 24;
const BAR_HEIGHT = 72;
const PILL_WIDTH = 124;
const OVERSHOOT = 48;
const IDLE_MS = 450;
const LOGO_WIDTH = 84;
const LOGO_COMPACT_SCALE = 2 / 3;
const COMPACT_TRANSITION = { duration: 0.6, ease: EASE };

function barClip(pill: boolean, side: number) {
  return pill
    ? `inset(0px ${side}px 0px ${side}px round ${BAR_HEIGHT / 2}px)`
    : `inset(-${OVERSHOOT}px -${OVERSHOOT}px -${OVERSHOOT}px -${OVERSHOOT}px round ${BAR_HEIGHT / 2}px)`;
}

const GLASS =
  "border border-white/70 bg-[#FDF8F1]/55 backdrop-blur-2xl backdrop-saturate-[1.8] shadow-[inset_0_1px_0_rgb(255_255_255/0.9),inset_0_-1px_0_rgb(74_46_16/0.08),0_calc(var(--sun-dy)*10px+14px)_40px_-16px_rgb(74_46_16/0.42)] before:pointer-events-none before:absolute before:inset-0 before:rounded-full before:bg-[linear-gradient(180deg,rgb(255_255_255/0.55),rgb(255_255_255/0)_70%)] before:content-['']";

export function LandingNavbar({
  categories,
  products,
}: {
  categories: LandingCategory[];
  products: LandingProduct[];
}) {
  const [pill, setPill] = useState(false);
  const [barWidth, setBarWidth] = useState(0);
  const barRef = useRef<HTMLDivElement>(null);
  const idleTimer = useRef<number | null>(null);
  const [current, setCurrent] = useState<SectionId>(SECTION_IDS.home);
  const [hovered, setHovered] = useState<SectionId | null>(null);
  const [preview, setPreview] = useState<Preview | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const closeTimer = useRef<number | null>(null);

  useEffect(() => {
    let lastY = window.scrollY;
    let direction = 0;
    let anchor = window.scrollY;
    const clearIdle = () => {
      if (idleTimer.current) window.clearTimeout(idleTimer.current);
      idleTimer.current = null;
    };
    const onScroll = () => {
      const y = window.scrollY;
      if (y <= TOP_ZONE) {
        direction = 0;
        anchor = y;
        lastY = y;
        clearIdle();
        setPill(false);
        return;
      }
      const step = y > lastY ? 1 : y < lastY ? -1 : 0;
      if (step !== 0 && step !== direction) {
        direction = step;
        anchor = lastY;
      }
      lastY = y;
      if (direction === 0 || Math.abs(y - anchor) < SWITCH_DISTANCE) return;
      clearIdle();
      if (direction > 0) {
        setPill(true);
        idleTimer.current = window.setTimeout(() => setPill(false), IDLE_MS);
      } else {
        setPill(false);
      }
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      clearIdle();
    };
  }, []);

  useEffect(() => {
    const node = barRef.current;
    if (!node) return;
    const update = () => setBarWidth(node.getBoundingClientRect().width);
    update();
    const observer = new ResizeObserver(update);
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const visible = new Map<string, number>();
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) visible.set(entry.target.id, entry.intersectionRatio);
        let best: string | null = null;
        let ratio = 0;
        for (const [id, value] of visible) {
          if (value > ratio) {
            ratio = value;
            best = id;
          }
        }
        if (best) {
          const section = best as SectionId;
          setCurrent(LINK_FOR_SECTION[section] ?? section);
        }
      },
      { rootMargin: "-35% 0px -45% 0px", threshold: [0, 0.25, 0.5, 0.75, 1] },
    );
    for (const id of TRACKED) {
      const node = document.getElementById(id);
      if (node) observer.observe(node);
    }
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!preview && !mobileOpen) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setPreview(null);
        setMobileOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [preview, mobileOpen]);

  useEffect(() => {
    document.documentElement.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.documentElement.style.overflow = "";
    };
  }, [mobileOpen]);

  const cancelClose = () => {
    if (closeTimer.current) window.clearTimeout(closeTimer.current);
    closeTimer.current = null;
  };
  const openPreview = (next: Preview) => {
    cancelClose();
    setPreview(next);
  };
  const scheduleClose = () => {
    cancelClose();
    closeTimer.current = window.setTimeout(() => setPreview(null), CLOSE_DELAY);
  };
  const closeAll = useCallback(() => {
    cancelClose();
    setPreview(null);
    setMobileOpen(false);
  }, []);

  const go = (target: SectionId) => {
    closeAll();
    scrollToSection(target);
  };

  const pillActive = pill && !mobileOpen && preview === null;
  const side = Math.max(0, (barWidth - PILL_WIDTH) / 2);
  const indicator = hovered ?? current;

  return (
    <MotionConfig reducedMotion="user">
      <header className="pointer-events-none fixed inset-x-0 top-0 z-50 flex justify-center px-4 pt-3 sm:pt-4">
        <motion.div
          ref={barRef}
          initial={{ opacity: 0, y: -24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: EASE }}
          style={{ height: BAR_HEIGHT }}
          onMouseLeave={() => {
            setHovered(null);
            scheduleClose();
          }}
          onMouseEnter={() => preview && cancelClose()}
          className="pointer-events-auto relative z-50 w-[80%] max-w-[1280px]"
        >
          <motion.div
            aria-hidden="true"
            initial={false}
            animate={{ clipPath: barClip(pillActive, side) }}
            transition={COMPACT_TRANSITION}
            className={`pointer-events-none absolute inset-0 rounded-full ${GLASS}`}
          />

          <motion.nav
            aria-label="Principal"
            initial={false}
            animate={{ clipPath: barClip(pillActive, side) }}
            transition={COMPACT_TRANSITION}
            className="relative grid h-full grid-cols-[1fr_auto_1fr] grid-rows-1 items-center gap-3 px-2 sm:px-3"
          >
            <div className="flex min-w-0 items-center justify-self-start" inert={pillActive}>
              <button
                type="button"
                onClick={() => setMobileOpen((open) => !open)}
                aria-expanded={mobileOpen}
                aria-controls="landing-mobile-menu"
                aria-label={mobileOpen ? "Cerrar menú" : "Abrir menú"}
                className="inline-flex size-11 cursor-pointer items-center justify-center rounded-full text-[#062112] transition-colors hover:bg-[#062112]/5 desk:hidden"
              >
                {mobileOpen ? <X className="size-5" /> : <Menu className="size-5" />}
              </button>

              <ul
                inert={pillActive}
                className="hidden items-center gap-1 whitespace-nowrap px-1 desk:flex"
                onMouseLeave={() => setHovered(null)}
              >
                {LINKS.map((link) => {
                  const active = current === link.target;
                  const expanded = link.preview ? preview === link.preview : undefined;
                  return (
                    <li
                      key={link.target}
                      onMouseEnter={() => {
                        setHovered(link.target);
                        if (link.preview) openPreview(link.preview);
                        else scheduleClose();
                      }}
                    >
                      <a
                        href={`#${link.target}`}
                        aria-current={active ? "true" : undefined}
                        aria-expanded={expanded}
                        onFocus={() => {
                          setHovered(link.target);
                          if (link.preview) openPreview(link.preview);
                          else scheduleClose();
                        }}
                        onBlur={() => setHovered(null)}
                        onClick={(event) => {
                          event.preventDefault();
                          go(link.target);
                        }}
                        className={`relative inline-flex h-10 items-center gap-1 rounded-full px-4 font-sans text-[0.95rem] transition-colors duration-300 ${
                          active ? "text-[#062112]" : "text-[#062112]/65 hover:text-[#062112]"
                        }`}
                      >
                        {indicator === link.target && (
                          <motion.span
                            layoutId="landing-nav-indicator"
                            transition={{ type: "spring", stiffness: 520, damping: 38, mass: 0.6 }}
                            className="absolute inset-x-3 -bottom-0.5 h-[2px] rounded-full bg-[#BF9250] shadow-[0_0_10px_rgb(191_146_80/0.8)]"
                          />
                        )}
                        {link.label}
                        {link.preview && (
                          <ChevronDown
                            aria-hidden="true"
                            className={`size-3.5 transition-transform duration-300 ${expanded ? "rotate-180" : ""}`}
                          />
                        )}
                      </a>
                    </li>
                  );
                })}
              </ul>
            </div>

            <a
              href={`#${SECTION_IDS.home}`}
              onClick={(event) => {
                event.preventDefault();
                go(SECTION_IDS.home);
              }}
              aria-label="Leonice Arenas Spa Capilar, ir al inicio"
              className="justify-self-center"
            >
              <motion.span
                initial={false}
                animate={{ scale: pillActive ? LOGO_COMPACT_SCALE : 1 }}
                transition={COMPACT_TRANSITION}
                style={{ width: LOGO_WIDTH }}
                className="block"
              >
                <Image src={LogoB} alt="" priority className="h-auto w-full" />
              </motion.span>
            </a>

            <div className="justify-self-end" inert={pillActive}>
              <span className="hidden sm:block">
                <BookingLink variant="sand" size="sm" className="!shadow-none">
                  Agendar cita
                </BookingLink>
              </span>
              <span className="sm:hidden">
                <BookingLink variant="sand" size="sm" arrow={false} className="!shadow-none">
                  Agendar
                </BookingLink>
              </span>
            </div>
          </motion.nav>

          <AnimatePresence>
            {preview && (
              <motion.div
                key="preview"
                initial={{ opacity: 0, y: -8, clipPath: "inset(0 0 100% 0 round 0 0 32px 32px)" }}
                animate={{ opacity: 1, y: 0, clipPath: "inset(0 0 0% 0 round 0 0 32px 32px)" }}
                exit={{ opacity: 0, y: -6, transition: { duration: 0.2 } }}
                transition={{ duration: 0.5, ease: EASE }}
                onMouseEnter={cancelClose}
                className="absolute inset-x-0 top-full mt-3 hidden desk:block"
              >
                <div className="lit rounded-[2rem] border border-white/70 bg-[#FDF8F1]/90 p-6">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={preview}
                      initial={{ opacity: 0, x: preview === "products" ? 16 : -16 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, transition: { duration: 0.12 } }}
                      transition={{ duration: 0.35, ease: EASE }}
                    >
                      {preview === "treatments" ? (
                        <TreatmentsPreview categories={categories} onNavigate={closeAll} />
                      ) : (
                        <ProductsPreview products={products} onNavigate={closeAll} />
                      )}
                    </motion.div>
                  </AnimatePresence>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              id="landing-mobile-menu"
              initial={{ opacity: 0, clipPath: "inset(0 0 100% 0 round 0 0 32px 32px)" }}
              animate={{ opacity: 1, clipPath: "inset(0 0 0% 0 round 0 0 0 0)" }}
              exit={{ opacity: 0, clipPath: "inset(0 0 100% 0 round 0 0 32px 32px)", transition: { duration: 0.3 } }}
              transition={{ duration: 0.55, ease: EASE }}
              className="pointer-events-auto fixed inset-x-0 bottom-0 top-0 z-40 flex flex-col bg-[#FDF8F1]/95 px-6 pb-10 pt-28 desk:hidden"
            >
              <motion.ul
                initial="hidden"
                animate="show"
                variants={{ hidden: {}, show: { transition: { staggerChildren: 0.06, delayChildren: 0.1 } } }}
                className="flex flex-col"
              >
                {LINKS.map((link) => (
                  <motion.li
                    key={link.target}
                    variants={{
                      hidden: { opacity: 0, y: 18 },
                      show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE } },
                    }}
                    className="border-b border-[#BF9250]/25"
                  >
                    <a
                      href={`#${link.target}`}
                      onClick={(event) => {
                        event.preventDefault();
                        go(link.target);
                      }}
                      className="flex items-center justify-between py-5 font-heading text-4xl text-[#062112]"
                    >
                      {link.label}
                      {current === link.target && (
                        <span className="size-2 rounded-full bg-[#BF9250]" aria-hidden="true" />
                      )}
                    </a>
                  </motion.li>
                ))}
              </motion.ul>
              <div className="mt-auto">
                <BookingLink variant="ink" size="lg" className="w-full" onClick={closeAll}>
                  Agendar mi cita
                </BookingLink>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    </MotionConfig>
  );
}
