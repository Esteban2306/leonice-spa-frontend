"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
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

export function LandingNavbar({
  categories,
  products,
}: {
  categories: LandingCategory[];
  products: LandingProduct[];
}) {
  const [scrolled, setScrolled] = useState(false);
  const [current, setCurrent] = useState<SectionId>(SECTION_IDS.home);
  const [preview, setPreview] = useState<Preview | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const closeTimer = useRef<number | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
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

  const solid = scrolled || preview !== null || mobileOpen;

  return (
    <header
      className="fixed inset-x-0 top-0 z-50"
      onMouseLeave={scheduleClose}
      onMouseEnter={() => preview && cancelClose()}
    >
      <div
        className={`relative transition-[background-color,box-shadow,backdrop-filter] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          solid
            ? "bg-[#FDF8F1]/88 shadow-[0_calc(var(--sun-dy)*10px+6px)_30px_-18px_rgb(74_46_16/0.35)] backdrop-blur-xl"
            : "bg-transparent"
        }`}
      >
        <nav
          aria-label="Principal"
          className={`mx-auto grid max-w-[1440px] grid-cols-[1fr_auto_1fr] items-center px-5 transition-[height] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] sm:px-8 ${
            scrolled ? "h-[4.5rem]" : "h-[5.5rem]"
          }`}
        >
          <ul className="hidden items-center gap-1 desk:flex">
            {LINKS.map((link) => {
              const active = current === link.target;
              const expanded = link.preview ? preview === link.preview : undefined;
              return (
                <li
                  key={link.target}
                  onMouseEnter={() => (link.preview ? openPreview(link.preview) : scheduleClose())}
                >
                  <a
                    href={`#${link.target}`}
                    aria-current={active ? "true" : undefined}
                    aria-expanded={expanded}
                    onFocus={() => (link.preview ? openPreview(link.preview) : scheduleClose())}
                    onClick={(event) => {
                      event.preventDefault();
                      go(link.target);
                    }}
                    className={`relative inline-flex h-11 items-center gap-1 rounded-full px-4 font-sans text-[0.95rem] transition-colors duration-300 ${
                      active ? "text-[#062112]" : "text-[#062112]/65 hover:text-[#062112]"
                    }`}
                  >
                    {active && (
                      <motion.span
                        layoutId="landing-nav-active"
                        className="absolute inset-x-3 bottom-1.5 h-[2px] rounded-full bg-[#BF9250]"
                        transition={{ duration: 0.5, ease: EASE }}
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

          <button
            type="button"
            onClick={() => setMobileOpen((open) => !open)}
            aria-expanded={mobileOpen}
            aria-controls="landing-mobile-menu"
            aria-label={mobileOpen ? "Cerrar menú" : "Abrir menú"}
            className="inline-flex size-11 cursor-pointer items-center justify-center justify-self-start rounded-full text-[#062112] transition-colors hover:bg-[#062112]/5 desk:hidden"
          >
            {mobileOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>

          <a
            href={`#${SECTION_IDS.home}`}
            onClick={(event) => {
              event.preventDefault();
              go(SECTION_IDS.home);
            }}
            aria-label="Leonice Arenas Spa Capilar, ir al inicio"
            className="justify-self-center"
          >
            <Image
              src={LogoB}
              alt=""
              priority
              className={`h-auto transition-[width] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                scrolled ? "w-[5.5rem]" : "w-24 sm:w-28"
              }`}
            />
          </a>

          <div className="justify-self-end">
            <span className="hidden sm:block">
              <BookingLink variant="sand" size="sm">
                Agendar cita
              </BookingLink>
            </span>
            <span className="sm:hidden">
              <BookingLink variant="sand" size="sm" arrow={false}>
                Agendar
              </BookingLink>
            </span>
          </div>
        </nav>

        <AnimatePresence>
          {preview && (
            <motion.div
              key="preview"
              initial={{ opacity: 0, y: -8, clipPath: "inset(0 0 100% 0 round 0 0 28px 28px)" }}
              animate={{ opacity: 1, y: 0, clipPath: "inset(0 0 0% 0 round 0 0 28px 28px)" }}
              exit={{ opacity: 0, y: -6, transition: { duration: 0.2 } }}
              transition={{ duration: 0.5, ease: EASE }}
              onMouseEnter={cancelClose}
              className="absolute inset-x-0 top-full hidden desk:block"
            >
              <div className="mx-auto max-w-[1440px] px-8 pb-8 pt-3">
                <div className="lit rounded-[1.75rem] border border-[#BF9250]/25 bg-[#F2EBDB] p-6">
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
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            id="landing-mobile-menu"
            initial={{ opacity: 0, clipPath: "inset(0 0 100% 0)" }}
            animate={{ opacity: 1, clipPath: "inset(0 0 0% 0)" }}
            exit={{ opacity: 0, clipPath: "inset(0 0 100% 0)", transition: { duration: 0.3 } }}
            transition={{ duration: 0.55, ease: EASE }}
            className="fixed inset-x-0 bottom-0 top-[4.5rem] z-40 flex flex-col bg-[#FDF8F1] px-6 pb-10 pt-6 desk:hidden"
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
  );
}
