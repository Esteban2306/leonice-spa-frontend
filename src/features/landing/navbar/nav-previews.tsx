"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowRight, Clock } from "lucide-react";

import type {
  LandingCategory,
  LandingProduct,
} from "@/src/features/landing/content/landing-content";
import { formatDuration, formatThousandsCop } from "@/src/features/landing/lib/format";
import { SECTION_IDS } from "@/src/features/landing/lib/site-config";
import { scrollToSection } from "@/src/features/landing/motion/scroll-to-section";
import { ProductCard } from "@/src/features/landing/sections/products/product-card";

const EASE = [0.16, 1, 0.3, 1] as const;

const list = {
  hidden: {},
  show: { transition: { staggerChildren: 0.05, delayChildren: 0.06 } },
};
const item = {
  hidden: { opacity: 0, y: 10, filter: "blur(4px)" },
  show: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.45, ease: EASE } },
};

export function TreatmentsPreview({
  categories,
  onNavigate,
}: {
  categories: LandingCategory[];
  onNavigate: () => void;
}) {
  const [activeId, setActiveId] = useState(categories[0]?.id ?? "");
  const active = categories.find((c) => c.id === activeId) ?? categories[0];

  if (!active) {
    return (
      <p className="font-sans text-sm text-[#062112]/70">
        Muy pronto verás aquí nuestras categorías de tratamientos.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-[minmax(12rem,15rem)_1fr] gap-6">
      <motion.ul variants={list} initial="hidden" animate="show" className="flex flex-col gap-1">
        {categories.map((category) => {
          const selected = category.id === active.id;
          return (
            <motion.li key={category.id} variants={item}>
              <button
                type="button"
                onMouseEnter={() => setActiveId(category.id)}
                onFocus={() => setActiveId(category.id)}
                onClick={() => {
                  onNavigate();
                  scrollToSection(SECTION_IDS.treatments);
                }}
                className={`relative flex w-full cursor-pointer flex-col items-start rounded-2xl px-4 py-3 text-left transition-colors duration-300 ${
                  selected ? "text-[#F2EBDB]" : "text-[#062112] hover:bg-[#062112]/5"
                }`}
              >
                {selected && (
                  <motion.span
                    layoutId="nav-category-pill"
                    className="absolute inset-0 rounded-2xl bg-[#062112]"
                    transition={{ duration: 0.45, ease: EASE }}
                  />
                )}
                <span className="relative font-heading text-2xl leading-tight">{category.name}</span>
                <span
                  className={`relative font-sans text-xs ${selected ? "text-[#E0BC87]" : "text-[#062112]/60"}`}
                >
                  {category.treatmentCount} {category.treatmentCount === 1 ? "servicio" : "servicios"}
                  {category.fromThousands !== null && ` · desde ${formatThousandsCop(category.fromThousands)}`}
                </span>
              </button>
            </motion.li>
          );
        })}
      </motion.ul>

      <AnimatePresence mode="wait">
        <motion.ul
          key={active.id}
          variants={list}
          initial="hidden"
          animate="show"
          exit={{ opacity: 0, transition: { duration: 0.15 } }}
          className="grid content-start gap-2"
        >
          {active.highlights.map((treatment) => (
            <motion.li
              key={treatment.id}
              variants={item}
              className="flex items-center justify-between gap-4 rounded-2xl border border-[#BF9250]/25 bg-[#FDF8F1] px-4 py-3"
            >
              <div className="min-w-0">
                <p className="truncate font-sans font-bold text-[#062112]">{treatment.name}</p>
                <p className="flex items-center gap-1.5 font-sans text-xs text-[#062112]/65">
                  <Clock className="size-3.5" aria-hidden="true" />
                  {formatDuration(treatment.durationMinutes)}
                </p>
              </div>
              <p className="shrink-0 font-sans text-sm font-bold text-[#7a5a2c] tabular-nums">
                desde {formatThousandsCop(treatment.promotion?.priceFromThousands ?? treatment.priceFromThousands)}
              </p>
            </motion.li>
          ))}
          <motion.li variants={item}>
            <button
              type="button"
              onClick={() => {
                onNavigate();
                scrollToSection(SECTION_IDS.treatments);
              }}
              className="group mt-1 inline-flex cursor-pointer items-center gap-2 font-sans text-sm font-bold text-[#062112] underline decoration-[#BF9250] decoration-2 underline-offset-[6px]"
            >
              Ver todos los tratamientos
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
            </button>
          </motion.li>
        </motion.ul>
      </AnimatePresence>
    </div>
  );
}

export function ProductsPreview({
  products,
  onNavigate,
}: {
  products: LandingProduct[];
  onNavigate: () => void;
}) {
  return (
    <div className="flex flex-col gap-4">
      <motion.ul variants={list} initial="hidden" animate="show" className="grid grid-cols-4 gap-4">
        {products.map((product) => (
          <motion.li key={product.id} variants={item}>
            <ProductCard product={product} variant="compact" />
          </motion.li>
        ))}
      </motion.ul>
      <button
        type="button"
        onClick={() => {
          onNavigate();
          scrollToSection(SECTION_IDS.products);
        }}
        className="group inline-flex cursor-pointer items-center gap-2 self-start font-sans text-sm font-bold text-[#062112] underline decoration-[#BF9250] decoration-2 underline-offset-[6px]"
      >
        Explorar todos los productos
        <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
      </button>
    </div>
  );
}
